"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
  thumbnailLabel?: string;
}

export function ProductGallery({ images, productName, thumbnailLabel = "Vedi immagine" }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, goNext, goPrev]);

  if (images.length === 0) return null;

  const selected = images[selectedIndex];

  return (
    <>
      <div className="flex flex-col gap-4 reveal">
        {/* Main Image — clickable to open lightbox */}
        <button
          onClick={openLightbox}
          className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--neutral-100)] ken-burns group cursor-zoom-in"
          aria-label={`Zoom ${productName}`}
        >
          <Image
            src={selected.src}
            alt={selected.alt || `${productName} - Vista ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority={selectedIndex === 0}
          />
          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--brand-charcoal)]/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
            <span className="text-white text-[0.65rem] font-semibold uppercase tracking-wider">Zoom</span>
          </div>
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  relative w-20 h-20 flex-shrink-0 rounded-[var(--radius-md)]
                  overflow-hidden border-2 transition-all duration-[var(--transition-fast)]
                  ${
                    index === selectedIndex
                      ? "border-[var(--accent)] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }
                `}
                aria-label={`${thumbnailLabel} ${index + 1}: ${image.alt || productName}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt || `${productName} - Miniatura ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} - Gallery`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[var(--brand-charcoal)]/95 backdrop-blur-sm"
            onClick={closeLightbox}
          />

          {/* Content */}
          <div className="relative z-10 w-full max-w-5xl mx-4 aspect-[4/3]">
            <Image
              src={selected.src}
              alt={selected.alt || `${productName} - Vista ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain"
            />
          </div>

          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                aria-label="Previous image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
                aria-label="Next image"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                className={`h-1 rounded-full transition-all duration-400 ${
                  i === selectedIndex
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
