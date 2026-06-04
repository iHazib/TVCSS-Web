import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDownRight, Check, ShieldAlert } from "lucide-react";

export default function TicketContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [campus, setCampus] = useState("");
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState("both");
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketCode, setTicketCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setTicketCode(`CS-${randomId}-TX`);
    setIsRegistered(true);
  };

  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 md:px-12 bg-brand-dark flex flex-col justify-center items-center relative overflow-hidden" id="register-section">
      {/* Section Header */}
      <div className="w-full max-w-5xl mb-8 md:mb-12 flex justify-between items-end border-b border-white/20 pb-4">
        <h2 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase text-white leading-none">Register_</h2>
        <p className="font-mono text-xs uppercase text-brand-green tracking-widest hidden sm:block">[ Code-Storm 2026 Portal ]</p>
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-brand-green/10 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 5 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-5xl flex flex-col lg:flex-row bg-[#e8e8eb] text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Paper Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

        {/* Left Stub - Vertical Text */}
        <div className="w-full lg:w-12 bg-[#d1d1d6] flex lg:flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-zinc-400 p-3 lg:py-6 relative z-10 shrink-0">
          <div className="lg:-rotate-90 whitespace-nowrap font-mono text-[9px] tracking-[0.2em] text-zinc-600 uppercase font-bold">
            SYS/CODE_STORM/2026
          </div>
          <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center transform lg:rotate-0 -rotate-90">
            <span className="text-brand-green text-[10px]">▶</span>
          </div>
        </div>

        {/* Middle Body - Ticket Info */}
        <div className="flex-[2] p-5 sm:p-10 relative overflow-hidden flex flex-col justify-between">
          {/* Neon geometric SVG overlay */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden mix-blend-normal z-0 opacity-[0.03]">
            <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,280 L150,280 L200,200 L350,200 L400,300 L550,300 L600,220 L850,220" stroke="#39FF14" strokeWidth="24" fill="none" strokeLinejoin="miter" strokeLinecap="square" />
              <path d="M-50,180 L100,180 L150,100 L250,100 L300,220 L400,220 L450,150 L850,150" stroke="#39FF14" strokeWidth="12" fill="none" strokeLinejoin="miter" strokeLinecap="square" opacity="0.8" />
            </svg>
          </div>

          {/* Header Row */}
          <div className="relative z-10 flex justify-between items-start mb-5 sm:mb-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">EVENT PROFORMA</span>
            <div className="bg-zinc-900 text-white text-[10px] sm:text-xs font-mono px-2 sm:px-3 py-1 uppercase tracking-[0.2em] shrink-0 ml-2">
              ANNEXURE A // DSU DCK
            </div>
          </div>

          {/* Event Name & Core details */}
          <div className="relative z-10 mb-6 sm:mb-8">
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl leading-none uppercase tracking-tight text-zinc-900">CODE-STORM</h2>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-zinc-700 leading-none uppercase tracking-tight mt-1">2026 // HACKATHON</h3>

            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono uppercase font-bold tracking-widest">
              <span className="bg-[#39FF14] text-zinc-900 px-2.5 py-1 border border-zinc-400">DSU DHAC CAMPUS</span>
              <span className="bg-zinc-900 text-white px-2.5 py-1">JUNE 10, 11, & 15</span>
              <span className="bg-zinc-200 text-zinc-700 px-2.5 py-1 border border-zinc-300">FEE: PKR 500</span>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="relative z-10 border-t border-b border-zinc-400 py-4 font-mono text-[10px] sm:text-xs space-y-3 mb-5 sm:mb-6">
            <p className="font-bold text-zinc-900 tracking-wider">[ EVENT ITINERARY ]</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border-l-2 border-zinc-900 pl-2">
                <span className="block font-bold text-zinc-900">DAY 01 (WED) // 10 JUNE</span>
                <span className="block text-zinc-700 font-bold text-[10px]">12:00 PM - 01:30 PM</span>
                <span className="block mt-1 font-semibold text-zinc-900 leading-tight">Seminar & Orientation Session</span>
                <span className="block text-[9px] text-zinc-800 mt-1 leading-snug">Intro to Code-Storm, industry briefing, innovation awareness. Guest online session.</span>
              </div>
              <div className="border-l-2 border-zinc-900 pl-2">
                <span className="block font-bold text-zinc-900">DAY 02 (THU) // 11 JUNE</span>
                <span className="block text-zinc-700 font-bold text-[10px]">12:00 PM - 01:30 PM</span>
                <span className="block mt-1 font-semibold text-zinc-900 leading-tight">Hackathon - Track 1</span>
                <span className="block text-[9px] text-zinc-800 mt-1 leading-snug">Team registrations, problem statement briefing, planning, ideation & development.</span>
              </div>
              <div className="border-l-2 border-zinc-900 pl-2">
                <span className="block font-bold text-zinc-900">DAY 03 (MON) // 15 JUNE</span>
                <span className="block text-zinc-700 font-bold text-[10px]">12:00 PM - 02:30 PM</span>
                <span className="block mt-1 font-semibold text-zinc-900 leading-tight">Track 2 & Showcase</span>
                <span className="block text-[9px] text-zinc-800 mt-1 leading-snug">Project completion, final judging presentations, winner announcement & prize ceremony.</span>
              </div>
            </div>
          </div>

          {/* Objectives & Deliverables Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] text-zinc-800 uppercase mb-6 sm:mb-8">
            <div>
              <p className="font-bold text-zinc-900 tracking-wider">[ EXPECTED OUTCOMES ]</p>
              <ul className="list-disc pl-4 space-y-1 mt-1.5 leading-relaxed">
                <li>Promote student innovation and creativity</li>
                <li>Encourage practical teamwork & engineering</li>
                <li>Provide exposure to industry technologies</li>
                <li>Networking between students and tech professionals</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-zinc-900 tracking-wider">[ DELIVERABLES ]</p>
              <ul className="list-disc pl-4 space-y-1 mt-1.5 leading-relaxed">
                <li>Cash Prizes for top-performing teams</li>
                <li>Winner and Runner-Up Certificates of achievement</li>
                <li>Participation Certificates for all attendees</li>
                <li>Practical hands-on software development experience</li>
              </ul>
            </div>
          </div>

          {/* Footer Row */}
          <div className="relative z-10 flex flex-wrap justify-between items-end w-full border-t border-zinc-400 pt-4 gap-3 sm:gap-4">
            <div>
              <p className="font-display text-xl sm:text-2xl leading-none">SYS.V2.0</p>
              <p className="font-mono text-[9px] uppercase font-bold mt-1 tracking-widest text-zinc-500">BATCH 25-26 // HACK</p>
            </div>
            <div className="text-right font-mono text-[9px] uppercase leading-tight font-bold text-zinc-500 hidden sm:block tracking-widest">
              <p>DHA SUFFA UNIVERSITY</p>
              <p>CAMPUS NETWORK ACCESS</p>
              <p>TVCSS SECURED REGISTRATION</p>
            </div>
            <div className="text-right font-mono text-[10px] uppercase leading-tight font-bold text-zinc-800 tracking-widest">
              <p>24.9628° N</p>
              <p>67.0421° E</p>
            </div>
          </div>
        </div>

        {/* Right Form Area (The "Tear-off" Stub) */}
        <div className="flex-[1] min-w-0 lg:min-w-[340px] border-t lg:border-t-0 lg:border-l-[3px] border-dotted border-zinc-400 p-5 sm:p-8 flex flex-col relative bg-[#f4f4f6]">
          {/* Glassy Corner Overlay */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/80 to-black/5 backdrop-blur-md border-b border-l border-white/60 shadow-[-8px_8px_16px_rgba(0,0,0,0.08)] rounded-bl-[2rem] z-20 hidden lg:flex items-start justify-end p-4 pointer-events-none">
            <ArrowDownRight strokeWidth={2.5} className="text-zinc-600 w-5 h-5" />
          </div>

          <div className="mb-5 sm:mb-6">
            <div className="font-mono text-[9px] sm:text-[10px] uppercase font-bold leading-tight w-3/4 text-zinc-500 tracking-wider">
              TICKET REF<br />
              C-STORM/REG/2026
            </div>
            <div className="mt-3 inline-block font-mono text-xs uppercase font-bold tracking-widest bg-zinc-900 text-[#39FF14] px-2.5 py-1">
              ENTRY FEE: 500 PKR
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isRegistered ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3.5 relative z-10 w-full mb-auto"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col sm:flex-row sm:items-end group gap-1 sm:gap-0">
                  <label className="font-mono text-[10px] sm:text-xs uppercase font-bold sm:mr-3 text-zinc-700 whitespace-nowrap sm:pb-1">NAME:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="flex-1 min-w-0 bg-transparent border-0 border-b-[2px] border-dotted border-zinc-400 focus:border-zinc-800 outline-none font-mono text-sm uppercase pb-1 transition-colors group-hover:border-zinc-600 text-zinc-900 rounded-none w-full placeholder:text-zinc-300 placeholder:normal-case"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end group gap-1 sm:gap-0">
                  <label className="font-mono text-[10px] sm:text-xs uppercase font-bold sm:mr-3 text-zinc-700 whitespace-nowrap sm:pb-1">EMAIL:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="flex-1 min-w-0 bg-transparent border-0 border-b-[2px] border-dotted border-zinc-400 focus:border-zinc-800 outline-none font-mono text-sm uppercase pb-1 transition-colors group-hover:border-zinc-600 text-zinc-900 rounded-none w-full placeholder:text-zinc-300 placeholder:normal-case"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end group gap-1 sm:gap-0">
                  <label className="font-mono text-[10px] sm:text-xs uppercase font-bold sm:mr-3 text-zinc-700 whitespace-nowrap sm:pb-1">TEAM NAME:</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Team name (Optional)"
                    className="flex-1 min-w-0 bg-transparent border-0 border-b-[2px] border-dotted border-zinc-400 focus:border-zinc-800 outline-none font-mono text-sm uppercase pb-1 transition-colors group-hover:border-zinc-600 text-zinc-900 rounded-none w-full placeholder:text-zinc-300 placeholder:normal-case"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end group gap-1 sm:gap-0">
                  <label className="font-mono text-[10px] sm:text-xs uppercase font-bold sm:mr-3 text-zinc-700 whitespace-nowrap sm:pb-1">STUDENT ID:</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. CS-221041"
                    className="flex-1 min-w-0 bg-transparent border-0 border-b-[2px] border-dotted border-zinc-400 focus:border-zinc-800 outline-none font-mono text-sm uppercase pb-1 transition-colors group-hover:border-zinc-600 text-zinc-900 rounded-none w-full placeholder:text-zinc-300 placeholder:normal-case"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end group gap-1 sm:gap-0">
                  <label className="font-mono text-[10px] sm:text-xs uppercase font-bold sm:mr-3 text-zinc-700 whitespace-nowrap sm:pb-1">CAMPUS:</label>
                  <input
                    type="text"
                    required
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="DSU DCK / Main / Other"
                    className="flex-1 min-w-0 bg-transparent border-0 border-b-[2px] border-dotted border-zinc-400 focus:border-zinc-800 outline-none font-mono text-sm uppercase pb-1 transition-colors group-hover:border-zinc-600 text-zinc-900 rounded-none w-full placeholder:text-zinc-300 placeholder:normal-case"
                  />
                </div>

                <div className="space-y-1.5 pt-1.5">
                  <label className="font-mono text-[10px] sm:text-xs uppercase font-bold text-zinc-700 block">TRACK REGISTRATION:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTrack("both")}
                      className={`font-mono text-[9px] sm:text-[10px] py-2.5 uppercase font-bold tracking-widest border transition-colors ${track === "both" ? "bg-zinc-900 text-[#39FF14] border-zinc-900" : "bg-transparent text-zinc-700 border-zinc-300 hover:border-zinc-500"}`}
                    >
                      Full Event (1+2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrack("seminar")}
                      className={`font-mono text-[9px] sm:text-[10px] py-2.5 uppercase font-bold tracking-widest border transition-colors ${track === "seminar" ? "bg-zinc-900 text-[#39FF14] border-zinc-900" : "bg-transparent text-zinc-700 border-zinc-300 hover:border-zinc-500"}`}
                    >
                      Seminar Only
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full font-mono text-xs sm:text-sm bg-zinc-900 text-[#39FF14] py-3.5 uppercase font-bold hover:bg-[#39FF14] hover:text-zinc-900 transition-colors shadow-lg active:translate-y-px tracking-widest cursor-pointer">
                    Secure Event Pass
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 text-white p-5 rounded-[2px] flex flex-col justify-between items-center text-center font-mono border-2 border-[#39FF14] space-y-6 my-auto"
              >
                <div className="w-12 h-12 rounded-full bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14] border border-[#39FF14]/30 animate-pulse">
                  <Check size={24} />
                </div>

                <div className="space-y-2">
                  <h4 className="text-[#39FF14] font-bold text-sm tracking-wider uppercase">TICKET SECURED</h4>
                  <p className="text-[10px] text-zinc-400 uppercase leading-relaxed">
                    Your pass for Code-Storm 2026 has been generated. Show this stub at the venue to pay & finalize.
                  </p>
                </div>

                <div className="border border-dashed border-zinc-700 bg-black/40 p-3 w-full space-y-1.5 text-center">
                  <span className="text-[9px] text-zinc-500 uppercase block font-bold">GATEPASS CODE:</span>
                  <span className="text-[#39FF14] text-lg font-bold block select-all tracking-wider">{ticketCode}</span>
                  {teamName && (
                    <div className="border-t border-zinc-800 pt-1.5 mt-1.5 text-left">
                      <span className="text-[8px] text-zinc-500 block uppercase font-bold">REGISTERED TEAM:</span>
                      <span className="text-white text-xs block font-bold truncate uppercase">{teamName}</span>
                    </div>
                  )}
                  <span className="text-[8px] text-[#39FF14]/60 uppercase block pt-1 border-t border-zinc-800/40">STATUS: PAY ON ARRIVAL</span>
                </div>

                <div className="w-full flex flex-col gap-2 pt-2">
                  <div className="flex gap-2 items-center text-[9px] text-zinc-400 bg-black/40 p-2 border border-zinc-800 text-left">
                    <ShieldAlert size={16} className="text-brand-orange shrink-0" />
                    <span>MUST PAY 500 PKR REGISTRATION FEE AT BRING-UP FOR ENTRY.</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsRegistered(false);
                      setName("");
                      setEmail("");
                      setStudentId("");
                      setCampus("");
                      setTeamName("");
                    }}
                    className="w-full py-2 bg-zinc-800 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-zinc-700 transition-colors"
                  >
                    Register New Team
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 sm:mt-8 pt-6 border-t border-zinc-300">
            <p className="font-mono text-[8px] uppercase font-bold text-center mb-2 tracking-widest text-zinc-500">EVENT &gt; DATA TRANSMISSION</p>
            {/* Pure CSS Barcode */}
            <div className="h-10 sm:h-12 w-full bg-[repeating-linear-gradient(to_right,#18181b_0,#18181b_2px,transparent_2px,transparent_4px,#18181b_4px,#18181b_5px,transparent_5px,transparent_8px,#18181b_8px,#18181b_12px,transparent_12px,transparent_14px,#18181b_14px,#18181b_18px,transparent_18px,transparent_20px)] opacity-85 mx-auto max-w-[240px]"></div>
            <p className="font-display text-2xl sm:text-3xl text-center mt-3 leading-none text-zinc-900 tracking-wide">TVCSS</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
