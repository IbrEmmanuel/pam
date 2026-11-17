"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// import type { Variants } from "framer-motion";
import Image from "next/image";
// import { X } from "lucide-react";

import { teamMembers } from "@/constants/team";
import type { TeamMember } from "@/types/team";
import { ChevronLeft, ChevronRight } from "lucide-react";

function useBoxSizes<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [sizes, setSizes] = useState({ clientWidth: 0, scrollWidth: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () =>
      setSizes({
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
      });

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, sizes };
}

/** TEAM MEMBER CARD */
const TeamMemberCard: React.FC<{
  member: TeamMember;
  index: number;
  size: number;
}> = ({ member, index, size }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      className="relative group cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-gray-900 flex-shrink-0"
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`View details for ${member.name}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {/* Grayscale */}
        <Image
          src={member.grayscaleImage}
          alt={member.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? "opacity-0" : "opacity-100"
          } grayscale`}
          width={size}
          height={size}
          priority={index < 6}
        />
        {/* Color */}
        <Image
          src={member.colorImage}
          alt={member.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          width={size}
          height={size}
        />

        {/* Overlay with name */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-semibold text-lg">{member.name}</h3>
            {/* <p className="text-sm text-gray-200">{member.role}</p> */}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default function MeetTheTeam() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [cardSize, setCardSize] = React.useState(360); // SSR default

  // listen for the simple custom event fired by the card (keeps card isolated)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { member: TeamMember };
      if (detail?.member) setSelectedMember(detail.member);
    };
    window.addEventListener("open-team-modal", handler as EventListener);
    return () =>
      window.removeEventListener("open-team-modal", handler as EventListener);
  }, []);

  /** DESKTOP (pinned) refs & measurements */
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { ref: railContainerRef, sizes: railViewport } =
    useBoxSizes<HTMLDivElement>(); // visible region (right pane)
  const railStripRef = useRef<HTMLDivElement | null>(null);
  const [stripScrollWidth, setStripScrollWidth] = useState(0);

  // measure the strip scrollWidth
  useEffect(() => {
    const el = railStripRef.current;
    if (!el) return;

    const update = () => setStripScrollWidth(el.scrollWidth);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // how far can we translate
  const viewportW = railViewport.clientWidth;
  const contentW = stripScrollWidth;
  const maxTranslate = Math.max(0, contentW - viewportW + 600);
  const extraScreens = viewportW > 0 ? contentW / viewportW : 1;
  const pinHeightVh = Math.max(200, Math.round(100 + (extraScreens - 1) * 100));

  // scroll progress across the tall section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  useEffect(() => {
    const compute = () => {
      const h = window.innerHeight;
      setCardSize(Math.max(240, Math.min(420, Math.floor(h * 0.42))));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);
  const itemsPerColumn = 2;
  const columns = useMemo(() => {
    const out: TeamMember[][] = [];
    for (let i = 0; i < teamMembers.length; i += itemsPerColumn) {
      out.push(teamMembers.slice(i, i + itemsPerColumn));
    }
    return out;
  }, []);

  return (
    <div className="min-h-screen">
      {/* DESKTOP / TABLET: pinned horizontal scroll */}
      <div className="hidden md:block">
        <div
          ref={sectionRef}
          className="relative"
          style={{ height: `${pinHeightVh}vh` }}
        >
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            <div className="px-6 py-16 flex w-full gap-6">
              {/* Left Title */}
              <div className="basis-1/2 shrink-0 flex items-center">
                <div>
                  <h2 className="text-[clamp(2rem,5vw,48px)] font-bold dark:text-white text-gray-800">
                    Meet the team
                  </h2>
                  <div className="mt-4 text-gray-600 dark:text-gray-400">
                    <p className="text-sm">Scroll to explore our team</p>
                  </div>
                </div>
              </div>

              {/* Right rail (viewport) */}
              <div className="basis-1/2 overflow-hidden" ref={railContainerRef}>
                <motion.div
                  ref={railStripRef}
                  style={{ x, willChange: "transform" }}
                  className="flex flex-nowrap h-full"
                  transition={{ type: "tween", ease: "linear" }}
                >
                  {/* columns (each = vertical stack) must not shrink */}
                  {columns.map((col, colIdx) => (
                    <div
                      key={`col-${colIdx}`}
                      className="flex flex-col flex-none"
                      style={{ width: cardSize }}
                    >
                      {col.map((member, rowIdx) => (
                        <div key={member.id} className="p-2">
                          <TeamMemberCard
                            member={member}
                            index={colIdx * itemsPerColumn + rowIdx}
                            size={cardSize}
                          />
                        </div>
                      ))}
                      {/* fill remaining rows (if last column shorter) to keep consistent height */}
                      {col.length < itemsPerColumn &&
                        Array.from({ length: itemsPerColumn - col.length }).map(
                          (_, i) => (
                            <div
                              key={`sp-${i}`}
                              className="p-2"
                              style={{ width: cardSize, height: cardSize }}
                            />
                          )
                        )}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE: simple grid (no pinned scroll) */}
      {/* <div className="md:hidden">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Meet the team
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="relative">
                <TeamMemberCard member={member} index={index} size={320} />
              </div>
            ))}
          </div>
        </div>
      </div> */}

      <div className="md:hidden">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Meet the team
          </h2>

          {/* Pager state */}
          {/* NOTE: put these hooks inside your component, above return, if your linter prefers */}
          {(() => {
            // const [page, setPage] = React.useState(0);
            const pageSize = 2; // mobile shows 2 at a time
            const [page, setPage] = useState(0);
            const totalPages = Math.max(
              1,
              Math.ceil(teamMembers.length / pageSize)
            );
            const clamp = (n: number) =>
              Math.min(totalPages - 1, Math.max(0, n));
            const prev = () => setPage((p) => clamp(p - 1));
            const next = () => setPage((p) => clamp(p + 1));
            const start = page * pageSize;
            const current = teamMembers.slice(start, start + pageSize);

            return (
              <div className="relative">
                {/* Cards (exact same styling preserved) */}
                <div className="grid grid-cols-1 gap-4">
                  {current.map((member, index) => (
                    <div key={member.id} className="relative">
                      <TeamMemberCard
                        member={member}
                        index={start + index}
                        size={320}
                      />
                    </div>
                  ))}
                </div>

                {/* Carets */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    type="button"
                    aria-label="Previous"
                    onClick={prev}
                    disabled={page === 0}
                    className=" w-[40px] flex items-center justify-center h-[40px] rounded-full bg-[#000000] text-white disabled:opacity-40"
                  >
                    <ChevronLeft />
                  </button>
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {page + 1} / {totalPages}
                  </div>
                  <button
                    type="button"
                    aria-label="Next"
                    onClick={next}
                    disabled={page >= totalPages - 1}
                    className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#000000] text-white disabled:opacity-40"
                  >
                    <ChevronRight />
                  </button>
                </div>

                {/* tiny page indicator (optional; remove if you don't want it) */}
              </div>
            );
          })()}
        </div>
      </div>
      {/* MODAL */}
      {/* <AnimatePresence>
        {selectedMember && (
          <TeamDetailModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence> */}
    </div>
  );
}
