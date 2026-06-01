import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { getAllProducts } from "@/data/products";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plp" });

  return {
    title: t("title"),
    description: t("desc"),
  };
}

export const revalidate = 300;

export default async function PLPPage({ params }: { params: Promise<{ locale: string }> }) {
  const products = getAllProducts();
  await params;
  const t = await getTranslations("plp");
  const prodT = await getTranslations("product");
  const commonT = await getTranslations("common");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: t("breadcrumb") }]} />

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3">
          {t("heading")}
        </h1>
        <p className="text-[var(--muted)] text-base max-w-xl">
          {t("desc")}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 reveal-stagger">
        {products.map((product, index) => (
          <ProductCard
            key={product.slug}
            slug={product.slug}
            name={product.name}
            price={product.price_eur}
            image={product.images[0].src}
            color={product.color}
            stockStatus={product.stock_status}
            priority={index < 3}
            stockLabel={prodT(`stock.${product.stock_status}`)}
            ctaLabel={commonT("scopri")}
            ivaLabel={commonT("ivaIncluded")}
          />
        ))}
      </div>
    </div>
  );
}
