import React from "react";

const JournalPageSkeleton = () => {
  return (
    <main className="mx-auto animate-pulse">
      {/* Back Button */}
      <div className="ml-4 mb-6">
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      {/* Cover Image */}
      <div className="w-full min-h-[333px] mt-6 bg-gray-300 dark:bg-gray-600"></div>

      {/* Content Grid */}
      <div className="grid grid-cols-8 my-[54px] px-4 gap-4">
        {/* Category Badge */}
        <div className="col-span-4 md:col-span-1">
          <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        {/* Share Button (mobile) */}
        <div className="col-span-8 order-2 md:hidden">
          <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded ml-4 mt-10"></div>
        </div>

        {/* Article Content */}
        <article className="col-span-8 mt-8 md:col-span-5 order-2 md:order-none md:mt-auto space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>

          {/* Body */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </article>

        {/* Date */}
        <div className="col-span-4 md:col-span-2 text-right">
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded ml-auto"></div>
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="aspect-[16/10] bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="aspect-[16/10] bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </main>
  );
};

export default JournalPageSkeleton;
