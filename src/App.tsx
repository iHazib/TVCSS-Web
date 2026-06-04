import { motion } from "motion/react";
import Navbar from "./components/Navbar";
import HeroGrid from "./components/HeroGrid";
import MarqueeSection from "./components/MarqueeSection";
import LabCards from "./components/LabCards";
import TeamSection from "./components/TeamSection";
import TimelineSection from "./components/TimelineSection";
import TicketContact from "./components/TicketContact";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark font-sans text-brand-light antialiased selection:bg-brand-green selection:text-brand-dark">
      <CustomCursor />
      <Navbar />
      
      <main className="pt-20"> {/* Offset for absolutely positioned navbar */}
        <HeroGrid />
        
        {/* Massive ON BOARD Background Type Section */}
        <section id="team" className="py-12 md:py-24 overflow-hidden relative">
            <h2 className="font-display text-[25vw] leading-[0.75] uppercase text-brand-green opacity-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none z-0">
               ON
            </h2>
            <div className="relative z-10 w-full">
               <TeamSection />
            </div>
            <h2 className="font-display text-[25vw] leading-[0.75] uppercase text-brand-green opacity-90 text-center mt-8 pointer-events-none relative z-10">
               BOARD
            </h2>
        </section>

        <MarqueeSection />

        <LabCards />
        
        <TimelineSection />

        <TicketContact />

        {/* Footer */}
        <footer className="py-10 md:py-16 border-t border-white/10 text-center font-mono text-xs opacity-70 flex flex-col items-center gap-4 bg-black/30">
            <img 
              src="/tvcss_logo.png" 
              alt="TVCSS Logo" 
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-300"
            />
            <p className="tracking-widest uppercase max-w-2xl px-6 leading-relaxed">
              CR 2026 // TECH VISIONARY COMPUTER SCIENCE SOCIETY - DHA SUFFA UNIVERSITY DCK
            </p>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">
              [ SHAPING THE FUTURE OF COMPUTING ]
            </p>
        </footer>
      </main>
    </div>
  );
}
