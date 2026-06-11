import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCommunityPosts,
  useCreateCommunityPost,
  useDeleteCommunityPost,
  useReactToPost,
  useListPostComments,
  useCreatePostComment,
  useDeleteComment,
  useReactToComment,
  getListCommunityPostsQueryKey,
  getListPostCommentsQueryKey,
  type CommunityPost,
  type PostComment,
  type ReactionCounts,
} from "@workspace/api-client-react";
import {
  ThumbsUp,
  Heart,
  PartyPopper,
  Handshake,
  Lightbulb,
  MessageCircle,
  Trash2,
  Send,
  LogIn,
  ImagePlus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ReactionType = "like" | "love" | "celebrate" | "support" | "insightful";

const REACTIONS: {
  type: ReactionType;
  label: string;
  icon: typeof ThumbsUp;
}[] = [
  { type: "like", label: "Like", icon: ThumbsUp },
  { type: "love", label: "Love", icon: Heart },
  { type: "celebrate", label: "Celebrate", icon: PartyPopper },
  { type: "support", label: "Support", icon: Handshake },
  { type: "insightful", label: "Insightful", icon: Lightbulb },
];

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Avatar({
  name,
  imageUrl,
  size = "md",
}: {
  name: string;
  imageUrl: string | null;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${dim} rounded-full object-cover shrink-0 border border-border`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-primary/15 text-primary font-serif font-bold flex items-center justify-center shrink-0`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ReactionBar({
  counts,
  myReaction,
  total,
  onReact,
  disabled,
}: {
  counts: ReactionCounts;
  myReaction: string | null;
  total: number;
  onReact: (type: ReactionType) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {REACTIONS.map(({ type, label, icon: Icon }) => {
        const active = myReaction === type;
        const count = counts[type] ?? 0;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onReact(type)}
            disabled={disabled}
            title={label}
            aria-label={label}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 min-h-[34px] ${
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            }`}
          >
            <Icon size={14} className={active ? "fill-primary/20" : ""} />
            {count > 0 && <span className="tabular-nums">{count}</span>}
          </button>
        );
      })}
      {total > 0 && (
        <span className="ml-1 text-[11px] text-muted-foreground">
          {total} {total === 1 ? "reaction" : "reactions"}
        </span>
      )}
    </div>
  );
}

function CommentThread({ postId }: { postId: number }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: comments, isLoading } = useListPostComments(postId);
  const createComment = useCreatePostComment();
  const deleteComment = useDeleteComment();
  const reactToComment = useReactToComment();
  const [text, setText] = useState("");
  const safeComments = Array.isArray(comments) ? comments : [];

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getListPostCommentsQueryKey(postId) });
    qc.invalidateQueries({ queryKey: getListCommunityPostsQueryKey() });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    createComment.mutate(
      { id: postId, data: { content } },
      {
        onSuccess: () => {
          setText("");
          invalidate();
        },
      },
    );
  };

  const onReact = (commentId: number, type: ReactionType) => {
    reactToComment.mutate(
      { id: commentId, data: { type } },
      { onSuccess: invalidate },
    );
  };

  return (
    <div className="mt-4 border-t border-border pt-4 space-y-4">
      {user ? (
        <form onSubmit={submit} className="flex items-start gap-2.5">
          <Avatar name={user.name} imageUrl={user.imageUrl ?? null} size="sm" />
          <div className="flex-1 flex items-end gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={createComment.isPending || !text.trim()}
              className="shrink-0 flex items-center justify-center rounded-lg bg-primary text-primary-foreground w-10 h-10 hover:bg-primary/90 transition-colors disabled:opacity-50"
              aria-label="Post comment"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      ) : (
        <Link
          href="/sign-in"
          className="flex items-center gap-2 text-xs text-primary font-semibold hover:underline"
        >
          <LogIn size={13} /> Sign in to join the conversation
        </Link>
      )}

      {isLoading ? (
        <div className="text-xs text-muted-foreground">Loading comments...</div>
      ) : safeComments.length > 0 ? (
        <div className="space-y-4">
          {safeComments.map((c: PostComment) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Avatar
                name={c.authorName}
                imageUrl={c.authorImageUrl ?? null}
                size="sm"
              />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="rounded-2xl bg-card border border-border px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold truncate">
                      {c.authorName}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {timeAgo(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5 whitespace-pre-wrap break-words">
                    {c.content}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 pl-1">
                  <ReactionBar
                    counts={c.reactions}
                    myReaction={c.myReaction ?? null}
                    total={c.totalReactions}
                    onReact={(type) =>
                      user
                        ? onReact(c.id, type)
                        : (window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sign-in`)
                    }
                  />
                  {user && user.id === c.authorId && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteComment.mutate(
                          { id: c.id },
                          { onSuccess: invalidate },
                        )
                      }
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      aria-label="Delete comment"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">
          No comments yet. Be the first to respond.
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const reactToPost = useReactToPost();
  const deletePost = useDeleteCommunityPost();
  const [showComments, setShowComments] = useState(false);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: getListCommunityPostsQueryKey() });

  const onReact = (type: ReactionType) => {
    if (!user) {
      window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sign-in`;
      return;
    }
    reactToPost.mutate(
      { id: post.id, data: { type } },
      { onSuccess: invalidate },
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-background border border-border rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <header className="flex items-center gap-3">
        <Avatar name={post.authorName} imageUrl={post.authorImageUrl ?? null} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{post.authorName}</div>
          <div className="text-[11px] text-muted-foreground">
            {timeAgo(post.createdAt)}
          </div>
        </div>
        {user && user.id === post.authorId && (
          <button
            type="button"
            onClick={() =>
              deletePost.mutate({ id: post.id }, { onSuccess: invalidate })
            }
            className="text-muted-foreground hover:text-destructive transition-colors p-1"
            aria-label="Delete post"
          >
            <Trash2 size={15} />
          </button>
        )}
      </header>

      <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
        {post.content}
      </p>

      {post.imageUrl && (
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src={post.imageUrl}
            alt="Post attachment"
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <ReactionBar
          counts={post.reactions}
          myReaction={post.myReaction ?? null}
          total={post.totalReactions}
          onReact={onReact}
        />
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors min-h-[34px]"
        >
          <MessageCircle size={15} />
          {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <CommentThread postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function Composer() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const createPost = useCreateCommunityPost();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImage, setShowImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  if (!user) return null;

  const readImageFile = async (file: File): Promise<void> => {
    if (!file.type.startsWith("image/")) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = objectUrl;
      });

      const maxDimension = 1280;
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);

      const result = canvas.toDataURL("image/webp", 0.82);
      if (result) {
        setImageUrl(result);
        setShowImage(true);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        if (result) {
          setImageUrl(result);
          setShowImage(true);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;
    createPost.mutate(
      { data: { content: text, imageUrl: imageUrl.trim() || undefined } },
      {
        onSuccess: () => {
          setContent("");
          setImageUrl("");
          setShowImage(false);
          qc.invalidateQueries({ queryKey: getListCommunityPostsQueryKey() });
        },
      },
    );
  };

  return (
    <form
      onSubmit={submit}
      className="bg-background border border-border rounded-2xl p-5 sm:p-6 space-y-4"
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void readImageFile(file);
          }
          e.currentTarget.value = "";
        }}
      />
      <div className="flex items-start gap-3">
        <Avatar name={user.name} imageUrl={user.imageUrl} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Share something with the community, ${user.name.split(" ")[0]}...`}
          rows={3}
          className="flex-1 resize-none bg-transparent text-[15px] focus:outline-none placeholder:text-muted-foreground"
        />
      </div>

      {showImage && (
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Paste an image URL (optional)"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => {
            setShowImage((v) => !v);
            imageInputRef.current?.click();
          }}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            showImage ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <ImagePlus size={15} /> Add image
        </button>
        <button
          type="submit"
          disabled={createPost.isPending || !content.trim()}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg uppercase tracking-widest text-[11px] font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {createPost.isPending ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

export default function CommunityFeed() {
  const { user, isLoaded } = useAuth();
  const { data: posts, isLoading } = useListCommunityPosts();
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <section id="feed" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-3 mb-8">
            <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">
              Community Feed
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif">
              Voices of the Movement
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              Share updates, celebrate milestones, and connect with members
              across the continent and the diaspora.
            </p>
          </div>

          {isLoaded && !user && (
            <div className="bg-secondary text-secondary-foreground rounded-2xl p-6 sm:p-8 text-center space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl">
                Join the conversation
              </h3>
              <p className="text-secondary-foreground/75 text-sm leading-relaxed max-w-md mx-auto">
                Sign in to post, react, and comment alongside the Papi Foundation
                community.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                <Link
                  href="/sign-in"
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg uppercase tracking-widest text-[11px] font-bold hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="border border-primary/50 text-primary px-6 py-3 rounded-lg uppercase tracking-widest text-[11px] font-bold hover:bg-primary/10 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          <Composer />

          {isLoading ? (
            <div className="text-center text-sm text-muted-foreground py-10">
              Loading feed...
            </div>
          ) : safePosts.length > 0 ? (
            <div className="space-y-5">
              {safePosts.map((post: CommunityPost) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-10 border border-dashed border-border rounded-2xl">
              No posts yet. {user ? "Be the first to share." : "Sign in to start the conversation."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
