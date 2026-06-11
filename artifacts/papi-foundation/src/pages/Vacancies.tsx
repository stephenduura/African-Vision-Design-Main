import { motion } from "framer-motion";
import { Link } from "wouter";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

const vacancies = [
  {
    id: 1,
    title: "Field Program Coordinator — Nigeria",
    department: "Operations",
    location: "Lagos, Nigeria",
    type: "Full-time",
    description: "Lead the coordination and delivery of our Nigeria education and clean water programs. You will manage local partnerships, field teams, and program reporting.",
    requirements: ["3+ years NGO or development sector experience", "Fluent in English and Yoruba or Hausa", "Based in or willing to relocate to Lagos"],
    open: true,
  },
  {
    id: 2,
    title: "Partnerships & Fundraising Officer",
    department: "Development",
    location: "Amsterdam, Netherlands",
    type: "Full-time",
    description: "Identify, pitch, and manage partnerships with European corporations, government bodies, and institutional donors. Manage grant applications and reporting.",
    requirements: ["Experience in fundraising or business development", "Strong network in the European development finance sector", "Excellent written and verbal communication"],
    open: true,
  },
  {
    id: 3,
    title: "Legal Counsel — Africa Operations",
    department: "Legal",
    location: "Remote (Africa-based preferred)",
    type: "Part-time / Retainer",
    description: "Provide legal guidance on operations across multiple African jurisdictions including contract review, compliance, and regulatory affairs.",
    requirements: ["Qualified lawyer in at least one African jurisdiction", "Experience in NGO/foundation law", "Knowledge of cross-border investment frameworks"],
    open: true,
  },
  {
    id: 4,
    title: "Communications & Content Manager",
    department: "Communications",
    location: "Remote",
    type: "Full-time",
    description: "Tell the Papi Foundation story through compelling content — impact reports, social media, press releases, video scripts, and donor communications.",
    requirements: ["Proven content creation experience", "Strong visual storytelling skills", "Passion for African development"],
    open: true,
  },
];

export default function Vacancies() {
  return (
    <div>
      <section className="py-20 border-b border-border" style={{ background: "linear-gradient(135deg, #F5F0E5 0%, #EDE3D0 100%)" }}>
        <div className="container mx-auto px-4 text-center space-y-5">
          <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Join Our Team</div>
          <h1 className="text-5xl md:text-6xl font-serif">Vacancies</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            We are building a world-class team of development professionals, advocates, and experts. If you are passionate about Africa's future, we want to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {vacancies.map((vacancy, i) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-card border border-border p-8 space-y-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h2 className="font-serif text-2xl">{vacancy.title}</h2>
                    <div className="text-xs tracking-widest uppercase text-primary font-semibold">{vacancy.department}</div>
                  </div>
                  <span className="text-[9px] tracking-widest uppercase bg-secondary text-secondary-foreground px-3 py-1.5 font-bold">
                    Open Position
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" />{vacancy.location}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" />{vacancy.type}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-primary" />{vacancy.department}</span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{vacancy.description}</p>

                <div className="space-y-2">
                  <div className="text-xs font-semibold tracking-wider uppercase">Requirements</div>
                  <ul className="space-y-1">
                    {vacancy.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/contact" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-secondary/90 transition-colors">
                  Apply Now <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-card border border-border text-center space-y-4">
            <h3 className="font-serif text-2xl">Do Not See Your Role?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              We are always looking for exceptional people. Send us your CV and a note about how you want to contribute to Building Africa by Africans.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
              Send Open Application <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
