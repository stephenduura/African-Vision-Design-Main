import { Router } from "express";
import { db } from "@workspace/db";
import { teamMembersTable } from "@workspace/db";
import { CreateTeamMemberBody } from "@workspace/api-zod";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/team", async (req, res): Promise<void> => {
  const members = await db.select().from(teamMembersTable).orderBy(asc(teamMembersTable.order));
  res.json(members.map((m) => ({ ...m, createdAt: undefined })));
});

router.post("/team", async (req, res): Promise<void> => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [member] = await db.insert(teamMembersTable).values(parsed.data).returning();
  res.status(201).json(member);
});

export default router;
