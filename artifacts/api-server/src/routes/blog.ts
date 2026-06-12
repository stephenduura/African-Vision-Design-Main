import { Router } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { CreateBlogPostBody, GetBlogPostParams } from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.publishedAt));
  res.json(posts.map((p: any) => ({ ...p, publishedAt: p.publishedAt.toISOString() })));
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const parsed = GetBlogPostParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, parsed.data.id));
  if (!post) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ...post, publishedAt: post.publishedAt.toISOString() });
});

router.post("/blog", async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db.insert(blogPostsTable).values(parsed.data).returning();
  res.status(201).json({ ...post, publishedAt: post.publishedAt.toISOString() });
});

export default router;
