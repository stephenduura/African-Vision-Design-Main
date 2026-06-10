import { Router } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";
import {
  ListProjectsQueryParams,
  CreateProjectBody,
  GetProjectParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/projects/stats", async (req, res): Promise<void> => {
  const all = await db.select().from(projectsTable);
  const ongoing = all.filter((p) => p.status === "ongoing").length;
  const completed = all.filter((p) => p.status === "completed").length;
  const upcoming = all.filter((p) => p.status === "upcoming").length;
  const totalRaised = all.reduce((sum, p) => sum + (p.raisedAmount ?? 0), 0);
  const totalBeneficiaries = all.reduce((sum, p) => sum + (p.beneficiaries ?? 0), 0);
  const countries = new Set(all.map((p) => p.country)).size;
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
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  const all = await db.select().from(projectsTable);
  let filtered = all;
  if (parsed.success) {
    if (parsed.data.status) {
      filtered = filtered.filter((p) => p.status === parsed.data.status);
    }
    if (parsed.data.country) {
      filtered = filtered.filter((p) =>
        p.country.toLowerCase().includes((parsed.data.country ?? "").toLowerCase())
      );
    }
  }
  const result = filtered.map((p) => ({
    ...p,
    progressPercent: p.goalAmount > 0 ? Math.round((p.raisedAmount / p.goalAmount) * 100) : 0,
    createdAt: p.createdAt.toISOString(),
  }));
  res.json(result);
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const parsed = GetProjectParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, parsed.data.id));
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
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json({
    ...project,
    progressPercent: project.goalAmount > 0 ? Math.round((project.raisedAmount / project.goalAmount) * 100) : 0,
    createdAt: project.createdAt.toISOString(),
  });
});

export default router;
