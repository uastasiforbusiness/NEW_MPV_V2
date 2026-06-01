"use client";

import type { ReactNode } from "react";
import { LogoSplash } from "@/components/LogoSplash";

/**
 * Client wrapper that mounts the first-visit splash screen.
 * Must be inside a <body> with suppressHydrationWarning for localStorage checks.
 */
export function SplashProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <LogoSplash />
      {children}
    </>
  );
}
