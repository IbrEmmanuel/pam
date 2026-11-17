"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const NextThemeProvider = ({ children }: { children: ReactNode }) => {
  // data mode
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
};

export default NextThemeProvider;
