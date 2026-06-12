import { sql } from "drizzle-orm";
import { db, teamMembersTable } from "@workspace/db";
import { TEAM_ROSTER } from "@workspace/db/seed/teamRoster";
import { logger } from "./lib/logger";

const TEAM_SEED_LOCK_KEY = 727274001;

/**
 * Reconcile the team_members table to the canonical roster above. Runs inside a
 * single transaction so readers always see a complete, consistent set.
 */
export async function seedTeam(): Promise<void> {
  await db.transaction(async (tx: any) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${TEAM_SEED_LOCK_KEY})`);
    await tx.delete(teamMembersTable);
    await tx.insert(teamMembersTable).values(TEAM_ROSTER);
  });
  logger.info({ count: TEAM_ROSTER.length }, "Team roster reconciled");
}
