// WhatWeDo.jsx
import { SERVICES } from "@/constants/mobileServices";
import Image from "next/image";
import React from "react";

export default function WhatWeDo({ items = SERVICES }) {
  return (
    <section className="mx-auto sm:hidden max-w-5xl ">
      <div className="grid grid-cols-1 gap-2">
        <Image
          src="/about/whyworkwithus1.png"
          alt="image"
          className="w-full h-fit"
          width={1000}
          priority
          height={1000}
        />
        <h1 className="text-xl pl-2 font-semibold">What we do</h1>
        {items.map((item, i) => (
          <article key={i} className="group relative  flex  p-2 transition">
            <p className="pl-3 text-sm leading-relaxed ">
              <span className="font-semibold">{item.title}: </span>
              <span className="md:text-left text-justify">{item.desc}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
