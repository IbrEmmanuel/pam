import Image from "next/image";
import Link from "next/link";
import React from "react";

const JournalImageGallery = ({
  data,
}: {
  data: {
    img: string;
    title: string;
    description: string;
    type: string;
    slug?: string;
  };
}) => {
  // Generate slug from title if not provided
  const slug =
    data.slug ||
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  return (
    <Link href={`/journals/${slug}`} className="block">
      <article className="relative group w-full cursor-pointer">
        {/* Image */}
        <div className="overflow-hidden">
          <Image
            src={data.img}
            alt={data.title}
            width={1000}
            height={1000}
            className="w-full min-h-[400px] h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        {/* Bottom info section */}
        <div className="absolute flex gap-1 pl-6 pt-6 bottom-0 left-0 right-0 bg-white dark:bg-[#000000] dark:text-white  text-[#000000]">
          <div>
            <span className="text-xs shrink-0 bg-[#000000] text-white dark:bg-[#FCFCFC] dark:text-[#000000]  px-3 py-1 font-medium uppercase tracking-wide">
              {data.type}
            </span>
          </div>

          <div className="gap-3 px-4 -mt-1 py-3">
            <h3 className="text-xs font-semibold leading-tight line-clamp-2">
              {data.title}
            </h3>
            <div
              className="
              overflow-hidden
              max-h-0 group-hover:max-h-40
              transition-[max-height] duration-300 ease-out
            "
            >
              <p
                className="
                text-[10px] mt-4 leading-relaxed
                translate-y-2 opacity-0
                group-hover:translate-y-0 group-hover:opacity-100
                transition-all duration-500 ease-out
              "
              >
                {data.description}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default JournalImageGallery;
