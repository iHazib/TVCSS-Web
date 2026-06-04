import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface CardProps {
  title: string;
  subtitle: string;
  expId: string;
  date: string;
  bgConfig: string;
  textColor: string;
  images: string[];
  pixelClasses: string[];
}

function PixelCard({ title, subtitle, expId, date, bgConfig, textColor, images, pixelClasses }: CardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const tick = setInterval(() => {
      if (!paused.current) {
        setCurrentIdx(i => (i + 1) % images.length);
      }
    }, 3000);
    return () => clearInterval(tick);
  }, [images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative group h-[420px] sm:h-[500px] flex flex-col border border-white/20 rounded overflow-hidden"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* Decorative floating pixels */}
      {pixelClasses.map((cls, idx) => (
        <div key={idx} className={`absolute w-4 h-4 z-20 ${cls}`}></div>
      ))}

      {/* Image area */}
      <div className="flex-1 relative overflow-hidden bg-brand-dark group-hover:scale-105 transition-transform duration-700 origin-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-10"></div>

        {/* All images stacked — CSS opacity crossfade */}
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${title} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover grayscale brightness-110 contrast-105 transition-opacity duration-700 ${i === currentIdx ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {/* Dot indicators — only when multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className={`h-[170px] sm:h-[200px] ${bgConfig} flex flex-col justify-end p-4 sm:p-6 relative border-t border-white/20`}>

        {/* Pixel step decorations */}
        <div className={`absolute top-0 right-8 w-6 h-6 -mt-6 ${bgConfig}`}></div>
        <div className={`absolute top-0 right-16 w-4 h-4 -mt-4 ${bgConfig}`}></div>
        <div className="absolute top-0 right-4 w-4 h-4 bg-brand-dark -mt-10 border border-white/20"></div>
        <div className={`absolute top-0 left-4 w-6 h-6 -mt-6 ${bgConfig}`}></div>

        <div className={`flex gap-2 items-center mb-3 font-mono text-[10px] bg-brand-dark/20 w-fit px-2 py-1 uppercase ${textColor}`}>
          <span>{expId}</span>
          <span>|</span>
          <span>{date}</span>
        </div>

        <div className={`border-b border-brand-dark/20 pb-1.5 mb-1.5 ${textColor}`}>
          <h3 className="font-display text-3xl sm:text-4xl uppercase leading-none tracking-tight">{title}</h3>
        </div>
        <p className={`font-mono text-[10px] uppercase max-w-[90%] leading-tight ${textColor}`}>{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function LabCards() {
  return (
    <section id="events" className="py-16 md:py-32 px-6 md:px-12 relative overflow-hidden bg-brand-dark border-b border-white/20">

      {/* Floating background pixels */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-8 h-8 bg-brand-cyan md:block hidden"
      ></motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-20 w-6 h-6 bg-brand-pink"
      ></motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-1/3 w-4 h-4 bg-brand-yellow"
      ></motion.div>
      <div className="absolute top-32 left-1/2 text-9xl font-display text-white/[0.02] uppercase pointer-events-none tracking-[2rem] text-center w-full -translate-x-1/2">Events</div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 relative z-10 w-full">
          <h2 className="font-display text-5xl md:text-8xl flex flex-col leading-[0.8] uppercase">
            <span className="text-white/40">Recent</span>
            <span>Events</span>
          </h2>
          <p className="font-mono text-xs max-w-xs text-brand-light/60 mt-4 md:mt-0 uppercase md:text-right">
            Seminars, activities, and celebrations by TVCSS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <PixelCard
            title="Embedded Linux"
            subtitle="From system boot to production-ready platforms with IoT Consultant Rizwan Fazal."
            expId="SEM_01"
            date="22 DEC 2025"
            bgConfig="bg-brand-yellow"
            textColor="text-brand-dark"
            images={[
              "/events_images/seminar_1.jpg",
              "/events_images/seminar_2.jpg",
            ]}
            pixelClasses={[
              "bg-brand-yellow top-1/4 -left-2",
              "bg-brand-yellow top-1/3 left-8",
              "bg-brand-yellow bottom-1/2 right-4",
            ]}
          />
          <PixelCard
            title="Earth Day 2026"
            subtitle="Plantation and green activities. Engaging tech students in eco-themed preservation."
            expId="EVT_01"
            date="22 APR 2026"
            bgConfig="bg-brand-pink"
            textColor="text-brand-dark"
            images={["/events_images/earth_day.webp"]}
            pixelClasses={[
              "bg-brand-pink top-10 right-4 w-3 h-3",
              "bg-brand-pink top-1/2 left-2 w-5 h-5",
              "bg-brand-light top-3/4 right-8",
            ]}
          />
          <PixelCard
            title="Honoring Leaders"
            subtitle="Celebrating success and honoring the leadership of the TVCSS board."
            expId="CER_01"
            date="TENURE 25-26"
            bgConfig="bg-brand-cyan"
            textColor="text-brand-dark"
            images={["/events_images/honoring_leaders.jpg"]}
            pixelClasses={[
              "bg-brand-cyan top-1/3 right-0",
              "bg-brand-light top-2/3 left-6",
              "bg-brand-cyan bottom-20 -left-3",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
