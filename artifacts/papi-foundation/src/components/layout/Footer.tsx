import { useState } from "react";
import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send } from "lucide-react";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import africaLogo from "@assets/africa_nobg.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscribe = useSubscribeNewsletter();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate(
      { data: { email, name } },
      {
        onSuccess: () => setSubscribed(true),
      }
    );
  };

  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      {/* Main footer grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 — Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={africaLogo}
                alt="Papi Foundation"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <div className="font-serif font-bold text-xl tracking-widest uppercase text-primary leading-tight">
                  PAPI FOUNDATION
                </div>
                <div className="text-xs tracking-[0.2em] text-primary/70 uppercase mt-1">
                  Building Africa by Africans
                </div>
              </div>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              A global African humanitarian foundation investing in education, clean water, healthcare, and community empowerment across Africa.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-secondary-foreground/60 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-secondary-foreground/60 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-secondary-foreground/60 hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://www.instagram.com/official_papifoundation" target="_blank" rel="noreferrer" className="text-secondary-foreground/60 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-secondary-foreground/60 hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div className="space-y-5">
            <h4 className="font-serif text-sm tracking-widest uppercase text-primary border-b border-primary/30 pb-3">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/doing-business", label: "Doing Business in Africa" },
                { href: "/african-insights", label: "African Insights" },
                { href: "/projects", label: "Projects" },
                { href: "/team", label: "Our Team" },
                { href: "/vacancies", label: "Vacancies" },
                { href: "/news", label: "News" },
                { href: "/events", label: "Events & Training" },
                { href: "/donate", label: "Donate" },
                { href: "/community", label: "Community" },
                { href: "/roadmap", label: "Roadmap" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-secondary-foreground/70 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Offices */}
          <div className="space-y-5">
            <h4 className="font-serif text-sm tracking-widest uppercase text-primary border-b border-primary/30 pb-3">Our Offices</h4>
            <div className="space-y-4 text-sm">
              {[
                { country: "Nigeria (HQ)", address: "Flat 2 Bahamas Estate, Opposite Grandpela, Durumi District, Abuja, Nigeria", phone: "+31 6 42032437" },
                { country: "Nigeria", address: "Lagos, Nigeria", phone: "+234 80 000 0000" },
                { country: "Ghana", address: "Accra, Ghana", phone: "+233 20 000 0000" },
                { country: "Kenya", address: "Nairobi, Kenya", phone: "+254 70 000 0000" },
                { country: "Rwanda", address: "Kigali, Rwanda", phone: "+250 78 000 0000" },
              ].map((office) => (
                <div key={office.country} className="space-y-0.5">
                  <div className="font-semibold text-secondary-foreground/90 text-xs tracking-wider uppercase">{office.country}</div>
                  <div className="flex items-start gap-1.5 text-secondary-foreground/60">
                    <MapPin size={11} className="mt-0.5 shrink-0" />
                    {office.address}
                  </div>
                  {office.phone && (
                    <div className="flex items-center gap-1.5 text-secondary-foreground/60">
                      <Phone size={11} />
                      {office.phone}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-secondary-foreground/70">
                  <Mail size={13} />
                  <a href="mailto:info@papifoundation.net" className="hover:text-primary transition-colors">info@papifoundation.net</a>
                </div>
                <div className="flex items-center gap-2 text-secondary-foreground/70">
                  <Phone size={13} />
                  <span>+31 6 42032437</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4 — Newsletter */}
          <div className="space-y-5">
            <h4 className="font-serif text-sm tracking-widest uppercase text-primary border-b border-primary/30 pb-3">Monthly Newsletter</h4>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              Stay up to date with our latest projects, impact reports, and events from across Africa.
            </p>
            {subscribed ? (
              <div className="bg-primary/20 border border-primary/40 px-4 py-3 text-sm text-primary">
                Thank you for subscribing. You will receive our next newsletter shortly.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-secondary-foreground/10 border border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/40 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribe.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 text-xs tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  <Send size={13} />
                  {subscribe.isPending ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-foreground/50 tracking-wide">
          <span>&copy; {new Date().getFullYear()} Papi Foundation. All rights reserved. KvK: 00000000</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
