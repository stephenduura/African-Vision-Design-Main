import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Tractor, BarChart3, Hammer, Truck, Ship, ShoppingBag, TrendingUp, FileText, Handshake } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const sectors = [
  { n: "01", icon: Tractor, title: "Livestock", description: "Investing in sustainable livestock farming, veterinary services, and supply chains across sub-Saharan Africa. From cattle ranching to poultry, the sector feeds millions.", img: "/sectors/livestock.png" },
  { n: "02", icon: Tractor, title: "Agri-trading & Agricultural Machinery", description: "Facilitating trade in agricultural commodities and modern farming equipment. We connect buyers and sellers across the continent and support mechanisation programs.", img: "/sectors/agritrading.png" },
  { n: "03", icon: BarChart3, title: "Business & Financial Services", description: "Supporting African SMEs, fintech startups, and financial institutions with investment, advisory services, and connections to European capital markets.", img: "/sectors/finance.png" },
  { n: "04", icon: Hammer, title: "Construction & Engineering", description: "Funding and facilitating infrastructure development — roads, schools, health clinics, housing, and utilities. Africa's infrastructure gap is one of the greatest investment opportunities.", img: "/sectors/construction.png" },
  { n: "05", icon: Truck, title: "Transportation & Logistics", description: "Building efficient, modern supply chains across Africa. From freight forwarding to last-mile delivery, we invest in the movement of goods and people.", img: "/sectors/transport.png" },
  { n: "06", icon: Ship, title: "Marine & Offshore", description: "Supporting Africa's blue economy — port development, maritime trade, offshore energy, and fisheries management along the continent's vast coastlines.", img: "/sectors/marine.png" },
  { n: "07", icon: ShoppingBag, title: "Retail", description: "Investing in Africa's growing consumer market. From e-commerce to physical retail, we help brands reach Africa's 1.4 billion consumers through distribution networks.", img: "/sectors/retail.png" },
];

const services = [
  { icon: TrendingUp, title: "Market Research & Intelligence", description: "Deep market analysis, consumer insights, and investment intelligence for any African country or sector.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=75" },
  { icon: Handshake, title: "Trade Facilitation", description: "End-to-end support for import/export, customs, compliance, and cross-border trade between Europe and Africa.", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=75" },
  { icon: FileText, title: "Investment Promotion", description: "Connecting European and global investors with verified, high-quality African investment opportunities.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=75" },
];

export default function DoingBusiness() {
  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[72vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1800&q=80')` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(27,67,50,0.92) 0%, rgba(27,67,50,0.65) 60%, rgba(27,67,50,0.3) 100%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl text-white space-y-6">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">The Opportunity</motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif leading-tight">
              Doing Business<br />
              <span className="text-primary italic">in Africa</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/75 text-lg leading-relaxed max-w-xl">
              Africa is not just a humanitarian cause — it is the world's greatest untapped economic frontier. The Papi Foundation provides the intelligence, the network, and the infrastructure to help you succeed on the continent.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link href="/contact" className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                Talk to Us <ArrowRight size={13} />
              </Link>
              <Link href="/partners" className="border-2 border-white/40 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-colors">
                View Partners
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* KEY STATS */}
      <section className="py-14 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center divide-x divide-secondary-foreground/20">
            {[
              { v: "1.4B", l: "Consumers" },
              { v: "€2.5T", l: "GDP by 2030" },
              { v: "54", l: "Nations" },
              { v: "60%", l: "Under 25" },
              { v: "25+", l: "Languages" },
              { v: "9%", l: "Growth Rate" },
            ].map((s) => (
              <div key={s.l} className="px-3">
                <div className="font-serif text-2xl font-bold text-primary">{s.v}</div>
                <div className="text-[9px] tracking-wider text-secondary-foreground/60 mt-0.5 uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS — image cards with hover detail */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-16 space-y-4">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Our Sectors</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif">Where We Invest & Operate</motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
              Seven sectors driving Africa's economic growth — backed by our €13.8B network and on-the-ground expertise.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((sector, i) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-60px" }}
                className="group relative h-[420px] overflow-hidden cursor-default"
              >
                {/* Full-bleed image */}
                <img src={sector.img} alt={sector.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110" />

                {/* Permanent forest-green duotone wash */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(27,67,50,0.15) 0%, rgba(27,67,50,0.55) 55%, rgba(15,38,28,0.95) 100%)" }} />

                {/* Top row: number + icon */}
                <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                  <span className="font-serif text-5xl text-white/90 leading-none drop-shadow-lg">{sector.n}</span>
                  <div className="w-11 h-11 border border-white/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors duration-500">
                    <sector.icon size={18} className="text-white" />
                  </div>
                </div>

                {/* Gold rule that grows on hover */}
                <div className="absolute bottom-[148px] left-6 h-[3px] bg-primary w-10 group-hover:w-20 transition-all duration-500" />

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-serif text-2xl leading-tight mb-3">{sector.title}</h3>
                  {/* Description reveals smoothly on hover */}
                  <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <p className="text-white/80 text-sm leading-relaxed pb-1">{sector.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITY — parallax split */}
      <section className="py-28 border-y border-border" style={{ background: "#F5F0E5" }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="show" variants={fadeLeft}
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6"
            >
              <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Why Africa Now</div>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                The World's Last Great<br />Investment Frontier
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Africa has the world's youngest population, the fastest urbanisation rate, and an emerging middle class of 350 million consumers. By 2030, the continent will account for 85% of global population growth — creating unprecedented demand for goods, services, and infrastructure.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                The Papi Foundation is uniquely positioned to help you navigate this opportunity — with local knowledge, established partnerships, and a €13.8B investment network already in place.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-secondary/90 transition-colors">
                Start the Conversation <ArrowRight size={13} />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" variants={fadeRight}
              viewport={{ once: true, margin: "-80px" }}
              className="relative h-[520px] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80"
                alt="African city skyline"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <div className="font-serif text-3xl font-bold text-primary">350M</div>
                <div className="text-white/80 text-sm">Emerging middle class consumers by 2030</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES — image + text cards */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="text-center mb-16 space-y-4">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">How We Help</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-serif">Our Business Services</motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-60px" }}
                className="group overflow-hidden border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <service.icon size={20} className="text-primary" />
                  </div>
                </div>
                <div className="p-7 space-y-3 bg-card">
                  <h3 className="font-serif text-xl">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1800&q=80')` }} />
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white space-y-6">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-40px" }}>
            <motion.h2 variants={fadeUp} className="text-4xl font-serif mb-3">Ready to Enter Africa?</motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 max-w-lg mx-auto leading-relaxed mb-8">
              Whether you are a European investor, a diaspora entrepreneur, or an international company — we are your partner on the ground.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                Start the Conversation <ArrowRight size={13} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
