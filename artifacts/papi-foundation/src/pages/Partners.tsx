import { useListPartners, type Partner } from "@workspace/api-client-react";
import {
  motion, MotionConfig, useScroll, useTransform, useInView,
  animate, useReducedMotion, type Variants,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, ArrowUpRight, Building2, HeartHandshake,
  Landmark, Crown, Handshake, Globe,
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

const categoryMeta: Record<Partner["type"], { label: string; tagline: string; icon: typeof Building2 }> = {
  sponsor: { label: "Title Sponsors", tagline: "Visionary backers underwriting our boldest commitments", icon: Crown },
  government: { label: "Government & Institutional", tagline: "Sovereign and multilateral partners enabling national-scale impact", icon: Landmark },
  company: { label: "Corporate Partners", tagline: "Global enterprises investing capital, expertise, and reach", icon: Building2 },
  ngo: { label: "NGO & Implementation", tagline: "Field experts co-delivering programs on the ground", icon: HeartHandshake },
};

const ORDER: Partner["type"][] = ["sponsor", "government", "company", "ngo"];

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  const [imgOk, setImgOk] = useState(true);
  const initials = partner.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <motion.a
      href={partner.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      viewport={{ once: true, margin: "-60px" }}
      className="group relative bg-background border border-border p-8 flex flex-col transition-all duration-500 hover:border-primary/50 hover:shadow-[0_24px_60px_-30px_rgba(15,38,28,0.4)] hover:-translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <ArrowUpRight size={16} className="absolute top-6 right-6 text-primary/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />

      <div className="h-16 flex items-center mb-6">
        {imgOk ? (
          <img
            src={partner.logoUrl}
            alt={partner.name}
            onError={() => setImgOk(false)}
            className="max-h-12 max-w-[150px] object-contain object-left grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
          />
        ) : (
          <div className="w-14 h-14 border border-primary/30 bg-primary/5 flex items-center justify-center font-serif text-xl text-primary group-hover:bg-primary/10 transition-colors">
            {initials}
          </div>
        )}
      </div>

      <h3 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors leading-snug">{partner.name}</h3>
      {partner.country && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-widest mt-2">
          <Globe size={11} className="text-primary/60" /> {partner.country}
        </div>
      )}
      {partner.description && (
        <p className="text-sm text-muted-foreground leading-relaxed mt-4 line-clamp-3">{partner.description}</p>
      )}
      <div className="mt-auto pt-6">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold text-primary opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-300">
          Visit Partner <ArrowRight size={11} />
        </span>
      </div>
    </motion.a>
  );
}

export default function Partners() {
  const { data: partners, isLoading } = useListPartners();
  const safePartners = Array.isArray(partners) ? partners : [];

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

  const all = safePartners;
  const countries = new Set(all.map((p) => p.country).filter(Boolean));
  const grouped = ORDER.map((type) => ({ type, items: all.filter((p) => p.type === type) })).filter((g) => g.items.length > 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-hidden">

        {/* ─── HERO ─── */}
        <section ref={heroRef} className="relative min-h-[80vh] flex items-end overflow-hidden">
          <motion.div
            style={{ y: heroY, backgroundImage: `url('/partners/hero.png')`, backgroundSize: "cover", backgroundPosition: "center" }}
            className="absolute inset-[-8%]"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,38,28,0.55) 0%, rgba(15,38,28,0.5) 45%, rgba(15,38,28,0.96) 100%)" }} />
          <div className="container mx-auto px-4 relative z-10 pb-20 pt-40">
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl text-white space-y-7">
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary" />
                <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Our Coalition</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-7xl leading-[1.05]">
                Stronger,<br /><span className="text-primary italic">Together</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/70 text-lg leading-relaxed max-w-2xl">
                Systemic change is never built alone. We stand alongside the institutions, governments, and enterprises who share one conviction — that Africa's future is built by Africans, backed by the world.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
                <a href="#coalition" className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                  Meet the Coalition <ArrowRight size={13} />
                </a>
                <Link href="/contact" className="border border-white/30 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                  Become a Partner
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ─── STRENGTH IN NUMBERS ─── */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 space-y-3">
              <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">The Coalition in Numbers</div>
              <h2 className="text-3xl md:text-4xl font-serif">A Network Built on Trust</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
              {[
                { value: all.length, label: "World-class partners" },
                { value: grouped.length, label: "Categories of collaboration" },
                { value: countries.size, label: "Countries represented" },
                { value: 100, suffix: "%", label: "Mission-aligned commitment" },
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

        {/* ─── WHY PARTNER WITH US ─── */}
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-16 space-y-3 max-w-2xl mx-auto">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">The Value of the Alliance</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">Why the World's Best Partner With Us</motion.h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
              {[
                { icon: Globe, title: "Authentic Local Roots", body: "Decades of lived experience and deep community relationships across the continent — partnership that is genuinely African-led, not parachuted in." },
                { icon: Handshake, title: "Radical Transparency", body: "Every euro tracked, every milestone published. Our partners see exactly where capital flows and the measurable lives it changes." },
                { icon: Building2, title: "Scalable Infrastructure", body: "A professional platform built to deploy programs, manage risk, and report impact at national scale — investor-grade from day one." },
              ].map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  viewport={{ once: true }}
                  className="bg-background p-10 group hover:bg-secondary hover:text-secondary-foreground transition-colors duration-500"
                >
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <v.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-secondary-foreground/70 transition-colors">{v.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── THE COALITION — grouped partner cards ─── */}
        <section id="coalition" className="py-28 scroll-mt-20 border-y border-border" style={{ background: "#F5F0E5" }}>
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-20 space-y-4 max-w-2xl mx-auto">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Those Who Stand With Us</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">The Coalition</motion.h2>
            </motion.div>

            <div className="space-y-20">
              {grouped.map((group) => {
                const meta = categoryMeta[group.type];
                return (
                  <div key={group.type}>
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8 mb-10">
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                          <meta.icon size={20} className="text-primary" />
                        </div>
                        <h3 className="font-serif text-2xl md:text-3xl text-foreground">{meta.label}</h3>
                      </div>
                      <div className="h-px bg-border flex-1 hidden md:block mb-3" />
                      <p className="text-muted-foreground text-sm max-w-sm md:text-right leading-relaxed">{meta.tagline}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {group.items.map((partner, i) => (
                        <PartnerCard key={partner.id} partner={partner} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/partners/cta.png')` }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(15,38,28,0.97) 0%, rgba(15,38,28,0.82) 55%, rgba(15,38,28,0.55) 100%)" }} />
          <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl text-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary" />
                <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Join the Coalition</span>
              </div>
              <h2 className="font-serif text-5xl md:text-6xl leading-tight">Let's Build the Future Together</h2>
              <p className="text-white/65 leading-relaxed max-w-lg">
                Whether you bring capital, expertise, infrastructure, or reach, there is a place for you in this coalition. Partner with us to turn ambition into measurable, lasting impact across Africa.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                  Become a Partner <ArrowRight size={13} />
                </Link>
                <Link href="/impact" className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:border-primary hover:text-primary transition-colors">
                  See Our Impact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
