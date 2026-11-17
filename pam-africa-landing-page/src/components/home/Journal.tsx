"use client";

import React, { useEffect, useState } from "react";
import { fetchJournals, Journal } from "@/lib/journalService";
import JournalImageGallery from "./JournalImageGallery";
import { ViewMoreCard } from "./ViewMoreCard";
import JournalSkeletonCard from "./JournalSkeletonCard";

function sortAndSlice(data: Journal[]) {
  return data
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime() || new Date(a.createdAt).getTime();
      const dateB = new Date(b.date).getTime() || new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);
}

const Journals = ({ initialJournals }: { initialJournals?: Journal[] }) => {
  const [journals, setJournals] = useState<Journal[]>(() =>
    initialJournals ? sortAndSlice(initialJournals) : []
  );
  const [loading, setLoading] = useState(initialJournals === undefined);

  useEffect(() => {
    if (initialJournals?.length) {
      setJournals(sortAndSlice(initialJournals));
      setLoading(false);
      return;
    }
    const loadJournals = async () => {
      try {
        setLoading(true);
        const data = await fetchJournals();
        setJournals(sortAndSlice(data));
      } catch (err) {
        console.error("Error loading journals:", err);
        setJournals([]);
      } finally {
        setLoading(false);
      }
    };
    loadJournals();
  }, [initialJournals]);

  if (loading) {
    return <JournalsSkeleton />;
  }

  return (
    <div className="px-6">
      <p className="mb-10">Journals</p>
      <div className=" grid grid-cols-1 sm:grid-cols-1 gap-x-2 gap-y-10 md:grid-cols-3">
        {journals.map((journal) => (
          <JournalImageGallery
            key={journal.slug}
            data={{
              img: journal.cover,
              title: journal.title,
              description: journal.excerpt,
              type: journal.category,
              slug: journal.slug,
            }}
          />
        ))}
        <ViewMoreCard />
      </div>
    </div>
  );
};

// Skeleton version for loading states
export const JournalsSkeleton = () => {
  return (
    <div className="px-6">
      <div className="mb-10">
        <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <JournalSkeletonCard key={index} />
        ))}
        <ViewMoreCard />
      </div>
    </div>
  );
};

export default Journals;
