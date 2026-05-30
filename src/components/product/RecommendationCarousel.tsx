import { ProductCard } from "./ProductCard";
import { getAllProducts } from "@/data/products";

interface RecommendationCarouselProps {
  currentSlug: string;
  limit?: number;
  title?: string;
}

export function RecommendationCarousel({
  currentSlug,
  limit = 2,
  title = "Potrebbe piacerti anche",
}: RecommendationCarouselProps) {
  const related = getAllProducts()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="font-serif text-2xl font-semibold mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {related.map((product) => (
          <ProductCard
            key={product.slug}
            slug={product.slug}
            name={product.name}
            price={product.price_eur}
            image={product.images[0].src}
            color={product.color}
            stockStatus={product.stock_status}
          />
        ))}
      </div>
    </section>
  );
}
