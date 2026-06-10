import StripePackage from "stripe";
import { StripeSync } from "stripe-replit-sync";
import { getSupabaseDatabaseUrl } from "@workspace/db";

export type StripeClient = InstanceType<typeof StripePackage>;

function isUsableStripeKey(key: string | undefined): key is string {
  if (!key) return false;
  const trimmed = key.trim();
  return Boolean(trimmed) && /^(sk|rk)_[A-Za-z0-9_]+$/.test(trimmed);
}

function getStripeSecretKey(): string {
  const candidates = [
    process.env["STRIPE_SECRET_KEY"],
    process.env["STRIPE_SECRET_KEY_ALT"],
    process.env["PAPI"],
    process.env["STRIPE_RESTRICTED_KEY"],
  ];

  const secretKey = candidates.find((candidate) => isUsableStripeKey(candidate));
  if (!secretKey) {
    throw new Error(
      "A valid Stripe API key (sk_ or rk_) must be set for Stripe checkout and webhooks.",
    );
  }
  return secretKey.trim();
}

function getStripeWebhookSecret(): string {
  return process.env["STRIPE_WEBHOOK_SECRET"]?.trim() ?? "";
}

/**
 * Returns a fresh authenticated Stripe client.
 * Not cached -- fetches credentials on every call so rotated keys are picked up.
 */
export async function getUncachableStripeClient(): Promise<StripeClient> {
  return new StripePackage(getStripeSecretKey());
}

/**
 * Returns a fresh StripeSync instance for webhook processing and data sync.
 * Not cached -- fetches credentials on every call so rotated keys are picked up.
 */
export async function getStripeSync(): Promise<StripeSync> {
  const databaseUrl = getSupabaseDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("SUPABASE_DB_URL or DATABASE_URL environment variable is required");
  }

  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: getStripeSecretKey(),
    stripeWebhookSecret: getStripeWebhookSecret(),
  });
}
