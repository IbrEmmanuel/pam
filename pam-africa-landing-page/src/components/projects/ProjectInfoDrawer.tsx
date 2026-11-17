"use client";

import FormattedText from "@/lib/textFormat";
import { X } from "lucide-react";
import * as React from "react";

type Props = {
  title: string;
  info?: string;
};

export default function ProjectInfoDrawer({ title, info }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border px-3 py-1.5 text-sm hover:bg-[#000000] hover:text-white transition"
      >
        Project info
      </button>

      {/* Simple right drawer */}
      <div
        className={`fixed inset-0 z-[2000] transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[#000000]/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#000000] shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-5 flex items-center justify-between border-b">
              <h3 className="font-semibold">
                <FormattedText>{title}</FormattedText>
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-sm dark:text-white hover:underline"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <p className="text-neutral-700 dark:text-white whitespace-pre-line">
                <FormattedText>{info}</FormattedText>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
