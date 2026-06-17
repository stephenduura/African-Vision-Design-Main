import { Router } from "express";
import { db } from "@workspace/db";
import { communityMembersTable } from "@workspace/db";
import { JoinCommunityBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/community/stats", async (req, res, next): Promise<void> => {
  try {
    const all = await db.select().from(communityMembersTable);
    const countries = new Set(all.map((m: any) => (m.country || "").trim()).filter(Boolean)).size;
    const volunteers = all.filter((m: any) => m.memberType === "volunteer").length;
    const organizations = all.filter((m: any) => m.memberType === "organization").length;
    res.json({ totalMembers: all.length, countries, volunteers, organizations });
  } catch (error) {
    next(error);
  }
});

router.get("/community/members", async (req, res, next): Promise<void> => {
  try {
    const members = await db
      .select()
      .from(communityMembersTable)
      .orderBy(desc(communityMembersTable.joinedAt));
    res.json(members.map((m: any) => ({ ...m, joinedAt: m.joinedAt.toISOString() })));
  } catch (error) {
    next(error);
  }
});

router.post("/community/members", async (req, res, next): Promise<void> => {
  const parsed = JoinCommunityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [member] = await db.insert(communityMembersTable).values(parsed.data).returning();
    res.status(201).json({ ...member, joinedAt: member.joinedAt.toISOString() });
  } catch (error: any) {
    // Unique constraint violation error code in PostgreSQL is 23505
    if (error && (error.code === "23505" || String(error.message).includes("unique constraint") || String(error.detail).includes("already exists"))) {
      res.status(400).json({ error: "This email is already registered." });
      return;
    }
    next(error);
  }
});

export default router;
