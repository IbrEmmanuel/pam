// AwardsAccordion.tsx
"use client";
import { awards } from "@/constants/awards";
import React, { useId, useRef, useState, useEffect } from "react";

/** ---- Small plus/minus icon ---- */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#000000]/30 text-lg leading-none"
    >
      {open ? "–" : "+"}
    </span>
  );
}

/** ---- Single row ---- */
function AwardRow({
  item,
  open,
  onToggle,
}: {
  item: (typeof awards)[number];
  open: boolean;
  onToggle: () => void;
}) {
  const btnId = useId();
  const panelId = `${btnId}-panel`;
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  // Animate to auto height
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      const full = el.scrollHeight;
      setHeight(full);
      // after transition, set to 'auto' so content can grow
      const t = setTimeout(() => setHeight(NaN), 240);
      return () => clearTimeout(t);
    } else {
      // collapse to exact pixels for smooth animation
      setHeight(el.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  return (
    <li className="border-b border-[#000000]/10">
      <button
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#000000]/40"
      >
        <div className="min-w-0">
          <p className="text-lg font-semibold">{item.organization}</p>
        </div>
        <PlusMinus open={open} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className="overflow-hidden transition-[height] duration-200 ease-out"
        style={{
          height: Number.isNaN(height) ? ("auto" as any) : `${height}px`,
        }}
      >
        <div ref={ref} className="pb-5 pl-1 pr-2 sm:pr-4">
          <div className="flex items-start gap-4">
            <img
              src={item.img}
              alt={`${item.organization} logo`}
              className="h-10 w-10 shrink-0 rounded-md object-contain ring-1 ring-[#000000]/10"
            />
            <div className="min-w-0">
              <p className="text-sm uppercase tracking-wide text-[#000000]/60">
                {item.year}
              </p>
              <p className="mt-1 text-base font-medium">{item.title}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

/** ---- Accordion wrapper (one-open-at-a-time) ---- */
export default function AwardsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl md:hidden  p-5 sm:p-8">
      <h2 className="text-2xl font-bold">Awards & Recognition</h2>
      <ul className="mt-4">
        {awards.map((a, i) => (
          <AwardRow
            key={`${a.organization}-${a.year}-${i}`}
            item={a}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </ul>
    </section>
  );
}
