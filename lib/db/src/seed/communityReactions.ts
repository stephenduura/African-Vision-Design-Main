// @ts-nocheck
export const COMMUNITY_REACTION_SEEDS = [
  { postIndex: 0, userId: "seed_reactor_001", type: "love" as const },
  { postIndex: 0, userId: "seed_reactor_002", type: "insightful" as const },
  { postIndex: 1, userId: "seed_reactor_003", type: "support" as const },
  { postIndex: 1, userId: "seed_reactor_004", type: "celebrate" as const },
  { postIndex: 2, userId: "seed_reactor_005", type: "like" as const },
  { postIndex: 2, userId: "seed_reactor_006", type: "insightful" as const },
  { postIndex: 3, userId: "seed_reactor_007", type: "love" as const },
];

export const COMMUNITY_COMMENT_SEEDS = [
  { postIndex: 0, authorId: "seed_commenter_001", authorName: "Grace Njeri", authorImageUrl: null, content: "This is exactly the kind of transparency that builds real trust." },
  { postIndex: 0, authorId: "seed_commenter_002", authorName: "Oliver Meyer", authorImageUrl: null, content: "A great model for community-led development." },
  { postIndex: 1, authorId: "seed_commenter_003", authorName: "Faith Johnson", authorImageUrl: null, content: "Health outreach like this has immediate impact on families." },
  { postIndex: 2, authorId: "seed_commenter_004", authorName: "Amina Bello", authorImageUrl: null, content: "Proud to see the network growing and supporting field teams." },
];

export const COMMUNITY_COMMENT_REACTION_SEEDS = [
  { commentIndex: 0, userId: "seed_reactor_008", type: "like" as const },
  { commentIndex: 1, userId: "seed_reactor_009", type: "support" as const },
  { commentIndex: 2, userId: "seed_reactor_010", type: "insightful" as const },
  { commentIndex: 3, userId: "seed_reactor_011", type: "love" as const },
];
