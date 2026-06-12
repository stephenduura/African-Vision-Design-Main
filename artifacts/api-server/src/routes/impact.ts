import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable, donationsTable, communityMembersTable, partnersTable } from "@workspace/db";

const router = Router();

router.get("/impact", async (req, res): Promise<void> => {
  const [projects, donations, members, partners] = await Promise.all([
    db.select().from(projectsTable),
    db.select().from(donationsTable),
    db.select().from(communityMembersTable),
    db.select().from(partnersTable),
  ]);
  const totalRaised = donations.reduce((sum: number, d: any) => sum + d.amount, 0);
  const projectsCompleted = projects.filter((p: any) => p.status === "completed").length;
  const beneficiaries = projects.reduce((sum: number, p: any) => sum + (p.beneficiaries ?? 0), 0);
  const countriesReached = new Set(projects.map((p: any) => p.country)).size;
  res.json({
    totalRaised,
    projectsCompleted,
    beneficiaries,
    countriesReached,
    partnersCount: partners.length,
    communityMembers: members.length,
  });
});

router.get("/impact/roadmap", async (req, res): Promise<void> => {
  const roadmap = [
    {
      id: 1,
      year: 2024,
      title: "Foundation Launch",
      description: "Papi Foundation was established with a clear mission to transform lives across Africa.",
      status: "completed",
      milestones: ["Foundation registered", "Website launched", "First donors secured", "Nigeria pilot project launched"],
    },
    {
      id: 2,
      year: 2025,
      title: "Nigeria Expansion",
      description: "Deepening our impact in Nigeria with education, clean water, and healthcare projects.",
      status: "completed",
      milestones: ["3 schools built", "2 clean water systems installed", "500+ beneficiaries reached", "10 partner organizations onboarded"],
    },
    {
      id: 3,
      year: 2026,
      title: "West Africa Growth",
      description: "Expanding operations to Ghana, Senegal, and Cameroon with community-driven programs.",
      status: "current",
      milestones: ["Enter Ghana market", "Launch Senegal pilot", "Build regional ambassador network", "Reach 5,000 beneficiaries"],
    },
    {
      id: 4,
      year: 2027,
      title: "Pan-African Platform",
      description: "Scaling to 15+ African countries with a fully digital platform for transparent impact tracking.",
      status: "upcoming",
      milestones: ["15 countries active", "Digital impact dashboard live", "€1M raised milestone", "100+ corporate partners"],
    },
    {
      id: 5,
      year: 2028,
      title: "Global Recognition",
      description: "Achieving global NGO status and UN recognition as a leading African development foundation.",
      status: "upcoming",
      milestones: ["UN partnership established", "50,000 lives impacted", "Global ambassador program", "€5M annual fundraising"],
    },
  ];
  res.json(roadmap);
});

export default router;
