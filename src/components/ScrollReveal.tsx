"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

const SELECTORS =
  ".reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale";

function attachObserver(): () => void {
  // If user prefers reduced motion, make all elements visible immediately
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelectorAll(SELECTORS)
      .forEach((el) => el.classList.add("visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Once revealed, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  const els = document.querySelectorAll(SELECTORS);
  els.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

/**
 * IntersectionObserver for scroll-reveal animations.
 * Re-attaches on every route change to handle SPA navigation.
 * Uses unobserve() after reveal to avoid re-hiding elements.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to let React finish rendering the new route
    const timer = setTimeout(() => {
      const cleanup = attachObserver();
      return cleanup;
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
