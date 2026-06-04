import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About Us", href: "#about", id: "about" },
  { label: "Our Team", href: "#team", id: "team" },
  { label: "Events", href: "#events", id: "events" },
  { label: "Timeline", href: "#timeline", id: "timeline" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = "about";

      // Sort by actual page position so DOM order doesn't affect which wins
      const sections = navLinks
        .map(({ id }) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { id, top: el.getBoundingClientRect().top + scrollY };
        })
        .filter((s): s is { id: string; top: number } => s !== null)
        .sort((a, b) => a.top - b.top);

      for (const { id, top } of sections) {
        if (scrollY >= top - 130) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <nav className="bg-brand-dark/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/tvcss_logo.png"
            alt="TVCSS Logo"
            className="h-7 sm:h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
          <span className="font-display text-xl sm:text-2xl uppercase tracking-wider leading-none translate-y-0.5">TVCSS</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative pb-1 transition-colors duration-200 ${
                  isActive
                    ? "text-brand-green"
                    : "text-brand-light/60 hover:text-brand-light"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-px bg-brand-green"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#register-section"
            className="pixel-btn-glowing"
            onClick={() => setMenuOpen(false)}
          >
            <span className="sm:hidden">Register</span>
            <span className="hidden sm:inline">Register for Hackathon</span>
          </a>

          <button
            className="md:hidden flex items-center justify-center w-9 h-9 border border-white/20 text-brand-light hover:border-brand-green hover:text-brand-green transition-colors shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="bg-brand-dark/98 backdrop-blur-md border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col font-mono text-xs uppercase tracking-widest">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    className={`flex items-center gap-3 px-6 py-4 border-b border-white/5 transition-colors ${
                      isActive
                        ? "text-brand-green bg-brand-green/5"
                        : "text-brand-light/60 hover:text-brand-light hover:bg-white/5"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={`text-[8px] ${isActive ? "text-brand-green" : "text-white/20"}`}>
                      {isActive ? "▶" : "·"}
                    </span>
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
