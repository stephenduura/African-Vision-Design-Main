import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, User, Phone, Mail, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import africaLogo from "@assets/africa_nobg.png";

const aboutMenu = [
  { href: "/about", label: "About Us" },
  { href: "/team", label: "Our Team" },
  { href: "/roadmap", label: "Track Records" },
  { href: "/partners", label: "Membership & Partners" },
  { href: "/vacancies", label: "Vacancies" },
];

const navLinks = [
  { href: "/doing-business", label: "Doing Business in Africa" },
  { href: "/african-insights", label: "African Insights" },
  { label: "About Papi", children: aboutMenu },
  { href: "/news", label: "News & Events" },
  { href: "/community", label: "Community" },
  { href: "/office", label: "Office" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground py-1.5 px-4 hidden md:block">
        <div className="container mx-auto flex items-center justify-between text-xs tracking-wide">
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Mail size={11} />
              info@papifoundation.net
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={11} />
              +31 6 42032437
            </span>
          </span>
          <span className="flex items-center gap-4">
            {[
              { label: "Facebook", href: "https://facebook.com" },
              { label: "Twitter", href: "https://twitter.com" },
              { label: "LinkedIn", href: "https://linkedin.com" },
              { label: "Instagram", href: "https://www.instagram.com/official_papifoundation" },
              { label: "YouTube", href: "https://youtube.com" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">{s.label}</a>
            ))}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.img
            src={africaLogo}
            alt="Papi Foundation"
            className="w-11 h-11 object-contain shrink-0 drop-shadow-sm"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div>
            <div className="font-serif font-bold text-lg tracking-widest text-foreground uppercase leading-tight">
              PAPI FOUNDATION
            </div>
            <div className="text-[10px] tracking-[0.2em] text-primary uppercase font-medium leading-tight">
              Building Africa by Africans
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-6 text-[11px] font-semibold tracking-[0.15em] uppercase">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors py-2">
                  {link.label}
                  <ChevronDown size={11} className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 bg-background border border-border shadow-lg py-2 min-w-[200px]"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2.5 text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className={`transition-colors hover:text-primary whitespace-nowrap py-2 border-b-2 ${
                  location === link.href ? "border-primary text-primary" : "border-transparent text-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="hidden xl:flex items-center gap-3">
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button className="flex items-center gap-2 border border-primary/40 bg-primary/5 text-primary px-4 py-2.5 text-[11px] tracking-widest uppercase font-bold hover:bg-primary/10 transition-colors">
                <div className="w-5 h-5 bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name.split(" ")[0]}
                <ChevronDown size={11} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 bg-background border border-border shadow-lg py-2 min-w-[180px]"
                  >
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-2.5 text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-colors">
                      <LayoutDashboard size={12} />
                      My Dashboard
                    </Link>
                    <Link href="/donate" className="flex items-center gap-2.5 px-5 py-2.5 text-[10px] tracking-widest hover:bg-primary/10 hover:text-primary transition-colors">
                      <User size={12} />
                      Donate
                    </Link>
                    <hr className="border-border my-1" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-5 py-2.5 text-[10px] tracking-widest hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                    >
                      <LogOut size={12} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/sign-in" className="flex items-center gap-2 text-[11px] tracking-widest uppercase font-semibold text-foreground hover:text-primary transition-colors border border-border px-4 py-2.5">
              <User size={13} />
              Sign In
            </Link>
          )}
          <Link href="/donate" className="bg-primary text-primary-foreground px-5 py-2.5 uppercase tracking-widest text-[11px] font-bold hover:bg-primary/90 transition-colors">
            Donate
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="xl:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden overflow-hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {user && (
                <div className="flex items-center gap-3 px-2 py-3 mb-2 bg-primary/10 border border-primary/20">
                  <div className="w-8 h-8 bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              )}
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <div className="text-[11px] tracking-widest uppercase font-bold text-muted-foreground px-2 py-2">{link.label}</div>
                    {link.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block px-4 py-2 text-[11px] tracking-widest uppercase hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link key={link.href} href={link.href!} className="block px-2 py-2.5 text-[11px] tracking-widest uppercase font-semibold hover:text-primary transition-colors border-b border-border/40" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                )
              )}
              <div className="flex gap-3 mt-4">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex-1 text-center border border-primary text-primary py-3 text-[11px] tracking-widest uppercase font-semibold" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </Link>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="flex-1 text-center border border-border text-muted-foreground py-3 text-[11px] tracking-widest uppercase font-semibold">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" className="flex-1 text-center border border-border py-3 text-[11px] tracking-widest uppercase font-semibold" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/donate" className="flex-1 text-center bg-primary text-primary-foreground py-3 text-[11px] tracking-widest uppercase font-bold" onClick={() => setMobileOpen(false)}>
                      Donate
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
