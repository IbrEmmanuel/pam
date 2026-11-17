"use client";
import React, { useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

type Props = {
  // 1st tile (logo / brand panel) – two variants
  firstA: string;
  firstB: string;
  second: string;
  thirdA: string;
  thirdB: string;
  fourthMobile: string;

  // Optional logo wordmark (white on [#000000]) shown on the first tile
  pamMark?: React.ReactNode;
};

export default function PAMGalleryScroller({
  firstA,
  firstB,
  second,
  thirdA,
  thirdB,
  fourthMobile,
  pamMark,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"], // 0 at section top, 1 after pinned area
  });

  // step = 0 in the first half, 1 in the second half of the pinned range
  const step = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  // Image sources keyed by step
  const firstSrc = useMemo(
    () => (step.get() < 0.5 ? firstA : firstB),
    [step, firstA, firstB]
  );
  const thirdSrc = useMemo(
    () => (step.get() < 0.5 ? thirdA : thirdB),
    [step, thirdA, thirdB]
  );

  // Crossfade variants
  const fade = {
    initial: { opacity: 0, scale: 1.02, filter: "blur(6px)" },
    enter: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      filter: "blur(6px)",
      transition: { duration: 0.4 },
    },
  };

  return (
    <section ref={sectionRef} className="relative">
      {/* Sticky viewport that holds the gallery while we scrub the step */}
      <div className="sticky top-0  flex items-center justify-center ">
        {/* Max width wrapper */}
        <div className="w-full ">
          <div className="grid grid-cols-2 md:grid-cols-3 ">
            {/* 1) FIRST TILE (changes on scroll) */}
            <div className="relative aspect-[1/1] md:aspect-[1/1] overflow-hidden bg-neutral-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={firstSrc}
                  src={firstSrc}
                  alt="Tile 1"
                  className="absolute inset-0 h-full w-full object-cover"
                  variants={fade}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                />
              </AnimatePresence>
            </div>

            {/* 2) SECOND TILE (static) */}
            <div className="relative aspect-[1/1] md:aspect-[1/1] overflow-hidden border-l border-r border-gray-500">
              <img
                src={second}
                alt="Tile 2"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* 3) THIRD TILE (changes on scroll) */}
            <div className="relative aspect-[3/4] md:aspect-[1/1] overflow-hidden ">
              <AnimatePresence mode="wait">
                <motion.img
                  key={thirdSrc}
                  src={thirdSrc}
                  alt="Tile 3"
                  className="absolute inset-0 h-full w-full object-cover"
                  variants={fade}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                />
              </AnimatePresence>
            </div>

            {/* 4) MOBILE-ONLY TILE (visible on small screens; hidden on md+) */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:hidden">
              <img
                src={fourthMobile}
                alt="Tile 4 (mobile only)"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
