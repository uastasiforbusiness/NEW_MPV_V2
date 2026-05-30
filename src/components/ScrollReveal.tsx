"use client";

import { useEffect } from "react";

/**
 * IntersectionObserver for scroll-reveal animations.
 * Runs inside useEffect — after React hydration — so it never
 * conflicts with server-rendered HTML.
 */
export function ScrollReveal() {
  useEffect(() => {
    // If user prefers reduced motion, make all elements visible immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll(".reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale")
        .forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const els = document.querySelectorAll(
      ".reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale"
    );
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
