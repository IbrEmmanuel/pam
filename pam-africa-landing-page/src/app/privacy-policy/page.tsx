import NavBar from "@/components/NavBar";
import { PrivacyPage } from "@/components/PrivacyPolicy";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import React from "react";

const Privacy = () => {
  return (
    <div>
      <NavBar />
      <Link
        href=".."
        className="flex w-[104px] items-center gap-1 border border-gray-500 ml-4 px-2.5 py-2"
      >
        <ChevronUp className="transform -rotate-90" />
        Back
      </Link>
      <PrivacyPage />
    </div>
  );
};

export default Privacy;
