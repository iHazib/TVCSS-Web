import { motion } from "motion/react";

const timelineData = [
  {
    id: "ORIENT_01",
    year: "Q1 2025",
    sysPath: "A:\\TVCSS\\INDUCTION.EXE",
    title: "Society Orientation",
    desc: "> INDUCTION OF NEW MEMBERS. INTRODUCING CORE VISIONS, COMMITTEES, AND UPCOMING ROADMAP FOR FUTURE CS LEADERS.",
    bgClass: "bg-brand-orange",
    borderClass: "border-brand-orange",
    textClass: "text-brand-orange",
    progress: "██████████",
  },
  {
    id: "SEM_LINUX",
    year: "DEC 22",
    sysPath: "C:\\TECH\\EMBEDDED.BAT",
    title: "Linux Systems",
    desc: "> DEEP DIVE INTO KERNEL & BOOT PROCESSES. FROM BOOT TO PRODUCTION-READY EMBEDDED PLATFORMS WITH RIZWAN FAZAL.",
    bgClass: "bg-brand-cyan",
    borderClass: "border-brand-cyan",
    textClass: "text-brand-cyan",
    progress: "████████░░",
  },
  {
    id: "ECO_EARTH",
    year: "APR 2026",
    sysPath: "C:\\ECO\\EARTH_DAY.SYS",
    title: "Earth Day",
    desc: "> ECO-THEMED SPATIAL ACTIVITIES AT DCK CAMPUS. PLANTATION DRIVES, RECYCLED MATERIALS WORKSHOPS, AND PHOTO BOOTHS.",
    bgClass: "bg-brand-pink",
    borderClass: "border-brand-pink",
    textClass: "text-brand-pink",
    progress: "████░░░░░░",
  },
  {
    id: "C_STORM_26",
    year: "JUNE 10-15",
    sysPath: "ROOT@TVCSS:~# ./CODE_STORM.SH",
    title: "Code-Storm 2026",
    desc: "> flagship 3-day event at dsu dck campus. day 1 (10 june): seminar & orientation. day 2 (11 june): hackathon track 1. day 3 (15 june): showcase & winner ceremony.",
    bgClass: "bg-brand-green",
    borderClass: "border-brand-green",
    textClass: "text-brand-green",
    progress: "▓▓▓▓▓░░░░░",
  },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="py-16 md:py-32 px-4 sm:px-6 md:px-12 bg-black relative overflow-hidden border-b-[3px] border-white">
      {/* Intense CRT Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0))] bg-[length:100%_4px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[3px] border-white pb-4 mb-12 md:mb-24 relative gap-3 md:gap-4">
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase text-white leading-none tracking-tight">Timeline.Exe</h2>
          <div className="bg-white text-black font-mono text-xs uppercase tracking-widest px-3 py-1 font-bold shrink-0">
            [ STATUS: EXECUTING ]
          </div>
          {/* Retro sizing squares */}
          <div className="absolute bottom-0 right-0 flex pointer-events-none translate-y-full pt-1">
            <div className="w-3 h-3 border-2 border-white mr-1"></div>
            <div className="w-3 h-3 bg-white"></div>
          </div>
        </div>

        <div className="relative">
          {/* Rigid Dotted Timeline */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-px border-l-[3px] border-dotted border-white/40 md:-translate-x-[1.5px]"></div>

          {timelineData.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={item.id} className="relative w-full mb-10 md:mb-32 group">

                {/* Node Square */}
                <div
                  className={`absolute left-4 sm:left-6 md:left-1/2 top-4 md:top-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-black border-[3px] border-white transform -translate-x-[9px] sm:-translate-x-[11px] md:-translate-x-[11px] md:-translate-y-1/2 z-20 group-hover:${item.bgClass} transition-none`}
                ></div>

                <div className={`flex flex-col md:flex-row w-full items-start md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} pl-10 sm:pl-16 md:pl-0`}>

                  {/* Left/Right Label Half — desktop only */}
                  <div className={`hidden md:flex w-1/2 flex-col justify-center ${isEven ? 'pr-20 items-end' : 'pl-20 items-start'}`}>
                    <span className={`font-mono text-xl md:text-3xl font-bold uppercase ${item.textClass} tracking-widest`}>
                      &gt; {item.year}
                    </span>
                    <span className="font-mono text-xs text-white/50 uppercase mt-2 text-right max-w-[200px] break-all">
                      {item.sysPath}
                    </span>
                  </div>

                  {/* Mobile year label */}
                  <div className="md:hidden mb-2">
                    <span className={`font-mono text-sm font-bold uppercase ${item.textClass} tracking-widest`}>
                      &gt; {item.year}
                    </span>
                  </div>

                  {/* Retro Window Card */}
                  <div className={`w-full md:w-1/2 mt-0 md:mt-0 ${isEven ? 'md:pl-20' : 'md:pr-20'} relative`}>

                    {/* Hard shadow behind box */}
                    <div className={`absolute inset-0 bg-white translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 pointer-events-none group-hover:${item.bgClass} transition-colors duration-0`}></div>

                    <div className="border-[3px] border-white bg-black relative z-10 flex flex-col h-full">

                      {/* Title Bar */}
                      <div className="border-b-[3px] border-white bg-white text-black flex justify-between items-center px-3 py-2">
                        <div className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="w-3 h-4 bg-black inline-block shrink-0"></span>
                          <span className="truncate">{item.id}</span>
                        </div>
                        <div className="flex gap-1.5 cursor-pointer shrink-0">
                          <div className="w-4 h-4 border-2 border-black flex items-center justify-center font-mono text-[10px] font-bold">_</div>
                          <div className="w-4 h-4 border-2 border-black flex items-center justify-center font-mono text-[10px] font-bold">□</div>
                          <div className="w-4 h-4 border-2 border-black flex items-center justify-center font-mono text-[10px] items-start pt-[1px] font-bold hover:bg-black hover:text-white">x</div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5 md:p-6 flex flex-col gap-3 md:gap-4">
                        <div className="font-mono text-[10px] sm:text-xs uppercase text-white font-bold opacity-60 break-all">
                          {item.sysPath}
                        </div>

                        <h4 className={`font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight ${item.textClass}`}>
                          {item.title}
                        </h4>

                        <p className="font-mono text-[10px] sm:text-xs text-brand-light uppercase leading-loose mt-1">
                          {item.desc}
                          <span className={`inline-block w-2.5 h-4 ml-1 align-middle animate-pulse ${item.bgClass}`}></span>
                        </p>

                        <div className="mt-4 pt-4 border-t-[3px] border-dotted border-white/30 flex justify-between items-end">
                          <div className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
                            STATUS: [ OK ]
                          </div>
                          <div className={`font-mono text-xs sm:text-sm tracking-[0.2em] ${item.textClass}`}>
                            [{item.progress}]
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
