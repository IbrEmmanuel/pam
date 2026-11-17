import Link from "next/link";

export const ViewMoreCard = ({ href = "/journals" }: { href?: string }) => {
  return (
    <div className="flex items-center h-[460px] md:h-auto  justify-center bg-[#000000] text-white hover:bg-neutral-800 transition-colors ">
      <Link href={href} className="border border-white px-4 py-2 text-sm">
        View More
      </Link>
    </div>
  );
};
