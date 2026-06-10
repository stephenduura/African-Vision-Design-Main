import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Heart, Globe, Users, Shield, TrendingUp, Award } from "lucide-react";
import founderImg from "@assets/WhatsApp_Image_2026-05-26_at_10.33.05_PM_(1)_1780670580464.jpeg";

const fadeUp = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } };

const values = [
  { icon: Heart, title: "Compassion", description: "Every decision we make is grounded in genuine care for the people and communities we serve across Africa." },
  { icon: Shield, title: "Integrity", description: "Full financial transparency. Every euro donated is tracked, reported, and deployed with precision and accountability." },
  { icon: TrendingUp, title: "Ambition", description: "We are not content with small results. We think and operate at continental scale — because Africa deserves nothing less." },
  { icon: Globe, title: "Pan-Africanism", description: "We believe Africa's transformation must come from within — designed, led, and owned by Africans." },
  { icon: Users, title: "Community", description: "Our network of 230M+ people is not a statistic — it is a living community of people committed to one shared future." },
  { icon: Award, title: "Excellence", description: "We hold ourselves to the highest global standards in governance, impact measurement, and institutional quality." },
];

const timeline = [
  { year: "2023", event: "Foundation Established", detail: "Papi Foundation registered in Amsterdam with a mission to Build Africa by Africans." },
  { year: "2024", event: "First Programs Launched", detail: "Education, clean water, and healthcare programs launched in Nigeria, Ghana, Kenya and Rwanda." },
  { year: "2024", event: "€13.8B Network Assembled", detail: "230M+ members connected within 9 months — the fastest-growing African development network in history." },
  { year: "2025", event: "Five Offices Open", detail: "HQ in Abuja; field offices operational in Lagos, Accra, Nairobi and Kigali." },
  { year: "2026", event: "Investment Sectors Activated", detail: "Livestock, agri-tech, logistics, marine, construction and retail investment programs deployed." },
  { year: "2028", event: "Continental Expansion", detail: "Target: 20 countries, 1 million direct beneficiaries, and €1B in deployed capital." },
];

export default function About() {
  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=80')`,
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(27,67,50,0.88) 0%, rgba(27,67,50,0.7) 50%, rgba(27,67,50,0.55) 100%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden" animate="show" variants={fadeUp}
            transition={{ duration: 0.9 }}
            className="max-w-3xl space-y-6 text-white"
          >
            <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Our Foundation</div>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight">
              Building Africa<br />
              <span className="text-primary italic">by Africans</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-xl">
              We are a global humanitarian foundation with deep African roots and a world-class institutional vision. Our work spans five countries and touches millions of lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial="hidden" whileInView="show" variants={fadeLeft}
              transition={{ duration: 0.9 }} viewport={{ once: true, margin: "-80px" }}
              className="space-y-7"
            >
              <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Our Mission</div>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                A Different Kind of Foundation
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Most development organisations export solutions from the outside. We believe that Africa's future belongs to Africans — and we back that belief with investment, infrastructure, and an extraordinary global network.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                Papi Foundation brings together diaspora entrepreneurs, European investors, African governments, NGOs, and community leaders under one shared purpose: a prosperous, self-determining Africa.
              </p>
              <div className="space-y-3">
                {["Fund community-led projects across Africa", "Connect global capital to African opportunities", "Train and empower the next generation of African leaders"].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    <span className="text-sm text-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" variants={fadeRight}
              transition={{ duration: 0.9 }} viewport={{ once: true, margin: "-80px" }}
              className="relative"
            >
              <div className="relative overflow-hidden aspect-[4/5] bg-secondary/5">
                <img
                  src={founderImg}
                  alt="Papi Foundation"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-primary p-6 shadow-xl hidden md:block">
                <div className="font-serif text-4xl font-bold text-primary-foreground">9</div>
                <div className="text-primary-foreground/80 text-xs tracking-widest uppercase mt-1">Months to Scale</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STORY — full-bleed image */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1567360425852-c97e27e19e8b?auto=format&fit=crop&w=1800&q=80')` }}
        />
        <div className="absolute inset-0 bg-secondary/80" />
        <div className="container mx-auto px-4 relative z-10 text-white text-center space-y-6">
          <motion.div
            initial="hidden" whileInView="show" variants={fadeUp}
            transition={{ duration: 0.9 }} viewport={{ once: true, margin: "-60px" }}
          >
            <div className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold mb-4">The Story</div>
            <h2 className="text-4xl md:text-5xl font-serif max-w-3xl mx-auto leading-tight">
              Born from Frustration. Built on Vision.
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed mt-5">
              Tedum Henry Paago was born in Africa and built his career spanning finance, development, and international trade. After years of witnessing Africa being spoken for, planned for, and invested in by outsiders, he founded Papi Foundation in 2023 to change that story permanently.
            </p>
            <p className="text-white/70 max-w-2xl mx-auto text-base leading-relaxed mt-3">
              Within nine months, the network grew to 230M+ people and €13.8B in collective investment capacity. Not through advertising — through trust, purpose, and the raw power of an idea whose time had come.
            </p>
          </motion.div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" variants={fadeUp}
            transition={{ duration: 0.7 }} viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16 space-y-4"
          >
            <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">What We Stand For</div>
            <h2 className="text-4xl md:text-5xl font-serif">Our Core Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden" whileInView="show" variants={fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }} viewport={{ once: true, margin: "-60px" }}
                className="group p-7 border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-400"
              >
                <v.icon size={28} className="text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-xl mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL IMAGE + TEXT — Education + Healthcare */}
      <section className="py-24 border-y border-border" style={{ background: "#F0EBE0" }}>
        <div className="container mx-auto px-4 space-y-16">
          {[
            {
              img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80",
              tag: "Education",
              title: "Every Child Deserves a Quality Education",
              text: "We build and renovate schools, fund teachers, provide learning materials, and create scholarship pathways for children across Nigeria, Ghana, Kenya, and Rwanda. Education is the foundation of everything.",
              stat: "3,000+ Students",
              statSub: "enrolled in our programs",
              flip: false,
            },
            {
              img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
              tag: "Healthcare",
              title: "Health is a Right, Not a Privilege",
              text: "We fund rural health clinics, mobile medical teams, maternal health programs, and disease prevention campaigns across underserved communities. Our teams have served over 8,500 patients directly.",
              stat: "8,500+ Patients",
              statSub: "treated and supported",
              flip: true,
            },
          ].map((block, idx) => (
            <div
              key={block.tag}
              className={`grid lg:grid-cols-2 gap-12 items-center ${block.flip ? "lg:flex-row-reverse" : ""}`}
            >
              <motion.div
                initial="hidden" whileInView="show"
                variants={block.flip ? fadeRight : fadeLeft}
                transition={{ duration: 0.9 }} viewport={{ once: true, margin: "-60px" }}
                className={`relative overflow-hidden h-[420px] ${block.flip ? "lg:order-2" : ""}`}
              >
                <img src={block.img} alt={block.tag} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[9px] tracking-widest uppercase px-3 py-1.5 font-bold">{block.tag}</div>
              </motion.div>
              <motion.div
                initial="hidden" whileInView="show"
                variants={block.flip ? fadeLeft : fadeRight}
                transition={{ duration: 0.9, delay: 0.15 }} viewport={{ once: true, margin: "-60px" }}
                className={`space-y-5 ${block.flip ? "lg:order-1" : ""}`}
              >
                <h3 className="font-serif text-3xl md:text-4xl leading-tight">{block.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">{block.text}</p>
                <div className="border-l-4 border-primary pl-5">
                  <div className="font-serif text-3xl font-bold text-primary">{block.stat}</div>
                  <div className="text-xs tracking-widest uppercase text-muted-foreground mt-0.5">{block.statSub}</div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="show" variants={fadeUp}
            transition={{ duration: 0.7 }} viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-16 space-y-4"
          >
            <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Where We Came From</div>
            <h2 className="text-4xl md:text-5xl font-serif">Our Journey</h2>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="show" variants={fadeLeft}
                  transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true, margin: "-40px" }}
                  className="relative flex items-start gap-8"
                >
                  <div className="shrink-0 w-16 flex flex-col items-center">
                    <div className="w-4 h-4 bg-primary border-2 border-primary-foreground shadow-md rounded-full z-10" />
                    <div className="text-[10px] tracking-widest uppercase text-primary font-bold mt-2">{item.year}</div>
                  </div>
                  <div className="pb-8 border-b border-border flex-1">
                    <h3 className="font-serif text-xl mb-2">{item.event}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1800&q=80')` }}
        />
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white space-y-6">
          <motion.div
            initial="hidden" whileInView="show" variants={fadeUp}
            transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-40px" }}
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Join Our Mission</h2>
            <p className="text-white/70 max-w-lg mx-auto leading-relaxed mb-8">
              Whether you donate, partner, volunteer, or simply share — every action matters. Help us build Africa by Africans.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/donate" className="bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                Donate Now
              </Link>
              <Link href="/contact" className="border-2 border-white/40 text-white px-10 py-4 text-xs tracking-widest uppercase font-bold hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
                Get in Touch <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
