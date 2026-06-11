import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  useListDonations,
  useListProjects,
  useGetImpactStats,
  useGetDonationSummary,
} from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  LogOut,
  Heart,
  TrendingUp,
  Download,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Globe,
  Users,
  BarChart3,
  Calendar,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ElementType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border border-border p-6 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-widest uppercase text-muted-foreground font-semibold">{label}</span>
        <Icon size={18} className="text-primary" />
      </div>
      <div className="font-serif text-3xl font-bold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </motion.div>
  );
}

function generateReport(user: { name: string; email: string; memberSince: string }, donations: Array<{ amount: number; currency: string; donorName: string; type?: string; createdAt: string; message?: string | null }>, impact: { projectsCompleted: number; beneficiaries: number; countriesReached: number } | undefined) {
  const totalDonated = donations.filter((d) => d.donorName.toLowerCase() === user.name.toLowerCase() || d.donorName.toLowerCase().includes(user.email.split("@")[0].toLowerCase())).reduce((s, d) => s + d.amount, 0);
  const lines = [
    "====================================================",
    "         PAPI FOUNDATION — MEMBER IMPACT REPORT",
    "====================================================",
    "",
    `Member Name   : ${user.name}`,
    `Email         : ${user.email}`,
    `Member Since  : ${user.memberSince}`,
    `Report Date   : ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    "",
    "----------------------------------------------------",
    "  YOUR CONTRIBUTION SUMMARY",
    "----------------------------------------------------",
    `Total Donated : €${totalDonated.toLocaleString()}`,
    `Transactions  : ${donations.length}`,
    "",
    "----------------------------------------------------",
    "  FOUNDATION IMPACT (2024–2025)",
    "----------------------------------------------------",
    `Projects Completed    : ${impact?.projectsCompleted ?? 0}`,
    `Lives Impacted        : ${(impact?.beneficiaries ?? 0).toLocaleString()}+`,
    `Countries Reached     : ${impact?.countriesReached ?? 0}`,
    "",
    "----------------------------------------------------",
    "  WHAT YOUR DONATIONS FUNDED",
    "----------------------------------------------------",
    "  - Clean water borehole systems in Abuja, Nigeria",
    "  - Youth education center construction in Lagos",
    "  - Rural healthcare clinic in Kano State",
    "  - Solar energy for 8 off-grid villages in Enugu",
    "",
    "----------------------------------------------------",
    "  MESSAGE FROM THE FOUNDER",
    "----------------------------------------------------",
    "  Dear Member,",
    "",
    "  Your trust and generosity is what makes the Papi",
    "  Foundation's mission possible. Every euro you give",
    "  is tracked, accounted for, and invested directly",
    "  into the communities that need it most.",
    "",
    "  We are Building Africa by Africans — and you are",
    "  an essential part of that movement.",
    "",
    "  With gratitude,",
    "  Tedum Henry Paago",
    "  Founder / President",
    "  Papi Foundation",
    "",
    "====================================================",
    "  info@papifoundation.net  |  +31 6 42032437",
    "  papifoundation.net",
    "====================================================",
  ];
  return lines.join("\n");
}

export default function Dashboard() {
  const { user, isLoaded, logout, followProject, unfollowProject, isFollowing } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview" | "donations" | "projects" | "profile">("overview");

  const { data: allDonations } = useListDonations();
  const { data: projects } = useListProjects();
  const { data: impact } = useGetImpactStats();
  const { data: summary } = useGetDonationSummary();
  const safeDonations = Array.isArray(allDonations) ? allDonations : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  const myDonations = safeDonations.filter(
    (d) =>
      d.donorName.toLowerCase() === user.name.toLowerCase() ||
      d.donorName.toLowerCase().includes(user.email.split("@")[0].toLowerCase())
  );

  const totalDonated = myDonations.reduce((s, d) => s + d.amount, 0);
  const followedProjects = safeProjects.filter((p) => isFollowing(p.id));

  const handleDownloadReport = () => {
    if (!user) return;
    const content = generateReport(user, myDonations, impact);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Papi-Foundation-Impact-Report-${user.name.replace(/\s+/g, "-")}-${new Date().getFullYear()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "donations", label: "Donations" },
    { key: "projects", label: "My Projects" },
    { key: "profile", label: "Profile" },
  ] as const;

  return (
    <div className="min-h-screen py-10" style={{ background: "linear-gradient(180deg, #F5F0E5 0%, #FAFAF6 200px)" }}>
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-secondary flex items-center justify-center shrink-0">
              <span className="font-serif text-2xl font-bold text-secondary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-serif text-2xl text-foreground">Welcome back, {user.name.split(" ")[0]}</div>
              <div className="text-xs text-muted-foreground tracking-wide mt-0.5">
                Member since {new Date(user.memberSince).toLocaleDateString("en-GB", { month: "long", year: "numeric" })} &middot; {user.memberType}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-[11px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors"
            >
              <Download size={13} />
              Impact Report
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-border text-muted-foreground px-5 py-2.5 text-[11px] tracking-widest uppercase font-bold hover:border-destructive hover:text-destructive transition-colors"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3.5 text-[11px] tracking-widest uppercase font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Your Total Donated" value={`€${totalDonated.toLocaleString()}`} sub={`${myDonations.length} contribution${myDonations.length !== 1 ? "s" : ""}`} icon={Heart} />
              <StatCard label="Projects Followed" value={`${followedProjects.length}`} sub="Click Projects tab to manage" icon={Bookmark} />
              <StatCard label="Lives Impacted" value={`${(impact?.beneficiaries ?? 0).toLocaleString()}+`} sub="Foundation-wide" icon={Users} />
              <StatCard label="Countries Reached" value={`${impact?.countriesReached ?? 0}`} sub="Active programs" icon={Globe} />
            </div>

            {/* Impact Summary */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-background border border-border p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl">Your Impact Summary</h2>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-primary font-bold hover:underline"
                  >
                    <FileText size={12} />
                    Download Report
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Clean water provided to", value: "2,000+ families", icon: CheckCircle2, color: "text-cyan-700" },
                    { label: "Children enrolled in education", value: "500+ students", icon: CheckCircle2, color: "text-green-700" },
                    { label: "Healthcare patients served", value: "8,500+ people", icon: CheckCircle2, color: "text-red-700" },
                    { label: "Villages electrified with solar", value: "8 communities", icon: CheckCircle2, color: "text-amber-700" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4 p-3.5 bg-card border border-border">
                      <item.icon size={16} className={item.color} />
                      <div className="flex-1 text-sm">{item.label}</div>
                      <div className="font-semibold text-sm text-foreground">{item.value}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                  These are the collective outcomes of Papi Foundation programs that your donations contribute to. Your membership helps us hold ourselves accountable to these numbers.
                </p>
              </div>

              {/* Foundation totals */}
              <div className="bg-secondary text-secondary-foreground p-6 space-y-5 flex flex-col">
                <div className="text-[10px] tracking-widest uppercase text-primary font-semibold">Foundation Wide</div>
                <h2 className="font-serif text-xl">Overall Progress</h2>
                {[
                  { label: "Total raised", value: `€${((summary?.totalRaised ?? 0) / 1000).toFixed(0)}K` },
                  { label: "Total donors", value: (summary?.totalDonors ?? 0).toLocaleString() },
                  { label: "Monthly recurring", value: `€${(summary?.monthlyRecurring ?? 0).toLocaleString()}` },
                  { label: "Projects completed", value: impact?.projectsCompleted ?? 0 },
                  { label: "Partners worldwide", value: impact?.partnersCount ?? 0 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between border-b border-secondary-foreground/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-secondary-foreground/70 text-sm">{row.label}</span>
                    <span className="font-bold text-primary font-serif text-lg">{row.value}</span>
                  </div>
                ))}
                <Link href="/donate" className="mt-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 text-[11px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                  Donate Again <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Recent donations preview */}
            {myDonations.length === 0 && (
              <div className="bg-background border border-border p-10 text-center space-y-4">
                <Heart size={36} className="text-primary/30 mx-auto" />
                <h3 className="font-serif text-xl">No donations yet</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Make your first donation to start tracking your impact and seeing your contribution history here.</p>
                <Link href="/donate" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 text-[11px] tracking-widest uppercase font-bold hover:bg-secondary/90 transition-colors">
                  Make a Donation <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {myDonations.length > 0 && (
              <div className="bg-background border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl">Recent Donations</h2>
                  <button onClick={() => setActiveTab("donations")} className="text-[10px] tracking-widest uppercase text-primary font-bold hover:underline flex items-center gap-1">
                    View All <ChevronRight size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {myDonations.slice(0, 4).map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3.5 bg-card border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/15 flex items-center justify-center text-primary font-bold text-xs">
                          {d.donorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{d.isAnonymous ? "Anonymous" : d.donorName}</div>
                          <div className="text-[10px] text-muted-foreground">{new Date(d.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">€{d.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{d.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DONATIONS TAB */}
        {activeTab === "donations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-serif text-2xl">Donation History</h2>
                <p className="text-muted-foreground text-sm mt-1">Complete record of all your contributions to the Papi Foundation.</p>
              </div>
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-[11px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors"
              >
                <Download size={13} />
                Download Report
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-background border border-border p-5 text-center space-y-1">
                <div className="font-serif text-2xl font-bold text-primary">€{totalDonated.toLocaleString()}</div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground">Total Given</div>
              </div>
              <div className="bg-background border border-border p-5 text-center space-y-1">
                <div className="font-serif text-2xl font-bold text-primary">{myDonations.length}</div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground">Contributions</div>
              </div>
              <div className="bg-background border border-border p-5 text-center space-y-1">
                <div className="font-serif text-2xl font-bold text-primary">
                  {myDonations.filter((d) => d.type === "monthly").length}
                </div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground">Recurring</div>
              </div>
            </div>

            {myDonations.length === 0 ? (
              <div className="bg-background border border-border p-12 text-center space-y-4">
                <BarChart3 size={40} className="text-primary/20 mx-auto" />
                <h3 className="font-serif text-xl">No donations yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">Your donation history will appear here once you make your first contribution.</p>
                <Link href="/donate" className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 text-[11px] tracking-widest uppercase font-bold hover:bg-secondary/90 transition-colors">
                  Make Your First Donation <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="bg-background border border-border overflow-hidden">
                <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-muted border-b border-border text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">
                  <span className="col-span-2">Donor</span>
                  <span>Amount</span>
                  <span>Type</span>
                  <span>Date</span>
                </div>
                <div className="divide-y divide-border">
                  {myDonations.map((d, i) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="grid grid-cols-5 gap-4 px-5 py-4 items-center hover:bg-card/50 transition-colors"
                    >
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/15 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {d.donorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{d.isAnonymous ? "Anonymous" : d.donorName}</div>
                          {d.message && <div className="text-[10px] text-muted-foreground truncate max-w-[140px]">"{d.message}"</div>}
                        </div>
                      </div>
                      <div className="font-bold text-primary">€{d.amount.toLocaleString()}</div>
                      <div>
                        <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold ${d.type === "monthly" ? "bg-secondary/20 text-secondary" : "bg-primary/15 text-primary"}`}>
                          {d.type}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(d.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {safeDonations.length > myDonations.length && (
              <div className="bg-card border border-border p-5 text-sm text-muted-foreground text-center">
                Showing your personal donations. The foundation has received{" "}
                <strong className="text-foreground">{safeDonations.length}</strong> total contributions from all donors.{" "}
                <Link href="/donate" className="text-primary font-semibold hover:underline">View donor wall</Link>.
              </div>
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl">My Projects</h2>
              <p className="text-muted-foreground text-sm mt-1">Follow projects to track their progress and receive updates.</p>
            </div>

            {/* All projects with follow toggle */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(projects ?? []).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-background border overflow-hidden hover:shadow-md transition-all ${isFollowing(project.id) ? "border-primary/50" : "border-border"}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-foreground/10" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold backdrop-blur-sm ${
                        project.status === "completed" ? "bg-green-600/90 text-white"
                          : project.status === "ongoing" ? "bg-primary/90 text-primary-foreground"
                          : "bg-secondary/90 text-secondary-foreground"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {isFollowing(project.id) && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-primary text-primary-foreground text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">Following</div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[9px] tracking-widest uppercase text-muted-foreground mb-0.5">{project.country} · {project.category}</div>
                        <h3 className="font-serif text-base leading-snug">{project.title}</h3>
                      </div>
                      <button
                        onClick={() => isFollowing(project.id) ? unfollowProject(project.id) : followProject(project.id)}
                        className={`shrink-0 p-2 border transition-colors ${isFollowing(project.id) ? "border-primary text-primary bg-primary/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
                        title={isFollowing(project.id) ? "Unfollow project" : "Follow project"}
                      >
                        {isFollowing(project.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      </button>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>€{(project.raisedAmount ?? 0).toLocaleString()} raised</span>
                        <span className="font-semibold text-foreground">{project.progressPercent ?? 0}%</span>
                      </div>
                      <div className="h-1.5 bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progressPercent ?? 0}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground">Goal: €{project.goalAmount.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {project.beneficiaries && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Users size={11} className="text-primary" />
                          {project.beneficiaries.toLocaleString()} beneficiaries
                        </div>
                      )}
                      <Link href={`/projects/${project.id}`} className="ml-auto text-[10px] tracking-widest uppercase font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                        View <ChevronRight size={11} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {followedProjects.length > 0 && (
              <div className="bg-card border border-border p-5 text-sm text-center">
                You are following <strong className="text-foreground">{followedProjects.length}</strong> project{followedProjects.length !== 1 ? "s" : ""}. We will notify you of major milestones and updates.
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="font-serif text-2xl">My Profile</h2>
              <p className="text-muted-foreground text-sm mt-1">Your membership details and account information.</p>
            </div>

            <div className="bg-background border border-border p-8 space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-secondary flex items-center justify-center shrink-0">
                  <span className="font-serif text-4xl font-bold text-secondary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-[10px] tracking-widest uppercase text-primary font-semibold mt-1">{user.memberType} Member</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-border pt-6">
                {[
                  { label: "Full Name", value: user.name },
                  { label: "Email Address", value: user.email },
                  { label: "Member Type", value: user.memberType.charAt(0).toUpperCase() + user.memberType.slice(1) },
                  { label: "Member Since", value: new Date(user.memberSince).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Projects Followed", value: `${followedProjects.length} project${followedProjects.length !== 1 ? "s" : ""}` },
                  { label: "Total Donated", value: `€${totalDonated.toLocaleString()}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <span className="text-xs tracking-widest uppercase text-muted-foreground font-semibold">{row.label}</span>
                    <span className="text-sm font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Membership benefits */}
            <div className="bg-secondary text-secondary-foreground p-6 space-y-4">
              <h3 className="font-serif text-xl">Your Membership Benefits</h3>
              {[
                "Access to member-only impact reports",
                "Project following and progress tracking",
                "Donation history and tax records",
                "Priority invitations to Foundation events",
                "Monthly newsletter with field updates",
                "Direct line to the Foundation team",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span className="text-secondary-foreground/80">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownloadReport}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 text-[11px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors"
              >
                <Download size={14} />
                Download Full Impact Report
              </button>
              <Link href="/donate" className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-4 text-[11px] tracking-widest uppercase font-bold hover:bg-secondary/90 transition-colors">
                <Heart size={14} />
                Make Another Donation
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 border border-border text-muted-foreground py-3.5 text-[11px] tracking-widest uppercase font-bold hover:border-destructive hover:text-destructive transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
