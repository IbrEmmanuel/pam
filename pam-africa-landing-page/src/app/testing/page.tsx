"use client";

import React from "react";
import { motion, useScroll } from "framer-motion";

export default function TestingMotion() {
  const { scrollYProgress } = useScroll();
  return (
    <div className="flex justify-center relative h-screen items-center">
      <motion.div
        style={{
          scale: scrollYProgress,
          position: "sticky",
          top: 0,
        }}
        className="bg-red-500 w-32 h-32 "
        whileHover={{ color: "[#000000]", scale: 2, rotate: 10, padding: 10 }}
        drag
        whileDrag={{
          scale: 1.1,
          backgroundColor: "orange",
          color: "[#000000]",
        }}
        dragConstraints={{
          top: -50,
          bottom: 0,
          right: 0,
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        hello there
      </motion.div>
    </div>
  );
}
