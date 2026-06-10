---
name: Stripe via stripe-replit-sync
description: Non-obvious gotchas for the Replit-managed Stripe integration (esbuild, connector fields, webhook trust, drizzle).
---

# Stripe (stripe-replit-sync) integration gotchas

## esbuild must keep `stripe-replit-sync` external
`stripe-replit-sync` locates its SQL migrations directory via `import.meta.url` at
runtime. esbuild bundling rewrites that path, so migrations **silently skip** —
the symptom is a later runtime error like `relation "stripe.accounts" does not
exist` even though startup logged no failure.
**Fix:** add `"stripe-replit-sync"` to the `external[]` array in the api-server
`build.mjs`. Any package that reads sibling files via `import.meta.url` needs the
same treatment.

## Connector credential field names
The Replit Stripe connector returns the secret key as `secret` and the webhook
signing secret as `webhook_secret` — NOT `secret_key`. Both `stripeClient.ts`
copies (api-server and scripts) must read those exact names.

## Trust boundaries (security)
- **Recorded donation amount/currency must come from the Stripe session**
  (`session.amount_total` in minor units ÷ 100, `session.currency`), never from
  client-supplied `metadata`. Metadata is only safe for non-financial fields
  (donorName, message, projectId, type, isAnonymous).
- **Checkout success/cancel base URL** must be built from the server-side
  `REPLIT_DOMAINS` env var only. Never fall back to a client-supplied `origin` —
  that is an open-redirect/phishing vector on the Stripe checkout session. Error
  out if `REPLIT_DOMAINS` is missing.
- **Why:** flagged in architect review of the donation checkout feature.

## Idempotency
Webhook donation inserts are made idempotent with a unique `stripe_session_id`
column + `onConflictDoNothing({ target: ... })`. Stripe retries webhooks, so any
webhook-driven insert needs a unique natural key like this.

## Webhook wiring
Register the raw-body Stripe webhook route BEFORE `express.json()` and verify via
`sync.processWebhook` before custom handling. Run init (migrations, managed
webhook, backfill) in the background at startup so the site stays up if Stripe is
unavailable.
