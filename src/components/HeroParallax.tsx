"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";

interface HeroParallaxProps {
  imageSrc: string;
  imageAlt: string;
  overline: string;
  title1: string;
  title2: string;
  title3: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollLabel: string;
}

/**
 * Hero section con parallax suave al scroll.
 * La imagen se mueve a 0.3× velocidad del scroll — efecto sutil y premium.
 * Respeta prefers-reduced-motion.
 */
export function HeroParallax({
  imageSrc,
  imageAlt,
  overline,
  title1,
  title2,
  title3,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  scrollLabel,
}: HeroParallaxProps) {
  const imgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (!imgRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (imgRef.current) {
        const offset = window.scrollY * 0.3;
        imgRef.current.style.transform = `translateY(${offset}px)`;
      }
    });
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section className="relative h-[92dvh] min-h-[650px] max-h-[1100px] overflow-hidden">
      {/* Parallax image wrapper — 120% height so it has room to move */}
      <div
        ref={imgRef}
        className="absolute hero-parallax-img"
        style={{
          inset: "-10% 0",
          height: "120%",
          width: "100%",
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 35%" }}
          priority
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B09]/90 via-[#0D0B09]/45 to-[#0D0B09]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/70 via-transparent to-[#0D0B09]/25" />
      <div className="absolute inset-0 hero-vignette" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          background:
            "radial-gradient(ellipse at 15% 60%, var(--brand-gold) 0%, transparent 50%)",
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-2xl">
            <div className="reveal">
              <p className="overline text-[var(--brand-gold)] mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-[var(--brand-gold)]/60" />
                {overline}
              </p>
            </div>
            <h1
              className="display-heading text-white mb-6 reveal"
              style={{ transitionDelay: "150ms" }}
            >
              {title1}
              <br />
              <span className="accent-text text-[var(--brand-gold-light)]">
                {title2}
              </span>
              <br />
              {title3}
            </h1>
            <p
              className="text-[var(--neutral-300)] text-base sm:text-lg mb-10 max-w-md font-light leading-relaxed reveal"
              style={{ transitionDelay: "300ms" }}
            >
              {subtitle}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 reveal"
              style={{ transitionDelay: "450ms" }}
            >
              <Button
                href="/prodotti"
                size="lg"
                className="btn-luxury bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] tracking-wide"
              >
                {ctaPrimary}
              </Button>
              <Button
                href="/prodotti/sofa-negro"
                variant="outline"
                size="lg"
                className="border-white/20 text-white/90 hover:bg-white/8 hover:border-white/40 tracking-wide"
              >
                {ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal"
        style={{ transitionDelay: "600ms" }}
      >
        <span className="text-white/30 text-[0.7rem] uppercase tracking-[0.35em] font-medium">
          {scrollLabel}
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
