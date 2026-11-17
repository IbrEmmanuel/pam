"use client";
import { awards } from "@/constants/awards";
import Image from "next/image";
import React, { useState } from "react";
import AwardsAccordion from "./Accordion";

const AwardsList = () => {
  const [showAll, setShowAll] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  const visibleAwards = showAll ? awards : awards.slice(0, 10);

  return (
    <div className="w-full flex flex-col md:flex-row justify-between mx-auto text-[#000000] dark:text-white p-4 md:p-6 mt-10 min-h-screen">
      <div
        className="relative basis-2/6 mb-8 md:mb-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Awards</h1>
      </div>

      <div className="space-y-4 md:space-y-6 basis-4/6 flex-1 hidden md:block">
        {visibleAwards.map((award, index) => (
          <div
            key={index}
            className="flex group text-gray-800 dark:text-white hover:text-gray-800 cursor-pointer items-start justify-between rounded-lg p-3 md:p-4 relative"
          >
            <Image
              src={award.img}
              width={500}
              height={500}
              alt={award.title}
              className="w-32 md:w-40 absolute -left-32 md:-left-40 hidden group-hover:inline-block transition-all duration-300"
            />
            <div className="flex-1">
              <div className="flex items-start gap-3 md:gap-6">
                <div className="font-medium text-sm md:text-base min-w-[50px] md:min-w-[60px]">
                  {award.year}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm md:text-base leading-relaxed">
                    {award.title}
                  </h3>
                </div>
                <div className="text-right min-w-[150px] md:min-w-[200px] text-xs md:text-sm">
                  {award.organization}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-6 md:mt-8">
          <button
            onClick={handleToggle}
            className="px-6 md:px-8 py-2 md:py-3 border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm md:text-base"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>

      <AwardsAccordion />
    </div>
  );
};

export default AwardsList;
