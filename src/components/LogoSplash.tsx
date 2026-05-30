"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";

type Phase = "bloom" | "reveal" | "text" | "hold" | "lift" | "done";

/**
 * Cinematic first-visit logo splash.
 * Plays once per session (sessionStorage gated).
 *
 * Sequence:
 *   bloom   → gold light blooms + ripple rings expand from center
 *   reveal  → logo draws in with staggered mask + glow
 *   text    → brand name + tagline + filigree extend
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
    const t2 = setTimeout(() => setPhase("text"), 1500);
    const t3 = setTimeout(() => setPhase("hold"), 2600);
    const t4 = setTimeout(() => setPhase("lift"), 3500);
    const t5 = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("mpv-splash-seen", "1");
    }, 4300);

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
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Central gold bloom — ellipse más grande e intensa */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
          phase === "bloom" || phase === "reveal" || phase === "text"
            ? "opacity-100"
            : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.06) 45%, transparent 70%)",
        }}
      />

      {/* Corner vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%)",
          opacity: 1,
          transition: "opacity 1000ms",
        }}
      />

      {/* ---------- Ripple rings ---------- */}
      <RippleRings visible={phase !== "bloom"} />

      {/* ---------- Floating gold particles ---------- */}
      <Particles visible={phase !== "bloom"} />

      {/* ---------- Main content ---------- */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo — ahora 120px (era 64px) */}
        <div
          className={`relative transition-all duration-[1000ms] ease-out ${
            phase === "reveal" || phase === "text" || phase === "hold"
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-90"
          }`}
        >
          {/* Glow ring behind logo */}
          <div
            className={`absolute rounded-full transition-all duration-[1400ms] ease-out ${
              phase === "reveal" || phase === "text" || phase === "hold"
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75"
            }`}
            style={{
              inset: "-50%",
              background:
                "radial-gradient(circle, rgba(201,169,110,0.3) 0%, rgba(201,169,110,0.08) 50%, transparent 70%)",
              filter: "blur(24px)",
              zIndex: 0,
            }}
          />
          <div className="relative z-[1]">
            <Logo variant="dark" mode="full" size={120} effect="reveal" priority />
          </div>
        </div>

        {/* Nombre de marca — MPV Italia con stagger */}
        <div
          className={`flex flex-col items-center gap-1 transition-all duration-600 ease-out ${
            phase === "text" || phase === "hold"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: phase === "text" ? "100ms" : "0ms" }}
        >
          <p
            className="text-xl font-semibold tracking-[0.35em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MPV Italia
          </p>
        </div>

        {/* Tagline + filigree */}
        <div
          className={`flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
            phase === "text" || phase === "hold"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: phase === "text" ? "250ms" : "0ms" }}
        >
          <p
            className="text-[0.65rem] uppercase tracking-[0.45em] font-medium text-[var(--brand-gold-muted)]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Luxury Pet Furniture
          </p>

          {/* Filigree line */}
          <div className="flex items-center gap-3">
            <span
              className={`block h-px bg-gradient-to-r from-transparent to-[var(--brand-gold)]/50 transition-all duration-[600ms] ease-out ${
                phase === "text" || phase === "hold" ? "w-16" : "w-0"
              }`}
              style={{ transitionDelay: "350ms" }}
            />
            <span className="block w-1 h-1 rounded-full bg-[var(--brand-gold)]/70" />
            <span
              className={`block h-px bg-gradient-to-l from-transparent to-[var(--brand-gold)]/50 transition-all duration-[600ms] ease-out ${
                phase === "text" || phase === "hold" ? "w-16" : "w-0"
              }`}
              style={{ transitionDelay: "350ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ripple Rings — anillos dorados que emanan del centro               */
/* ------------------------------------------------------------------ */

function RippleRings({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="mpv-splash-ripple"
          style={{
            width: "200px",
            height: "200px",
            animationDelay: `${i * 0.65}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Particles — pure CSS animated gold dust                           */
/* ------------------------------------------------------------------ */

function Particles({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 2.8}s`,
    duration: `${3 + Math.random() * 4.5}s`,
    size: `${0.8 + Math.random() * 2.5}px`,
    drift: `${-35 + Math.random() * 70}px`,
    opacity: 0.4 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[var(--brand-gold)]"
          style={{
            left: p.left,
            bottom: "15%",
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
