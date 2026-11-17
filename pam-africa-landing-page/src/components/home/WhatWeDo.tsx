"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
  type EasingDefinition,
} from "framer-motion";

const EASE: EasingDefinition = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.16, delayChildren: 0.12 },
  },
};

const line: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};

const para: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: 0.15 },
  },
};

const headlineLines = [
  "improve people's lives.",
  "make complex things simple.",
  "build for the future.",
  "deliver exceptional quality.",
];

export default function WhatWeDo() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "0% 0px 0% 0px", once: false });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const [maxMove, setMaxMove] = useState(215);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMaxMove(98);
      } else {
        setMaxMove(215);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const weY = useTransform(scrollYProgress, [0, 1], [-20, maxMove]);

  return (
    <section className="relative flex flex-col md:min-h-[100vh] pt-28 w-full">
      <div className="mx-auto max-w-6xl px-1 md:px-6" ref={ref}>
        <div className="flex relative gap-2 mx-auto md:pl-20">
          {/* "We" scrolls but capped at 300px on mobile */}
          <motion.p
            style={{ y: weY }}
            className="relative text-[25px] md:text-[54px] font-bold leading-tight tracking-tight"
          >
            We
          </motion.p>

          {/* Animated headline lines */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="max-w-4xl"
          >
            {headlineLines.map((text, i) => (
              <motion.h2
                key={i}
                variants={line}
                className="text-[25px] md:text-[54px] font-semibold leading-tight tracking-tight"
              >
                {text}
              </motion.h2>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Paragraph section */}
      <motion.div className="mt-25 text-sm leading-6 flex flex-col md:flex-row px-6 md:text-base md:leading-7">
        <p className="block md:basis-[25%] mb-5 md:mb-0 font-semibold text-2xl">
          What we do
        </p>
        <p className="md:basis-[65%] max-w-[500px] text-left leading-relaxed">
          We are an Energy Enabler Ecosystem (EEE) that unite innovation,
          sustainability, and resilience. <br /> From products to projects and
          services, we deliver outcomes that are future-focused, environmentally
          responsible, and technically robust — empowering communities,
          businesses, and industries to thrive while shaping a more sustainable
          and equitable future.
        </p>
      </motion.div>
    </section>
  );
}
