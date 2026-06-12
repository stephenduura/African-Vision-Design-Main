// @ts-nocheck
import { Router } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function getSingleQueryValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return undefined;
}

router.get("/projects/stats", async (req, res): Promise<void> => {
  const all: any[] = await db.select().from(projectsTable);
  const ongoing = all.filter((p: any) => p.status === "ongoing").length;
  const completed = all.filter((p: any) => p.status === "completed").length;
  const upcoming = all.filter((p: any) => p.status === "upcoming").length;
  const totalRaised = all.reduce((sum: number, p: any) => sum + (p.raisedAmount ?? 0), 0);
  const totalBeneficiaries = all.reduce((sum: number, p: any) => sum + (p.beneficiaries ?? 0), 0);
  const countries = new Set(all.map((p: any) => p.country)).size;
  res.json({
    total: all.length,
    ongoing,
    completed,
    upcoming,
    totalRaised,
    totalBeneficiaries,
    countriesReached: countries,
  });
});

router.get("/projects", async (req, res): Promise<void> => {
  const all: any[] = await db.select().from(projectsTable);
  let filtered: any[] = all;
  const status = getSingleQueryValue(req.query.status);
  const country = getSingleQueryValue(req.query.country);

  if (status === "ongoing" || status === "completed" || status === "upcoming") {
    filtered = filtered.filter((p: any) => p.status === status);
  }
  if (country) {
    filtered = filtered.filter((p: any) =>
      p.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  const result: any[] = filtered.map((p: any) => ({
    ...p,
    progressPercent: p.goalAmount > 0 ? Math.round((p.raisedAmount / p.goalAmount) * 100) : 0,
    createdAt: p.createdAt.toISOString(),
  }));
  res.json(result);
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [project]: any[] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
  if (!project) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({
    ...project,
    progressPercent: project.goalAmount > 0 ? Math.round((project.raisedAmount / project.goalAmount) * 100) : 0,
    createdAt: project.createdAt.toISOString(),
  });
});

router.post("/projects", async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const requiredFields = ["title", "description", "status", "country", "category", "goalAmount", "imageUrl"];
  if (
    requiredFields.some((field) => body[field] == null) ||
    typeof body.title !== "string" ||
    typeof body.description !== "string" ||
    typeof body.status !== "string" ||
    typeof body.country !== "string" ||
    typeof body.category !== "string" ||
    typeof body.goalAmount !== "number" ||
    typeof body.imageUrl !== "string"
  ) {
    res.status(400).json({ error: "Invalid project payload" });
    return;
  }
  const newProject: any = {
    title: body.title,
    description: body.description,
    status: body.status === "ongoing" || body.status === "completed" || body.status === "upcoming"
      ? body.status
      : "upcoming",
    country: body.country,
    category: body.category,
    goalAmount: body.goalAmount,
    raisedAmount: typeof body.raisedAmount === "number" ? body.raisedAmount : 0,
    imageUrl: body.imageUrl,
    beforeImageUrl: typeof body.beforeImageUrl === "string" ? body.beforeImageUrl : null,
    afterImageUrl: typeof body.afterImageUrl === "string" ? body.afterImageUrl : null,
    beneficiaries: typeof body.beneficiaries === "number" ? body.beneficiaries : null,
    location: typeof body.location === "string" ? body.location : null,
    lat: typeof body.lat === "number" ? body.lat : null,
    lng: typeof body.lng === "number" ? body.lng : null,
  };
  const [project]: any[] = await db.insert(projectsTable).values(newProject).returning();
  res.status(201).json({
    ...project,
    progressPercent: project.goalAmount > 0 ? Math.round((project.raisedAmount / project.goalAmount) * 100) : 0,
    createdAt: project.createdAt.toISOString(),
  });
});

export default router;
