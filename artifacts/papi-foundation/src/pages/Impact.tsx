import { useGetImpactStats } from "@workspace/api-client-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Droplets, BookOpen, HeartPulse, Sun, Home, Users, Globe, TrendingUp, ArrowRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } };

function AnimCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        {inView ? value.toLocaleString() : 0}
      </motion.span>
      {suffix}
    </span>
  );
}

const impactAreas = [
  {
    icon: Droplets,
    title: "Clean Water",
    description: "Borehole drilling, water purification systems, and sanitation infrastructure serving rural communities.",
    stat: "2,000+",
    statLabel: "Families with clean water",
    image: "https://images.unsplash.com/photo-1564419431959-a3f1b9d77754?auto=format&fit=crop&w=900&q=80",
    color: "bg-cyan-50 border-cyan-200",
    iconColor: "text-cyan-700",
  },
  {
    icon: BookOpen,
    title: "Education",
    description: "School construction, teacher training, scholarship programs, and learning material distribution.",
    stat: "3,000+",
    statLabel: "Students enrolled",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-700",
  },
  {
    icon: HeartPulse,
    title: "Healthcare",
    description: "Rural clinics, mobile medical teams, maternal health support, and disease prevention campaigns.",
    stat: "8,500+",
    statLabel: "Patients treated",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-700",
  },
  {
    icon: Sun,
    title: "Clean Energy",
    description: "Solar panel installation, mini-grid projects, and off-grid electrification in rural areas.",
    stat: "8",
    statLabel: "Villages electrified",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80",
    color: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-700",
  },
  {
    icon: Home,
    title: "Community Infrastructure",
    description: "Community centres, market facilities, roads, and sanitation systems for growing communities.",
    stat: "12",
    statLabel: "Communities upgraded",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80",
    color: "bg-stone-50 border-stone-200",
    iconColor: "text-stone-700",
  },
  {
    icon: Users,
    title: "Women Empowerment",
    description: "Business training, microfinance access, leadership programs, and mentorship for African women.",
    stat: "1,200+",
    statLabel: "Women supported",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-700",
  },
];

const countries = [
  { name: "Nigeria", projects: 8, beneficiaries: 7200, flag: "🇳🇬" },
  { name: "Ghana", projects: 5, beneficiaries: 3100, flag: "🇬🇭" },
  { name: "Kenya", projects: 4, beneficiaries: 2800, flag: "🇰🇪" },
  { name: "Rwanda", projects: 3, beneficiaries: 1900, flag: "🇷🇼" },
  { name: "Senegal", projects: 2, beneficiaries: 800, flag: "🇸🇳" },
];

export default function Impact() {
  const { data: stats, isLoading } = useGetImpactStats();

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[72vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529528744093-6f8abeee511d?auto=format&fit=crop&w=1800&q=80')` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(27,67,50,0.92) 0%, rgba(27,67,50,0.65) 60%, rgba(27,67,50,0.2) 100%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden" animate="show" variants={fadeUp}
            transition={{ duration: 1 }}
            className="max-w-2xl space-y-6 text-white"
          >
            <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Our Results</div>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              Measurable<br />
              <span className="text-primary italic">Change.</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Every euro donated, every project funded, every community served — tracked, reported, and published. This is what accountability looks like.
            </p>
          </motion.div>
        </div>
      </section>

      {/* GLOBAL STATS */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-secondary-foreground/15">
            {[
              { label: "Total Raised", value: stats?.totalRaised ?? 450000, prefix: "€", suffix: "" },
              { label: "Lives Impacted", value: stats?.beneficiaries ?? 15000, suffix: "+" },
              { label: "Projects Completed", value: stats?.projectsCompleted ?? 12, suffix: "" },
              { label: "Countries Active", value: stats?.countriesReached ?? 5, suffix: "" },
            ].map((s) => (
              <div key={s.label} className="px-4 py-2">
                <div className="font-serif text-4xl md:text-5xl font-bold text-primary">
                  <AnimCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-[10px] tracking-widest uppercase text-secondary-foreground/60 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT AREAS — image cards */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" variants={fadeUp}
            transition={{ duration: 0.7 }} viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16 space-y-4"
          >
            <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">What We Fund</div>
            <h2 className="text-4xl md:text-5xl font-serif">Areas of Impact</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-base">
              Six interconnected pillars of development, each backed by measurable outcomes and real community data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial="hidden" whileInView="show" variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.09 }} viewport={{ once: true, margin: "-60px" }}
                className="group bg-card border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                      <area.icon size={20} className={area.iconColor} />
                    </div>
                    <div className="font-serif text-white text-xl font-semibold">{area.title}</div>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                  <div className={`border p-4 flex items-center justify-between ${area.color}`}>
                    <div className="text-xs tracking-wider uppercase text-muted-foreground">{area.statLabel}</div>
                    <div className={`font-serif text-2xl font-bold ${area.iconColor}`}>{area.stat}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER visual split */}
      <section className="py-24 border-y border-border" style={{ background: "#F0EBE0" }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" variants={fadeUp}
            transition={{ duration: 0.7 }} viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14 space-y-4"
          >
            <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Real Transformation</div>
            <h2 className="text-4xl md:text-5xl font-serif">Where We Operate</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "/abuja-water.png", label: "Clean Water — Abuja, Nigeria", sub: "2,000 families now have reliable clean water access" },
              { img: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69a98?auto=format&fit=crop&w=800&q=80", label: "Education — Lagos, Nigeria", sub: "3 schools renovated, 1,200 students enrolled" },
              { img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80", label: "Solar Energy — Enugu, Nigeria", sub: "8 villages fully electrified via solar mini-grid" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden" whileInView="show" variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true, margin: "-40px" }}
                className="group overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-serif text-base leading-tight">{item.label}</div>
                    <div className="text-white/70 text-xs mt-1">{item.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES TABLE */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="show" variants={fadeLeft}
              transition={{ duration: 0.9 }} viewport={{ once: true, margin: "-60px" }}
              className="space-y-6"
            >
              <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Country Breakdown</div>
              <h2 className="text-4xl font-serif leading-tight">Where We Work</h2>
              <p className="text-muted-foreground leading-relaxed text-base">Five countries, twenty programs, and fifteen thousand lives impacted directly. We are expanding every quarter.</p>
              <div className="space-y-2">
                {countries.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial="hidden" whileInView="show" variants={fadeLeft}
                    transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }}
                    className="flex items-center justify-between p-4 bg-card border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.flag}</span>
                      <div>
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.projects} active projects</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-lg font-bold text-primary">{c.beneficiaries.toLocaleString()}+</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">beneficiaries</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" variants={fadeRight}
              transition={{ duration: 0.9 }} viewport={{ once: true, margin: "-60px" }}
              className="relative h-[520px] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1561553873-e8491a564fd0?auto=format&fit=crop&w=900&q=80"
                alt="Africa impact"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <div className="font-serif text-3xl font-bold text-primary">15,000+</div>
                <div className="text-white/80 text-sm">Direct beneficiaries across 5 countries</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-secondary text-secondary-foreground text-center">
        <div className="container mx-auto px-4 space-y-6">
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-40px" }}>
            <h2 className="text-4xl font-serif mb-3">Help Us Scale the Impact</h2>
            <p className="text-secondary-foreground/70 max-w-md mx-auto mb-8 leading-relaxed">Every contribution directly funds one of our six impact programs. See exactly where your money goes.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/donate" className="bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                Donate Now
              </Link>
              <Link href="/projects" className="border-2 border-secondary-foreground/30 text-secondary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
                View Projects <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
