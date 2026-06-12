import { Router, type Request } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db } from "@workspace/db";
import {
  communityPostsTable,
  postReactionsTable,
  postCommentsTable,
  commentReactionsTable,
  type CommunityPost as CommunityPostRow,
  type PostComment as PostCommentRow,
} from "@workspace/db";
import {
  CreateCommunityPostBody,
  CreatePostCommentBody,
  ReactToPostBody,
  ReactToCommentBody,
} from "@workspace/api-zod";
import { and, desc, asc, eq, inArray } from "drizzle-orm";
import {
  createLocalCommunityPost,
  createLocalPostComment,
  deleteLocalCommunityPost,
  deleteLocalPostComment,
  listLocalCommunityPosts,
  listLocalPostComments,
  reactToLocalComment,
  reactToLocalPost,
} from "../lib/communityFallbackStore";

const router = Router();
let communityStorageMode: "db" | "local" | null = null;
let communityStorageModePromise: Promise<"db" | "local"> | null = null;

const REACTION_TYPES = ["like", "love", "celebrate", "support", "insightful"] as const;
type ReactionType = (typeof REACTION_TYPES)[number];
type ReactionCounts = Record<ReactionType, number>;

function emptyCounts(): ReactionCounts {
  return { like: 0, love: 0, celebrate: 0, support: 0, insightful: 0 };
}

function getUserId(req: Request): string | null {
  try {
    const auth = getAuth(req);
    return auth?.userId ?? null;
  } catch {
    const preview = getLocalPreviewIdentity(req);
    return preview?.id ?? null;
  }
}

function getLocalPreviewIdentity(
  req: Request,
): { id: string; name: string; imageUrl: string | null } | null {
  const authorization = req.headers.authorization;
  const token =
    typeof authorization === "string" && authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length).trim()
      : null;
  if (!token || !token.startsWith("local:")) {
    return null;
  }

  try {
    const raw = decodeURIComponent(token.slice("local:".length));
    const parsed = JSON.parse(raw) as {
      id?: string;
      name?: string;
      imageUrl?: string | null;
    };
    if (!parsed.id) return null;
    return {
      id: parsed.id,
      name: parsed.name?.trim() || "Member",
      imageUrl: parsed.imageUrl?.trim() || null,
    };
  } catch {
    return null;
  }
}

function sanitizeImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("data:image/")) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function resolveIdentity(
  req: Request,
  userId: string,
): Promise<{ name: string; imageUrl: string | null }> {
  const local = getLocalPreviewIdentity(req);
  if (local && local.id === userId) {
    return { name: local.name, imageUrl: local.imageUrl };
  }

  try {
    const u = await clerkClient.users.getUser(userId);
    const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
    const name =
      full ||
      u.username ||
      u.primaryEmailAddress?.emailAddress?.split("@")[0] ||
      "Member";
    return { name, imageUrl: u.imageUrl ?? null };
  } catch {
    return { name: "Member", imageUrl: null };
  }
}

function serializePost(
  p: CommunityPostRow,
  counts: ReactionCounts,
  myReaction: ReactionType | null,
  commentCount: number,
) {
  const totalReactions = REACTION_TYPES.reduce((sum: number, t) => sum + counts[t], 0);
  return {
    id: p.id,
    authorId: p.authorId,
    authorName: p.authorName,
    authorImageUrl: p.authorImageUrl,
    content: p.content,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt.toISOString(),
    reactions: counts,
    totalReactions,
    myReaction,
    commentCount,
  };
}

function serializeComment(
  c: PostCommentRow,
  counts: ReactionCounts,
  myReaction: ReactionType | null,
) {
  const totalReactions = REACTION_TYPES.reduce((sum: number, t) => sum + counts[t], 0);
  return {
    id: c.id,
    postId: c.postId,
    authorId: c.authorId,
    authorName: c.authorName,
    authorImageUrl: c.authorImageUrl,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    reactions: counts,
    totalReactions,
    myReaction,
  };
}

async function buildPost(p: CommunityPostRow, me: string | null) {
  const reactions = await db
    .select()
    .from(postReactionsTable)
    .where(eq(postReactionsTable.postId, p.id));
  const counts = emptyCounts();
  let myReaction: ReactionType | null = null;
  for (const r of reactions as any[]) {
    counts[r.type as ReactionType] += 1;
    if (me && r.userId === me) myReaction = r.type as ReactionType;
  }
  const comments = await db
    .select({ id: postCommentsTable.id })
    .from(postCommentsTable)
    .where(eq(postCommentsTable.postId, p.id));
  return serializePost(p, counts, myReaction, comments.length);
}

async function buildComment(c: PostCommentRow, me: string | null) {
  const reactions = await db
    .select()
    .from(commentReactionsTable)
    .where(eq(commentReactionsTable.commentId, c.id));
  const counts = emptyCounts();
  let myReaction: ReactionType | null = null;
  for (const r of reactions as any[]) {
    counts[r.type as ReactionType] += 1;
    if (me && r.userId === me) myReaction = r.type as ReactionType;
  }
  return serializeComment(c, counts, myReaction);
}

function switchToLocalCommunityStorage() {
  communityStorageMode = "local";
}

async function resolveCommunityStorageMode(): Promise<"db" | "local"> {
  if (communityStorageMode) return communityStorageMode;
  if (!communityStorageModePromise) {
    communityStorageModePromise = (async () => {
      if (process.env["COMMUNITY_FORCE_LOCAL"] === "1") {
        return "local";
      }

      const dbProbe = db
        .select({ id: communityPostsTable.id })
        .from(communityPostsTable)
        .limit(1)
        .then(() => "db" as const)
        .catch(() => "local" as const);

      const timeout = new Promise<"local">((resolve) => {
        setTimeout(() => resolve("local"), 1200);
      });

      return Promise.race([dbProbe, timeout]);
    })();
  }

  communityStorageMode = await communityStorageModePromise;
  return communityStorageMode;
}

// ── POSTS ──────────────────────────────────────────────────────────────────

router.get("/community/posts", async (req, res): Promise<void> => {
  const me = getUserId(req);
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    res.json(await listLocalCommunityPosts(me));
    return;
  }

  try {
    const posts = await db
      .select()
      .from(communityPostsTable)
      .orderBy(desc(communityPostsTable.createdAt));
    const ids = posts.map((p: any) => p.id);

    const reactions = ids.length
      ? await db
          .select()
          .from(postReactionsTable)
          .where(inArray(postReactionsTable.postId, ids))
      : [];
    const comments = ids.length
      ? await db
          .select({ postId: postCommentsTable.postId })
          .from(postCommentsTable)
          .where(inArray(postCommentsTable.postId, ids))
      : [];

    const countsByPost = new Map<number, ReactionCounts>();
    const myByPost = new Map<number, ReactionType>();
    for (const r of reactions as any[]) {
      let c = countsByPost.get(r.postId);
      if (!c) {
        c = emptyCounts();
        countsByPost.set(r.postId, c);
      }
      c[r.type as ReactionType] += 1;
      if (me && r.userId === me) myByPost.set(r.postId, r.type as ReactionType);
    }
    const commentCountByPost = new Map<number, number>();
    for (const c of comments as any[]) {
      commentCountByPost.set(c.postId, (commentCountByPost.get(c.postId) ?? 0) + 1);
    }

    res.json(
      posts.map((p: any) =>
        serializePost(
          p,
          countsByPost.get(p.id) ?? emptyCounts(),
          myByPost.get(p.id) ?? null,
          commentCountByPost.get(p.id) ?? 0,
        ),
      ),
    );
  } catch {
    switchToLocalCommunityStorage();
    res.json(await listLocalCommunityPosts(me));
  }
});

router.post("/community/posts", async (req, res): Promise<void> => {
  const me = getUserId(req);
  if (!me) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateCommunityPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const content = parsed.data.content.trim();
  if (!content) {
    res.status(400).json({ error: "Post content cannot be empty" });
    return;
  }
  const { name: authorName, imageUrl: authorImageUrl } = await resolveIdentity(req, me);
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    const post = await createLocalCommunityPost({
      authorId: me,
      authorName,
      authorImageUrl,
      content,
      imageUrl: sanitizeImageUrl(parsed.data.imageUrl),
    });
    res.status(201).json(serializePost(post, emptyCounts(), null, 0));
    return;
  }

  try {
    const [post] = await db
      .insert(communityPostsTable)
      .values({
        authorId: me,
        authorName,
        authorImageUrl,
        content,
        imageUrl: sanitizeImageUrl(parsed.data.imageUrl),
      })
      .returning();
    res.status(201).json(serializePost(post!, emptyCounts(), null, 0));
  } catch {
    switchToLocalCommunityStorage();
    const post = await createLocalCommunityPost({
      authorId: me,
      authorName,
      authorImageUrl,
      content,
      imageUrl: sanitizeImageUrl(parsed.data.imageUrl),
    });
    res.status(201).json(serializePost(post, emptyCounts(), null, 0));
  }
});

router.delete("/community/posts/:id", async (req, res): Promise<void> => {
  const me = getUserId(req);
  if (!me) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    const result = await deleteLocalCommunityPost(id, me);
    if (result === "deleted") {
      res.status(204).end();
    } else if (result === "forbidden") {
      res.status(403).json({ error: "Forbidden" });
    } else {
      res.status(404).json({ error: "Not found" });
    }
    return;
  }

  try {
    const [post] = await db
      .select()
      .from(communityPostsTable)
      .where(eq(communityPostsTable.id, id));
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (post.authorId !== me) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    await db.delete(communityPostsTable).where(eq(communityPostsTable.id, id));
    res.status(204).end();
  } catch {
    switchToLocalCommunityStorage();
    const result = await deleteLocalCommunityPost(id, me);
    if (result === "deleted") {
      res.status(204).end();
    } else if (result === "forbidden") {
      res.status(403).json({ error: "Forbidden" });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  }
});

router.put("/community/posts/:id/reaction", async (req, res): Promise<void> => {
  const me = getUserId(req);
  if (!me) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = ReactToPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const type = parsed.data.type as ReactionType;
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    const result = await reactToLocalPost({ postId: id, userId: me, type });
    if (!result) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(serializePost(result.post, result.counts as ReactionCounts, result.myReaction, result.commentCount));
    return;
  }

  try {
    const [post] = await db
      .select()
      .from(communityPostsTable)
      .where(eq(communityPostsTable.id, id));
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const [existing] = await db
      .select()
      .from(postReactionsTable)
      .where(and(eq(postReactionsTable.postId, id), eq(postReactionsTable.userId, me)));
    if (existing && existing.type === type) {
      await db.delete(postReactionsTable).where(eq(postReactionsTable.id, existing.id));
    } else {
      await db
        .insert(postReactionsTable)
        .values({ postId: id, userId: me, type })
        .onConflictDoUpdate({
          target: [postReactionsTable.postId, postReactionsTable.userId],
          set: { type },
        });
    }
    res.json(await buildPost(post, me));
  } catch {
    switchToLocalCommunityStorage();
    const result = await reactToLocalPost({ postId: id, userId: me, type });
    if (!result) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(serializePost(result.post, result.counts as ReactionCounts, result.myReaction, result.commentCount));
  }
});

// ── COMMENTS ─────────────────────────────────────────────────────────────────

router.get("/community/posts/:id/comments", async (req, res): Promise<void> => {
  const me = getUserId(req);
  const postId = Number(req.params.id);
  if (!Number.isInteger(postId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    res.json(await listLocalPostComments(postId, me));
    return;
  }

  try {
    const comments = await db
      .select()
      .from(postCommentsTable)
      .where(eq(postCommentsTable.postId, postId))
      .orderBy(asc(postCommentsTable.createdAt));
    const ids = comments.map((c: any) => c.id);
    const reactions = ids.length
      ? await db
          .select()
          .from(commentReactionsTable)
          .where(inArray(commentReactionsTable.commentId, ids))
      : [];
    const countsByComment = new Map<number, ReactionCounts>();
    const myByComment = new Map<number, ReactionType>();
    for (const r of reactions as any[]) {
      let c = countsByComment.get(r.commentId);
      if (!c) {
        c = emptyCounts();
        countsByComment.set(r.commentId, c);
      }
      c[r.type as ReactionType] += 1;
      if (me && r.userId === me) myByComment.set(r.commentId, r.type as ReactionType);
    }
    res.json(
      comments.map((c: any) =>
        serializeComment(
          c,
          countsByComment.get(c.id) ?? emptyCounts(),
          myByComment.get(c.id) ?? null,
        ),
      ),
    );
  } catch {
    switchToLocalCommunityStorage();
    res.json(await listLocalPostComments(postId, me));
  }
});

router.post("/community/posts/:id/comments", async (req, res): Promise<void> => {
  const me = getUserId(req);
  if (!me) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const postId = Number(req.params.id);
  if (!Number.isInteger(postId)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = CreatePostCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const content = parsed.data.content.trim();
  if (!content) {
    res.status(400).json({ error: "Comment cannot be empty" });
    return;
  }
  const { name, imageUrl } = await resolveIdentity(req, me);
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    const comment = await createLocalPostComment({
      postId,
      authorId: me,
      authorName: name,
      authorImageUrl: imageUrl,
      content,
    });
    res.status(201).json(serializeComment(comment, emptyCounts(), null));
    return;
  }

  try {
    const [post] = await db
      .select()
      .from(communityPostsTable)
      .where(eq(communityPostsTable.id, postId));
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const [comment] = await db
      .insert(postCommentsTable)
      .values({
        postId,
        authorId: me,
        authorName: name,
        authorImageUrl: imageUrl,
        content,
      })
      .returning();
    res.status(201).json(serializeComment(comment!, emptyCounts(), null));
  } catch {
    switchToLocalCommunityStorage();
    const comment = await createLocalPostComment({
      postId,
      authorId: me,
      authorName: name,
      authorImageUrl: imageUrl,
      content,
    });
    res.status(201).json(serializeComment(comment, emptyCounts(), null));
  }
});

router.delete("/community/comments/:id", async (req, res): Promise<void> => {
  const me = getUserId(req);
  if (!me) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    const result = await deleteLocalPostComment(id, me);
    if (result === "deleted") {
      res.status(204).end();
    } else if (result === "forbidden") {
      res.status(403).json({ error: "Forbidden" });
    } else {
      res.status(404).json({ error: "Not found" });
    }
    return;
  }

  try {
    const [comment] = await db
      .select()
      .from(postCommentsTable)
      .where(eq(postCommentsTable.id, id));
    if (!comment) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    if (comment.authorId !== me) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    await db.delete(postCommentsTable).where(eq(postCommentsTable.id, id));
    res.status(204).end();
  } catch {
    switchToLocalCommunityStorage();
    const result = await deleteLocalPostComment(id, me);
    if (result === "deleted") {
      res.status(204).end();
    } else if (result === "forbidden") {
      res.status(403).json({ error: "Forbidden" });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  }
});

router.put("/community/comments/:id/reaction", async (req, res): Promise<void> => {
  const me = getUserId(req);
  if (!me) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = ReactToCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const type = parsed.data.type as ReactionType;
  const storageMode = await resolveCommunityStorageMode();
  if (storageMode === "local") {
    const result = await reactToLocalComment({ commentId: id, userId: me, type });
    if (!result) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(serializeComment(result.comment, result.counts as ReactionCounts, result.myReaction));
    return;
  }

  try {
    const [comment] = await db
      .select()
      .from(postCommentsTable)
      .where(eq(postCommentsTable.id, id));
    if (!comment) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    const [existing] = await db
      .select()
      .from(commentReactionsTable)
      .where(
        and(eq(commentReactionsTable.commentId, id), eq(commentReactionsTable.userId, me)),
      );
    if (existing && existing.type === type) {
      await db
        .delete(commentReactionsTable)
        .where(eq(commentReactionsTable.id, existing.id));
    } else {
      await db
        .insert(commentReactionsTable)
        .values({ commentId: id, userId: me, type })
        .onConflictDoUpdate({
          target: [commentReactionsTable.commentId, commentReactionsTable.userId],
          set: { type },
        });
    }
    res.json(await buildComment(comment, me));
  } catch {
    switchToLocalCommunityStorage();
    const result = await reactToLocalComment({ commentId: id, userId: me, type });
    if (!result) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(serializeComment(result.comment, result.counts as ReactionCounts, result.myReaction));
  }
});

export default router;
