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
  /** If true, loads SVG with a native clipPath circle */
  round?: boolean;
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
  round = false,
}: LogoProps) {
  // Determine which image to load based on the mode
  const src =
    mode === "full"
      ? round
        ? "/images/logo/LOGO_LUXURY_round.svg"
        : "/images/logo/LOGO_LUXURY_no_background.svg"
      : round
        ? "/images/logo/LOGO_round.svg"
        : "/images/logo/LOGO_no_background.svg";

  const alt = "MPV Italia";

  // Map effect + variant to container CSS classes
  const variantClass = variant === "dark" ? "mpv-logo--dark-variant" : "";
  const effectClass =
    effect === "none" ? variantClass : `mpv-logo mpv-logo--${effect} ${variantClass}`;

  // SVG viewBox is 1536×1024 (3:2 aspect ratio)
  const SVG_ASPECT = 1024 / 1536; // ≈ 0.6667
  const logoHeight = Math.round(size * SVG_ASPECT);

  const imageElement = (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={logoHeight}
      priority={priority}
      unoptimized
      className={`mpv-logo__svg ${className}`}
      style={{
        width: size ? `${size}px` : "auto",
        height: logoHeight ? `${logoHeight}px` : "auto",
        maxWidth: "100%",
        display: "block",
      }}
    />
  );

  // Build container style: match image dimensions exactly
  // Container must preserve the SVG viewBox ratio (1536×1024 = 3:2)
  // so the clipPath circle renders as a perfect circle, not an ellipse.
  const containerStyle: React.CSSProperties = {
    width: size,
    height: logoHeight,
    maxWidth: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  // For glow effect, add the glow ring behind the image
  if (effect === "glow") {
    return (
      <span
        className={`${effectClass} ${className}`}
        style={containerStyle}
      >
        <span className="mpv-logo__glow-ring" />
        {imageElement}
      </span>
    );
  }

  // For shimmer, pulse, float, reveal, spin — wrap in container
  if (effect !== "none") {
    return (
      <span
        className={`${effectClass} ${className}`}
        style={containerStyle}
      >
        {imageElement}
      </span>
    );
  }

  // Always wrap in a container for consistent sizing, even with no effect
  const containerClasses = [
    "mpv-logo",
    variantClass,
    className,
  ].filter(Boolean).join(" ");

  return (
    <span
      className={containerClasses}
      style={containerStyle}
    >
      {imageElement}
    </span>
  );
}
