"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors.generic");

  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center max-w-md px-8">
        <div className="w-16 h-16 rounded-full bg-[var(--error)]/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-[var(--error)] text-2xl font-serif">!</span>
        </div>
        <h2 className="font-serif text-xl font-semibold mb-3">
          {t("title")}
        </h2>
        <p className="text-sm text-[var(--muted)] mb-8">
          {t("desc")}
        </p>
        <Button onClick={reset} size="md">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}
