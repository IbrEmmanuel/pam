"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate } from "framer-motion";
import Welcome from "@/components/home/Welcome";
import Hero from "@/components/home/Hero";
import WhatWeDo from "@/components/home/WhatWeDo";
import Sponsors from "@/components/home/Sponsors";
import Journals from "@/components/home/Journal";
import OurStory from "@/components/home/OurStory";
import FeaturedProjects, {
  type FeaturedProjectCard,
} from "@/components/home/FeaturedProjects";
import AwardsList from "@/components/home/Awards";
import NavBar from "@/components/NavBar";
import { HERO_IMAGES, decodeImage, prefetchImages } from "@/lib/preloadImages";
import type { Journal } from "@/lib/journalService";

export default function HomePageClient({
  initialJournals,
  featuredProjects,
}: {
  initialJournals: Journal[];
  featuredProjects: FeaturedProjectCard[];
}) {
  const [progress, setProgress] = useState(0);
  const [showHero, setShowHero] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    if (!showHero) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [showHero]);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
      if (hasSeenWelcome) {
        setShowHero(true);
        setImagesReady(true);
        prefetchImages(HERO_IMAGES);
        return;
      }

      const { preloader } = await import("@/constants/preloader");
      await Promise.all(preloader.map((src) => decodeImage(src)));
      void Promise.allSettled(HERO_IMAGES.map((src) => decodeImage(src, 0)));

      if (cancelled) return;
      setImagesReady(true);
    };

    boot().catch((error) => {
      console.error("Welcome frames failed to decode:", error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!imagesReady || showHero) return;

    const controls = animate(0, 100, {
      duration: 6.1,
      ease: "easeInOut",
      onUpdate: (v) => {
        const rounded = Math.ceil(v / 10) * 10;
        setProgress((prev) => (prev !== rounded ? rounded : prev));
      },
      onComplete: () => {
        setProgress(100);
        setShowHero(true);
        sessionStorage.setItem("hasSeenWelcome", "true");
      },
    });

    return () => controls.stop();
  }, [imagesReady, showHero]);

  if (!imagesReady) {
    return <div className="fixed inset-0 z-50 bg-[#131313]" />;
  }

  return (
    <div className="relative min-h-dvh overflow-visible font-[family-name:var(--font-helvetica-now)]">
      <AnimatePresence>
        {!showHero ? (
          <Welcome key="welcome" progress={progress} />
        ) : (
          <div className="relative flex flex-col">
            <Hero key="hero" />
            <NavBar />
            <WhatWeDo />
            <Sponsors />
            <Journals initialJournals={initialJournals} />
            <OurStory />
            <FeaturedProjects projects={featuredProjects} />
            <AwardsList />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
