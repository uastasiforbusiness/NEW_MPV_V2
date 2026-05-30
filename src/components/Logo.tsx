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
 * MPV Italia logo — Rendered SVG brand marks with visual effects.
 *
 * Variants:
 * - variant="light": para fondos claros — filtro normal
 * - variant="dark": para fondos oscuros — brightness/contrast amplificado
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
  const src =
    mode === "full"
      ? "/images/logo/LOGO_LUXURY_no_background.svg"
      : "/images/logo/LOGO_no_background.svg";

  const alt = "MPV Italia";

  // Map effect + variant to container CSS classes
  const variantClass = variant === "dark" ? "mpv-logo--dark-variant" : "";
  const effectClass =
    effect === "none" ? variantClass : `mpv-logo mpv-logo--${effect} ${variantClass}`;

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
        display: "block",
      }}
    />
  );

  // For glow effect, add the glow ring behind the image
  if (effect === "glow") {
    return (
      <span
        className={effectClass}
        style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <span className="mpv-logo__glow-ring" />
        {imageElement}
      </span>
    );
  }

  // For shimmer, pulse, float, reveal, spin — wrap in container with explicit size
  if (effect !== "none") {
    return (
      <span
        className={effectClass}
        style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        {imageElement}
      </span>
    );
  }

  // No effect — still apply variant class if dark, else return Image directly
  if (variantClass) {
    return (
      <span
        className={`mpv-logo ${variantClass}`}
        style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        {imageElement}
      </span>
    );
  }

  return imageElement;
}
