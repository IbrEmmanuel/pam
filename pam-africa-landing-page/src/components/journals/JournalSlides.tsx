"use client";
import { useState, useEffect, useCallback } from "react";
import { fetchJournals, Journal } from "@/lib/journalService";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import JournalSlideSkeleton from "./JournalSlideSkeleton";

interface JournalsSlideProps {
  currentSlug?: string;
}

export default function JournalsSlide({ currentSlug }: JournalsSlideProps) {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournals = async () => {
      try {
        setLoading(true);
        const data = await fetchJournals();
        const sorted = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        let filtered = sorted;
        let initialIndex = 0;

        if (currentSlug) {
          const foundIndex = sorted.findIndex((j) => j.slug === currentSlug);
          if (foundIndex !== -1) {
            filtered = sorted.filter((j) => j.slug !== currentSlug);
            if (filtered.length > 0) {
              const originalLength = sorted.length;
              const originalNext = (foundIndex + 1) % originalLength;
              initialIndex =
                originalNext > foundIndex ? originalNext - 1 : originalNext;
            }
          }
        }

        setJournals(filtered);
        setIndex(initialIndex);
      } catch (err) {
        console.error("Error loading journals:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJournals();
  }, [currentSlug]); // Re-run if currentSlug changes, but since it's a prop, it's fine

  const last = journals.length - 1;
  const current = journals[index];

  // optional: left/right arrow keys
  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && index < last)
        setIndex((i) => Math.min(last, i + 1));
      if (e.key === "ArrowLeft" && index > 0)
        setIndex((i) => Math.max(0, i - 1));
    },
    [index, last]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  if (loading) {
    return <JournalSlideSkeleton />;
  }

  if (journals.length === 0 || !current) {
    return (
      <main className="mx-auto px-2 md:px-4 py-10">
        <p className="text-gray-600">No other journals available.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto px-2 md:px-4 py-10">
      {/* Pager header */}
      {/* Single item with transition */}
      <ul className="grid gap-6">
        <AnimatePresence mode="wait">
          <motion.li
            key={current.slug}
            className="overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Link
              href={`/journals/${current.slug}`}
              className="grid grid-cols-1 md:grid-cols-5 gap-5 group"
            >
              <div className="md:p-4 md:col-span-3 flex order-2 md:order-1 items-start gap-3">
                <p className="text-base basis-[35%] capitalize shrink-0 tracking-wide">
                  <span className="text-white bg-[#000000] px-2 py-1">
                    {current.category}
                  </span>
                </p>
                <div className="w-auto basis-[65%]">
                  <h2 className="text-base text-[#000000] dark:text-white font-semibold">
                    {current.title}
                  </h2>
                  <p className="text-sm hidden md:group-hover:block max-w-[291px] text-gray-600 mt-2 line-clamp-3">
                    {current.excerpt}
                  </p>
                </div>
              </div>
              <div className="relative order-1 md:order-2 aspect-[16/9] md:col-span-2">
                <Image
                  src={current.cover}
                  alt={current.title}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <motion.div className="overlay hidden absolute inset-0 bg-[#000000]/50 md:flex items-center justify-center">
                  <button className="text-white hidden px-4 py-2 border-2 border-white group-hover:block">
                    View More
                  </button>
                </motion.div>
              </div>
            </Link>
          </motion.li>
        </AnimatePresence>
      </ul>
      <div className="mb-6 mt-16 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {index + 1} / {journals.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="px-4 py-2 border rounded disabled:opacity-40"
            aria-label="Previous"
          >
            ← Previous
          </button>
          {index === last ? (
            <Link
              href="/journals"
              className="px-4 py-2 border rounded bg-[#000000] text-white dark:bg-white dark:text-[#000000]"
            >
              All journals →
            </Link>
          ) : (
            <button
              onClick={() => setIndex((i) => Math.min(last, i + 1))}
              className="px-4 py-2 border rounded bg-[#000000] text-white dark:bg-white dark:text-[#000000]"
              aria-label="Next"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
