"use client";

import { useTranslations } from "next-intl";

import { useCartStore } from "@/store/cart";
import { ivaBreakdown } from "@/lib/iva";
import { Button } from "@/components/ui";

export function CartSummary() {
  const t = useTranslations("cart.summary");
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const breakdown = ivaBreakdown(subtotal);

  if (items.length === 0) return null;

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
      <h3 className="font-serif text-lg font-semibold mb-4">
        {t("title")}
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t("subtotal")}</span>
          <span className="font-medium">{breakdown.subtotalFormatted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">
            {t("iva", { rate: breakdown.ivaRateFormatted })}
          </span>
          <span className="font-medium">{breakdown.ivaAmountFormatted}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">{t("shipping")}</span>
          <span className="text-[var(--success)] font-medium">{t("shippingFree")}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex justify-between items-baseline">
          <span className="font-serif font-semibold text-base">{t("total")}</span>
          <span className="font-serif font-bold text-xl">
            {breakdown.totalFormatted}
          </span>
        </div>
        <p className="text-xs text-[var(--muted)] mt-1 text-right">
          {t("ivaIncluded", { rate: breakdown.ivaRateFormatted })}
        </p>
      </div>

      <Button
        href="/checkout"
        size="lg"
        fullWidth
        className="mt-6"
      >
        {t("checkoutCta")}
      </Button>
    </div>
  );
}
