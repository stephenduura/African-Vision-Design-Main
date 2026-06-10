import { Router } from "express";
import { db } from "@workspace/db";
import { partnersTable } from "@workspace/db";
import { CreatePartnerBody } from "@workspace/api-zod";

const router = Router();

router.get("/partners", async (req, res): Promise<void> => {
  const partners = await db.select().from(partnersTable);
  res.json(partners.map((p) => ({ ...p, createdAt: undefined })));
});

router.post("/partners", async (req, res): Promise<void> => {
  const parsed = CreatePartnerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [partner] = await db.insert(partnersTable).values(parsed.data).returning();
  res.status(201).json(partner);
});

export default router;
