"use client";

import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart";
import { ivaBreakdown, formatCurrency } from "@/lib/iva";
import { Button } from "@/components/ui";
import type { Address } from "@/types/order";

interface OrderReviewProps {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function OrderReview({
  shippingAddress,
  billingAddress,
  paymentMethod,
  onBack,
  onSubmit,
  isSubmitting = false,
}: OrderReviewProps) {
  const t = useTranslations("checkout.review");
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const breakdown = ivaBreakdown(subtotal);

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-semibold mb-6">
        {t("title")}
      </h2>

      {/* Items */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] divide-y divide-[var(--border)]">
        <div className="px-4 py-3 bg-[var(--neutral-50)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {t("products", { count: items.length })}
          </p>
        </div>
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-[var(--muted)]">
                {t("qty", { qty: item.quantity, price: formatCurrency(item.price) })}
              </p>
            </div>
            <p className="text-sm font-medium">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
        <div className="px-4 py-3 bg-[var(--neutral-50)] border-b border-[var(--border)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {t("shippingTo")}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-sm text-[var(--muted)]">{shippingAddress.street}</p>
          <p className="text-sm text-[var(--muted)]">
            {shippingAddress.cap} {shippingAddress.city} ({shippingAddress.province})
          </p>
          <p className="text-sm text-[var(--muted)]">{shippingAddress.phone}</p>
        </div>
      </div>

      {/* Billing */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]">
        <div className="px-4 py-3 bg-[var(--neutral-50)] border-b border-[var(--border)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {t("billingTitle")}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm">
            {billingAddress.firstName} {billingAddress.lastName}
          </p>
          <p className="text-sm text-[var(--muted)]">{billingAddress.street}</p>
          <p className="text-sm text-[var(--muted)]">
            {billingAddress.cap} {billingAddress.city} ({billingAddress.province})
          </p>
          <p className="text-sm text-[var(--muted)] capitalize mt-2">
            {t("payment", { method: paymentMethod === "nexi" ? t("paymentCard") : "PayPal" })}
          </p>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">{t("subtotal")}</span>
            <span>{breakdown.subtotalFormatted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">
              {t("iva", { rate: breakdown.ivaRateFormatted })}
            </span>
            <span>{breakdown.ivaAmountFormatted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">{t("shipping")}</span>
            <span className="text-[var(--success)]">{t("shippingFree")}</span>
          </div>
        </div>
        <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-[var(--border)]">
          <span className="font-serif font-semibold text-lg">{t("total")}</span>
          <span className="font-serif font-bold text-2xl">
            {breakdown.totalFormatted}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Indietro
        </Button>
        <Button
          onClick={onSubmit}
          size="lg"
          isLoading={isSubmitting}
        >
          {isSubmitting ? t("processing") : t("pay", { total: breakdown.totalFormatted })}
        </Button>
      </div>
    </div>
  );
}
