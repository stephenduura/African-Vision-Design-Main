import { useListBlogPosts } from "@workspace/api-client-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts();
  const safePosts = Array.isArray(posts) ? posts : [];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="bg-background pt-24 pb-32">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6">Stories & Insights</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            In-depth perspectives on African development, on-the-ground impact reports, and foundation news.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {safePosts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col h-full border border-border bg-card hover:border-primary/50 transition-colors"
            >
              <Link href={`/blog/${post.id}`} className="block relative aspect-[4/3] overflow-hidden">
                <img 
                  src={post.imageUrl || 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=2070&auto=format&fit=crop'} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 text-xs uppercase tracking-wider">
                  {post.category}
                </div>
              </Link>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="text-xs text-muted-foreground tracking-wider uppercase mb-4">
                  <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</time> &bull; BY {post.author}
                </div>
                <h2 className="text-2xl font-serif text-foreground mb-4 line-clamp-2">
                  <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground line-clamp-3 mb-8 flex-1">{post.excerpt}</p>
                <Link href={`/blog/${post.id}`} className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-primary hover:text-foreground transition-colors mt-auto">
                  Read Full Story &rarr;
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        
        {safePosts.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            No articles found. Check back later for insights.
          </div>
        )}

      </div>
    </div>
  );
}
