import Stripe from "npm:stripe@22.2.0";
import { createClient } from "npm:@supabase/supabase-js@2";

type CheckoutSessionLike = {
  id: string;
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
};

const stripeSecretKey =
  Deno.env.get("STRIPE_SECRET_KEY")?.trim() ??
  Deno.env.get("STRIPE_RESTRICTED_KEY")?.trim() ??
  "";
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")?.trim() ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim() ?? "";
const supabaseServiceRoleKey =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim() ?? "";

if (!stripeSecretKey) {
  throw new Error("A Stripe secret or restricted key is required.");
}

if (!stripeWebhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is required for webhook verification.");
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for donation writes.",
  );
}

const stripe = new Stripe(stripeSecretKey);
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

async function recordDonation(session: CheckoutSessionLike): Promise<boolean> {
  if (session.payment_status && session.payment_status !== "paid") {
    return false;
  }

  const metadata = session.metadata ?? {};
  const donorName = metadata["donorName"]?.trim();
  if (!donorName) {
    return false;
  }

  const amount =
    typeof session.amount_total === "number" ? session.amount_total / 100 : NaN;
  if (!Number.isFinite(amount) || amount <= 0) {
    return false;
  }

  const projectIdRaw = metadata["projectId"]?.trim();
  const parsedProjectId = projectIdRaw ? Number(projectIdRaw) : NaN;

  const row = {
    amount,
    currency: (session.currency ?? metadata["currency"] ?? "EUR").toUpperCase(),
    donor_name: donorName,
    is_anonymous: metadata["isAnonymous"] === "true",
    project_id: Number.isFinite(parsedProjectId) ? parsedProjectId : null,
    message: metadata["message"] ? metadata["message"] : null,
    type: metadata["type"] === "monthly" ? "monthly" : "one-time",
    stripe_session_id: session.id,
  };

  const { error } = await supabase
    .from("donations")
    .upsert([row], { onConflict: "stripe_session_id" });

  if (error) {
    throw error;
  }

  console.info(
    JSON.stringify({
      message: "Donation recorded from Supabase Stripe webhook",
      sessionId: session.id,
      amount: row.amount,
      type: row.type,
    }),
  );

  return true;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: jsonHeaders },
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(
      JSON.stringify({ error: "Missing Stripe signature" }),
      { status: 400, headers: jsonHeaders },
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      stripeWebhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return new Response(
      JSON.stringify({ error: "Invalid Stripe signature" }),
      { status: 400, headers: jsonHeaders },
    );
  }

  if (event.type === "checkout.session.completed") {
    try {
      await recordDonation(event.data.object as CheckoutSessionLike);
    } catch (error) {
      console.error("Failed to record donation from Stripe webhook", error);
      return new Response(
        JSON.stringify({ error: "Failed to persist donation" }),
        { status: 500, headers: jsonHeaders },
      );
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: jsonHeaders,
  });
});
