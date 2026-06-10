// @ts-nocheck
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

export const reactionTypeEnum = pgEnum("reaction_type", [
  "like",
  "love",
  "celebrate",
  "support",
  "insightful",
]);

export const communityPostsTable = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  authorImageUrl: text("author_image_url"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postReactionsTable = pgTable(
  "post_reactions",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => communityPostsTable.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    type: reactionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqUserPost: unique("uniq_user_post_reaction").on(t.postId, t.userId),
  }),
);

export const postCommentsTable = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => communityPostsTable.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  authorImageUrl: text("author_image_url"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentReactionsTable = pgTable(
  "comment_reactions",
  {
    id: serial("id").primaryKey(),
    commentId: integer("comment_id")
      .notNull()
      .references(() => postCommentsTable.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    type: reactionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqUserComment: unique("uniq_user_comment_reaction").on(
      t.commentId,
      t.userId,
    ),
  }),
);

export type CommunityPost = typeof communityPostsTable.$inferSelect;
export type PostReaction = typeof postReactionsTable.$inferSelect;
export type PostComment = typeof postCommentsTable.$inferSelect;
export type CommentReaction = typeof commentReactionsTable.$inferSelect;
