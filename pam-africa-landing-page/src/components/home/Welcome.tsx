"use client";

import { preloader } from "@/constants/preloader";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = { progress: number };

export default function Welcome({ progress }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const newIndex = Math.min(
      Math.floor(progress / (100 / preloader.length)),
      preloader.length - 1
    );
    setCurrentIndex(newIndex);
  }, [progress]);

  const currentImage = preloader[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#131313] text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
    >
      {/* Keep decoded frames in DOM so crossfades never flash empty */}
      <div className="absolute inset-0" aria-hidden>
        {preloader.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
            decoding="sync"
          />
        ))}
      </div>

      <AnimatePresence mode="sync">
        <motion.div
          key={currentImage}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            decoding="sync"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[#131313]/40" />
        </motion.div>
      </AnimatePresence>

      <motion.div className="absolute bottom-[20%] z-10 mx-auto flex w-full max-w-[1132px] flex-col items-center justify-between gap-4 px-4 md:bottom-[30%] md:flex-row md:gap-10 md:px-6">
        <div className="text-base font-bold tabular-nums md:text-2xl">{progress}</div>
        <h1 className="text-center text-xl font-bold sm:text-3xl md:text-left md:text-4xl lg:text-[64px] lg:leading-[1.05]">
          Welcome to PAM
        </h1>
      </motion.div>
    </motion.div>
  );
}
