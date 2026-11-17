"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ImageFillReveal() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"], // Adjusted offset to ensure full progress
  });

  // Map scroll progress from 0 to 1 to reveal the image fully from bottom to top
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {" "}
      {/* Container with height to allow scrolling */}
      <div
        className="w-lg"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Base image */}
        <img
          src="/images/hero2.png" // Replace with your base image URL or path
          alt="Base"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Overlay (fill) image with clipPath animation */}
        <motion.img
          src="/images/hero.png" // Replace with your fill image URL or path
          alt="Fill"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            clipPath: clipPath,
          }}
        />
      </div>
    </div>
  );
}
