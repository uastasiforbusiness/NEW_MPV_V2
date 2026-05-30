"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { useLocale } from "next-intl";

const locales = [
  { code: "it", label: "IT", full: "Italiano" },
  { code: "en", label: "EN", full: "English" },
  { code: "es", label: "ES", full: "Español" },
] as const;

interface LanguageSwitcherProps {
  /**
   * `"default"` — full labels with separators (for footer/mobile).
   * `"compact"` — minimal inline pill for the header.
   */
  variant?: "default" | "compact";
}

export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  if (variant === "compact") {
    return (
      <div
        className="flex items-center gap-0.5 border border-[var(--border)] rounded-full px-0.5 py-0.5 bg-[var(--surface)]/60 backdrop-blur-sm"
        role="radiogroup"
        aria-label="Lingua / Language / Idioma"
      >
        {locales.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            disabled={isPending}
            role="radio"
            aria-checked={locale === lang.code}
            aria-label={lang.full}
            className={`text-[0.6rem] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full transition-all duration-200 ${
              locale === lang.code
                ? "bg-[var(--brand-gold)] text-[#0D0B09] shadow-sm"
                : "text-[var(--neutral-500)] hover:text-[var(--neutral-300)] hover:bg-[var(--border)]/40"
            } ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Lingua / Language / Idioma">
      {locales.map((lang, i) => (
        <span key={lang.code} className="flex items-center">
          <button
            onClick={() => handleChange(lang.code)}
            disabled={isPending}
            role="radio"
            aria-checked={locale === lang.code}
            aria-label={lang.full}
            className={`text-[0.65rem] font-medium uppercase tracking-[0.12em] px-2 py-1 rounded-sm transition-all duration-200 ${
              locale === lang.code
                ? "text-[var(--brand-gold)]"
                : "text-[var(--neutral-500)] hover:text-[var(--neutral-300)]"
            } ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
          >
            {lang.label}
          </button>
          {i < locales.length - 1 && (
            <span className="w-px h-3 bg-[var(--border)] opacity-30" />
          )}
        </span>
      ))}
    </div>
  );
}
