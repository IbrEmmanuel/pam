import React from "react";

const JournalSkeleton = () => {
  return (
    <li className="overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Content Section */}
        <div className="md:p-4 md:col-span-3 flex order-2 md:order-1 items-start gap-3">
          {/* Category Badge */}
          <div className="basis-[35%] shrink-0">
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          
          {/* Title and Excerpt */}
          <div className="w-auto basis-[65%] space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
            
            {/* Excerpt */}
            <div className="hidden md:block space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative order-1 md:order-2 aspect-[16/9] md:col-span-2">
          <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded"></div>
          
          {/* Overlay skeleton */}
          <div className="hidden md:flex absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-50 items-center justify-center">
            <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default JournalSkeleton;
