import React from "react";

const JournalSkeletonCard = () => {
  return (
    <article className="relative group w-full animate-pulse">
      {/* Image */}
      <div className="overflow-hidden">
        <div className="w-full h-auto bg-gray-300 dark:bg-gray-600 aspect-[4/3]"></div>
      </div>

      {/* Bottom info section */}
      <div className="absolute flex gap-1 pl-6 pt-6 bottom-0 left-0 right-0 bg-white dark:bg-[#000000] text-[#000000]">
        <div>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        <div className="gap-3 px-4 py-3">
          {/* Title */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default JournalSkeletonCard;
