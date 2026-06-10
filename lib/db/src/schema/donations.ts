// @ts-nocheck
import { pgTable, serial, text, real, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const donationTypeEnum = pgEnum("donation_type", ["one-time", "monthly"]);

export const donationsTable = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("EUR"),
  donorName: text("donor_name").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  projectId: integer("project_id"),
  message: text("message"),
  type: donationTypeEnum("type").notNull().default("one-time"),
  stripeSessionId: text("stripe_session_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDonationSchema = createInsertSchema(donationsTable).omit({ id: true, createdAt: true });
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donationsTable.$inferSelect;
