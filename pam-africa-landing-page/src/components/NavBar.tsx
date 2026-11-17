"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import LetsTalkModal from "./lets-talk/LetsTalkModal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { Variants } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const nav = [
  { href: "/", label: "Home", num: "1", image: "default.png" },
  { href: "/about", label: "About", num: "4", image: "about.png" },
  { href: "/enablers", label: "Enablers", num: "2", image: "enabler.png" },
  { href: "/projects", label: "Projects", num: "3", image: "project.png" },
  { href: "/journals", label: "Journals", num: "5", image: "journal.png" },
] as const;

export default function NavBar({ className }: { className?: string }) {
  const [openLetTalk, setOpenLetTalk] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const slideUp: Variants = {
    hidden: { y: 50, opacity: 0 },
    show: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 2, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
    }),
  };
  // Prevent body scroll when menu is open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [open]);
  const [hoveredImg, setHoveredImg] = React.useState<string | null>(null);
  const defaultImg = nav[0].image; // "default.png"
  // Close on ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav
        className={`h-[80px] w-full sticky bg-white/60 dark:bg-[#000000]/60 z-50 top-0 flex items-center justify-between px-3 ${className}`}
      >
        {/* Left: Logo */}
        <Link
          href="/"
          className={`flex relative items-center ${
            isActive("/")
              ? "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-[#000000] dark:after:bg-white"
              : "opacity-90 hover:opacity-100"
          }`}
        >
          Home
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {nav.slice(1).map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={[
                  "relative pb-1 transition-colors",
                  isActive(href)
                    ? "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-[#000000] dark:after:bg-white"
                    : "opacity-90 hover:opacity-100",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Desktop Let's Talk as a button (opens modal) */}
          <li>
            <button
              type="button"
              onClick={() => setOpenLetTalk(true)}
              className={[
                "relative pb-1 transition-colors",
                "opacity-90 hover:opacity-100",
              ].join(" ")}
            >
              Let&apos;s Talk
            </button>
          </li>
        </ul>

        {/* Theme + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            className="ml-2 rounded px-3 py-1.5 border border-white/20 hover:bg-white/5 md:ml-6"
          >
            Menu
          </button>
        </div>
      </nav>

      {/* ---------- Animated Overlay (Mobile / Slide-in) ---------- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50 bg-[#000000]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.aside
              key="panel"
              className="fixed inset-0 flex flex-col justify-between z-50 text-white overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
              role="dialog"
              aria-modal="true"
            >
              <div>
                <div className="flex mt-1  gap-2 md:gap-0 ml-4 md:ml-0 flex-col md:flex-row max-w-7xl">
                  {nav.map((navbar, i) => (
                    <motion.div
                      key={navbar.href}
                      custom={i}
                      initial="hidden"
                      animate="show"
                      variants={slideUp}
                    >
                      <Link
                        href={navbar.href}
                        className="text-[clamp(2.5rem,4.5vw,10rem)] px-1  font-bold"
                        onMouseEnter={() => setHoveredImg(navbar.image)}
                        onMouseLeave={() => setHoveredImg(null)}
                        onFocus={() => setHoveredImg(navbar.image)}
                        onBlur={() => setHoveredImg(null)}
                      >
                        {navbar.label},
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-lg absolute right-5 top-3 hover:opacity-70 flex "
                  aria-label="Close"
                >
                  Close
                </button>
              </div>

              <div>
                <ContactStrip />
              </div>
              <div className="hidden md:flex flex-row-reverse justify-between">
                {nav.map((item, index) => {
                  const isVisible =
                    hoveredImg === item.image || (!hoveredImg && index === 0);
                  return (
                    <Image
                      key={item.image}
                      src={`/navbar/${item.image}`}
                      width={200}
                      height={200}
                      alt={item.image}
                      className={`${isVisible ? "visible" : "invisible"} `}
                    />
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Modal */}
      <LetsTalkModal
        open={openLetTalk}
        onClose={() => setOpenLetTalk(false)}
        heroSrc="/images/pam_office.png"
        logoSrc="/icons/pamlogo.svg"
        title="Talk to PAM"
      />
    </>
  );
}

function ContactStrip({
  phone = "+2348020641916",
  email = "support@pamafrica.com",
  socials = [
    { label: "instagram", href: "https://www.instagram.com/pamafrica_/" },
    { label: "medium", href: "https://pamafrica.medium.com/" },
    { label: "youtube", href: "https://www.youtube.com/@pamafrica1591" },
    { label: "linkedin", href: "https://www.linkedin.com/company/pamafrica" },
    { label: "twitter", href: "https://www.linkedin.com/company/pamafrica" },
  ],
}: {
  phone?: string;
  email?: string;
  socials?: { label: string; href: string }[];
}) {
  return (
    <section className="w-full lg:mt-20 mb-5">
      <div className="w-full px-4 ">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:items-start">
          {/* Left: CTA Button */}
          <div className="flex md:justify-start  col-span-2 md:col-span-1">
            <p className="inline-flex h-12 items-center justify-center rounded-sm px-6 text-sm tracking-wide  transition-colors">
              Contact
            </p>
          </div>

          {/* Middle: Phone & Inquiries */}
          <div className="space-y-4 md:justify-self-center">
            <div>
              <p className="text-sm text-gray-400">(Phone)</p>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="mt-1 block text-lg text-white/90 hover:text-white"
              >
                {phone}
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-400">(Inquiries)</p>
              <a
                href={`mailto:${email}`}
                className="mt-1 block text-lg text-white/90 hover:text-white break-words"
              >
                {email}
              </a>
            </div>
          </div>

          {/* Right: Socials (right-aligned, vertical) */}
          <ul className="space-y-2 md:justify-self-end text-right">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
