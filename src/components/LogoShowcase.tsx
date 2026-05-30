"use client";

import { Logo } from "@/components/Logo";

const effects = [
  { name: "none", label: "Static", description: "Default — no animation" },
  { name: "shimmer", label: "Shimmer", description: "Gold shimmer sweep" },
  { name: "glow", label: "Glow", description: "Pulsing gold glow" },
  { name: "pulse", label: "Pulse", description: "Breathing scale" },
  { name: "float", label: "Float", description: "Gentle float" },
  { name: "gradient", label: "Gradient", description: "Animated gold gradient" },
  { name: "reveal", label: "Reveal", description: "Draw-in reveal" },
] as const;

/**
 * Logo effect showcase — displays all available logo effects side by side.
 * Useful for design review and testing. Not linked in production navigation.
 */
export function LogoShowcase() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="display-heading text-center mb-4">Logo Harness</h2>
        <p className="body-text text-center max-w-xl mx-auto mb-16">
          All available visual effects for the MPV Italia logo. Each effect is
          composable with any variant (light/dark) and mode (full/compact).
        </p>

        {/* Effect Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {effects.map((effect) => (
            <div
              key={effect.name}
              className="luxury-card bg-[var(--surface)] rounded-[var(--radius-lg)] p-8 flex flex-col items-center gap-6 border border-[var(--border)]"
            >
              <div className="flex items-center justify-center w-24 h-24">
                <Logo
                  variant="light"
                  mode="full"
                  size={80}
                  effect={effect.name as "none" | "shimmer" | "glow" | "pulse" | "float" | "gradient" | "reveal"}
                />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] mb-1">
                  {effect.label}
                </h3>
                <p className="text-xs text-[var(--neutral-500)] font-light">
                  {effect.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Variant Comparison */}
        <h3 className="text-center overline mb-8">Variant Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Light variant */}
          <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-10 border border-[var(--border)] flex flex-col items-center gap-6">
            <span className="overline">Light Variant</span>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Logo variant="light" mode="full" size={64} effect="shimmer" />
                <p className="text-xs text-[var(--neutral-500)] mt-2">Full</p>
              </div>
              <div className="text-center">
                <Logo variant="light" mode="compact" size={48} effect="shimmer" />
                <p className="text-xs text-[var(--neutral-500)] mt-2">Compact</p>
              </div>
            </div>
          </div>

          {/* Dark variant */}
          <div className="bg-[var(--brand-charcoal)] rounded-[var(--radius-lg)] p-10 flex flex-col items-center gap-6">
            <span className="overline text-[var(--brand-gold-muted)]">Dark Variant</span>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Logo variant="dark" mode="full" size={64} effect="glow" />
                <p className="text-xs text-[var(--neutral-400)] mt-2">Full</p>
              </div>
              <div className="text-center">
                <Logo variant="dark" mode="compact" size={48} effect="glow" />
                <p className="text-xs text-[var(--neutral-400)] mt-2">Compact</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-[var(--surface-warm)] rounded-[var(--radius-lg)] p-8 lg:p-12 border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Usage
          </h3>
          <pre className="text-sm overflow-x-auto text-[var(--neutral-700)] font-mono leading-relaxed">
{`<Logo
  variant="light"   // "light" | "dark"
  mode="compact"    // "full" | "compact"
  size={36}
  effect="shimmer"  // "none" | "shimmer" | "glow" | "pulse" | "float" | "gradient" | "reveal"
/>`}
          </pre>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[var(--neutral-600)]">
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Header</p>
              <p className="font-light"><code>effect=&quot;shimmer&quot;</code> — subtle gold sweep on load</p>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Footer</p>
              <p className="font-light"><code>effect=&quot;glow&quot;</code> — ambient gold pulse</p>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Splash</p>
              <p className="font-light"><code>effect=&quot;reveal&quot;</code> — cinematic draw-in</p>
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)] mb-1">Product Cards</p>
              <p className="font-light"><code>effect=&quot;float&quot;</code> — gentle hover float</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
