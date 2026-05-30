"use client";

import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark";
  /** Full = ornate frame (splash, footer hero). Compact = cropped "M" mark (header, small spaces). */
  mode?: "full" | "compact";
  size?: number;
  className?: string;
  priority?: boolean;
  /** Visual effect applied to the logo */
  effect?:
    | "none"
    | "shimmer"
    | "glow"
    | "pulse"
    | "float"
    | "gradient"
    | "reveal"
    | "spin";
}

/**
 * MPV Italia logo — Rendered WebP brand marks with visual effects.
 *
 * Variants (legacy):
 * - variant="light": legacy support
 * - variant="dark": legacy support
 *
 * Modes:
 * - mode="full": ornate circular frame with all decorative elements
 * - mode="compact": gold lettermark/logo
 */
export function Logo({
  variant = "light",
  mode = "full",
  size = 32,
  className = "",
  effect = "none",
  priority = false,
}: LogoProps) {
  // Determine which image to load based on the mode
  const src = mode === "full"
    ? "/images/logo/LOGO_LUXURY_no_background.svg"
    : "/images/logo/LOGO_no_background.svg";

  const alt = "MPV Italia";

  // Map effect to container CSS class
  const effectClass =
    effect === "none" ? "" : `mpv-logo mpv-logo--${effect}`;

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={`mpv-logo__svg object-contain ${className}`}
      style={{
        width: size ? `${size}px` : "auto",
        height: size ? `${size}px` : "auto",
      }}
    />
  );

  // For glow effect, add the glow ring behind the image
  if (effect === "glow") {
    return (
      <span className={effectClass}>
        <span className="mpv-logo__glow-ring" />
        {imageElement}
      </span>
    );
  }

  // For shimmer, pulse, float, reveal — wrap in container
  if (effect !== "none") {
    return <span className={effectClass}>{imageElement}</span>;
  }

  // No effect — return Image directly
  return imageElement;
}
