import { useListEvents, useListBlogPosts, type Event, type BlogPost } from "@workspace/api-client-react";
import {
  motion, MotionConfig, useScroll, useTransform, useInView,
  animate, useReducedMotion, type Variants,
} from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import { format } from "date-fns";
import {
  ArrowRight, ArrowUpRight, Calendar, MapPin, Play,
  Radio, Newspaper, CalendarDays, Megaphone, Globe, Mail,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const stagger: Variants = { show: { transition: { staggerChildren: 0.1 } } };

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) { setVal(to); return; }
    const controls = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (v) => setVal(v) });
    return () => controls.stop();
  }, [inView, to, reduceMotion]);
  const display = Number.isInteger(to) ? Math.round(val).toLocaleString() : val.toFixed(1);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

const typeMeta: Record<Event["type"], { label: string; icon: typeof Radio }> = {
  update: { label: "Field Update", icon: Radio },
  press: { label: "In the Press", icon: Newspaper },
  event: { label: "Event", icon: CalendarDays },
  video: { label: "Watch", icon: Play },
};

const FILTERS: { key: "all" | Event["type"]; label: string }[] = [
  { key: "all", label: "All" },
  { key: "update", label: "Field Updates" },
  { key: "event", label: "Events" },
  { key: "press", label: "Press" },
  { key: "video", label: "Video" },
];

function safeDate(d: string) {
  const parsed = new Date(d);
  return Number.isNaN(parsed.getTime()) ? d : format(parsed, "MMMM d, yyyy");
}

function FeaturedStory({ event }: { event: Event }) {
  const meta = typeMeta[event.type];
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      viewport={{ once: true, margin: "-80px" }}
      className="grid lg:grid-cols-2 border border-border bg-card overflow-hidden group"
    >
      <div className="relative h-72 lg:h-auto overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
        />
        {event.videoUrl && (
          <a
            href={event.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(15,38,28,0.35)" }}
            aria-label="Play video (opens in new tab)"
          >
            <span className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 ml-1" />
            </span>
          </a>
        )}
        <div className="absolute top-5 left-5 bg-primary text-primary-foreground px-3 py-1 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
          <meta.icon size={11} /> {meta.label}
        </div>
      </div>
      <div className="p-10 lg:p-14 flex flex-col justify-center">
        <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold mb-5">Featured Story</div>
        <Link href={`/news/${event.id}`}>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight text-foreground mb-5 cursor-pointer hover:text-primary transition-colors">{event.title}</h2>
        </Link>
        <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" />{safeDate(event.date)}</span>
          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" />{event.location}</span>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-8">{event.description}</p>
        <Link
          href={`/news/${event.id}`}
          className="inline-flex items-center gap-2 self-start bg-primary text-primary-foreground px-8 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Read Full Story <ArrowRight size={13} />
        </Link>
      </div>
    </motion.article>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  const meta = typeMeta[event.type];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      className="bg-background border border-border overflow-hidden group flex flex-col hover:border-primary/50 hover:shadow-[0_24px_60px_-30px_rgba(15,38,28,0.4)] hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 55%, rgba(15,38,28,0.45) 100%)" }} />
        {event.videoUrl && (
          <a
            href={event.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play video (opens in new tab)"
          >
            <span className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 ml-0.5" />
            </span>
          </a>
        )}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-primary px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5">
          <meta.icon size={10} /> {meta.label}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Calendar size={11} className="text-primary/70" />{safeDate(event.date)}</span>
          <span className="flex items-center gap-1 truncate"><MapPin size={11} className="text-primary/70" />{event.location}</span>
        </div>
        <Link href={`/news/${event.id}`}>
          <h3 className="font-serif text-lg leading-snug text-foreground group-hover:text-primary transition-colors mb-3 cursor-pointer">{event.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{event.description}</p>
        <div className="mt-auto pt-5">
          <Link
            href={`/news/${event.id}`}
            className="inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase font-bold text-primary hover:gap-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read More <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function StoryCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <Link
        href={`/blog/${post.id}`}
        className="group relative block bg-background border border-border overflow-hidden h-full transition-all duration-500 hover:border-primary/50 hover:shadow-[0_24px_60px_-30px_rgba(15,38,28,0.4)] hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative h-52 overflow-hidden">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold">{post.category}</span>
        </div>
        <div className="p-7 flex flex-col">
          <ArrowUpRight size={16} className="absolute top-[13.5rem] right-6 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
          <h3 className="font-serif text-xl leading-snug text-foreground group-hover:text-primary transition-colors mb-3">{post.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground uppercase tracking-widest">
            <span>{post.author}</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-primary opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
              Read Story <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function News() {
  const { data: events, isLoading: eventsLoading, isError: eventsError, refetch: refetchEvents } = useListEvents();
  const { data: posts, isLoading: postsLoading, isError: postsError } = useListBlogPosts();
  const [activeFilter, setActiveFilter] = useState<"all" | Event["type"]>("all");

  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroY = reduceMotion ? "0%" : heroYRaw;

  const safeEvents = Array.isArray(events) ? events : [];
  const safePosts = Array.isArray(posts) ? posts : [];

  const sortedEvents = useMemo(
    () => [...safeEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [safeEvents],
  );
  const featured = sortedEvents[0];
  const rest = sortedEvents.slice(1);
  const filtered = activeFilter === "all" ? rest : rest.filter((e) => e.type === activeFilter);
  const availableFilters = FILTERS.filter(
    (f) => f.key === "all" || rest.some((e) => e.type === f.key),
  );

  const allPosts = safePosts;
  const countries = new Set(safeEvents.map((e) => e.location?.split(",").pop()?.trim()).filter(Boolean));
  const pressCount = safeEvents.filter((e) => e.type === "press").length;
  const eventCount = safeEvents.filter((e) => e.type === "event").length;

  if (eventsLoading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (eventsError || (sortedEvents.length === 0 && allPosts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center space-y-5">
          <div className="mx-auto w-14 h-14 border border-primary/30 bg-primary/5 flex items-center justify-center">
            <Newspaper size={24} className="text-primary" />
          </div>
          <h1 className="font-serif text-3xl text-foreground">The Newsroom</h1>
          <p className="text-muted-foreground leading-relaxed">
            {eventsError
              ? "We couldn't load the latest stories just now. Please try again in a moment."
              : "Fresh updates from the field are on their way. Check back soon."}
          </p>
          {eventsError && (
            <button
              onClick={() => refetchEvents()}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors"
            >
              Try Again <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-hidden">

        {/* ─── HERO ─── */}
        <section ref={heroRef} className="relative min-h-[80vh] flex items-end overflow-hidden">
          <motion.div
            style={{ y: heroY, backgroundImage: `url('/news/hero.png')`, backgroundSize: "cover", backgroundPosition: "center" }}
            className="absolute inset-[-8%]"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,38,28,0.55) 0%, rgba(15,38,28,0.5) 45%, rgba(15,38,28,0.96) 100%)" }} />
          <div className="container mx-auto px-4 relative z-10 pb-20 pt-40">
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl text-white space-y-7">
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary" />
                <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">The Newsroom</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-7xl leading-[1.05]">
                The Pulse of<br /><span className="text-primary italic">Progress</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/70 text-lg leading-relaxed max-w-2xl">
                Field updates, signature events, press coverage, and stories from the ground — follow the measurable momentum of Africa being built by Africans.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <a href="#feed" className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                  Read the Latest <ArrowRight size={13} />
                </a>
                <a href="#subscribe" className="border border-white/30 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                  Subscribe
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── IN NUMBERS ─── */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 space-y-3">
              <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">The Story So Far</div>
              <h2 className="text-3xl md:text-4xl font-serif">Momentum, Measured</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
              {[
                { value: (events ?? []).length, label: "Updates published" },
                { value: countries.size, label: "Countries in the news" },
                { value: pressCount, label: "Press features" },
                { value: eventCount, label: "Signature events" },
              ].map((s) => (
                <div key={s.label} className="text-center px-2">
                  <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">
                    <Counter to={s.value} />
                  </div>
                  <div className="text-xs tracking-wider uppercase text-secondary-foreground/80 max-w-[180px] mx-auto leading-relaxed">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURED ─── */}
        {featured && (
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
              <FeaturedStory event={featured} />
            </div>
          </section>
        )}

        {/* ─── NEWS FEED (filterable) ─── */}
        {rest.length > 0 && (
          <section id="feed" className="py-24 scroll-mt-20 border-y border-border" style={{ background: "#F5F0E5" }}>
            <div className="container mx-auto px-4">
              <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="mb-12 space-y-4">
                <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">From the Field</motion.div>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">News &amp; Updates</motion.h2>
              </motion.div>

              {availableFilters.length > 2 && (
                <div className="flex flex-wrap gap-2 mb-12">
                  {availableFilters.map((f) => {
                    const active = activeFilter === f.key;
                    return (
                      <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        aria-pressed={active}
                        className={`px-5 py-2.5 text-[11px] tracking-widest uppercase font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          active
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-background border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>

              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-16">No stories in this category yet.</p>
              )}
            </div>
          </section>
        )}

        {/* ─── STORIES & REPORTS ─── */}
        {(allPosts.length > 0 || postsError) && (
          <section className="py-28 bg-background">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="space-y-3">
                  <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">In Depth</motion.div>
                  <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">Stories &amp; Reports</motion.h2>
                </motion.div>
                {!postsError && (
                  <Link href="/blog" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-primary hover:gap-3 transition-all">
                    View All <ArrowRight size={13} />
                  </Link>
                )}
              </div>
              {postsError ? (
                <div className="border border-border bg-card p-12 text-center max-w-xl mx-auto">
                  <p className="text-muted-foreground leading-relaxed">
                    Our stories and reports are taking a moment to load. Please{" "}
                    <Link href="/blog" className="text-primary font-semibold hover:underline">visit the full blog</Link>{" "}
                    to read them.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allPosts.slice(0, 6).map((post, i) => (
                    <StoryCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── CTA / SUBSCRIBE ─── */}
        <section id="subscribe" className="relative py-28 scroll-mt-20 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/news/cta.png')` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(15,38,28,0.97) 0%, rgba(15,38,28,0.82) 55%, rgba(15,38,28,0.55) 100%)" }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl text-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary" />
                <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Stay Connected</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight">Never Miss a Milestone</h2>
              <p className="text-white/65 leading-relaxed max-w-lg">
                From groundbreaking field updates to signature events across the continent — get the stories that matter delivered straight to you.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                  <Mail size={14} /> Subscribe to Updates
                </Link>
                <Link href="/community" className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:border-primary hover:text-primary transition-colors">
                  Join the Community
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
