"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavProject = {
  name: string;
  href: string;
};

const DEFAULT_PROJECTS: NavProject[] = [
  { name: "Net Zero Villages", href: "#net-zero-villages" },
  { name: "Solar Battery Hub - SBH", href: "#solar-battery-hub-sbh" },
  { name: "So-Cool", href: "#so-cool" },
  { name: "Punch Newspaper", href: "#punch-newspaper" },
  { name: "New Telegraph", href: "#new-telegraph" },
];

const Navigation = ({ projects = DEFAULT_PROJECTS }: { projects?: NavProject[] }) => {
  const [isOpen, setIsOpen] = useState(true);

  // container/list animation
  const listVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.04,
        duration: 0.24,
      },
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { when: "afterChildren", duration: 0.2 },
    },
  };

  // each item animation
  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.18 } },
    collapsed: { opacity: 0, y: -6, transition: { duration: 0.12 } },
  };

  return (
    <aside className="w-full px-4 md:px-0 max-w-2xl md:mt-10 mx-auto">
      <button
        className="flex items-center gap-2 font-semibold text-sm cursor-pointer select-none"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="project-list"
      >
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <ChevronUp />
        </motion.span>
        All projects
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            id="project-list"
            key="projects"
            className="mt-3 space-y-2 overflow-hidden"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={listVariants}
          >
            {projects.map((p) => (
              <motion.li key={p.name} variants={itemVariants}>
                <a
                  href={p.href}
                  className="transition-colors hover:text-gray-600"
                >
                  {p.name}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default Navigation;
