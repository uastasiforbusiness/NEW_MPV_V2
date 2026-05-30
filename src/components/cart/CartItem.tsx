"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/iva";
import { useCartStore } from "@/store/cart";

interface CartItemProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
}

export function CartItem({
  productId,
  slug,
  name,
  price,
  quantity,
  image,
  color,
}: CartItemProps) {
  const t = useTranslations("cart");
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-5 border-b border-[var(--border)] last:border-b-0">
      {/* Image */}
      <Link
        href={`/prodotti/${slug}`}
        className="relative w-24 h-24 flex-shrink-0 rounded-[var(--radius-md)] overflow-hidden bg-[var(--neutral-100)]"
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/prodotti/${slug}`}
              className="font-serif font-semibold text-base hover:text-[var(--accent)] transition-colors"
            >
              {name}
            </Link>
            <p className="text-xs text-[var(--muted)] mt-0.5">{color}</p>
          </div>
          <p className="text-base font-semibold whitespace-nowrap">
            {formatCurrency(price * quantity)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-[var(--border)] rounded-[var(--radius-md)]">
            <button
              onClick={() => updateQuantity(productId, quantity - 1)}
              className="px-3 py-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs hover:bg-[var(--neutral-100)] transition-colors"
              aria-label={t("itemDecrease")}
            >
              −
            </button>
            <output className="px-3 py-2.5 text-xs font-medium min-w-[2.5rem] text-center border-x border-[var(--border)]" aria-live="polite">
              {quantity}
            </output>
            <button
              onClick={() => updateQuantity(productId, quantity + 1)}
              className="px-3 py-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-xs hover:bg-[var(--neutral-100)] transition-colors"
              aria-label={t("itemIncrease")}
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItem(productId)}
            className="px-2 py-2 min-h-[44px] flex items-center text-xs text-[var(--muted)] hover:text-[var(--error)] transition-colors"
            aria-label={t("itemRemoveLabel", { name })}
          >
            {t("itemRemove")}
          </button>
        </div>
      </div>
    </div>
  );
}
