"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors.generic");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)]">
      <div className="text-center max-w-md px-8">
        <div className="w-16 h-16 rounded-full bg-[var(--error)]/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-[var(--error)] text-2xl font-serif">!</span>
        </div>
        <h1 className="font-serif text-2xl font-bold mb-3">
          {t("title")}
        </h1>
        <p className="text-sm text-[var(--muted)] mb-8">
          {t("desc")}
        </p>
        <Button onClick={reset} size="lg">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}
