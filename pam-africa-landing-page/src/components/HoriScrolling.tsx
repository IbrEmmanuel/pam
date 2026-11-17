"use client";
import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useMobile";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
  fullBleed?: boolean;
  pageInfo?: string;
};

export default function HorizontalScrollOnVertical({
  images,
  alt = "Project image",
  className = "",

  fullBleed = true,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = images.length;
  const isMobile = useIsMobile();
  // Desktop/Tablet scroll-track height (ignored on mobile view)
  const sectionHeight = useMemo(() => {
    if (isMobile) return "auto"; // ✅ no tall container on mobile
    return `calc(${count * 100}vh + 1px)`;
  }, [count, isMobile]);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });

  // Finish translate *before* release: with N slides, end at (N-1)/N
  const endAt = count > 1 ? (count - 1.5) / count : 1;

  const x = useTransform(
    scrollYProgress,
    [0, endAt, 1],
    ["0%", `-${(count - 1) * 100}%`, `-${(count - 1) * 100}%`]
  );

  return (
    <section
      ref={trackRef}
      style={{ height: sectionHeight }}
      className={`relative ${fullBleed ? "w-screen" : "w-full"} ${className}`}
      aria-label="Horizontal gallery"
    >
      {/* Desktop/Tablet: pinned horizontal scroll */}
      <div className="hidden md:block sticky top-16 h-screen pb-10 overflow-hidden">
        <div className="flex max-w-6xl mx-auto relative z-10 items-center justify-between py-3 md:py-4">
          <div></div>
          <div className="text-sm md:text-base font-medium text-center">
            {alt}
          </div>
          <div></div>
        </div>
        <motion.div
          style={{ x }}
          className="flex h-full will-change-transform"
          transition={{ type: "tween", ease: [0.22, 1, 0.36, 1] }}
        >
          {images.map((src, i) => (
            <div key={src} className="flex-none w-screen md:h-[562px] relative">
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
              />
              {/* (Desktop) index outside frame if you want: currently offset below */}
              <span className="absolute -bottom-10 left-3 text-sm font-semibold">
                {(i + 1).toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile: simple vertical list with number UNDER the image */}
      <div className="md:hidden">
        <ul className="space-y-6">
          {images.map((src, i) => (
            <li key={`m-${src}`} className="w-full">
              {/* aspect container for responsive Image fill */}
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
              {/* number BELOW image */}
              <div className="mt-2 px-3">
                <span className="text-sm font-semibold">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
