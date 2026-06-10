import type { InsertProject, InsertEvent } from "../schema";

export const EXTRA_PROJECT_SEEDS: InsertProject[] = [
  {
    title: "Community Infrastructure Renewal",
    description: "Community centres, market facilities, roads, and sanitation systems for growing communities.",
    status: "ongoing",
    country: "Senegal",
    category: "Community Infrastructure",
    goalAmount: 110000,
    raisedAmount: 54000,
    imageUrl: "/roadmap/hero.png",
    location: "Dakar",
    beneficiaries: 1300,
  },
  {
    title: "Youth Skills Accelerator",
    description: "Training and mentorship for young people entering technology, entrepreneurship, and community leadership.",
    status: "upcoming",
    country: "Kenya",
    category: "Education",
    goalAmount: 140000,
    raisedAmount: 25000,
    imageUrl: "/insights/youth.png",
    location: "Nairobi",
    beneficiaries: 800,
  },
];

export const EXTRA_EVENT_SEEDS: InsertEvent[] = [
  {
    title: "Field Team Visit: Abuja Water Project",
    description: "Community leaders and donors visited the water project site to review progress and next steps.",
    content: "The visit highlighted local ownership, technical progress, and the importance of long-term maintenance planning.",
    type: "update",
    imageUrl: "/abuja-water.png",
    date: "2026-02-18",
    location: "Abuja, Nigeria",
  },
  {
    title: "Diaspora Investor Roundtable",
    description: "A private roundtable with diaspora investors exploring high-trust opportunities across key sectors.",
    content: "The conversation focused on accountability, local partnerships, and investment pathways that create jobs and skills.",
    type: "event",
    imageUrl: "/partners/hero.png",
    date: "2026-03-22",
    location: "Amsterdam, Netherlands",
  },
];
