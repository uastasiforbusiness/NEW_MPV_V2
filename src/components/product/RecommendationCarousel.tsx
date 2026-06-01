"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ProductCard } from "./ProductCard";
import { getAllProducts } from "@/data/products";

interface RecommendationCarouselProps {
  currentSlug: string;
  limit?: number;
  title?: string;
}

export function RecommendationCarousel({
  currentSlug,
  limit = 4,
  title = "Potrebbe piacerti anche",
}: RecommendationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const related = getAllProducts()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);

    // Calculate active index based on scroll position
    const cardWidth = el.querySelector(":scope > *")?.clientWidth ?? 320;
    const gap = 24;
    const index = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, related.length - 1));
  }, [related.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(":scope > *")?.clientWidth ?? 320;
    const gap = 24;
    el.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  };

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      {/* Header with navigation arrows */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl font-semibold">{title}</h2>
        {related.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => scrollTo(activeIndex - 1)}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--foreground)]"
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => scrollTo(activeIndex + 1)}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--foreground)]"
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Scrollable carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {related.map((product, i) => (
          <div
            key={product.slug}
            className="flex-shrink-0 w-[75vw] sm:w-[45vw] lg:w-[320px] snap-start"
          >
            <ProductCard
              slug={product.slug}
              name={product.name}
              price={product.price_eur}
              image={product.images[0].src}
              color={product.color}
              stockStatus={product.stock_status}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* Gold dot indicators */}
      {related.length > 1 && (
        <div className="flex justify-center gap-2.5 mt-6">
          {related.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "w-8 bg-[var(--accent)]"
                  : "w-1.5 bg-[var(--neutral-300)] hover:bg-[var(--neutral-400)]"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
