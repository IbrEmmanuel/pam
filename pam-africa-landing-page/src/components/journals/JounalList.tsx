"use client";

import { fetchJournals, Journal } from "@/lib/journalService";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import JournalSkeleton from "./JournalSkeleton";

export default function JournalsList({
  initialJournals,
}: {
  initialJournals?: Journal[];
}) {
  const [journals, setJournals] = useState<Journal[]>(initialJournals ?? []);
  const [loading, setLoading] = useState(initialJournals === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialJournals) {
      setJournals(initialJournals);
      setLoading(false);
      return;
    }
    const loadJournals = async () => {
      try {
        setLoading(true);
        const data = await fetchJournals();
        const sorted = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setJournals(sorted);
      } catch (err) {
        setError("Failed to load journals");
        console.error("Error loading journals:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJournals();
  }, [initialJournals]);

  if (loading) {
    return (
      <main className="mx-auto px-2 md:px-4 py-10">
        <ul className="grid gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <JournalSkeleton key={index} />
          ))}
        </ul>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto px-2 md:px-4 py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Unable to load journals
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#000000] text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto px-2 md:px-4 py-10">
      <ul className="grid gap-6 ">
        {journals.map((journal) => (
          <li key={journal.slug} className=" overflow-hidden">
            <Link
              href={`/journals/${journal.slug}`}
              className="grid grid-cols-1 md:grid-cols-5 gap-5 group"
            >
              <div className="md:p-4 md:col-span-3 flex order-2 md:order-1  items-start gap-3">
                <p className="text-base basis-[35%] capitalize shrink-0 tracking-wide ">
                  <span className="text-white bg-[#000000] px-2 py-1">
                    {journal.category}
                  </span>
                </p>
                <div className="w-auto basis-[65%]">
                  <h2 className="text-base text-[#000000] dark:text-white font-semibold">
                    {journal.title}
                  </h2>
                  <p className="text-sm hidden  md:group-hover:block max-w-[291px] text-gray-600 mt-2 line-clamp-3">
                    {journal.excerpt}
                  </p>
                </div>
              </div>

              <div className="relative order-1 md:order-2 aspect-[16/9] md:col-span-2">
                <Image
                  src={journal.cover}
                  alt={journal.title}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover"
                />
                <motion.div className="overlay hidden absolute inset-0 bg-[#000000]/50 md:flex items-center justify-center">
                  <button className="text-white hidden px-4 py-2 border-2 border-white group-hover:block">
                    View More
                  </button>
                </motion.div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
