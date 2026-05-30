"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { useCartStore } from "@/store/cart";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  stockStatus: string;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function AddToCartButton({
  productId,
  slug,
  name,
  price,
  image,
  color,
  stockStatus,
  quantity = 1,
  size = "md",
  fullWidth = false,
}: AddToCartButtonProps) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({ productId, slug, name, price, quantity, image, color });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (stockStatus === "esaurito") {
    return (
      <Button size={size} fullWidth={fullWidth} disabled>
        {t("addToCartDisabled")}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      onClick={handleClick}
      variant={added ? "secondary" : "primary"}
    >
      {added ? t("addedToCart") : t("addToCart")}
    </Button>
  );
}
