"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";

function ConfirmationContent() {
  const t = useTranslations("checkout.confirmation");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-000000";

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-[var(--success)]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
        {t("title")}
      </h1>
      <p className="text-[var(--muted)] text-base mb-2">
        {t("thanks")}
      </p>
      <p className="font-mono text-lg font-bold text-[var(--accent)] mb-8">
        {orderId}
      </p>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 mb-8 text-left">
        <h3 className="font-serif font-semibold mb-3">
          {t("whatNow")}
        </h3>
        <ol className="space-y-3 text-sm text-[var(--muted)]">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <span>{t("step1")}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <span>{t("step2")}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <span>{t("step3")}</span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button href="/" variant="outline" size="lg">
          {t("backHome")}
        </Button>
        <Button href="/prodotti" size="lg">
          {t("continueShopping")}
        </Button>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  const t = useTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
