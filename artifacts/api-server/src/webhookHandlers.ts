import { db, donationsTable } from "@workspace/db";
import { getStripeSync } from "./stripeClient";
import { logger } from "./lib/logger";

interface CheckoutSessionLike {
  id: string;
  payment_status?: string;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
}

/**
 * Records a paid donation in the application's donations table from a completed
 * Stripe Checkout session. The charged amount and currency are read from
 * Stripe's canonical session fields (not client-supplied metadata); metadata is
 * only trusted for non-financial fields. Idempotent via the unique
 * stripe_session_id column.
 */
async function recordDonation(session: CheckoutSessionLike): Promise<void> {
  if (session.payment_status && session.payment_status !== "paid") return;

  const md = session.metadata ?? {};
  if (!md["donorName"]) return;

  // amount_total is in the currency's minor units (e.g. cents).
  const amount =
    typeof session.amount_total === "number" ? session.amount_total / 100 : NaN;
  if (!Number.isFinite(amount) || amount <= 0) return;

  const currency = (session.currency ?? md["currency"] ?? "EUR").toUpperCase();
  const type = md["type"] === "monthly" ? "monthly" : "one-time";

  await db
    .insert(donationsTable)
    .values({
      amount,
      currency,
      donorName: md["donorName"],
      isAnonymous: md["isAnonymous"] === "true",
      projectId: md["projectId"] ? Number(md["projectId"]) : null,
      message: md["message"] ? md["message"] : null,
      type,
      stripeSessionId: session.id,
    })
    .onConflictDoNothing({ target: donationsTable.stripeSessionId });

  logger.info(
    { sessionId: session.id, amount, type },
    "Donation recorded from Stripe checkout",
  );
}

export class WebhookHandlers {
  static async processWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "Stripe webhook payload must be a Buffer. Ensure the webhook route is " +
          "registered BEFORE express.json().",
      );
    }

    // Verifies the signature and syncs Stripe objects into the `stripe` schema.
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    // Signature already verified above, so the payload is authentic.
    let event: { type?: string; data?: { object?: CheckoutSessionLike } };
    try {
      event = JSON.parse(payload.toString());
    } catch {
      return;
    }

    if (event.type === "checkout.session.completed" && event.data?.object) {
      await recordDonation(event.data.object);
    }
  }
}
