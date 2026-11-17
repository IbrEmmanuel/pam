// app/components/Sponsors.tsx (TS) or components/Sponsors.jsx (JS)
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Sponsor = { src: string; alt: string; href?: string };

const SPONSORS: Sponsor[] = [
  { src: "/sponsors/s1.svg", alt: "Google" },
  { src: "/sponsors/s2.svg", alt: "Microsoft" },
  // { src: "/sponsors/s3.svg", alt: "AWS" },
  { src: "/sponsors/s4.svg", alt: "Vercel" },
  { src: "/sponsors/s5.svg", alt: "Netlify" },
  { src: "/sponsors/s6.svg", alt: "Shopify" },
  { src: "/sponsors/s7.svg", alt: "Shopifyq" },
  { src: "/sponsors/s8.svg", alt: "Shopifye" },
  { src: "/sponsors/s9.svg", alt: "Shopifyr" },
  { src: "/sponsors/s10.svg", alt: "Shopifyy" },
  { src: "/sponsors/s11.svg", alt: "Shopifyy" },
];

// Tweak speed (seconds to complete one loop)
const SPEED = 20;

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Sponsor[];
  reverse?: boolean;
}) {
  // Duplicate the items so the loop is seamless
  const xStart = 0;
  const xEnd = reverse ? "50%" : "-50%";

  return (
    <div className="relative w-full dark:bg-white overflow-hidden">
      {/* subtle edge fade (optional) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 md:w-8 bg-gradient-to-r dark:from-[#222] from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 md:w-8 bg-gradient-to-l from-background dark:from-[#222] to-transparent" />

      <motion.div
        className="flex w-[200%] gap-8 md:gap-12"
        aria-hidden="true"
        // The trick: slide half the width (because we duplicated content)
        animate={{ x: [xStart, xEnd] }}
        transition={{
          duration: SPEED,
          ease: "linear",
          repeat: Infinity,
        }}
        // Pause on hover
        whileHover={{}}
      >
        {/* First copy */}
        <ul className="flex w-1/2 min-w-[50%] items-center justify-around gap-8 md:gap-12">
          {items.map((s, i) => (
            <li key={`a-${i}`} className="shrink-0">
              <Logo {...s} />
            </li>
          ))}
        </ul>

        {/* Second copy */}
        <ul className="hidden sm:flex w-1/2 min-w-[50%]  items-center justify-around gap-8 md:gap-12">
          {items.map((s, i) => (
            <li key={`b-${i}`} className="shrink-0">
              <Logo {...s} />
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function Logo({ src, alt, href }: Sponsor) {
  const content = (
    <Image
      src={src}
      alt={alt}
      // Increased height for both mobile and medium screens
      className="h-[40px] w-[40px] opacity-80 transition-opacity duration-200 hover:opacity-100 md:h-[60px] md:w-[60px]"
      loading="lazy"
      draggable={false}
      // Adjust width and height props to a larger size
      width={500}
      height={500}
    />
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={alt}>
      {content}
    </a>
  ) : (
    content
  );
}
const Sponsors = () => {
  return (
    <section className="px-2 md:px-4 py-10 ">
      <p className="mb-10 text-sm capitalize text-[#000000] dark:text-white">
        Supported by
      </p>

      <MarqueeRow items={SPONSORS} />
    </section>
  );
};

export default Sponsors;
