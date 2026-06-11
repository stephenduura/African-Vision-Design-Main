import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import {
  useGetImpactStats,
  useGetDonationSummary,
  getGetDonationSummaryQueryKey,
  useGetRecentEvents,
  useListPartners,
  useListProjects,
} from "@workspace/api-client-react";
import {
  ArrowRight, TrendingUp, Users, Globe, Building2,
  Truck, Ship, ShoppingBag, Tractor, BarChart3, Hammer,
  Phone, Mail, MapPin, ChevronDown,
} from "lucide-react";
import Africa3D from "@/components/Africa3D";
import papiOfficeImg from "@assets/Gemini_Generated_Image_ri9qyfri9qyfri9q_1779885101247.png";
import founderImg from "@assets/WhatsApp_Image_2026-05-26_at_11.16.22_PM_(1)_1779885261318.jpeg";
import communityGatheringImg from "@assets/Gemini_Generated_Image_oqt0qxoqt0qxoqt0_1779885927605.png";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: smoothEase } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: smoothEase } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: smoothEase } },
};
const stagger = { show: { transition: { staggerChildren: 0.11 } } };

function AnimatedCounter({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      {prefix}
      <motion.span
        key={inView ? "active" : "idle"}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4 }}
      >
        {end.toLocaleString()}
      </motion.span>
      {suffix}
    </span>
  );
}

const sectors = [
  { icon: Tractor, label: "Livestock", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=75" },
  { icon: Tractor, label: "Agri-trading & Agricultural Machinery", img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=75" },
  { icon: BarChart3, label: "Business & Financial Services", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=75" },
  { icon: Hammer, label: "Construction & Engineering", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=75" },
  { icon: Truck, label: "Transportation & Logistics", img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=75" },
  { icon: Ship, label: "Marine & Offshore", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=75" },
  { icon: ShoppingBag, label: "Retail", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=75" },
];

const offices = [
  { city: "Abuja", country: "Nigeria (HQ)", phone: "+31 6 42032437" },
  { city: "Lagos", country: "Nigeria", phone: "+234 80 000 0000" },
  { city: "Accra", country: "Ghana", phone: "+233 20 000 0000" },
  { city: "Nairobi", country: "Kenya", phone: "+254 70 000 0000" },
  { city: "Kigali", country: "Rwanda", phone: "+250 78 000 0000" },
];

export default function Home() {
  const { data: impact } = useGetImpactStats();
  const { data: donationSummary } = useGetDonationSummary({
    query: { queryKey: getGetDonationSummaryQueryKey(), refetchInterval: 6000, staleTime: 0 },
  });
  const { data: recentEvents } = useGetRecentEvents();
  const { data: partners } = useListPartners();
  const { data: projects } = useListProjects({ status: "ongoing" });
  const featuredProjects = Array.isArray(projects) ? projects : [];
  const recentDonationItems = Array.isArray(donationSummary?.recentDonations)
    ? donationSummary.recentDonations
    : [];
  const recentEventItems = Array.isArray(recentEvents) ? recentEvents : [];
  const partnerItems = Array.isArray(partners) ? partners : [];

  // Parallax hero
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Parallax warm gradient bg */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, background: "linear-gradient(135deg, #F0E8D5 0%, #E8D8B4 45%, #DEC899 100%)" }}
        />
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Ccircle cx='30' cy='30' r='1' fill='%231B4332'/%3E%3C/svg%3E\")" }}
        />

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center relative z-10">
          <motion.div
            initial="hidden" animate="show" variants={stagger}
            className="space-y-7"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3">
              <div className="w-8 h-px bg-primary" />
              <span className="bg-secondary text-secondary-foreground text-[10px] tracking-[0.3em] uppercase px-4 py-2 font-semibold">
                Building Africa by Africans
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-[5.5rem] font-serif leading-[1.03] text-foreground">
              Empowering<br />
              Africa's{" "}
              <em className="text-primary not-italic">Future,</em><br />
              Together.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
              A world-class foundation funding education, clean water, healthcare, and economic development across Africa — with full transparency and a €13.8B global network.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Link href="/donate" className="group bg-secondary text-secondary-foreground px-9 py-4 uppercase tracking-widest text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2">
                Donate Now
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="text-foreground uppercase tracking-widest text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 border-b-2 border-primary pb-0.5">
                Our Mission <ArrowRight size={13} />
              </Link>
            </motion.div>
          </motion.div>

          {/* 3D Africa with gold sparkle base */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: smoothEase }}
            className="flex items-center justify-center relative"
          >
            <Africa3D />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-[9px] tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} />
        </motion.div>
      </section>

      {/* ── LIVE IMPACT STRIP ── */}
      <section className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" variants={stagger}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-secondary-foreground/20"
          >
            {[
              { label: "Raised", value: donationSummary?.totalRaised ?? 450000, prefix: "€", suffix: "+" },
              { label: "Beneficiaries", value: impact?.beneficiaries ?? 15000, suffix: "+" },
              { label: "Countries Active", value: impact?.countriesReached ?? 5, suffix: "" },
              { label: "Partners Worldwide", value: impact?.partnersCount ?? 20, suffix: "+" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="px-4">
                <div className="font-serif text-2xl md:text-3xl font-bold text-primary">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix ?? ""} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-secondary-foreground/60 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT / COMMUNITY — image + text ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden" whileInView="show" variants={fadeLeft}
              viewport={{ once: true, margin: "-80px" }}
              className="relative h-[580px] overflow-hidden"
            >
              <img
                src={communityGatheringImg}
                alt="Papi Foundation community gathering"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-transparent to-transparent" />
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }} viewport={{ once: true }}
                className="absolute bottom-8 left-8 right-8 bg-background/95 backdrop-blur-md p-5 border-l-4 border-primary"
              >
                <div className="font-serif text-3xl font-bold text-primary">230M+</div>
                <div className="text-xs tracking-widest uppercase text-muted-foreground mt-0.5">Network members united by one mission</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" variants={stagger}
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-7"
            >
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Our Community</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">
                A Movement Built<br />on Purpose
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed text-base">
                The Papi Foundation community provides a unique opportunity to network with investors, development partners, field experts, and community leaders who are committed to transforming Africa. We connect purpose with resources — bridging Europe and Africa in meaningful, measurable ways.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed text-base">
                Our members span entrepreneurs, NGOs, government bodies, and individuals who believe that Africa's future must be built by Africans — with the support of a connected global community.
              </motion.p>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                {[
                  { icon: Users, value: "230M+", label: "Network Members" },
                  { icon: TrendingUp, value: "€13.8B", label: "Investment Capacity" },
                  { icon: Globe, value: "47+", label: "Countries Connected" },
                  { icon: Building2, value: "6 Sectors", label: "Active Investment" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border p-4 flex items-center gap-3">
                    <stat.icon className="text-primary shrink-0" size={20} />
                    <div>
                      <div className="font-serif text-xl font-bold">{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground tracking-wide">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link href="/community" className="inline-flex items-center gap-2 text-primary font-semibold tracking-widest uppercase text-xs border-b-2 border-primary pb-0.5 hover:gap-3 transition-all">
                  Join the Community <ArrowRight size={13} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NETWORK STATS — full-bleed green section ── */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=60')`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden" whileInView="show" variants={stagger}
            viewport={{ once: true, margin: "-60px" }}
            className="text-center text-white space-y-4 mb-16"
          >
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">The Power of Our Network</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">Papi Foundation Network</motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed">
              Our network is made of over 230 million connected members with a combined investment capacity of €13.8 billion — mobilised within nine months of our founding.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" variants={stagger}
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { value: "230M+", label: "Network Members", sub: "Across 47 African countries and the global diaspora" },
              { value: "€13.8B", label: "Euros in Capacity", sub: "Collective investment potential mobilised within 9 months" },
              { value: "9 Months", label: "Time to Scale", sub: "The fastest-growing African humanitarian network in history" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                transition={{ delay: i * 0.12 }}
                className="border border-white/20 p-10 space-y-3 backdrop-blur-sm hover:border-primary/60 hover:bg-white/5 transition-all duration-500"
              >
                <div className="font-serif text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-white tracking-widest uppercase text-xs font-semibold">{stat.label}</div>
                <div className="text-white/60 text-sm leading-relaxed">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INVESTMENT SECTORS — image cards ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" variants={stagger}
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16 space-y-4"
          >
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Where We Invest</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">Sectors of Impact</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              Seven key sectors driving Africa's economic growth and community resilience — backed by our €13.8B network.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectors.map((sector, i) => (
              <motion.div
                key={sector.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: smoothEase }}
                viewport={{ once: true, margin: "-60px" }}
                className="group relative overflow-hidden border border-border cursor-default hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={sector.img}
                    alt={sector.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <sector.icon size={18} className="text-primary mb-1.5" />
                  <div className="font-semibold text-sm leading-snug">{sector.label}</div>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectors.length * 0.07 }}
              viewport={{ once: true, margin: "-60px" }}
              className="border border-primary/50 bg-primary/5 flex flex-col items-center justify-center p-8 gap-3 group hover:bg-primary/10 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-44"
            >
              <ArrowRight size={28} className="text-primary group-hover:translate-x-1 transition-transform" />
              <Link href="/doing-business" className="font-semibold text-sm text-primary text-center leading-snug">
                Explore All Opportunities
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      {featuredProjects.length > 0 && (
        <section className="py-28" style={{ background: "#F0EBE0" }}>
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-14">
              <motion.div
                initial="hidden" whileInView="show" variants={stagger}
                viewport={{ once: true, margin: "-60px" }}
                className="space-y-3"
              >
                <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Ongoing Work</motion.div>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">Active Projects</motion.h2>
              </motion.div>
              <Link href="/projects" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-primary hover:gap-3 transition-all">
                All Projects <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: smoothEase }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="bg-background border border-border group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="text-[9px] tracking-widest uppercase bg-primary text-primary-foreground px-2 py-0.5 font-bold">{project.category}</span>
                      <span className="text-[9px] tracking-widest uppercase bg-background/80 backdrop-blur-sm text-foreground px-2 py-0.5">{project.country}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif text-lg leading-snug">{project.title}</h3>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>€{(project.raisedAmount ?? 0).toLocaleString()} raised</span>
                        <span className="font-bold text-primary">{project.progressPercent ?? 0}%</span>
                      </div>
                      <div className="h-1.5 bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${project.progressPercent ?? 0}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          viewport={{ once: true }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground text-right">Goal: €{project.goalAmount.toLocaleString()}</div>
                    </div>
                    <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase font-bold text-primary hover:gap-2.5 transition-all">
                      View Project <ArrowRight size={11} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DIASPORA — full image split ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="show" variants={stagger}
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-7"
            >
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">For the African Diaspora</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">
                Ready to Come Home<br />and Build?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed text-base">
                Are you in the diaspora and ready to invest in Africa — to build businesses, create jobs, and grow the continent? Papi Foundation is your bridge. We connect you with the right partners, the right projects, and the right opportunities to make your investment count.
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-3">
                {[
                  "Market research and investment intelligence",
                  "Trade facilitation and logistics support",
                  "Investment promotion and partner matching",
                  "Legal guidance for cross-border projects",
                  "Connections to government and NGO networks",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-4 bg-card border border-border group hover:border-primary/40 transition-colors">
                    <div className="w-2 h-2 bg-primary shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href="/doing-business" className="bg-secondary text-secondary-foreground px-7 py-4 uppercase tracking-widest text-xs font-bold hover:bg-secondary/90 transition-colors">
                  Business in Africa
                </Link>
                <Link href="/community" className="border-2 border-secondary text-secondary px-7 py-4 uppercase tracking-widest text-xs font-bold hover:bg-secondary hover:text-secondary-foreground transition-colors">
                  Join the Network
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" variants={fadeRight}
              viewport={{ once: true, margin: "-80px" }}
              className="relative h-[580px] overflow-hidden"
            >
              <img
                src={papiOfficeImg}
                alt="Papi Foundation team meeting"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/10" />
              <motion.div
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }} viewport={{ once: true }}
                className="absolute top-8 right-8 bg-primary p-6 shadow-2xl text-primary-foreground"
              >
                <div className="font-serif text-3xl font-bold">€13.8B</div>
                <div className="text-primary-foreground/80 text-xs tracking-widest uppercase mt-1">Network capacity</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIVE DONATION TRANSPARENCY ── */}
      <section className="py-24 border-y border-border" style={{ background: "#F5F0E5" }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" variants={stagger}
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14 space-y-3"
          >
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Full Transparency</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-serif">Live Donation Tracker</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Every donation is visible. Every euro is tracked. Real-time accountability — because transparency builds trust.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" variants={stagger}
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-3 gap-5 mb-10"
          >
            {[
              { value: `€${((donationSummary?.totalRaised ?? 450000) / 1000).toFixed(1)}K`, label: "Total Raised", sub: "Updated in real-time" },
              { value: (donationSummary?.totalDonors ?? 250).toLocaleString(), label: "Total Donors", sub: `From ${impact?.countriesReached ?? 18} countries` },
              { value: `€${((donationSummary?.monthlyRecurring ?? 4500) / 1000).toFixed(1)}K`, label: "Monthly Recurring", sub: "From committed supporters" },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="bg-background border border-border p-8 text-center space-y-2 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                <div className="font-serif text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs tracking-widest uppercase text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {recentDonationItems.length > 0 && (
            <div className="space-y-2.5 max-w-2xl mx-auto">
              <div className="text-[10px] tracking-widest uppercase text-center text-muted-foreground mb-5">Recent Contributions</div>
              {recentDonationItems.slice(0, 5).map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between bg-background border border-border px-5 py-3.5 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/15 flex items-center justify-center text-primary font-bold text-xs">
                      {(d.isAnonymous ? "A" : d.donorName.charAt(0)).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{d.isAnonymous ? "Anonymous Supporter" : d.donorName}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">€{d.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{d.type}</div>
                  </div>
                </motion.div>
              ))}
              <div className="text-center pt-3">
                <Link href="/donate" className="text-xs tracking-widest uppercase text-primary font-bold hover:underline">
                  View Full Donor Wall
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── EVENTS & NEWS ── */}
      {recentEventItems.length > 0 && (
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-14">
              <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="space-y-3">
                <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Latest Updates</motion.div>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">Events & News</motion.h2>
              </motion.div>
              <Link href="/news" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-primary hover:gap-3 transition-all">
                All News &amp; Events <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEventItems.slice(0, 3).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: smoothEase }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="group border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-700" />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[9px] tracking-widest uppercase">
                      <span className="bg-primary/15 text-primary px-2 py-0.5 font-semibold">{event.type}</span>
                      <span className="text-muted-foreground">{event.date} — {event.location}</span>
                    </div>
                    <h3 className="font-serif text-base leading-snug">{event.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PARTNERS ── */}
      {partnerItems.length > 0 && (
        <section className="py-20 border-y border-border" style={{ background: "#F0EBE0" }}>
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="text-center mb-12 space-y-3">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Trusted Partners</motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl font-serif">Our Global Partners</motion.h2>
            </motion.div>
            <div className="flex flex-wrap items-center justify-center gap-5">
              {partnerItems.slice(0, 6).map((partner, i) => (
                <motion.a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="flex items-center gap-3 bg-background border border-border px-6 py-4 hover:border-primary/50 transition-colors"
                >
                  <img src={partner.logoUrl} alt={partner.name} className="h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <span className="text-xs font-semibold text-muted-foreground tracking-wide">{partner.name}</span>
                </motion.a>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/partners" className="text-xs tracking-widest uppercase font-bold text-primary border-b border-primary pb-0.5 hover:gap-2 transition-all">
                View All Partners
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CEO CONTACT ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0 border border-border overflow-hidden shadow-xl">
              <motion.div
                initial="hidden" whileInView="show" variants={fadeLeft}
                viewport={{ once: true, margin: "-60px" }}
                className="relative h-full min-h-[420px] overflow-hidden"
              >
                <img
                  src={founderImg}
                  alt="Tedum Henry Paago — Founder/President"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="font-serif text-2xl">Tedum Henry Paago</div>
                  <div className="text-primary text-xs tracking-widest uppercase mt-1 font-semibold">Founder / President</div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden" whileInView="show" variants={fadeRight}
                viewport={{ once: true, margin: "-60px" }}
                className="bg-secondary text-secondary-foreground p-10 flex flex-col justify-center space-y-6"
              >
                <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Contact the Visionary</div>
                <h2 className="text-3xl md:text-4xl font-serif">Reach Our Founder &amp; President</h2>
                <p className="text-secondary-foreground/70 leading-relaxed text-sm">
                  Have a partnership proposal, investment discussion, or a question about our mission? Tedum is personally committed to growing the Papi Foundation network. Reach out directly.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    { Icon: Mail, text: "president@papifoundation.net", href: "mailto:president@papifoundation.net" },
                    { Icon: Phone, text: "+31 6 42032437", href: "tel:+31642032437" },
                    { Icon: MapPin, text: "Berlin, Germany", href: null },
                  ].map(({ Icon, text, href }) => (
                    <div key={text} className="flex items-center gap-3 text-sm">
                      <Icon size={15} className="text-primary shrink-0" />
                      {href ? <a href={href} className="hover:text-primary transition-colors">{text}</a> : <span>{text}</span>}
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors self-start">
                  Send a Message <ArrowRight size={12} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFICES ── */}
      <section className="py-20 border-t border-border" style={{ background: "#F5F0E5" }}>
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="text-center mb-12 space-y-3">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Where We Are</motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-serif">Our Offices</motion.h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {offices.map((office, i) => (
              <motion.div
                key={office.country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background border border-border p-5 text-center space-y-2 hover:border-primary/50 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <MapPin size={18} className="text-primary mx-auto" />
                <div className="font-serif text-base">{office.city}</div>
                <div className="text-xs text-muted-foreground">{office.country}</div>
                <div className="text-[11px] text-primary">{office.phone}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/office" className="text-xs tracking-widest uppercase font-bold text-primary border-b border-primary pb-0.5">
              Full Office Directory
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA — full bleed image ── */}
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529528744093-6f8abeee511d?auto=format&fit=crop&w=1800&q=80')` }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(27,67,50,0.88)" }} />
        <div className="container mx-auto px-4 relative z-10 text-center text-white space-y-7">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-40px" }}>
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold mb-4">Join the Movement</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif max-w-2xl mx-auto leading-tight">
              Every Contribution Changes a Life
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 max-w-xl mx-auto text-base leading-relaxed mt-4">
              Whether you donate, partner, or become a member — your involvement matters. Together we are Building Africa by Africans.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link href="/donate" className="bg-primary text-primary-foreground px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors">
                Donate Now
              </Link>
              <Link href="/community" className="border-2 border-white/30 text-white px-10 py-4 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                Become a Member
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
