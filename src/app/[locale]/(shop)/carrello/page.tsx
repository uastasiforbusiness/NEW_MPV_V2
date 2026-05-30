"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/ui";
import { CartItem, CartSummary, CartEmpty } from "@/components/cart";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const isHydrated = useCartStore((s) => s.isHydrated);

  // Hydrate the store
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: t("title") }]} />

      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-8">
        {t("title")}
      </h1>

      {!isHydrated ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] divide-y divide-[var(--border)]">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  productId={item.productId}
                  slug={item.slug}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                  color={item.color}
                />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
