import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db";
import { CreateEventBody, GetEventParams } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/events/recent", async (req, res): Promise<void> => {
  const events = await db.select().from(eventsTable).orderBy(desc(eventsTable.createdAt)).limit(6);
  res.json(events.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

router.get("/events", async (req, res): Promise<void> => {
  const events = await db.select().from(eventsTable).orderBy(desc(eventsTable.createdAt));
  res.json(events.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

router.get("/events/:id", async (req, res): Promise<void> => {
  const parsed = GetEventParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, parsed.data.id));
  if (!event) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...event, createdAt: event.createdAt.toISOString() });
});

router.post("/events", async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [event] = await db.insert(eventsTable).values(parsed.data).returning();
  res.status(201).json({ ...event, createdAt: event.createdAt.toISOString() });
});

export default router;
