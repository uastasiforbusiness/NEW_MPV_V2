export type StockStatus = "disponibile" | "su_ordinazione" | "esaurito";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_eur: number;
  iva_rate: number;
  stock_status: StockStatus;
  images: ProductImage[];
  materials: string;
  dimensions: string;
  weight_kg: number;
  category: string;
  color: string;
  created_at: string;
}

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}
