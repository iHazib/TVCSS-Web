import { motion } from "motion/react";

export default function MarqueeSection() {
  const textBlocks = [
    "TECH VISIONARY",
    "//",
    "COMPUTER SCIENCE SOCIETY",
    "//",
    "DHA SUFFA UNIVERSITY",
    "//",
    "FUTURE INNOVATORS",
    "//"
  ];

  const fullText = Array(4).fill(textBlocks).flat();

  return (
    <div className="bg-brand-green text-brand-dark py-2 sm:py-3 border-y border-brand-dark relative flex overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {fullText.map((text, i) => (
          <div
            key={i}
            className="flex items-center justify-center font-display text-xl sm:text-3xl md:text-4xl uppercase tracking-wide mx-2 sm:mx-4"
          >
            {text}
          </div>
        ))}
      </div>

      {/* Second block for seamless looping */}
      <div className="flex whitespace-nowrap animate-marquee w-max absolute top-2 sm:top-3">
        {fullText.map((text, i) => (
          <div
            key={`clone-${i}`}
            className="flex items-center justify-center font-display text-xl sm:text-3xl md:text-4xl uppercase tracking-wide mx-2 sm:mx-4"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
