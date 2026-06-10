import { useGetRoadmap, type RoadmapItem } from "@workspace/api-client-react";
import {
  motion, MotionConfig, useScroll, useTransform, useInView,
  animate, useReducedMotion, type Variants,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Flag, Sparkles, CircleDot } from "lucide-react";
import founderPortrait from "@assets/WhatsApp_Image_2026-05-26_at_10.33.05_PM_(1)_1780670580464.jpeg";
import teamLawyer from "@assets/WhatsApp_Image_2026-06-03_at_9.32.48_PM_(1)_1780671584551.jpeg";
import teamYoungMan from "@assets/WhatsApp_Image_2026-06-05_at_3.55.55_PM_1780671584550.jpeg";

const peopleBehind = [
  { img: founderPortrait, name: "Founding Vision", role: "Leadership & Direction" },
  { img: teamLawyer, name: "Legal & Governance", role: "Counsel & Compliance" },
  { img: teamYoungMan, name: "Programmes & Delivery", role: "On-the-Ground Execution" },
];

const STATIC_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 1,
    year: 2024,
    title: "Foundation Launch",
    description: "Papi Foundation officially launches its continental mission and builds the core operating structure.",
    status: "completed",
    milestones: [
      "Foundation established and registered",
      "Core leadership and governance framework formed",
      "Initial program priorities defined",
    ],
  },
  {
    id: 2,
    year: 2024,
    title: "First Programs Deployed",
    description: "Education, clean water, and healthcare initiatives begin reaching communities across multiple countries.",
    status: "completed",
    milestones: [
      "Field programs rolled out in Nigeria, Ghana, Kenya, and Rwanda",
      "Community partnerships activated",
      "Early beneficiary reporting established",
    ],
  },
  {
    id: 3,
    year: 2025,
    title: "Scaling the Mission",
    description: "The foundation expands its footprint through stronger partnerships, regional coordination, and larger-scale delivery.",
    status: "current",
    milestones: [
      "New partnerships onboarded",
      "Broader visibility across the diaspora",
      "Operational systems strengthened for scale",
    ],
  },
  {
    id: 4,
    year: 2026,
    title: "Strategic Expansion",
    description: "The next phase focuses on investment promotion, sector-specific growth, and deeper continental reach.",
    status: "upcoming",
    milestones: [
      "Sector investment programs activated",
      "Additional country coverage planned",
      "Long-term impact measurement expanded",
    ],
  },
  {
    id: 5,
    year: 2028,
    title: "Continental Horizon",
    description: "A longer-term vision for global recognition, wider deployment, and measurable continental transformation.",
    status: "upcoming",
    milestones: [
      "Wider African footprint",
      "Higher deployed capital targets",
      "Continental recognition milestone",
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const stagger: Variants = { show: { transition: { staggerChildren: 0.12 } } };

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

const statusMeta: Record<RoadmapItem["status"], { label: string; chip: string; dot: string }> = {
  completed: { label: "Delivered", chip: "bg-primary/15 text-primary border-primary/30", dot: "bg-primary border-primary" },
  current: { label: "In Progress", chip: "bg-primary text-primary-foreground border-primary", dot: "bg-background border-primary shadow-[0_0_0_4px_rgba(212,175,55,0.25)]" },
  upcoming: { label: "On the Horizon", chip: "bg-secondary/10 text-secondary border-secondary/20", dot: "bg-background border-border" },
};

export default function Roadmap() {
  const { data: roadmapItems, isLoading } = useGetRoadmap();
  const safeRoadmapItems = Array.isArray(roadmapItems) && roadmapItems.length > 0 ? roadmapItems : STATIC_ROADMAP_ITEMS;

  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroY = reduceMotion ? "0%" : heroYRaw;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const items = safeRoadmapItems;
  const sorted = [...items].sort((a, b) => a.year - b.year);
  const completed = sorted.filter((i) => i.status === "completed");
  const current = sorted.find((i) => i.status === "current");
  const totalMilestones = sorted.reduce((sum, i) => sum + i.milestones.length, 0);
  const deliveredMilestones = completed.reduce((sum, i) => sum + i.milestones.length, 0);
  const years = sorted.length ? sorted[sorted.length - 1].year - sorted[0].year + 1 : 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-hidden">

        {/* ─── HERO ─── */}
        <section ref={heroRef} className="relative min-h-[82vh] flex items-end overflow-hidden">
          <motion.div
            style={{ y: heroY, backgroundImage: `url('/roadmap/hero.png')`, backgroundSize: "cover", backgroundPosition: "center" }}
            className="absolute inset-[-8%]"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,38,28,0.55) 0%, rgba(15,38,28,0.5) 45%, rgba(15,38,28,0.96) 100%)" }} />
          <div className="container mx-auto px-4 relative z-10 pb-20 pt-40">
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl text-white space-y-7">
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary" />
                <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Our Track Record</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-7xl leading-[1.05]">
                Promises Made,<br /><span className="text-primary italic">Promises Kept</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/70 text-lg leading-relaxed max-w-2xl">
                Every milestone on this page is a commitment we set out to honour — and a life changed because we did. This is the measurable, year-by-year story of building Africa by Africans.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <a href="#journey" className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                  Follow the Journey <ArrowRight size={13} />
                </a>
                <Link href="/impact" className="border border-white/30 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                  See Our Impact
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── PROGRESS BAND ─── */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 space-y-3">
              <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">The Record in Numbers</div>
              <h2 className="text-3xl md:text-4xl font-serif">A Masterplan in Motion</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
              {[
                { value: years, suffix: "", label: "Years of continuous progress" },
                { value: completed.length, suffix: "", label: "Chapters delivered in full" },
                { value: deliveredMilestones, suffix: "", label: "Milestones already achieved" },
                { value: totalMilestones, suffix: "", label: "Milestones in the masterplan" },
              ].map((s) => (
                <div key={s.label} className="text-center px-2">
                  <div className="font-serif text-5xl md:text-6xl font-bold text-primary mb-2">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs tracking-wider uppercase text-secondary-foreground/80 max-w-[180px] mx-auto leading-relaxed">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CURRENT CHAPTER SPOTLIGHT ─── */}
        {current && (
          <section className="py-24 bg-background border-b border-border">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="lg:col-span-5 relative"
                >
                  <div className="font-serif text-[12rem] md:text-[15rem] leading-none text-primary/10 select-none">{current.year}</div>
                  <div className="absolute inset-0 flex flex-col justify-center pl-2">
                    <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-primary font-bold mb-3">
                      <CircleDot size={13} /> Where We Are Now
                    </div>
                    <div className="font-serif text-5xl md:text-6xl text-foreground">{current.year}</div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                  viewport={{ once: true, margin: "-80px" }}
                  className="lg:col-span-7 space-y-6"
                >
                  <h2 className="font-serif text-3xl md:text-4xl leading-tight text-foreground">{current.title}</h2>
                  <p className="text-muted-foreground text-base leading-relaxed">{current.description}</p>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 pt-2">
                    {current.milestones.map((m) => (
                      <div key={m} className="flex items-start gap-3">
                        <span className="mt-1 w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                          <CircleDot size={11} className="text-primary" />
                        </span>
                        <span className="text-sm text-foreground/80 leading-relaxed">{m}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-px w-16 bg-primary/40" />
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* ─── THE JOURNEY — central spine timeline ─── */}
        <section id="journey" className="py-28 bg-background scroll-mt-20" style={{ background: "#F5F0E5" }}>
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-20 space-y-4 max-w-2xl mx-auto">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">The Masterplan, 2024–2028</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">A Continent, Built Chapter by Chapter</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                Ambitious by design, transparent by principle. Follow each chapter from our launch to global recognition.
              </motion.p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              {/* spine */}
              <div className="absolute left-[27px] md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 md:-translate-x-1/2" />

              <div className="space-y-14 md:space-y-4">
                {sorted.map((item, i) => {
                  const meta = statusMeta[item.status] ?? statusMeta.upcoming;
                  const leftSide = i % 2 === 0;
                  const StatusIcon = item.status === "completed" ? Check : item.status === "current" ? CircleDot : Flag;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 36 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: EASE }}
                      viewport={{ once: true, margin: "-80px" }}
                      className={`relative flex ${leftSide ? "md:justify-start" : "md:justify-end"}`}
                    >
                      {/* node */}
                      <div className={`absolute left-[19px] md:left-1/2 top-9 w-5 h-5 rounded-full border-2 md:-translate-x-1/2 z-10 ${meta.dot}`}>
                        {item.status === "completed" && <Check size={11} className="text-primary-foreground absolute inset-0 m-auto" />}
                      </div>

                      <div className="w-full md:w-[46%] pl-16 md:pl-0">
                        <div className={`group relative bg-background border border-border p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_20px_50px_-25px_rgba(15,38,28,0.35)] ${item.status === "current" ? "border-primary/60 shadow-[0_20px_50px_-25px_rgba(212,175,55,0.4)]" : ""}`}>
                          {/* ghost year */}
                          <span className="pointer-events-none absolute -top-6 right-5 font-serif text-7xl text-primary/5 select-none group-hover:text-primary/10 transition-colors">{item.year}</span>

                          <div className="flex items-center justify-between mb-4 relative">
                            <div className="flex items-baseline gap-3">
                              <span className="font-serif text-4xl text-foreground">{item.year}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-3 py-1.5 border font-bold ${meta.chip}`}>
                              <StatusIcon size={11} /> {meta.label}
                            </span>
                          </div>

                          <h3 className="font-serif text-2xl text-primary mb-3 relative">{item.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6 relative">{item.description}</p>

                          <div className="h-px w-full bg-border mb-5" />
                          <ul className="space-y-2.5 relative">
                            {item.milestones.map((m) => (
                              <li key={m} className="flex items-start gap-3 text-sm text-foreground/80">
                                <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.status === "completed" ? "bg-primary/15 text-primary" : "border border-primary/30 text-primary/60"}`}>
                                  {item.status === "completed" ? <Check size={10} /> : <span className="w-1 h-1 rounded-full bg-current" />}
                                </span>
                                <span className="leading-relaxed">{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PEOPLE BEHIND THE RECORD ─── */}
        <section className="py-24 md:py-28 bg-background border-t border-border">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-14 md:mb-16 space-y-4 max-w-2xl mx-auto">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">The People Behind Every Milestone</motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif leading-tight">Faces of the Mission</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                Behind every figure on this page is a person who showed up — the leaders, advisors, and builders turning commitments into measurable change across the continent.
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
              {peopleBehind.map((p) => (
                <motion.div key={p.name} variants={fadeUp} className="group">
                  <div className="relative overflow-hidden border border-border">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="h-px w-8 bg-primary mb-3" />
                      <div className="font-serif text-xl text-white leading-tight">{p.name}</div>
                      <div className="text-[10px] tracking-[0.25em] uppercase text-primary font-semibold mt-1.5">{p.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/roadmap/cta.png')` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(15,38,28,0.97) 0%, rgba(15,38,28,0.82) 55%, rgba(15,38,28,0.55) 100%)" }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl text-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary" />
                <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold flex items-center gap-2"><Sparkles size={12} /> Write the Next Chapter</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight">Be Part of What Comes Next</h2>
              <p className="text-white/65 leading-relaxed max-w-lg">
                Our track record is only the beginning. Every milestone ahead — from 15 nations to global recognition — is reachable with partners who believe in building Africa by Africans.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/donate" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                  Fund the Mission <ArrowRight size={13} />
                </Link>
                <Link href="/partners" className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:border-primary hover:text-primary transition-colors">
                  Become a Partner
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
