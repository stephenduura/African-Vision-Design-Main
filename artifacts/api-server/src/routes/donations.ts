import { Router, type Request } from "express";
import { db } from "@workspace/db";
import { donationsTable } from "@workspace/db";
import { CreateDonationBody, CreateDonationCheckoutBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";
import { getUncachableStripeClient, type StripeClient } from "../stripeClient";

const router = Router();

function getAppBaseUrl(req: Request): string {
  const configured = process.env["PUBLIC_APP_URL"]?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const hostHeader = req.headers["x-forwarded-host"];
  const host =
    typeof hostHeader === "string"
      ? hostHeader.split(",")[0]?.trim()
      : req.headers.host;
  if (!host) {
    throw new Error("Unable to determine application base URL for checkout");
  }

  const protoHeader = req.headers["x-forwarded-proto"];
  const proto =
    typeof protoHeader === "string" && protoHeader.trim()
      ? protoHeader.split(",")[0].trim()
      : req.protocol || "https";

  return `${proto}://${host}`;
}

type StripeCheckoutSessionCreateParams = NonNullable<
  Parameters<StripeClient["checkout"]["sessions"]["create"]>[0]
>;
type StripeCheckoutBrandingSettings = NonNullable<
  StripeCheckoutSessionCreateParams["branding_settings"]
>;
type StripeCheckoutSubmitType = NonNullable<StripeCheckoutSessionCreateParams["submit_type"]>;

function getCheckoutBranding(baseUrl: string): StripeCheckoutBrandingSettings {
  const publicAppUrl = process.env["PUBLIC_APP_URL"]?.trim();
  const logoUrl = publicAppUrl ? `${publicAppUrl.replace(/\/$/, "")}/logo.svg` : null;

  return {
    display_name: "PAPI FOUNDATION",
    background_color: "#F5F0E5",
    button_color: "#C9991A",
    border_style: "rounded",
    font_family: "lora",
    ...(logoUrl
      ? {
          logo: {
            type: "url",
            url: logoUrl,
          },
        }
      : {}),
  };
}

router.get("/donations", async (req, res): Promise<void> => {
  const donations = await db.select().from(donationsTable).orderBy(desc(donationsTable.createdAt));
  res.json(donations.map((d) => ({ ...d, createdAt: d.createdAt.toISOString() })));
});

router.get("/donations/summary", async (req, res): Promise<void> => {
  const all = await db.select().from(donationsTable).orderBy(desc(donationsTable.createdAt));
  const totalRaised = all.reduce((sum, d) => sum + d.amount, 0);
  const totalDonors = new Set(all.map((d) => d.donorName)).size;
  const monthlyRecurring = all
    .filter((d) => d.type === "monthly")
    .reduce((sum, d) => sum + d.amount, 0);
  const recentDonations = all.slice(0, 10).map((d) => ({ ...d, createdAt: d.createdAt.toISOString() }));
  res.json({ totalRaised, totalDonors, monthlyRecurring, recentDonations });
});

router.post("/donations", async (req, res): Promise<void> => {
  const parsed = CreateDonationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [donation] = await db.insert(donationsTable).values(parsed.data).returning();
  res.status(201).json({ ...donation, createdAt: donation.createdAt.toISOString() });
});

router.post("/donations/checkout", async (req, res): Promise<void> => {
  const parsed = CreateDonationCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    amount,
    currency,
    donorName,
    isAnonymous,
    projectId,
    message,
    type,
  } = parsed.data;

  const isMonthly = type === "monthly";

  // Build the post-checkout return URL only from the trusted server-side
  // domain. Never trust a client-supplied origin here -- that would let an
  // attacker point our Stripe checkout session at a phishing target.
  let baseUrl: string;
  try {
    baseUrl = getAppBaseUrl(req);
  } catch (error) {
    req.log.error({ err: error }, "Unable to determine checkout base URL");
    res.status(500).json({ error: "Server is not configured for checkout" });
    return;
  }

  try {
    const stripe = await getUncachableStripeClient();
    const submitType: StripeCheckoutSubmitType = isMonthly
      ? "subscribe"
      : "donate";

    const brandingSettings = getCheckoutBranding(baseUrl);
    const params: StripeCheckoutSessionCreateParams = {
      mode: isMonthly ? "subscription" : "payment",
      submit_type: submitType,
      branding_settings: brandingSettings,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: "PAPI FOUNDATION Donation",
              description: "Secure donation checkout for PAPI FOUNDATION",
            },
            ...(isMonthly ? { recurring: { interval: "month" as const } } : {}),
          },
        },
      ],
      success_url: `${baseUrl}/donate?status=success`,
      cancel_url: `${baseUrl}/donate?status=cancelled`,
      metadata: {
        donorName,
        currency,
        amount: String(amount),
        type,
        isAnonymous: String(Boolean(isAnonymous)),
        projectId: projectId != null ? String(projectId) : "",
        message: message ?? "",
      },
      ...(isMonthly
        ? {
            subscription_data: {
              description: "PAPI FOUNDATION donation subscription",
            },
          }
        : {
            payment_intent_data: {
              description: "PAPI FOUNDATION donation",
              statement_descriptor_suffix: "PAPI FDN",
            },
          }),
    };

    const session = await stripe.checkout.sessions.create(params);

    if (!session.url) {
      res.status(502).json({ error: "Stripe did not return a checkout URL" });
      return;
    }

    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err }, "Failed to create Stripe checkout session");
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

export default router;
