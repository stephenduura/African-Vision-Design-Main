import { Router } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable, newsletterSubscribersTable } from "@workspace/db";
import { SubmitContactBody, SubscribeNewsletterBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.insert(contactSubmissionsTable).values(parsed.data);
  res.status(201).json({ success: true, message: "Thank you for reaching out. We will respond within 48 hours." });
});

router.post("/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    await db.insert(newsletterSubscribersTable).values(parsed.data);
    res.status(201).json({ success: true, message: "You are now subscribed to the Papi Foundation newsletter." });
  } catch {
    res.status(400).json({ success: false, message: "This email is already subscribed." });
  }
});

export default router;
