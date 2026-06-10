import { motion, useScroll, useTransform, useInView, animate, useReducedMotion, type Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import {
  ArrowRight, BookOpen, TrendingUp, Globe, Lightbulb,
  Smartphone, Users, Building2, Sun, ChevronRight,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const stagger: Variants = { show: { transition: { staggerChildren: 0.12 } } };

const pillars = [
  { icon: TrendingUp, title: "Economic Intelligence", description: "In-depth analysis of Africa's fastest-growing markets, emerging industries, and investment hotspots — from the tech hubs of Lagos and Nairobi to the mineral wealth of the Congo Basin." },
  { icon: Globe, title: "Political & Regulatory Landscape", description: "Understanding the governance structures, regulatory frameworks, and policy environments that shape business and development across Africa's 54 nations." },
  { icon: BookOpen, title: "Cultural & Social Context", description: "Deep contextual knowledge of Africa's diverse cultures, languages, and social structures — the human dimension that makes or breaks every program and partnership." },
  { icon: Lightbulb, title: "Innovation & Technology", description: "Tracking Africa's extraordinary technology revolution — from mobile money and fintech to agritech, healthtech, and the continent's rapidly growing startup ecosystem." },
];

const megatrends = [
  {
    icon: Smartphone,
    eyebrow: "The Digital Leap",
    title: "A Continent Going Mobile-First",
    body: "Africa skipped the desktop era entirely. With over 650 million mobile subscribers and the world's most advanced mobile-money ecosystem, the continent is rewriting the rules of digital commerce, banking, and connectivity.",
    img: "/insights/digital.png",
    stats: [{ v: "650M+", l: "Mobile subscribers" }, { v: "$700B", l: "Mobile money volume" }],
    reverse: false,
  },
  {
    icon: Users,
    eyebrow: "The Demographic Dividend",
    title: "The World's Youngest Workforce",
    body: "By 2050, one in four people on Earth will be African. With a median age of 19 and 60% of the population under 25, Africa holds the largest, youngest, and fastest-growing labour force of any continent — the engine of the next global economy.",
    img: "/insights/youth.png",
    stats: [{ v: "1.4B", l: "People today" }, { v: "19", l: "Median age" }],
    reverse: true,
  },
  {
    icon: Sun,
    eyebrow: "The Green Frontier",
    title: "Powering Growth, Sustainably",
    body: "Africa holds 60% of the world's best solar resources and vast untapped renewable potential. As the continent electrifies, it is leapfrogging straight to clean energy — building one of the most significant green investment opportunities of the century.",
    img: "/insights/energy.png",
    stats: [{ v: "10 TW", l: "Solar potential" }, { v: "60%", l: "Of global solar resource" }],
    reverse: false,
  },
  {
    icon: Building2,
    eyebrow: "The Urban Surge",
    title: "Building the Cities of Tomorrow",
    body: "Africa is urbanising faster than any region in history. By 2035, half of all Africans will live in cities — driving unprecedented demand for housing, infrastructure, retail, and services across a continent under construction.",
    img: "/insights/urban.png",
    stats: [{ v: "+24", l: "Cities over 1M by 2035" }, { v: "50%", l: "Urban by 2035" }],
    reverse: true,
  },
];

const markets = [
  { country: "Nigeria", note: "Africa's largest economy & fintech capital", stat: "$477B GDP" },
  { country: "Kenya", note: "East Africa's innovation & mobile-money hub", stat: "M-Pesa pioneer" },
  { country: "South Africa", note: "The continent's most developed capital market", stat: "JSE listed" },
  { country: "Egypt", note: "Gateway between Africa, Europe & the Gulf", stat: "110M people" },
  { country: "Rwanda", note: "Africa's fastest-reforming business climate", stat: "#1 ease of doing business" },
  { country: "Ghana", note: "Stable democracy & rising tech ecosystem", stat: "Gold & cocoa leader" },
];

function Counter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) { setVal(to); return; }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, reduceMotion]);
  const display = Number.isInteger(to) ? Math.round(val).toLocaleString() : val.toFixed(1);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

export default function AfricanInsights() {
  const { data: posts } = useListBlogPosts();
  const insightPosts = Array.isArray(posts)
    ? posts.filter((p) => p.category === "report" || p.category === "impact")
    : [];

  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroY = reduceMotion ? "0%" : heroYRaw;

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO — cinematic modern Africa ─── */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-end overflow-hidden">
        <motion.div
          style={{ y: heroY, backgroundImage: `url('/insights/hero.png')`, backgroundSize: "cover", backgroundPosition: "center" }}
          className="absolute inset-[-10%]"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,38,28,0.55) 0%, rgba(15,38,28,0.45) 40%, rgba(15,38,28,0.96) 100%)" }} />

        <div className="container mx-auto px-4 relative z-10 pb-20 pt-40">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl text-white space-y-7">
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="h-px w-10 bg-primary" />
              <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Knowledge &amp; Analysis</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-8xl leading-[1.02]">
              African<br /><span className="text-primary italic">Insights</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Modern Africa is the defining growth story of this century. We translate lived experience, deep relationships, and continuous on-the-ground engagement into the intelligence you need to invest, partner, and operate with confidence.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
              <a href="#megatrends" className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                Explore the Trends <ArrowRight size={13} />
              </a>
              <Link href="/contact" className="border border-white/30 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                Request a Briefing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── MODERN AFRICA AT A GLANCE — animated counters ─── */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 space-y-3">
            <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Modern Africa at a Glance</div>
            <h2 className="text-3xl md:text-4xl font-serif">The Numbers Behind the Rise</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
            {[
              { value: 1.4, suffix: "B", label: "People across 54 nations", decimals: true },
              { value: 2.5, prefix: "€", suffix: "T", label: "Projected GDP by 2030", decimals: true },
              { value: 650, suffix: "M+", label: "Mobile subscribers" },
              { value: 60, suffix: "%", label: "Population under age 25" },
            ].map((s) => (
              <div key={s.label} className="text-center px-2">
                <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">
                  <Counter to={s.value} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <div className="text-xs tracking-wider uppercase text-secondary-foreground/55 max-w-[180px] mx-auto leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MEGATRENDS — editorial alternating ─── */}
      <section id="megatrends" className="py-28 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-20 space-y-4 max-w-2xl mx-auto">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Four Forces Reshaping the Continent</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">The Megatrends Defining<br />Modern Africa</motion.h2>
          </motion.div>

          <div className="space-y-24">
            {megatrends.map((trend, i) => (
              <div key={trend.title} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: trend.reverse ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  viewport={{ once: true, margin: "-80px" }}
                  className={`relative h-[440px] overflow-hidden ${trend.reverse ? "lg:order-2" : ""}`}
                >
                  <img src={trend.img} alt={trend.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(15,38,28,0.55) 100%)" }} />
                  <div className="absolute top-5 left-5 w-12 h-12 bg-primary flex items-center justify-center">
                    <trend.icon size={20} className="text-primary-foreground" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 divide-x divide-white/20 border-t border-white/20 backdrop-blur-sm bg-secondary/40">
                    {trend.stats.map((st) => (
                      <div key={st.l} className="px-5 py-4 text-white">
                        <div className="font-serif text-2xl font-bold text-primary">{st.v}</div>
                        <div className="text-[10px] tracking-wider uppercase text-white/70 mt-0.5">{st.l}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-5xl text-primary/30">{String(i + 1).padStart(2, "0")}</span>
                    <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">{trend.eyebrow}</div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif leading-tight">{trend.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{trend.body}</p>
                  <div className="h-px w-16 bg-primary/40" />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTELLIGENCE PILLARS ─── */}
      <section className="py-28 border-y border-border" style={{ background: "#F5F0E5" }}>
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-16 space-y-3">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Our Intelligence Pillars</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">How We Read the Continent</motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-px bg-border">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-10 flex gap-6 group hover:bg-secondary hover:text-secondary-foreground transition-colors duration-500"
              >
                <div className="shrink-0">
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <pillar.icon size={20} className="text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-xl group-hover:text-secondary-foreground transition-colors">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-secondary-foreground/70 transition-colors">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── KEY MARKETS SPOTLIGHT ─── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="space-y-3">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Where the Growth Is</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">Key Markets We Track</motion.h2>
            </div>
            <motion.p variants={fadeUp} className="text-muted-foreground text-sm max-w-sm md:text-right leading-relaxed">
              Six economies leading Africa's transformation — each with its own opportunities, risks, and momentum.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {markets.map((m, i) => (
              <motion.div
                key={m.country}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                viewport={{ once: true }}
                className="bg-background p-8 group hover:bg-primary/5 transition-colors duration-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-serif text-2xl">{m.country}</h3>
                  <ChevronRight size={16} className="text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-1" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{m.note}</p>
                <div className="text-[10px] tracking-widest uppercase text-primary font-bold bg-primary/10 inline-block px-3 py-1.5">{m.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST RESEARCH ─── */}
      {insightPosts.length > 0 && (
        <section className="py-28 border-y border-border" style={{ background: "#F5F0E5" }}>
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-3">
                <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Latest Research</div>
                <h2 className="text-4xl md:text-5xl font-serif">Reports &amp; Analysis</h2>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-primary hover:gap-3 transition-all">
                All Publications <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insightPosts.slice(0, 3).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background border border-border group overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 text-[9px] tracking-widest uppercase bg-primary text-primary-foreground px-2.5 py-1 font-bold">{post.category}</div>
                  </div>
                  <div className="p-7 space-y-3">
                    <h3 className="font-serif text-lg leading-snug">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-1 text-[11px] tracking-widest uppercase font-bold text-primary hover:gap-2 transition-all pt-1">
                      Read More <ArrowRight size={11} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA — Request a Briefing ─── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/insights/fintech.png')` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(15,38,28,0.97) 0%, rgba(15,38,28,0.82) 55%, rgba(15,38,28,0.55) 100%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-primary" />
              <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Bespoke Intelligence</span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight">Request a Briefing</h2>
            <p className="text-white/65 leading-relaxed max-w-lg">
              Preparing to enter an African market, structure an investment, or launch a development program? Our team can prepare a bespoke briefing tailored to your sector, geography, and objectives.
            </p>
            <div className="pt-2">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                Request Briefing <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
