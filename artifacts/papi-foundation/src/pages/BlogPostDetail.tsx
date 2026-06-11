import { useGetBlogPost } from "@workspace/api-client-react";
import { getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function BlogPostDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const enabled = Number.isFinite(postId);
  const { data: post, isLoading } = useGetBlogPost(postId, {
    query: {
      enabled,
      queryKey: getGetBlogPostQueryKey(postId),
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Post not found</div>;

  return (
    <article className="bg-background pb-32">
      <div className="relative h-[60vh] md:h-[70vh]">
        <img src={post.imageUrl || 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=2070&auto=format&fit=crop'} alt={post.title} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto bg-card border border-border p-8 md:p-16">
          <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider mb-10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all stories
          </Link>
          
          <div className="flex items-center gap-4 text-sm text-primary uppercase tracking-wider mb-6">
            <span>{post.category}</span>
            <span className="text-muted-foreground">&bull;</span>
            <time dateTime={post.publishedAt} className="text-muted-foreground">{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</time>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8 leading-tight">{post.title}</h1>
          
          <div className="flex items-center gap-4 mb-12 pb-12 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-serif text-lg text-primary">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-serif text-foreground">{post.author}</p>
              <p className="text-sm text-muted-foreground">Papi Foundation</p>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary">
            {/* Split by newline and render paragraphs for demo, normally would use a markdown parser */}
            {post.content.split('\n').map((paragraph, i) => (
              paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
