// @ts-nocheck
import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const memberTypeEnum = pgEnum("member_type", ["individual", "organization", "volunteer"]);

export const communityMembersTable = pgTable("community_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  country: text("country").notNull(),
  memberType: memberTypeEnum("member_type").notNull().default("individual"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertCommunityMemberSchema = createInsertSchema(communityMembersTable).omit({ id: true, joinedAt: true });
export type InsertCommunityMember = z.infer<typeof insertCommunityMemberSchema>;
export type CommunityMember = typeof communityMembersTable.$inferSelect;
