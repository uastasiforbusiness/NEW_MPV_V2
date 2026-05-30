"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";

type Phase = "bloom" | "reveal" | "text" | "hold" | "lift" | "done";

/**
 * Cinematic first-visit logo splash.
 * Plays once per session (sessionStorage gated).
 *
 * Sequence:
 *   bloom   → gold light blooms from center
 *   reveal  → logo draws in with staggered mask + glow
 *   text    → tagline + filigree line extend
 *   hold    → brief pause for brand impression
 *   lift    → whole splash dissolves upward
 */
export function LogoSplash() {
  const [phase, setPhase] = useState<Phase>("bloom");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      prefersReducedMotion ||
      (typeof window !== "undefined" &&
        sessionStorage.getItem("mpv-splash-seen"))
    ) {
      setPhase("done");
      return;
    }

    const t1 = setTimeout(() => setPhase("reveal"), 500);
    const t2 = setTimeout(() => setPhase("text"), 1400);
    const t3 = setTimeout(() => setPhase("hold"), 2400);
    const t4 = setTimeout(() => setPhase("lift"), 3200);
    const t5 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("mpv-splash-seen", "1");
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (phase === "done") return null;

  const isLifting = phase === "lift";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden transition-all duration-700 ease-out ${
        isLifting
          ? "opacity-0 -translate-y-10 scale-[0.97]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
      style={{
        backgroundColor: "var(--brand-charcoal)",
        pointerEvents: isLifting ? "none" : "auto",
      }}
    >
      {/* ---------- Ambient layers ---------- */}

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Central gold bloom */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
          phase === "bloom" || phase === "reveal" || phase === "text"
            ? "opacity-100"
            : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Corner vignette */}
      <div
        className="absolute inset-0 transition-opacity duration-[1000ms]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          opacity: phase === "done" ? 0 : 1,
        }}
      />

      {/* ---------- Floating gold particles ---------- */}
      <Particles visible={phase !== "done" && phase !== "bloom"} />

      {/* ---------- Main content ---------- */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <div
          className={`relative transition-all duration-[1000ms] ease-out ${
            phase === "reveal" || phase === "text" || phase === "hold"
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          {/* Glow ring behind logo */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-[1400ms] ease-out ${
              phase === "reveal" || phase === "text" || phase === "hold"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75"
            }`}
            style={{
              background:
                "radial-gradient(circle, rgba(201,169,110,0.25) 0%, rgba(201,169,110,0.05) 50%, transparent 70%)",
              filter: "blur(20px)",
              transform: "scale(1.6)",
              zIndex: 0,
            }}
          />
          <div className="relative z-[1]">
            <Logo variant="dark" mode="full" size={64} effect="reveal" priority />
          </div>
        </div>

        {/* Tagline */}
        <div
          className={`flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
            phase === "text" || phase === "hold"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <p
            className="text-[0.7rem] uppercase tracking-[0.4em] font-medium text-[var(--brand-gold-muted)]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Luxury Pet Furniture
          </p>

          {/* Filigree line */}
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-gradient-to-r from-transparent to-[var(--brand-gold)]/40" />
            <span className="block w-1 h-1 rounded-full bg-[var(--brand-gold)]/60" />
            <span className="block h-px w-8 bg-gradient-to-l from-transparent to-[var(--brand-gold)]/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Particles — pure CSS animated gold dust                           */
/* ------------------------------------------------------------------ */

function Particles({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${15 + Math.random() * 70}%`,
    delay: `${Math.random() * 2.5}s`,
    duration: `${3 + Math.random() * 4}s`,
    size: `${1 + Math.random() * 2}px`,
    drift: `${-20 + Math.random() * 40}px`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[var(--brand-gold)]"
          style={{
            left: p.left,
            bottom: "20%",
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `mpv-particle ${p.duration} ${p.delay} ease-in infinite`,
            "--drift": p.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
