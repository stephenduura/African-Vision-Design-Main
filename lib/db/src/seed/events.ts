// @ts-nocheck
import type { InsertEvent } from "../schema";

export const EVENT_SEEDS: InsertEvent[] = [
  {
    title: "Foundation Launch",
    description: "Papi Foundation was established with a clear mission to transform lives across Africa.",
    content: "The Foundation's launch marked the beginning of a continent-wide commitment to education, clean water, healthcare, and accountable growth.",
    type: "event",
    imageUrl: "/news/hero.png",
    date: "2024-03-18",
    location: "Abuja, Nigeria",
  },
  {
    title: "Nigeria Expansion",
    description: "Deepening our impact in Nigeria with education, clean water, and healthcare projects.",
    content: "Teams expanded field delivery and local partnerships to reach more communities with measurable support.",
    type: "update",
    imageUrl: "/abuja-water.png",
    date: "2025-02-12",
    location: "Nigeria",
  },
  {
    title: "West Africa Growth Forum",
    description: "A regional convening bringing together partners, field leaders, and community advocates across West Africa.",
    content: "The forum focused on collaboration, program delivery, and the next phase of regional growth.",
    type: "event",
    imageUrl: "/roadmap/hero.png",
    date: "2025-09-09",
    location: "Accra, Ghana",
  },
  {
    title: "Foundation in the Press",
    description: "A feature story highlighting the Foundation's model for African-led development and transparent impact tracking.",
    content: "Media coverage continues to spotlight the Foundation's approach to pairing global partnerships with local ownership.",
    type: "press",
    imageUrl: "/news/cta.png",
    date: "2026-01-28",
    location: "Amsterdam, Netherlands",
  },
  {
    title: "Pan-African Platform Briefing",
    description: "A public briefing on the digital infrastructure powering our next stage of growth and accountability.",
    content: "The session outlined the roadmap for a more connected, measurable, and scalable foundation platform.",
    type: "video",
    imageUrl: "/opengraph.jpg",
    date: "2026-04-04",
    location: "Remote",
    videoUrl: "https://example.com/video/pan-african-briefing",
  },
];
