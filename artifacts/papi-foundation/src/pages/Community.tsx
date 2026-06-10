import { useListCommunityMembers, useGetCommunityStats, useJoinCommunity } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Globe, Heart, ArrowRight } from "lucide-react";
import CommunityFeed from "@/components/community/CommunityFeed";

const MEMBER_TYPES = ["individual", "organization", "volunteer"] as const;

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Country is required"),
  memberType: z.enum(["individual", "organization", "volunteer"]),
  bio: z.string().optional(),
});

const fadeUp = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } };
const fadeLeft = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function Community() {
  const { data: stats } = useGetCommunityStats();
  const { data: members, isLoading: membersLoading } = useListCommunityMembers();
  const safeMembers = Array.isArray(members) ? members : [];
  const joinCommunity = useJoinCommunity();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", country: "", memberType: "individual", bio: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    joinCommunity.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Welcome to the Community!", description: "Your application has been received." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to join. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative flex items-center overflow-hidden bg-secondary text-white">
        {/* ambient layered background */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 120% at 15% 10%, rgba(27,67,50,0.55) 0%, rgba(20,49,37,1) 55%, rgba(14,36,27,1) 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        {/* decorative gold ring */}
        <div className="pointer-events-none absolute -right-40 -top-40 w-[34rem] h-[34rem] rounded-full border border-primary/20" />
        <div className="pointer-events-none absolute -right-24 top-10 w-[22rem] h-[22rem] rounded-full border border-primary/10" />

        <div className="container mx-auto px-4 relative z-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-12 items-center">
            {/* LEFT — editorial */}
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-xl space-y-7">
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <span className="h-px w-10 bg-primary" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Our People</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl xl:text-7xl font-serif leading-[1.05]">
                Join Our<br /><span className="text-primary italic">Community</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/75 text-base md:text-lg leading-relaxed max-w-lg">
                A network of over 230 million Africans and Africa-supporters united by a single conviction: that Africa's future belongs to Africans.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-1">
                <a href="#join" className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                  Become a Member <ArrowRight size={13} />
                </a>
                <a href="#feed" className="border border-white/25 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white/10 transition-colors">
                  Explore the Feed
                </a>
              </motion.div>
              {/* trust row */}
              <motion.div variants={fadeUp} className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1488508872907-592763824245?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-secondary" />
                  ))}
                </div>
                <div className="text-xs leading-tight">
                  <div className="font-serif text-lg text-primary font-bold leading-none">230M+</div>
                  <div className="text-white/60 tracking-wide">members across 47 countries</div>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT — layered image composition */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[440px] sm:h-[520px] lg:h-[560px] hidden md:block"
            >
              {/* main image */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-0 w-[68%] h-[78%] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-primary/30"
              >
                <img
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80"
                  alt="Community gathering"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
              </motion.div>

              {/* secondary overlapping image */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute left-0 bottom-0 w-[54%] h-[56%] overflow-hidden rounded-[1.5rem] shadow-2xl ring-4 ring-secondary"
              >
                <img
                  src="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=800&q=80"
                  alt="Community members together"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* floating stat card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-2 bottom-6 bg-background text-foreground px-5 py-4 rounded-xl shadow-2xl border-l-4 border-primary"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Heart size={16} className="fill-primary/20" />
                  <span className="font-serif text-2xl font-bold leading-none">15K+</span>
                </div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Lives changed together</div>
              </motion.div>

              {/* small gold accent square */}
              <div className="absolute -left-3 top-8 w-16 h-16 border-2 border-primary/40 rounded-lg rotate-12" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-secondary-foreground/20">
            {[
              { icon: Users, value: stats?.totalMembers?.toLocaleString() ?? "230M+", label: "Network Members" },
              { icon: Globe, value: "47+", label: "Countries" },
              { icon: Heart, value: "3", label: "Member Types" },
              { icon: Users, value: "15K+", label: "Direct Beneficiaries" },
            ].map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} transition={{ delay: i * 0.08 }} className="px-4">
                <s.icon size={22} className="text-primary mx-auto mb-2" />
                <div className="font-serif text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-[10px] tracking-widest uppercase text-secondary-foreground/60 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COMMUNITY FEED */}
      <CommunityFeed />

      {/* WHY JOIN — image split */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="show" variants={fadeLeft} viewport={{ once: true, margin: "-80px" }} className="relative h-[520px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=900&q=80" alt="Community meeting" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent" />
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }} viewport={{ once: true }}
                className="absolute bottom-8 left-8 right-8 bg-background/95 backdrop-blur-md p-5 border-l-4 border-primary"
              >
                <div className="font-serif text-2xl font-bold text-primary">230M+</div>
                <div className="text-xs tracking-widest uppercase text-muted-foreground mt-0.5">Members building Africa together</div>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-80px" }} className="space-y-7">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Why Join</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">
                Be Part of Something<br />Bigger Than Yourself
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-base leading-relaxed">
                Our community is not a mailing list — it is a living network of change-makers, investors, volunteers, and advocates who show up for Africa every day. When you join, you gain access to one of the most powerful development networks on earth.
              </motion.p>
              <motion.div variants={stagger} className="space-y-3">
                {[
                  "Access to members-only impact reports and project data",
                  "Invitations to Foundation events, webinars, and field visits",
                  "A direct line to investors, partners, and on-ground experts",
                  "Opportunities to volunteer, co-invest, or sponsor programs",
                  "Monthly updates on every active project and use of funds",
                ].map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-start gap-4 p-4 bg-card border border-border hover:border-primary/40 transition-colors group">
                    <div className="w-2 h-2 bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MEMBER TYPES */}
      <section className="py-24 border-y border-border" style={{ background: "#F0EBE0" }}>
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="text-center mb-14 space-y-4">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Membership</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl font-serif">How You Can Contribute</motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { type: "Individual", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=75", desc: "Join as an individual supporter, advocate, or diaspora member. Follow projects, donate, receive updates, and connect with the network." },
              { type: "Organization", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=700&q=75", desc: "Register your company, NGO, or institution as a partner organisation. Co-invest, sponsor programs, or align your CSR with our impact goals." },
              { type: "Volunteer", img: "https://images.unsplash.com/photo-1529528744093-6f8abeee511d?auto=format&fit=crop&w=700&q=75", desc: "Offer your time, skills, and expertise directly to our field programs. We need lawyers, doctors, teachers, engineers, and communicators." },
            ].map((m, i) => (
              <motion.div
                key={m.type}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-60px" }}
                className="group overflow-hidden border border-border bg-background hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="h-52 overflow-hidden relative">
                  <img src={m.img} alt={m.type} className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-primary px-3 py-1 text-[9px] tracking-widest uppercase text-primary-foreground font-bold">{m.type}</div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-xl">{m.type} Membership</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRENT MEMBERS */}
      {safeMembers.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="text-center mb-14 space-y-4">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Our People</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl font-serif">Community Members</motion.h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {safeMembers.slice(0, 8).map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border p-5 space-y-3 hover:border-primary/40 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/15 flex items-center justify-center text-primary font-serif font-bold text-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{member.name}</div>
                    <div className="text-[10px] text-muted-foreground">{member.country}</div>
                  </div>
                  <div className="text-[9px] tracking-widest uppercase text-primary font-semibold">{member.memberType}</div>
                  {member.bio && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{member.bio}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JOIN FORM */}
      <section id="join" className="py-28 border-t border-border" style={{ background: "#F5F0E5" }}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="space-y-6">
              <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Become a Member</motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif leading-tight">
                Join Us Today
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-base leading-relaxed">
                Membership is free and open to everyone who shares our vision of a prosperous, self-determining Africa. Fill in the form and we will be in touch within 48 hours.
              </motion.p>
              <motion.div variants={fadeUp} className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=75" alt="Community gathering" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent" />
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" variants={fadeRight} viewport={{ once: true, margin: "-60px" }} className="bg-background border border-border p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Full Name</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} className="border-border focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="your@email.com" {...field} className="border-border focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Country</FormLabel>
                      <FormControl><Input placeholder="Your country" {...field} className="border-border focus:border-primary" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="memberType" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Membership Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-border focus:border-primary">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MEMBER_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">About You (Optional)</FormLabel>
                      <FormControl><textarea placeholder="Tell us a little about yourself and why you want to join" rows={3} {...field} className="w-full border border-border p-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none bg-background" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={joinCommunity.isPending} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-4 text-xs tracking-widest uppercase font-bold">
                    {joinCommunity.isPending ? "Joining..." : "Join the Community"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
