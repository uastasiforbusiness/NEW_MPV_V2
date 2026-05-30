"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency, ivaBreakdown } from "@/lib/iva";
import { Button } from "@/components/ui";
import { useCartStore } from "@/store/cart";

interface ProductInfoProps {
  slug: string;
  name: string;
  price: number;
  ivaRate: number;
  description: string;
  materials: string;
  dimensions: string;
  weightKg: number;
  color: string;
  stockStatus: string;
  image: string;
}

export function ProductInfo({
  slug,
  name,
  price,
  ivaRate,
  description,
  materials,
  dimensions,
  weightKg,
  color,
  stockStatus,
  image,
}: ProductInfoProps) {
  const t = useTranslations("product");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const [addedToCart, setAddedToCart] = useState(false);

  const breakdown = ivaBreakdown(price * quantity, ivaRate);

  const stockLabels: Record<string, { className: string; icon: string }> = {
    disponibile: { className: "text-[var(--success)]", icon: "✓" },
    su_ordinazione: { className: "text-[var(--warning)]", icon: "ℹ" },
    esaurito: { className: "text-[var(--error)]", icon: "✕" },
  };

  const stock = stockLabels[stockStatus] || stockLabels.esaurito;

  const handleAddToCart = () => {
    addItem({
      productId: slug,
      slug,
      name,
      price,
      quantity,
      image,
      color,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Color & Stock */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--muted)]">{color}</span>
        <span className="text-sm text-[var(--neutral-300)]">|</span>
        <span className={`text-sm font-medium ${stock.className}`}>
          {stock.icon} {t(`stockBadge.${stockStatus}`, { fallback: t("stock.esaurito") })}
        </span>
      </div>

      {/* Price */}
      <div>
        <p className="text-3xl font-serif font-bold">
          {formatCurrency(price)}
        </p>
        <p className="text-sm text-[var(--muted)] mt-1">
          {t("ivaIncluded", { amount: formatCurrency(price - price / (1 + ivaRate)) })}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--muted)] leading-relaxed">
        {description}
      </p>

      {/* Materials */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
          {t("materials")}
        </h4>
        <p className="text-sm">{materials}</p>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4 py-4 border-t border-[var(--border)]">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
            {t("dimensions")}
          </h4>
          <p className="text-sm">{dimensions}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">
            {t("weight")}
          </h4>
          <p className="text-sm">{t("weightValue", { weight: weightKg })}</p>
        </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex flex-col gap-4 pt-2">
        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium" id="qty-label">{t("quantity")}</label>
          <div className="flex items-center border border-[var(--border)] rounded-[var(--radius-md)]" role="group" aria-labelledby="qty-label">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3.5 py-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm hover:bg-[var(--neutral-100)] transition-colors"
              aria-label={t("quantityDecrease")}
            >
              −
            </button>
            <output className="px-4 py-2.5 text-sm font-medium min-w-[3rem] text-center border-x border-[var(--border)]" aria-live="polite">
              {quantity}
            </output>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="px-3.5 py-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm hover:bg-[var(--neutral-100)] transition-colors"
              aria-label={t("quantityIncrease")}
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-[var(--muted)]">{t("total", { qty: quantity })}</span>
          <span className="text-xl font-serif font-bold">
            {breakdown.totalFormatted}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={stockStatus === "esaurito"}
        >
          {addedToCart
            ? t("addedToCart")
            : stockStatus === "esaurito"
            ? t("addToCartDisabled")
            : t("addToCart")}
        </Button>
      </div>
    </div>
  );
}
