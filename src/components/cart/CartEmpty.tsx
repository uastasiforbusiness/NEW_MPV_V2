"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

export function CartEmpty() {
  const t = useTranslations("cart.empty");

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--neutral-100)] flex items-center justify-center mb-6" aria-hidden="true">
        <svg
          className="w-8 h-8 text-[var(--muted)]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
      <h2 className="font-serif text-2xl font-semibold mb-2">
        {t("title")}
      </h2>
      <p className="text-sm text-[var(--muted)] mb-8 max-w-sm">
        {t("desc")}
      </p>
      <Button href="/prodotti" size="lg">
        {t("cta")}
      </Button>
    </div>
  );
}
