import { useListTeamMembers, type TeamMember } from "@workspace/api-client-react";
import { motion, MotionConfig, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { Linkedin, ArrowRight, Quote, MapPin, Mail } from "lucide-react";
import founderImg from "@assets/WhatsApp_Image_2026-05-26_at_11.16.22_PM_(1)_1779885261318.jpeg";
import founderPortrait from "@assets/WhatsApp_Image_2026-05-26_at_10.33.05_PM_(1)_1780670580464.jpeg";
import teamLawyer from "@assets/WhatsApp_Image_2026-06-03_at_9.32.48_PM_(1)_1780671584551.jpeg";
import teamYoungMan from "@assets/WhatsApp_Image_2026-06-05_at_3.55.55_PM_1780671584550.jpeg";
import ambassadorsImg from "@assets/generated_images/global_ambassadors.png";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
const stagger: Variants = { show: { transition: { staggerChildren: 0.1 } } };

const STATIC_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Tedum Henry Paago",
    role: "Founder / President",
    bio: "Leading the foundation's strategy, partnerships, and long-term vision for building Africa by Africans.",
    imageUrl: founderPortrait,
    linkedinUrl: null,
    category: "leadership",
    order: 0,
  },
  {
    id: 2,
    name: "Legal & Governance",
    role: "Counsel & Compliance",
    bio: "Supporting the foundation's legal structure, transparency standards, and governance commitments.",
    imageUrl: teamLawyer,
    linkedinUrl: null,
    category: "leadership",
    order: 1,
  },
  {
    id: 3,
    name: "Programmes & Delivery",
    role: "On-the-Ground Execution",
    bio: "Coordinating field delivery, operations, and programme support across active community initiatives.",
    imageUrl: teamYoungMan,
    linkedinUrl: null,
    category: "volunteer",
    order: 0,
  },
  {
    id: 4,
    name: "Global Ambassadors",
    role: "International Outreach",
    bio: "Advocates carrying the mission into donor networks, institutions, and diaspora communities worldwide.",
    imageUrl: ambassadorsImg,
    linkedinUrl: null,
    category: "ambassador",
    order: 0,
  },
];

function getFallbackImage(member: TeamMember) {
  const role = member.role.toLowerCase();
  const name = member.name.toLowerCase();
  if (member.category === "leadership" && (name.includes("tedum") || role.includes("founder"))) {
    return founderPortrait;
  }
  if (member.category === "leadership" && role.includes("legal")) {
    return teamLawyer;
  }
  if (member.category === "volunteer" || role.includes("program")) {
    return teamYoungMan;
  }
  if (member.category === "ambassador") {
    return ambassadorsImg;
  }
  return founderPortrait;
}

function PersonCard({ member, index }: { member: TeamMember; index: number }) {
  const fallback = getFallbackImage(member);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      viewport={{ once: true, margin: "-60px" }}
      tabIndex={0}
      className="group relative aspect-[3/4] overflow-hidden bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <img
        src={member.imageUrl || fallback}
        alt={member.name}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 35%, rgba(15,38,28,0.55) 62%, rgba(15,38,28,0.96) 100%)" }} />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="h-[3px] w-8 bg-primary mb-4 group-hover:w-14 transition-all duration-500" />
        <h3 className="font-serif text-2xl leading-tight">{member.name}</h3>
        <p className="text-primary text-[11px] uppercase tracking-[0.18em] font-semibold mt-1">{member.role}</p>

        <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-52 group-hover:opacity-100 group-focus-within:max-h-52 group-focus-within:opacity-100 [@media(hover:none)]:max-h-52 [@media(hover:none)]:opacity-100 transition-all duration-500 ease-out">
          <p className="text-white/75 text-sm leading-relaxed pt-4 line-clamp-4">{member.bio}</p>
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/80 hover:text-primary transition-colors mt-4 text-xs uppercase tracking-widest font-semibold">
              <Linkedin className="w-4 h-4" /> Connect
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb?: string }) {
  return (
    <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="max-w-2xl mx-auto text-center mb-14 space-y-4">
      <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">{eyebrow}</motion.div>
      <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">{title}</motion.h2>
      {blurb && <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">{blurb}</motion.p>}
    </motion.div>
  );
}

export default function Team() {
  const { data: team, isLoading } = useListTeamMembers();
  const safeTeam = Array.isArray(team) ? team : [];
  const displayTeam = safeTeam.length > 0 ? safeTeam : STATIC_TEAM_MEMBERS;

  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroYRaw = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroY = reduceMotion ? "0%" : heroYRaw;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const leadershipAll = displayTeam.filter((t) => t.category === "leadership").sort((a, b) => a.order - b.order);
  const founder = leadershipAll[0];
  const leadership = leadershipAll.slice(1);
  const fieldTeam = displayTeam.filter((t) => t.category === "volunteer").sort((a, b) => a.order - b.order);
  const ambassadors = displayTeam.filter((t) => t.category === "ambassador").sort((a, b) => a.order - b.order);

  return (
    <MotionConfig reducedMotion="user"><div className="overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div
          style={{ y: heroY, backgroundImage: `url('/team/hero.png')`, backgroundSize: "cover", backgroundPosition: "center" }}
          className="absolute inset-[-8%]"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,38,28,0.55) 0%, rgba(15,38,28,0.5) 45%, rgba(15,38,28,0.96) 100%)" }} />
        <div className="container mx-auto px-4 relative z-10 pb-20 pt-40">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl text-white space-y-7">
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="h-px w-10 bg-primary" />
              <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Our People</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-serif text-6xl md:text-7xl leading-[1.05]">
              The People Behind<br />the <span className="text-primary italic">Purpose</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/70 text-lg leading-relaxed max-w-2xl">
              A world-class team of operators, humanitarians, and visionaries — born across Africa and Europe, united by one mission: engineering sustainable, measurable impact across the continent.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-x border-white/10">
            {[
              { v: "2024", l: "Founded" },
              { v: "8", l: "Core changemakers" },
              { v: "3", l: "Continents represented" },
              { v: "54", l: "Nations served" },
            ].map((s) => (
              <div key={s.l} className="py-10 px-4 text-center">
                <div className="font-serif text-4xl md:text-5xl font-bold text-primary">{s.v}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-secondary-foreground/55 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOUNDER SPOTLIGHT ─── */}
      {founder && (
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                viewport={{ once: true, margin: "-80px" }}
                className="lg:col-span-5 relative"
              >
                <div className="absolute -top-5 -left-5 w-28 h-28 border-t-2 border-l-2 border-primary hidden md:block" />
                <div className="absolute -bottom-5 -right-5 w-28 h-28 border-b-2 border-r-2 border-primary hidden md:block" />
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={founderImg}
                    alt={founder.name}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = founderImg; }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                viewport={{ once: true, margin: "-80px" }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Founder &amp; President</div>
                <h2 className="font-serif text-5xl md:text-6xl leading-tight">{founder.name}</h2>
                <Quote className="text-primary/30 w-12 h-12" />
                <p className="font-serif text-2xl md:text-3xl italic leading-snug text-foreground/90">
                  Building Africa by Africans is not a slogan — it is a blueprint for systemic, generational change.
                </p>
                <p className="text-muted-foreground text-base leading-relaxed max-w-xl">{founder.bio}</p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 pt-1">
                  <a href="mailto:president@papifoundation.net" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 text-primary shrink-0" /> president@papifoundation.net
                  </a>
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary shrink-0" /> Berlin, Germany
                  </div>
                </div>
                <div className="h-px w-16 bg-primary/40" />
                {founder.linkedinUrl && (
                  <a href={founder.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-xs uppercase tracking-widest font-bold">
                    <Linkedin className="w-4 h-4" /> Connect with {founder.name.split(" ")[0]}
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ─── LEADERSHIP ─── */}
      {leadership.length > 0 && (
        <section className="py-28 border-y border-border" style={{ background: "#F5F0E5" }}>
          <div className="container mx-auto px-4">
            <SectionHeading eyebrow="Executive Leadership" title="The Team Steering the Mission" blurb="Seasoned operators with decades of combined experience across development, health, and partnerships." />
            <div className="grid lg:grid-cols-2 gap-10 items-stretch">
              <PersonCard key={leadership[0].id} member={leadership[0]} index={0} />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
                viewport={{ once: true, margin: "-60px" }}
                className="bg-background border border-border p-8 md:p-10 flex items-center"
              >
                <div className="max-w-xl space-y-5">
                  <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Executive Leadership</div>
                  <h3 className="font-serif text-3xl md:text-4xl leading-tight text-foreground">Guiding the Mission Forward</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    Our executive leadership team brings together decades of experience across international development, public health, and strategic partnerships. With a shared commitment to impact, they provide the vision, expertise, and direction needed to drive our mission forward and create sustainable change in the communities we serve.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FIELD TEAM ─── */}
      {fieldTeam.length > 0 && (
        <section className="py-28 bg-background">
          <div className="container mx-auto px-4">
            <SectionHeading eyebrow="On the Ground" title="Our Field Coordinators" blurb="Every day, in every community — the people who turn strategy into measurable change on the continent." />
            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {fieldTeam.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                  viewport={{ once: true, margin: "-60px" }}
                  className="group flex gap-5 items-start bg-card border border-border p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-500"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-full bg-secondary">
                    <img
                      src={m.imageUrl || getFallbackImage(m)}
                      alt={m.name}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = getFallbackImage(m); }}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl leading-tight">{m.name}</h3>
                    <div className="flex items-center gap-1.5 text-primary text-[11px] uppercase tracking-[0.15em] font-semibold">
                      <MapPin className="w-3 h-3" /> {m.role}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{m.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── AMBASSADORS ─── */}
      {ambassadors.length > 0 && (
        <section className="py-28 border-t border-border" style={{ background: "#F5F0E5" }}>
          <div className="container mx-auto px-4">
            <SectionHeading eyebrow="Global Ambassadors" title="Voices for Africa, Worldwide" blurb="Champions who carry the mission into donor communities, institutions, and the next generation." />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              viewport={{ once: true, margin: "-60px" }}
              className="relative max-w-4xl mx-auto overflow-hidden rounded-sm border border-primary/20 shadow-[0_30px_80px_-30px_rgba(15,38,28,0.45)]"
            >
              <img
                src={ambassadorsImg}
                alt="A connected world with Africa at its center — voices for Africa carried worldwide"
                className="w-full h-auto block"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="relative py-28 overflow-hidden bg-secondary text-secondary-foreground">
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-primary" />
              <span className="text-[10px] tracking-[0.45em] uppercase text-primary font-bold">Join the Mission</span>
              <div className="h-px w-10 bg-primary" />
            </div>
            <h2 className="font-serif text-5xl md:text-6xl leading-tight">Become Part of the Story</h2>
            <p className="text-secondary-foreground/65 leading-relaxed max-w-lg mx-auto">
              We are always looking for exceptional operators, volunteers, and ambassadors who share our conviction that Africa's future will be built by Africans.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center">
              <Link href="/community" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                Join Our Community <ArrowRight size={13} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:border-primary hover:text-primary transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div></MotionConfig>
  );
}
