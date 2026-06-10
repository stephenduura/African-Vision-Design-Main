import { runMigrations } from "stripe-replit-sync";
import app from "./app";
import { logger } from "./lib/logger";
import { getStripeSync } from "./stripeClient";
import { seedTeam } from "./seedTeam";
import { getSupabaseDatabaseUrl, getSupabaseFunctionsBaseUrl } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

/**
 * Initializes the Stripe `stripe` schema, registers a managed webhook pointing
 * at this deployment, and backfills existing Stripe data. Runs in the
 * background so the site stays up even if Stripe setup is temporarily
 * unavailable.
 */
async function initStripe(): Promise<void> {
  const databaseUrl = getSupabaseDatabaseUrl();
  if (!databaseUrl) {
    throw new Error(
      "SUPABASE_DB_URL or DATABASE_URL environment variable is required for Stripe integration.",
    );
  }

  await runMigrations({ databaseUrl });
  logger.info("Stripe schema ready");

  const explicitWebhookUrl =
    process.env["SUPABASE_STRIPE_WEBHOOK_URL"]?.trim() ||
    process.env["STRIPE_WEBHOOK_URL"]?.trim();
  const supabaseWebhookBase = getSupabaseFunctionsBaseUrl();
  const webhookUrl =
    explicitWebhookUrl ||
    (supabaseWebhookBase ? `${supabaseWebhookBase}/stripe-webhook` : "");

  if (webhookUrl) {
    try {
      const stripeSync = await getStripeSync();
      const webhook = await stripeSync.findOrCreateManagedWebhook(webhookUrl);
      logger.info(
        { url: webhook.url },
        "Stripe managed webhook configured",
      );
    } catch (err) {
      logger.warn(
        { err, webhookUrl },
        "Stripe webhook automation skipped; checkout remains available",
      );
    }
  } else {
    logger.info(
      "No Stripe webhook target configured; using local webhook route only",
    );
  }

  if (process.env["STRIPE_SYNC_ON_STARTUP"] === "true") {
    try {
      const stripeSync = await getStripeSync();
      await stripeSync.syncBackfill();
      logger.info("Stripe data synced");
    } catch (err) {
      logger.warn(
        { err },
        "Stripe backfill skipped; startup continues without historical sync",
      );
    }
  } else {
    logger.info(
      "Stripe backfill is disabled on startup; set STRIPE_SYNC_ON_STARTUP=true to enable it",
    );
  }
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

initStripe().catch((err) => {
  logger.error(
    { err },
    "Stripe initialization failed; the app will still continue running",
  );
});

seedTeam().catch((err) => {
  logger.error({ err }, "Team roster reconciliation failed");
});
