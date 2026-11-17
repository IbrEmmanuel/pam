"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button className="sm:flex items-center gap-3 hidden  dark:text-gray-200">
      <span
        className={`${theme === "light" && "text-gray-600"}`}
        onClick={() => setTheme("light")}
      >
        Light
      </span>
      <span>/</span>
      <span
        className={`${theme === "dark" && "text-gray-600"}`}
        onClick={() => setTheme("dark")}
      >
        Dark
      </span>
    </button>
  );
}
