// @ts-nocheck
import type { InsertDonation } from "../schema";

export type DonationSeed = {
  projectTitle: string | null;
  data: InsertDonation;
};

export const DONATION_SEEDS: DonationSeed[] = [
  {
    projectTitle: "Clean Water for Abuja Communities",
    data: {
      amount: 5000,
      currency: "EUR",
      donorName: "Tedum Henry Paago",
      isAnonymous: false,
      message: "Kickstarting the clean water program with a leadership gift.",
      type: "one-time",
      stripeSessionId: "seed_session_001",
    },
  },
  {
    projectTitle: "Education Access and School Renewal",
    data: {
      amount: 1200,
      currency: "EUR",
      donorName: "Anonymous Supporter",
      isAnonymous: true,
      message: "For school materials and teacher support.",
      type: "monthly",
      stripeSessionId: "seed_session_002",
    },
  },
  {
    projectTitle: "Clean Water for Abuja Communities",
    data: {
      amount: 750,
      currency: "EUR",
      donorName: "Amina Bello",
      isAnonymous: false,
      message: "Proud to support clean water access in Abuja.",
      type: "one-time",
      stripeSessionId: "seed_session_003",
    },
  },
  {
    projectTitle: "Women Empowerment Market Hub",
    data: {
      amount: 2500,
      currency: "EUR",
      donorName: "North Star Capital",
      isAnonymous: false,
      message: "Backing women's economic empowerment and community growth.",
      type: "one-time",
      stripeSessionId: "seed_session_004",
    },
  },
  {
    projectTitle: "Rural Health Outreach",
    data: {
      amount: 300,
      currency: "EUR",
      donorName: "Kwame Mensah",
      isAnonymous: false,
      message: "Support for rural health outreach.",
      type: "monthly",
      stripeSessionId: "seed_session_005",
    },
  },
  {
    projectTitle: "Solar Energy for Community Infrastructure",
    data: {
      amount: 1800,
      currency: "EUR",
      donorName: "Unity Impact Trust",
      isAnonymous: false,
      message: "Contributing to clean energy infrastructure.",
      type: "one-time",
      stripeSessionId: "seed_session_006",
    },
  },
];
