import { Router } from "express";
import { db } from "@workspace/db";
import { communityMembersTable } from "@workspace/db";
import { JoinCommunityBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";
import {
  createLocalCommunityMember,
  getLocalCommunityStats,
  listLocalCommunityMembers,
} from "../lib/communityFallbackStore";

const router = Router();
let communityMode: "db" | "local" | null = null;
let communityModePromise: Promise<"db" | "local"> | null = null;

async function resolveCommunityMode(): Promise<"db" | "local"> {
  if (communityMode) return communityMode;
  if (!communityModePromise) {
    communityModePromise = (async () => {
      if (process.env["COMMUNITY_FORCE_LOCAL"] === "1") {
        return "local";
      }

      const dbProbe = db
        .select({ id: communityMembersTable.id })
        .from(communityMembersTable)
        .limit(1)
        .then(() => "db" as const)
        .catch(() => "local" as const);

      const timeout = new Promise<"local">((resolve) => {
        setTimeout(() => resolve("local"), 1200);
      });

      return Promise.race([dbProbe, timeout]);
    })();
  }

  communityMode = await communityModePromise;
  return communityMode;
}

router.get("/community/stats", async (req, res): Promise<void> => {
  const storageMode = await resolveCommunityMode();
  if (storageMode === "local") {
    res.json(await getLocalCommunityStats());
    return;
  }

  try {
    const all = await db.select().from(communityMembersTable);
    const countries = new Set(all.map((m: any) => m.country)).size;
    const volunteers = all.filter((m: any) => m.memberType === "volunteer").length;
    const organizations = all.filter((m: any) => m.memberType === "organization").length;
    res.json({ totalMembers: all.length, countries, volunteers, organizations });
  } catch {
    communityMode = "local";
    res.json(await getLocalCommunityStats());
  }
});

router.get("/community/members", async (req, res): Promise<void> => {
  const storageMode = await resolveCommunityMode();
  if (storageMode === "local") {
    const members = await listLocalCommunityMembers();
    res.json(members.map((m: any) => ({ ...m, joinedAt: m.joinedAt.toISOString() })));
    return;
  }

  try {
    const members = await db
      .select()
      .from(communityMembersTable)
      .orderBy(desc(communityMembersTable.joinedAt));
    res.json(members.map((m: any) => ({ ...m, joinedAt: m.joinedAt.toISOString() })));
  } catch {
    communityMode = "local";
    const members = await listLocalCommunityMembers();
      res.json(members.map((m: any) => ({ ...m, joinedAt: m.joinedAt.toISOString() })));
  }
});

router.post("/community/members", async (req, res): Promise<void> => {
  const parsed = JoinCommunityBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const storageMode = await resolveCommunityMode();
  if (storageMode === "local") {
    try {
      const member = await createLocalCommunityMember(parsed.data);
      res.status(201).json({ ...member, joinedAt: member.joinedAt.toISOString() });
    } catch (err) {
      if (err instanceof Error && err.message === "duplicate-email") {
        res.status(400).json({ error: "This email is already registered." });
        return;
      }
      throw err;
    }
    return;
  }
  try {
    const [member] = await db.insert(communityMembersTable).values(parsed.data).returning();
    res.status(201).json({ ...member, joinedAt: member.joinedAt.toISOString() });
  } catch {
    communityMode = "local";
    try {
      const member = await createLocalCommunityMember(parsed.data);
      res.status(201).json({ ...member, joinedAt: member.joinedAt.toISOString() });
    } catch (err) {
      if (err instanceof Error && err.message === "duplicate-email") {
        res.status(400).json({ error: "This email is already registered." });
        return;
      }
      throw err;
    }
  }
});

export default router;
