"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./comparison.css";

gsap.registerPlugin(ScrollTrigger);

export default function ImageComparison() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create one timeline for the entire container
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom+=200 top+=300",
          scrub: true,

          pin: true,
          markers: false,
          pinSpacing: true,
        },
        defaults: { ease: "none" },
      });

      // Animate all afterImages at once
      tl.fromTo(
        ".afterImage",
        { yPercent: 100, y: 0 },
        { yPercent: 0 },
        0
      ).fromTo(".afterImage img", { yPercent: -100, y: 0 }, { yPercent: 0 }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="w-full grid grid-cols-2 sm:grid-cols-3 gap-0"
      >
        <section className="comparisonSection w-full relative aspect-[2/3] sm:h-[70vh] overflow-hidden">
          <div className="comparisonImage w-full h-full beforeImage">
            <img
              src="/images/logoscroll1.png"
              alt="before"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
          <div className="comparisonImage w-full h-full afterImage">
            <img
              src="/images/logoscroll1.png"
              alt="after"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
        </section>

        <section className="comparisonSection w-full relative aspect-[2/3] sm:h-[70vh] overflow-hidden">
          <div className="comparisonImage w-full h-full beforeImage">
            <img
              src="/images/logoscroll2.png"
              alt="before"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
          <div className="comparisonImage w-full h-full afterImage">
            <img
              src="/images/afterscroll1.png"
              alt="after"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
        </section>

        <section className="comparisonSection w-full relative aspect-[3/4] sm:h-[70vh] overflow-hidden">
          <div className="comparisonImage w-full h-full beforeImage">
            <img
              src="/images/logoscroll3.png"
              alt="before"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
          <div className="comparisonImage w-full h-full afterImage">
            <img
              src="/images/afterscoll2.png"
              alt="after"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
        </section>

        <section className="comparisonSection w-full block sm:hidden relative aspect-[3/4] sm:h-[70vh] overflow-hidden">
          <div className="comparisonImage w-full h-full beforeImage">
            <img
              src="/images/logoscroll4.png"
              alt="before"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
          <div className="comparisonImage w-full h-full afterImage">
            <img
              src="/images/afterscroll4.png"
              alt="after"
              className="w-full h-full absolute top-0 object-cover"
            />
          </div>
        </section>
      </div>
    </>
  );
}
