import type { InsertTeamMember } from "../schema";

/**
 * Canonical team roster for the Team page and seed routines.
 */
export const TEAM_ROSTER: InsertTeamMember[] = [
  {
    name: "Tedum Henry Paago",
    role: "Founder / President",
    bio: "Tedum Henry Paago founded Papi Foundation in 2024 with a vision to create systemic change across Africa. Born in Nigeria and educated in the Netherlands, he combines global perspective with deep African roots to drive impactful programs.",
    imageUrl: "/founder.jpg",
    linkedinUrl: "https://linkedin.com",
    category: "leadership",
    order: 1,
  },
  {
    name: "Benedicta Wokocha Gracious",
    role: "Legal Counsel",
    bio: "Benedicta leads the Foundation's legal affairs - overseeing governance, regulatory compliance, and the integrity of every partnership and programme across our countries of operation.",
    imageUrl: "/team/benedicta.png",
    linkedinUrl: null,
    category: "leadership",
    order: 2,
  },
  {
    name: "Stephen B. Paago",
    role: "Director of Programs",
    bio: "Stephen oversees the design and delivery of the Foundation's programmes, turning strategy into measurable change across education, clean water, and healthcare initiatives on the ground.",
    imageUrl: "/team/stephen.png",
    linkedinUrl: null,
    category: "leadership",
    order: 3,
  },
  {
    name: "David Okafor",
    role: "Director of Partnerships",
    bio: "David leads strategic partnerships for the Foundation, building and nurturing relationships with corporate, government, and NGO allies to expand the reach and impact of every programme across Africa.",
    imageUrl: "/team/leadership_man.jpg",
    linkedinUrl: null,
    category: "leadership",
    order: 4,
  },
  {
    name: "Chidi Okonkwo",
    role: "Field Coordinator - Nigeria",
    bio: "Chidi is on the ground in Nigeria every day, managing project delivery and community relationships. His deep knowledge of local communities ensures our programs are culturally appropriate and effective.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    linkedinUrl: null,
    category: "volunteer",
    order: 5,
  },
  {
    name: "Amara Diallo",
    role: "Field Coordinator - West Africa",
    bio: "Amara coordinates our expanding presence in Ghana and Senegal, building local partnerships and managing project teams across West Africa.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    linkedinUrl: null,
    category: "volunteer",
    order: 6,
  },
  {
    name: "Dr. Sarah Vandenberg",
    role: "International Ambassador - Netherlands",
    bio: "Dr. Vandenberg is a renowned development economist based in Amsterdam who champions Papi Foundation across European donor communities and academic institutions.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    linkedinUrl: "https://linkedin.com",
    category: "ambassador",
    order: 7,
  },
  {
    name: "Ibrahim Musa",
    role: "Youth Ambassador",
    bio: "Ibrahim, a 26-year-old entrepreneur from Kano, represents the next generation of African leaders. He advocates for youth empowerment programs and manages our youth community network.",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    linkedinUrl: null,
    category: "ambassador",
    order: 8,
  },
];
