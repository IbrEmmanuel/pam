"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ImageCompareProps = {
  beforeSrc: string; // The base/background image (e.g., "Before")
  afterSrc: string; // The top/revealed image (e.g., "After")
  altBefore?: string;
  altAfter?: string;
  height?: number; // Fixed aspect height if you want; or use CSS for responsive
  pin?: boolean; // Pin the section during scroll (default true)
  start?: string; // ScrollTrigger start (default "top center")
  end?: string; // ScrollTrigger end (default "+=100%")
};

export default function ImageCompare({
  beforeSrc,
  afterSrc,
  altBefore = "Before image",
  altAfter = "After image",
  height = 600,
  pin = true,
  start = "top center",
  end = "+=100%",
}: ImageCompareProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure plugin is registered only on client
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const overlay = overlayRef.current;
    const handle = handleRef.current;

    if (!container || !overlay || !handle) return;

    // We animate a CSS variable --reveal (0 -> 1) to control overlay width & handle position
    const ctx = gsap.context(() => {
      gsap.set(container, { "--reveal": 0 } as any);

      gsap.to(container, {
        duration: 1,
        ease: "none",
        "--reveal": 1,
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub: true,
          pin, // true
          pinSpacing: true, // <— remove the space
          anticipatePin: 1,
        },

        onUpdate: function () {
          const r = Number(gsap.getProperty(container, "--reveal") as number);
          // Move the overlay and handle together
          // Width percentage of the overlay
          const pct = `${(r * 100).toFixed(3)}%`;
          overlay.style.clipPath = `polygon(0 100%, 100% 100%, 100% ${
            100 - r * 100
          }%, 0 ${100 - r * 100}%)`;
          handle.style.top = `${100 - r * 100}%`;
        },
      });
    }, container);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.refresh());
    };
  }, [pin, start, end]);

  return (
    <section
      ref={containerRef}
      className="ic-section"
      aria-label="Scroll to compare images"
    >
      <div className="ic-frame" style={{ height }}>
        {/* BEFORE (base) */}
        <div className="ic-layer">
          <Image
            alt={altBefore}
            src={beforeSrc}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* AFTER (revealed on scroll) */}
        <div
          className="ic-layer ic-overlay"
          ref={overlayRef}
          aria-hidden="true"
        >
          <Image
            alt={altAfter}
            src={afterSrc}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Handle indicator (follows reveal edge) */}
        <div className="ic-handle" ref={handleRef} aria-hidden="true">
          <span className="ic-handle-line" />
          <span className="ic-handle-dot" />
        </div>
      </div>

      {/* Optional labels */}
      <div className="ic-labels">
        <span className="ic-badge">Before</span>
        <span className="ic-badge">After</span>
      </div>
    </section>
  );
}
