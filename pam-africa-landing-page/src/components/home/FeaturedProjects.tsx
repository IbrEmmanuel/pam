import { projectsData } from "@/constants/featuredProjects";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ViewMoreCard } from "./ViewMoreCard";

export type FeaturedProjectCard = {
  img: string;
  title: string;
  type: string;
  slug?: string;
};

const Projects = ({
  data,
}: {
  data: FeaturedProjectCard;
}) => {
  return (
    <Link href={`/projects/${data.slug}`} className="block">
      <article className="relative group w-full cursor-pointer">
        {/* Image */}
        <div className="overflow-hidden">
          <Image
            src={data.img}
            alt={data.title}
            width={1000}
            height={1000}
            className="w-full  h-full aspect-[1/1] object-cover transition-transform duration-500 "
          />
        </div>

        {/* Bottom info section - Initially hidden, shows on hover */}
        <div className="absolute flex gap-1 pl-6  bottom-0 left-0 right-0 bg-white text-[#000000] dark:bg-[#000000] dark:text-white  opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ease-out">
          <div className="gap-3 px-4 py-3">
            <div
              className="
              overflow-hidden
              min-h-16 md:max-h-0 group-hover:max-h-40
              transition-[max-height] duration-300 ease-out
            "
            >
              <div
                className="
                text-[10px] mt-4 leading-relaxed
                translate-y-2 md:opacity-0
                opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100
                transition-all duration-500 ease-out
                flex gap-10 items-center
              "
              >
                <div className="mb-2">
                  <span className="text-xs shrink-0  text-white bg-[#000000] dark:text-white  px-3 py-1 font-medium uppercase tracking-wide">
                    {data.type}
                  </span>
                </div>
                <p className="text-base md:text-xl -mt-2">{data.title}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export { Projects };

const FeaturedProjects = ({
  projects = projectsData,
}: {
  projects?: FeaturedProjectCard[];
}) => {
  return (
    <div className="px-6 min-h-screen overflow-hidden">
      <p className="mb-10 text-[28px] md:text-[48px]">Featured Projects</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {projects.map((data) => (
          <Projects data={data} key={data.slug || data.title} />
        ))}
        <ViewMoreCard href="/projects" />
      </div>
    </div>
  );
};

export default FeaturedProjects;
