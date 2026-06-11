import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, type Variants } from "framer-motion";
import { MapPin, Phone, Mail, Globe, ArrowRight, ChevronDown, Building2, Compass } from "lucide-react";
import { Link } from "wouter";
import officeImg from "@assets/Gemini_Generated_Image_ri9qyfri9qyfri9q_1779885101247.png";
import africaMap from "@assets/africa_nobg.png";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const fadeRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { show: { transition: { staggerChildren: 0.12 } } };

const dotTexture =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Ccircle cx='30' cy='30' r='1' fill='%231B4332'/%3E%3C/svg%3E\")";

const headquarters = {
  city: "Abuja",
  country: "Nigeria",
  region: "West Africa",
  address: "Flat 2 Bahamas Estate, Opposite Grandpela, Durumi District, Abuja, Nigeria",
  phone: "+31 6 42032437",
  email: "info@papifoundation.net",
  description:
    "The beating heart of the Papi Foundation. From Abuja we steer global partnerships, donor relations, governance, and the strategy that carries our mission across the continent.",
};

const regionalOffices = [
  {
    id: "lagos",
    city: "Lagos",
    country: "Nigeria",
    region: "West Africa",
    address: "Victoria Island, Lagos, Nigeria",
    phone: "+234 80 000 0000",
    email: "nigeria@papifoundation.net",
    description:
      "Our largest field office, overseeing education, clean water, and healthcare programmes across every Nigerian state.",
  },
  {
    id: "accra",
    city: "Accra",
    country: "Ghana",
    region: "West Africa",
    address: "Airport City, Accra, Ghana",
    phone: "+233 20 000 0000",
    email: "ghana@papifoundation.net",
    description:
      "Driving our West Africa expansion — coordinating women's empowerment and agricultural transformation programmes.",
  },
  {
    id: "dakar",
    city: "Dakar",
    country: "Senegal",
    region: "West Africa",
    address: "Almadies, Dakar, Senegal",
    phone: "+221 77 000 0000",
    email: "senegal@papifoundation.net",
    description:
      "Our newest home, launching school renovation and rural empowerment initiatives across Senegal.",
  },
  {
    id: "nairobi",
    city: "Nairobi",
    country: "Kenya",
    region: "East Africa",
    address: "Westlands, Nairobi, Kenya",
    phone: "+254 70 000 0000",
    email: "kenya@papifoundation.net",
    description:
      "Our East Africa hub, supporting programmes across Kenya, Rwanda, and neighbouring nations.",
  },
  {
    id: "kigali",
    city: "Kigali",
    country: "Rwanda",
    region: "East Africa",
    address: "Kiyovu, Kigali, Rwanda",
    phone: "+250 78 000 0000",
    email: "rwanda@papifoundation.net",
    description:
      "Implementing education and community development programmes across the heart of the region.",
  },
];

const footprint = [
  { region: "West Africa", cities: ["Abuja — HQ", "Lagos", "Accra", "Dakar"] },
  { region: "East Africa", cities: ["Nairobi", "Kigali"] },
];

const stats = [
  { value: 6, suffix: "", label: "Offices" },
  { value: 5, suffix: "", label: "Countries" },
  { value: 230, suffix: "M+", label: "People in Network" },
  { value: 13.8, prefix: "€", suffix: "B", decimals: 1, label: "Network Value" },
];

function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1700;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function Office() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const ringY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, background: "linear-gradient(135deg, #F0E8D5 0%, #E8D8B4 45%, #DEC899 100%)" }}
        />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: dotTexture }} />

        {/* Decorative gold orbit rings */}
        <motion.div
          style={{ y: ringY }}
          className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 hidden md:block"
        >
          <div className="w-[34rem] h-[34rem] rounded-full border border-primary/20" />
          <div className="absolute inset-12 rounded-full border border-primary/15" />
          <div className="absolute inset-28 rounded-full border border-primary/10" />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="container mx-auto px-4 relative z-10 max-w-4xl"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-7">
            <div className="w-8 h-px bg-primary" />
            <span className="bg-secondary text-secondary-foreground text-[10px] tracking-[0.3em] uppercase px-4 py-2 font-semibold">
              Our Global Presence
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-[5.25rem] font-serif leading-[1.04] text-foreground"
          >
            Anchored Across<br />
            <em className="text-primary not-italic">Africa.</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            From our global headquarters in Abuja to field offices spanning West and East Africa, the
            Papi Foundation stands where the work is. Six homes, five nations, one enduring mission.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            {["6 Offices", "5 Countries", "2 Regions"].map((pill) => (
              <span
                key={pill}
                className="border border-primary/40 text-foreground text-[11px] tracking-[0.18em] uppercase font-semibold px-5 py-2.5 rounded-full bg-background/40 backdrop-blur-sm"
              >
                {pill}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/contact"
              className="group bg-secondary text-secondary-foreground px-9 py-4 uppercase tracking-widest text-xs font-bold hover:bg-secondary/90 transition-colors flex items-center gap-2"
            >
              Get in Touch
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#headquarters"
              className="text-foreground uppercase tracking-widest text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 border-b-2 border-primary pb-0.5"
            >
              Visit Our HQ <ArrowRight size={13} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary"
        >
          <ChevronDown className="animate-bounce" size={22} />
        </motion.div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="bg-secondary text-secondary-foreground py-16 border-y border-primary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <div className="font-serif text-4xl md:text-5xl text-primary">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="mt-2 text-[10px] md:text-xs tracking-[0.22em] uppercase text-secondary-foreground/70">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HEADQUARTERS SPOTLIGHT ── */}
      <section id="headquarters" className="py-24 bg-background scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeLeft}
              className="relative"
            >
              <div className="absolute -top-5 -left-5 w-full h-full border border-primary/40 hidden sm:block" />
              <img
                src={officeImg}
                alt="Papi Foundation global headquarters in Abuja"
                className="relative w-full h-[26rem] object-cover shadow-xl"
              />
              <div className="absolute bottom-5 left-5 bg-secondary text-secondary-foreground px-5 py-3">
                <div className="text-[9px] tracking-[0.3em] uppercase text-primary font-bold">Headquarters</div>
                <div className="font-serif text-xl">Abuja, Nigeria</div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeRight}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-primary" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">
                  Global Headquarters
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Where Our Mission <em className="text-primary not-italic">Begins.</em>
              </h2>
              <p className="text-muted-foreground leading-relaxed">{headquarters.description}</p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3.5">
                  <MapPin size={17} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{headquarters.address}</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <Phone size={17} className="text-primary shrink-0" />
                  <a
                    href={`tel:${headquarters.phone.replace(/\s/g, "")}`}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {headquarters.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3.5">
                  <Mail size={17} className="text-primary shrink-0" />
                  <a
                    href={`mailto:${headquarters.email}`}
                    className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  >
                    {headquarters.email}
                  </a>
                </div>
              </div>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors mt-2"
              >
                Contact Headquarters
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── REGIONAL NETWORK ── */}
      <section
        className="py-24 border-t border-border"
        style={{ background: "linear-gradient(180deg, #F5F0E5 0%, #EFE6D4 100%)" }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">
                The Network
              </span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif">Our Regional Offices</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Close to the communities we serve — each office leads programmes rooted in the needs of its region.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {regionalOffices.map((office, i) => (
              <motion.div
                key={office.id}
                variants={fadeUp}
                className="group relative bg-card border border-card-border p-8 overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="pointer-events-none absolute -top-8 -right-2 font-serif text-[7rem] leading-none text-primary/[0.07] select-none">
                  0{i + 2}
                </div>
                <div className="relative space-y-4">
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-primary font-semibold">
                    <Compass size={13} />
                    {office.region}
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl leading-none">{office.city}</h3>
                    <p className="text-xs tracking-wider uppercase text-muted-foreground mt-1.5">{office.country}</p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{office.description}</p>
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <MapPin size={13} className="text-primary shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Phone size={13} className="text-primary shrink-0" />
                      <a
                        href={`tel:${office.phone.replace(/\s/g, "")}`}
                        className="hover:text-primary transition-colors"
                      >
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Mail size={13} className="text-primary shrink-0" />
                      <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CONTINENTAL FOOTPRINT ── */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeLeft}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
              </div>
              <motion.img
                src={africaMap}
                alt="Map of Africa marking Papi Foundation offices"
                className="relative w-[78%] max-w-sm drop-shadow-2xl"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeRight}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-primary" />
                  <span className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">
                    Our Footprint
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight">Across the Continent</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
                  Two regions. Six cities. A growing presence built to reach every community we are called to serve.
                </p>
              </div>

              <div className="space-y-7">
                {footprint.map((group) => (
                  <div key={group.region}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <Building2 size={16} className="text-primary" />
                      <h3 className="font-serif text-xl">{group.region}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {group.cities.map((city) => (
                        <span
                          key={city}
                          className="inline-flex items-center gap-1.5 border border-border bg-card px-4 py-2 text-sm text-foreground/80"
                        >
                          <MapPin size={12} className="text-primary" />
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GENERAL INQUIRIES CTA ── */}
      <section className="relative py-24 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: dotTexture }} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="container mx-auto px-4 relative z-10 text-center max-w-2xl"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">
              General Inquiries
            </span>
            <div className="w-8 h-px bg-primary" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">
            Let's Build Africa, <em className="text-primary not-italic">Together.</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-secondary-foreground/70 leading-relaxed">
            For partnerships, media, complaints, or general questions, our doors — and inboxes — are always open.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-8 text-sm">
            <a
              href="mailto:info@papifoundation.net"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail size={15} className="text-primary" />
              info@papifoundation.net
            </a>
            <a href="tel:+31642032437" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone size={15} className="text-primary" />
              +31 6 42032437
            </a>
            <span className="flex items-center gap-2">
              <Globe size={15} className="text-primary" />
              papifoundation.net
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/contact"
              className="group bg-primary text-primary-foreground px-9 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Send a Message
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/donate"
              className="text-secondary-foreground uppercase tracking-widest text-xs font-bold hover:text-primary transition-colors flex items-center gap-2 border-b-2 border-primary pb-0.5"
            >
              Support Our Work <ArrowRight size={13} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
