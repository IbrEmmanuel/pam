"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LetsTalkModal from "../lets-talk/LetsTalkModal";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
  id: number;
}

const Contact = () => {
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const [trails, setTrails] = useState<TrailDot[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering || !footerRef.current) return;

      const rect = footerRef.current.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      const newTrail: TrailDot = {
        x,
        y,
        opacity: 1,
        id: trailIdRef.current++,
      };

      setTrails((prev) => [...prev, newTrail].slice(-2)); // Keep only last 8 trails
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setTrails([]);
    };

    const footer = footerRef.current;
    if (footer) {
      footer.addEventListener("mousemove", handleMouseMove);
      footer.addEventListener("mouseenter", handleMouseEnter);
      footer.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (footer) {
        footer.removeEventListener("mousemove", handleMouseMove);
        footer.removeEventListener("mouseenter", handleMouseEnter);
        footer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isHovering]);

  // Fade out trails
  useEffect(() => {
    if (trails.length === 0) return;

    const interval = setInterval(() => {
      setTrails((prev) =>
        prev
          .map((trail) => ({ ...trail, opacity: trail.opacity - 0.1 }))
          .filter((trail) => trail.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [trails.length]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer ref={footerRef} className="relative ">
      {/* Mouse Trail */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="pointer-events-none hidden md:block  fixed z-50"
          style={{
            left: trail.x,
            top: trail.y,
          }}
        >
          <div className="w-[119px] h-[119px] bg-[#000000] rounded-full  flex items-center justify-center">
            <span className="text-white text-lg font-medium">Contact</span>
          </div>
        </div>
      ))}

      <div className="px-6 h-[407px] flex items-center">
        <div>
          <h1>Let's talk</h1>
          <p className="text-[28px] md:text-[62px]  font-bold leading-tight tracking-tight">
            Want to have a chat? <br /> Or Just Discuss Ideas?
          </p>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-[#000000] md:hidden dark:bg-white text-white dark:text-[#000000] px-5 py-2 mt-5 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Contact Us
          </button>
        </div>
      </div>
      <div className="px-6 md:hidden">
        <div className="w-full mb-20 md:hidden">
          <form className="relative border flex  w-full md:w-auto border-gray-800 dark:border-gray-300 dark:placeholder:text-gray-200 h-[50px] p-1">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="h-full flex-1 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-100 px-2 border-none outline-0"
            />
            <button
              type="submit"
              className="inline-block bg-gray-800 text-white   h-full px-3"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="min-h-screen hidden md:flex   bg-[url('/images/pamoffice.png')]  flex-col justify-between w-full pt-[142px] px-6">
        <div className="w-full hidden md:flex justify-end">
          <form className="relative border  w-full md:w-auto border-gray-200 h-[50px] p-1">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="h-full  text-white dark:text-white placeholder:text-gray-100 dark:placeholder:text-gray-200 px-2 border-none outline-0"
            />
            <button
              type="submit"
              className="inline-block bg-gray-200 dark:text-[#000000]  h-full px-3"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="relative w-full  backdrop-blur-sm overflow-hidden">
          {/* Main content container */}
          <div className="relative z-10 flex md:items-center flex-col-reverse  md:flex-row   md:justify-between px-8 py-6 h-full">
            {/* Left side - Social icons and address */}
            <div className="flex items-start flex-col ">
              {/* Social media icons */}
              <div className="flex  space-x-1">
                <div className="w-7 h-7 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <Image
                    src="/icons/Vector-1.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <div className="w-7 h-7 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <Image
                    src="/icons/Vector-2.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <div className="w-7 h-7 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <Image
                    src="/icons/Vector-3.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <div className="w-7 h-7 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <Image
                    src="/icons/Vector-4.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <div className="w-7 h-7 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <Image
                    src="/icons/Vector-5.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </div>
              </div>

              {/* Address information */}
              <div className=" py-3 mt-5 flex gap-3 items-center rounded-lg">
                <div className="w-7 h-7 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                  <Image
                    src="/icons/Vector-6.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">
                    Lagos: No. 2 Femi Apashe Street, Aquaview Estate, Lagos,
                    Nigeria
                  </div>
                  <div className="text-white text-xs mt-1">
                    <b>London:</b> 130 Parkdale Road, London, SE18 1RP
                  </div>
                </div>
              </div>
            </div>
            {/* Right side - Contact info and back to top */}
            <div className="flex md:items-center  space-x-8">
              {/* Contact information */}
              <div className="md:text-right text-left">
                <p className="text-white">(Phone)</p>
                <div className="flex items-center md:justify-end space-x-2 text-white/80 text-sm mb-1">
                  <span>+2349026431916</span>
                </div>
                <div className="text-white/60 text-xs">(Inquiries)</div>
                <div className="flex items-center justify-end space-x-2 text-white/80 text-sm mt-2">
                  <span>support@pamafrica.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="  border-t border-gray-600">
          <div className="flex items-center justify-between px-8 py-3">
            <div className="flex gap-10">
              <div className="text-white/60 text-xs">
                © PAM All rights reserved.
              </div>
              <Link
                href="/privacy-policy"
                className="text-white/60 text-xs hover:text-white/80 cursor-pointer hidden md:inline-block"
              >
                Privacy & Legal
              </Link>
            </div>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="border border-white px-3 text-white flex items-center gap-2  h-[48px] cursor-pointer rounded-[4px]"
            >
              <Image
                src="/icons/Chevroup.svg"
                alt="caret"
                width={50}
                height={50}
                className="w-5 h-5 "
              />
              Back to top
            </button>
          </div>
        </div>
      </div>

      <div className=" md:hidden flex   bg-[url('/images/pamoffice.png')]  flex-col justify-between w-full pt-[80px] px-3">
        <div className="text-gray-300 flex flex-col gap-2">
          <div className="">
            <p className="text-gray-500">{`(Phone)`}</p>
            <p>+2348020641916</p>
          </div>
          <div>
            <p className="text-gray-500">{`(Inquiries)`}</p>
            <p>support@pamafrica.com</p>
          </div>
        </div>

        <div>
          <address className="flex gap-2 mt-10 mb-16">
            <div className="h-8 w-8 rounded-full border border-gray-200 flex bg-gray-400 gap-2 justify-center items-center">
              <Image
                src="/icons/Vector-6.svg"
                width={50}
                height={50}
                alt="ff"
                className="w-4 h-4 "
              />
            </div>

            <div className="text-gray-300 text-xs">
              <p>
                <b>Lagos:</b> No. 2 Femi Apashe Street, Aquaview Estate, Lagos,
                Nigeria
              </p>
              <p>
                <b>London:</b> 130 Parkdale Road, London, SE18 1RP
              </p>
            </div>
          </address>

          <article className="mb-10 flex justify-between items-center">
            <div className="flex items-start flex-col ">
              {/* Social media icons */}
              <div className="flex gap-1  space-x-1">
                <Link
                  href="https://www.instagram.com/pamafrica_/"
                  className="w-8 h-8 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Image
                    src="/icons/Vector-1.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </Link>
                <Link
                  href="https://pamafrica.medium.com/"
                  className="w-8 h-8 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Image
                    src="/icons/Vector-2.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </Link>
                <Link
                  href="https://www.youtube.com/@pamafrica1591"
                  className="w-8 h-8 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Image
                    src="/icons/Vector-3.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/pamafrica"
                  className="w-8 h-8 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Image
                    src="/icons/Vector-4.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </Link>
                <Link
                  href="https://twitter.com/pamafrica_"
                  className="w-8 h-8 rounded-full bg-white backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Image
                    src="/icons/Vector-5.svg"
                    width={50}
                    height={50}
                    alt="ff"
                    className="w-4 h-4 text-white"
                  />
                </Link>
              </div>
            </div>

            <button
              onClick={() => scrollTo(0, 0)}
              className="border border-white px-3 text-white flex items-center gap-2  h-[45px] cursor-pointer rounded-[4px]"
            >
              <Image
                src="/icons/Chevroup.svg"
                alt="caret"
                width={50}
                height={50}
                className="w-5 h-5 "
              />
              Back to top
            </button>
          </article>
          <div className="py-5  border-t border-gray-600">
            <div className="flex items-center justify-between px-8 py-3">
              <div className="text-white/60 text-xs">
                © PAM All rights reserved.
              </div>
              <Link
                href="/privacy-policy"
                className="text-white/60 text-xs hover:text-white/80 cursor-pointer  "
              >
                Privacy & Legal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <LetsTalkModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        heroSrc="/images/pam_office.png"
        logoSrc="/icons/pamlogo.svg"
        title="Talk to PAM"
      />
    </footer>
  );
};

export default Contact;
