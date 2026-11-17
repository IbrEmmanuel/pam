import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/constants/projects";

export default function ProjectListItem({ p }: { p: Project }) {
  return (
    <Link href={`/projects/${p.slug}`} className="group block " id={p.slug}>
      <div className="grid grid-cols-12 gap-6  items-start">
        {/* Left: title + blurb */}
        <div className="col-span-12 md:col-span-4 pl-4">
          <div className="flex items-start justify-between md:justify-start md:gap-6">
            <h2 className="text-[22px] md:text-[24px] font-semibold tracking-tight">
              {p.title}
            </h2>
            <span className="text-lg md:text-xl font-semibold md:hidden">
              {p.year}
            </span>
          </div>

          {p.blurb && (
            <p className="mt-4 hidden group-hover:block text-neutral-600 leading-6 max-w-xs">
              {p.blurb}
            </p>
          )}
        </div>

        {/* Middle: year (desktop only) */}
        <div className="col-span-12 md:col-span-1 hidden md:flex pt-1">
          <span className="text-xl font-semibold">{p.year}</span>
        </div>

        {/* Right: big image */}
        <div className="col-span-12 md:col-span-7">
          <div className="relative h-[401px] md:h-[450px] w-full overflow-hidden">
            <Image
              src={p.cover}
              alt={p.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(min-width: 1024px) 70vw, 100vw"
              priority={false}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
