import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Members Directory", href: "/members" },
    { label: "Business Directory", href: "/businesses" },
    { label: "Marketplace",        href: "/marketplace" },
    { label: "Events",             href: "/events" },
  ],
  Community: [
    { label: "About Us",          href: "/about" },
    { label: "Become a Member",   href: "/join" },
    { label: "List Your Business",href: "/join" },
    { label: "Submit an Event",   href: "/dashboard/events" },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact Us",       href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto relative overflow-hidden" style={{ background: "#1E1B4B" }}>

      {/* Purple horizontal rule accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

      {/* Subtle ambient glow */}
      <div
        className="absolute -top-40 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <span className="text-purple-300 font-serif font-bold text-lg">W</span>
              </div>
              <div>
                <span className="block font-serif font-bold text-xl text-lavender-100 leading-tight">
                  Women of Wisdom
                </span>
                <span className="text-xs text-purple-400 uppercase tracking-widest font-semibold">
                  WOW Community
                </span>
              </div>
            </Link>
            <p className="text-violet-200 text-sm leading-relaxed max-w-xs">
              A premium membership community connecting women professionals, entrepreneurs, and changemakers to grow, collaborate, and thrive.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" aria-label="Instagram" className="p-2.5 rounded-xl bg-violet-800 hover:bg-violet-700 border border-violet-600 hover:border-purple-500/40 transition-all duration-200">
                <ExternalLink className="h-4 w-4 text-violet-200" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2.5 rounded-xl bg-violet-800 hover:bg-violet-700 border border-violet-600 hover:border-purple-500/40 transition-all duration-200">
                <ExternalLink className="h-4 w-4 text-violet-200" />
              </a>
              <a href="mailto:hello@womenofwisdom.com" className="p-2.5 rounded-xl bg-violet-800 hover:bg-violet-700 border border-violet-600 hover:border-purple-500/40 transition-all duration-200">
                <Mail className="h-4 w-4 text-violet-200" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4" style={{ letterSpacing: "0.14em" }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-violet-200 hover:text-purple-300 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-violet-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-violet-300">
            © {new Date().getFullYear()} Women of Wisdom. All rights reserved.
          </p>
          <p className="text-xs text-violet-300">
            Empowering women to connect, grow, and thrive.
          </p>
        </div>
      </div>
    </footer>
  );
}
