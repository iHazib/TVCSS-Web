import { motion } from "motion/react";
import { Instagram } from "lucide-react";

// ── Discord icon ──────────────────────────────────────────────────────────────
function DiscordIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.012.043.027.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function HeroGrid() {

  return (
    <section id="about" className="flex flex-col border-b border-white/20 md:min-h-[calc(100vh-80px)]">

      {/* ── STATUS BAR ─────────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-white/20 px-4 sm:px-6 py-2 flex items-center justify-between bg-white/[0.02] font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
        <div className="flex items-center gap-2 text-brand-green shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          <span>LIVE</span>
        </div>
        <span className="text-white/20 hidden sm:block truncate mx-6">
          ROOT@TVCSS:~#&nbsp;./init_society.sh
          <span className="hero-cursor text-brand-green/60 ml-1">█</span>
        </span>
        <div className="flex gap-3 items-center text-white/30 shrink-0">
          <span className="hidden md:block">DSU-DCK&nbsp;[01]</span>
          <span className="text-brand-orange">CS:2025-26</span>
        </div>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0">

        {/* ══════════════════════════════════════════════════
            TOP ROW  ·  spans full width on desktop
            ══════════════════════════════════════════════════ */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 border-b border-white/20">

          {/* ── TECH cell – orange bg ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="md:col-span-5 bg-brand-orange relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-black/15 group min-h-[42vw] sm:min-h-[34vw] md:min-h-0"
          >
            {/* Pixel decorations */}
            <motion.div animate={{ y: [0,-10,0], rotate:[0,8,0] }} transition={{ repeat:Infinity, duration:3.2, ease:"easeInOut" }}
              className="absolute top-6 right-10 w-5 h-5 bg-brand-dark/20" />
            <motion.div animate={{ y: [0,8,0] }} transition={{ repeat:Infinity, duration:2.6, ease:"easeInOut", delay:0.8 }}
              className="absolute bottom-14 right-6 w-3 h-3 bg-brand-dark/15" />
            <motion.div animate={{ y: [0,-6,0] }} transition={{ repeat:Infinity, duration:4, ease:"easeInOut", delay:1.4 }}
              className="absolute top-1/2 right-16 w-2 h-2 bg-brand-dark/10" />

            {/* Corner node */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-brand-dark/20 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-2 border-brand-dark/30 -translate-x-1/2 translate-y-1/2" />

            <p className="font-mono text-[8px] sm:text-[9px] text-brand-dark/50 uppercase tracking-widest">
              [ Empowering Innovators ]
            </p>

            <h1 className="font-display text-[22vw] sm:text-[15vw] md:text-[10.5vw] leading-[0.82] uppercase text-brand-dark select-none">
              TECH
            </h1>
          </motion.div>

          {/* ── VISIONARY cell – dark bg, multi-color letters ─ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="md:col-span-7 bg-brand-dark relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10 group min-h-[42vw] sm:min-h-[34vw] md:min-h-0"
          >
            <div className="bg-grid-pattern absolute inset-0 opacity-15 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30">
              <span>DSU DCK [2025-26]</span>
              <span>Computer Science [01]</span>
            </div>

            {/* Letter-by-letter coloured "VISIONARY" */}
            <h1 className="relative z-10 font-display text-[22vw] sm:text-[15vw] md:text-[10.5vw] leading-[0.82] uppercase text-right flex flex-row-reverse flex-wrap-reverse justify-start gap-0 select-none">
              {"VISIONARY".split("").reverse().map((letter, ri) => {
                const i = 8 - ri; // forward index
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.045, ease: "easeOut" }}
                    style={{ color: "#67e8f9" }}
                    className="hover:scale-110 transition-transform duration-150 inline-block"
                  >
                    {letter}
                  </motion.span>
                );
              })}
            </h1>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════
            BOTTOM ROW
            ══════════════════════════════════════════════════ */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 flex-1">

          {/* ── Left: Society intro + announcement + countdown ─ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-7 border-b md:border-b-0 md:border-r border-white/20 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-7 md:gap-6 relative overflow-hidden"
          >
            <div className="bg-grid-pattern absolute inset-0 opacity-15 pointer-events-none" />
            {/* Glow blobs */}
            <div className="absolute bottom-0 left-0 w-64 h-48 bg-brand-orange/5 blur-[70px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-cyan/5 blur-[70px] pointer-events-none" />

            {/* — Society intro — */}
            <div className="relative z-10 space-y-2">
              <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest" style={{ color: "#67e8f9" }}>
                [ About Us ]
              </p>
              <p className="font-sans text-sm sm:text-[0.95rem] md:text-base text-brand-light/75 leading-relaxed max-w-lg">
                TVCSS is DHA Suffa University's premier{" "}
                <span style={{ color: "#fcd34d" }} className="font-semibold">Computer Science Society</span>
                {" "}— forging the next generation of tech leaders through hackathons,
                seminars, and real-world{" "}
                <span style={{ color: "#67e8f9" }} className="font-semibold">industry connections</span>.
              </p>
            </div>

            {/* — Announcement — */}
            <div className="relative z-10">
              <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-brand-orange/80 mb-2">
                [ Flagship Event · Announcing ]
              </p>
              <div className="font-display leading-[0.82] uppercase">
                <span
                  className="hero-glitch text-[11vw] sm:text-[8vw] md:text-[5.5vw] inline"
                  style={{ color: "#fcd34d" }}
                  data-text="CODE"
                >
                  CODE
                </span>
                <span
                  className="hero-glitch text-[11vw] sm:text-[8vw] md:text-[5.5vw] inline ml-[0.12em]"
                  style={{ color: "#67e8f9" }}
                  data-text="STORM"
                >
                  STORM
                </span>
                <span className="text-[6vw] sm:text-[4.5vw] md:text-[3vw] text-white/20 inline ml-[0.15em]">
                  2026
                </span>
              </div>
              <p className="font-mono text-[8px] sm:text-[9px] text-white/35 uppercase mt-1.5 tracking-wider">
                Jun&nbsp;10&nbsp;·&nbsp;11&nbsp;·&nbsp;15&nbsp;&nbsp;//&nbsp;&nbsp;DSU DCK Campus&nbsp;&nbsp;//&nbsp;&nbsp;PKR&nbsp;500
              </p>
            </div>

            {/* — Hackathon Tomorrow Banner — */}
            <div className="relative z-10">
              <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-white/25 mb-3">
                [ Status Update ]
              </p>
              <div className="border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <p
                  className="font-display text-2xl sm:text-3xl md:text-4xl uppercase leading-none"
                  style={{ color: "#fcd34d", textShadow: "0 0 24px rgba(252,211,77,0.4)" }}
                >
                  Hackathon Starts Tomorrow
                </p>
                <p className="font-mono text-[8px] sm:text-[9px] text-white/45 uppercase tracking-wide">
                  Be updated here — join our Discord for live announcements
                </p>
                <a
                  href="https://discord.gg/4SgeVFN9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[9px] sm:text-xs uppercase font-bold px-4 py-2.5 transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "#5865F2", color: "#fff" }}
                >
                  <DiscordIcon size={14} />
                  <span>Join Discord for Updates</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* ── Right: CTA – yellow bg ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-5 bg-brand-yellow relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 md:p-10"
          >
            {/* Decorative pixel squares */}
            <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }}
              className="absolute top-8 right-8 w-4 h-4 bg-brand-dark/15" />
            <motion.div animate={{ y:[0,6,0] }} transition={{ repeat:Infinity, duration:2.4, ease:"easeInOut", delay:1 }}
              className="absolute bottom-20 right-14 w-3 h-3 bg-brand-dark/10" />

            {/* Corner node */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-brand-dark/20 translate-x-1/2 -translate-y-1/2" />

            <div>
              <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-brand-dark/45">
                [ Registration Open ]
              </p>

              <h2 className="font-display text-[13vw] sm:text-[9vw] md:text-[6.5vw] leading-[0.82] uppercase text-brand-dark mt-3">
                Join<br />The<br />Storm
              </h2>
            </div>

            <div className="space-y-5">
              <ul className="font-mono text-[8px] sm:text-[9px] uppercase text-brand-dark/55 space-y-1.5 tracking-wider">
                <li>→ 3-Day Hackathon Event</li>
                <li>→ Seminar + Competition</li>
                <li>→ Open to All Students</li>
                <li className="text-brand-dark font-bold">→ Entry: PKR 500</li>
              </ul>

              {/* Dark CTA button on yellow bg */}
              <a
                href="#register-section"
                className="flex items-center justify-between w-full bg-brand-dark text-brand-yellow font-mono text-xs uppercase font-bold py-3.5 px-5 hover:bg-brand-orange hover:text-brand-dark transition-colors duration-200"
              >
                <span>Secure Your Pass</span>
                <span>[↗]</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/tvcss_dsu_dck/"
                target="_blank"
                rel="noopener noreferrer"
                className="insta-btn group"
              >
                <span className="flex items-center gap-2">
                  <Instagram size={13} className="group-hover:scale-110 transition-transform duration-150" />
                  Follow on Instagram
                </span>
                <span>@tvcss_dsu_dck</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
