"use client";

import { useState } from "react";
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

  if (images.length === 0) return null;

  const selected = images[selectedIndex];

  return (
    <div className="flex flex-col gap-4 reveal">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--neutral-100)] ken-burns">
        <Image
          src={selected.src}
          alt={selected.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={selectedIndex === 0}
        />
      </div>

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
              aria-label={`${thumbnailLabel} ${index + 1}: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
