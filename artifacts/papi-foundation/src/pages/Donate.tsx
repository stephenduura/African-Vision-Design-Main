import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateDonationCheckout, useListProjects, useGetDonationSummary, getGetDonationSummaryQueryKey } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Shield, TrendingUp, Users, CheckCircle2, Radio } from "lucide-react";

const formSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  type: z.enum(["one-time", "monthly"]),
  donorName: z.string().min(2, "Name is required"),
  currency: z.enum(["EUR", "USD", "GBP"]).default("EUR"),
  projectId: z.coerce.number().optional().nullable(),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

const fadeUp = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const QUICK_AMOUNTS = [20, 50, 100, 250, 500, 1000];

function AnimCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (end - start) * ease));
      if (t < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

export default function Donate() {
  const { toast } = useToast();
  const { data: projects } = useListProjects();
  const safeProjects = Array.isArray(projects) ? projects : [];

  const { data: summary, dataUpdatedAt } = useGetDonationSummary({
    query: { queryKey: getGetDonationSummaryQueryKey(), refetchInterval: 6000, staleTime: 0 },
  });

  const createCheckout = useCreateDonationCheckout();
  const [donated, setDonated] = useState(false);
  const [prevDonorCount, setPrevDonorCount] = useState<number | null>(null);
  const [newDonorFlash, setNewDonorFlash] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      setDonated(true);
      toast({ title: "Thank you!", description: "Your donation was successful and is now on the live donor wall." });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (status === "cancelled") {
      toast({ title: "Checkout cancelled", description: "Your donation was not completed. You can try again any time.", variant: "destructive" });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!summary) return;
    if (prevDonorCount !== null && summary.totalDonors > prevDonorCount) {
      setNewDonorFlash(true);
      setTimeout(() => setNewDonorFlash(false), 2000);
    }
    setPrevDonorCount(summary.totalDonors);
  }, [summary?.totalDonors]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: "one-time", amount: 100, donorName: "", currency: "EUR", message: "", isAnonymous: false },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createCheckout.mutate(
      {
        data: {
          amount: values.amount,
          currency: values.currency,
          donorName: values.donorName,
          type: values.type,
          isAnonymous: values.isAnonymous,
          message: values.message || undefined,
          projectId: values.projectId || undefined,
        },
      },
      {
        onSuccess: (res) => {
          window.location.href = res.url;
        },
        onError: () => {
          toast({ title: "Error", description: "Could not start secure checkout. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const recentDonations = Array.isArray(summary?.recentDonations) ? summary.recentDonations : [];
  const totalRaised = summary?.totalRaised ?? 0;
  const totalDonors = summary?.totalDonors ?? 0;
  const monthlyRecurring = summary?.monthlyRecurring ?? 0;

  return (
    <div className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529528744093-6f8abeee511d?auto=format&fit=crop&w=1800&q=80')` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(27,67,50,0.93) 0%, rgba(27,67,50,0.65) 60%, rgba(27,67,50,0.25) 100%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-2xl text-white space-y-5">
            <motion.div variants={fadeUp} className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">Change a Life Today</motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-serif leading-tight">
              Your Donation<br />
              <span className="text-primary italic">Builds Africa.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/75 text-base leading-relaxed max-w-lg">
              100% transparent. Every euro tracked and reported. Choose where your donation goes, and watch it work.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* LIVE TOTALS BANNER */}
      <section className="py-8 bg-secondary text-secondary-foreground border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-6">

            {/* Live indicator */}
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </span>
              <span className="text-xs tracking-[0.3em] uppercase font-bold text-primary">Live Donations</span>
            </div>

            <div className="flex flex-wrap items-center gap-10">
              <div className="text-center">
                <div className="font-serif text-3xl font-bold text-primary">
                  <AnimCounter value={totalRaised} prefix="€" />
                </div>
                <div className="text-[10px] tracking-widest uppercase text-secondary-foreground/60 mt-0.5">Total Raised</div>
              </div>
              <div className="text-center">
                <div className={`font-serif text-3xl font-bold transition-colors duration-500 ${newDonorFlash ? "text-primary" : "text-secondary-foreground"}`}>
                  <AnimCounter value={totalDonors} />
                </div>
                <div className="text-[10px] tracking-widest uppercase text-secondary-foreground/60 mt-0.5">Donors</div>
              </div>
              <div className="text-center">
                <div className="font-serif text-3xl font-bold text-secondary-foreground">
                  <AnimCounter value={monthlyRecurring} prefix="€" suffix="/mo" />
                </div>
                <div className="text-[10px] tracking-widest uppercase text-secondary-foreground/60 mt-0.5">Monthly Recurring</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-secondary-foreground/40 text-[10px] tracking-widest uppercase">
              <Radio size={11} />
              <span>Updates every 6s</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-8 bg-secondary/80 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-10">
            {[
              { icon: Shield, text: "100% Secure Payments" },
              { icon: TrendingUp, text: "Full Donation Transparency" },
              { icon: Users, text: `${totalDonors.toLocaleString()} Donors Worldwide` },
              { icon: Heart, text: "15,000+ Lives Impacted" },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2.5 text-sm">
                <t.icon size={16} className="text-primary" />
                <span className="text-secondary-foreground/80">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN — form + impact */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">

            {/* FORM */}
            <div className="lg:col-span-3">
              <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="bg-card border border-border p-8 md:p-10">
                <motion.div variants={fadeUp} className="mb-8">
                  <div className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold mb-2">Make Your Donation</div>
                  <h2 className="font-serif text-3xl">Every Euro Counts</h2>
                </motion.div>

                {donated ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-5">
                    <CheckCircle2 size={56} className="text-primary mx-auto" />
                    <h3 className="font-serif text-2xl">Thank You!</h3>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
                      Your donation has been received and is now visible on our live donor wall below. You will receive a confirmation email shortly.
                    </p>
                    <button onClick={() => setDonated(false)} className="text-xs tracking-widest uppercase text-primary font-bold hover:underline">
                      Make Another Donation
                    </button>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Type toggle */}
                      <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Donation Type</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            {[{ v: "one-time", l: "One-Time" }, { v: "monthly", l: "Monthly" }].map(({ v, l }) => (
                              <button key={v} type="button" onClick={() => field.onChange(v)}
                                className={`py-3 text-xs tracking-widest uppercase font-bold border-2 transition-colors ${field.value === v ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                                {l}
                              </button>
                            ))}
                          </div>
                        </FormItem>
                      )} />

                      {/* Quick amounts */}
                      <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Amount (EUR)</FormLabel>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {QUICK_AMOUNTS.map((amt) => (
                              <button key={amt} type="button" onClick={() => field.onChange(amt)}
                                className={`py-2.5 text-sm font-bold border-2 transition-colors ${field.value === amt ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                                €{amt}
                              </button>
                            ))}
                          </div>
                          <FormControl>
                            <Input type="number" placeholder="Or enter custom amount" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="border-border focus:border-primary" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="donorName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Your Name</FormLabel>
                          <FormControl><Input placeholder="Your full name" {...field} className="border-border focus:border-primary" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="projectId" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Direct to Project (Optional)</FormLabel>
                          <Select onValueChange={(v) => field.onChange(v === "general" ? null : parseInt(v))}>
                            <FormControl>
                              <SelectTrigger className="border-border focus:border-primary">
                                <SelectValue placeholder="General fund (highest impact)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General Fund (Highest Impact)</SelectItem>
                              {safeProjects.map((p) => <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] tracking-widest uppercase font-semibold">Message (Optional)</FormLabel>
                          <FormControl><Textarea placeholder="Leave a message of encouragement..." rows={3} {...field} className="border-border focus:border-primary resize-none" /></FormControl>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="isAnonymous" render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" id="anon" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="w-4 h-4 accent-primary" />
                            <label htmlFor="anon" className="text-sm text-muted-foreground cursor-pointer">Make my donation anonymous</label>
                          </div>
                        </FormItem>
                      )} />

                      <Button type="submit" disabled={createCheckout.isPending} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-5 text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2">
                        <Heart size={14} />
                        {createCheckout.isPending ? "Redirecting to secure checkout..." : `Donate €${form.watch("amount") || 0} ${form.watch("type") === "monthly" ? "/ month" : ""}`}
                      </Button>

                      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                        Your donation is secure. Papi Foundation is a registered humanitarian foundation. You will receive a tax receipt by email.
                      </p>
                    </form>
                  </Form>
                )}
              </motion.div>
            </div>

            {/* IMPACT SIDEBAR */}
            <div className="lg:col-span-2 space-y-5">
              <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }}>
                <motion.div variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold mb-5">Your Impact</motion.div>

                {[
                  { amount: 20, impact: "Provides clean drinking water for 1 child for an entire year", img: "https://images.unsplash.com/photo-1564419431959-a3f1b9d77754?auto=format&fit=crop&w=400&q=60" },
                  { amount: 100, impact: "Covers school supplies for 5 children for a full term", img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=60" },
                  { amount: 250, impact: "Funds a mobile clinic visit to a rural community", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=60" },
                  { amount: 1000, impact: "Installs a solar panel unit for an off-grid family home", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=60" },
                ].map((item, i) => (
                  <motion.div
                    key={item.amount}
                    variants={fadeUp}
                    transition={{ delay: i * 0.09 }}
                    className="flex items-center gap-4 p-4 bg-card border border-border hover:border-primary/40 transition-colors group cursor-pointer mb-3"
                    onClick={() => form.setValue("amount", item.amount)}
                  >
                    <div className="w-16 h-14 shrink-0 overflow-hidden">
                      <img src={item.img} alt={`€${item.amount} impact`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg font-bold text-primary">€{item.amount}</div>
                      <div className="text-xs text-muted-foreground leading-snug">{item.impact}</div>
                    </div>
                  </motion.div>
                ))}

                <motion.div variants={fadeUp} className="bg-secondary text-secondary-foreground p-6 space-y-4 mt-6">
                  <h3 className="font-serif text-lg">Why Donors Trust Us</h3>
                  {["Every donation published publicly", "Annual audited accounts", "Direct beneficiary reporting", "Zero management fee on field funds"].map((t) => (
                    <div key={t} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      <span className="text-secondary-foreground/80">{t}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DONOR WALL */}
      <section className="py-20 border-t border-border" style={{ background: "#F5F0E5" }}>
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold">Live Donor Wall</span>
            </div>
            <h2 className="text-3xl font-serif">Recent Contributors</h2>
            <p className="text-muted-foreground text-sm">This wall updates automatically in real time as donations come in.</p>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {recentDonations.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="flex items-center justify-between bg-background border border-border px-5 py-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {(d.isAnonymous ? "A" : d.donorName.charAt(0)).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{d.isAnonymous ? "Anonymous Supporter" : d.donorName}</div>
                      {d.message && <div className="text-[10px] text-muted-foreground italic">"{d.message}"</div>}
                      {!d.message && (
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(d.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="font-bold text-primary font-serif text-lg">€{Number(d.amount).toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">{d.type}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {recentDonations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Be the first to donate. Your name will appear here instantly.
              </div>
            )}
          </div>

          {/* Grand total footer */}
          <div className="mt-10 bg-secondary text-secondary-foreground p-6 flex items-center justify-between">
            <div>
              <div className="text-[10px] tracking-widest uppercase text-primary font-semibold mb-1">Grand Total Raised</div>
              <div className="font-serif text-4xl font-bold text-primary">
                <AnimCounter value={totalRaised} prefix="€" />
              </div>
              <div className="text-secondary-foreground/60 text-xs mt-1">from {totalDonors.toLocaleString()} donors worldwide</div>
            </div>
            <div className="flex items-center gap-2 text-secondary-foreground/40 text-[10px] tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span>Live</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
