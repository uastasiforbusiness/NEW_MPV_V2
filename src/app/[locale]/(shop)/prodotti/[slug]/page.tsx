import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { ProductGallery, ProductInfo, ProductAccordion, ProductJSONLD, RecommendationCarousel } from "@/components/product";
import { getProductBySlug, getAllProducts } from "@/data/products";

interface PDPPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: PDPPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | MPV Italia`,
      description: product.description.slice(0, 200),
      images: [
        {
          url: product.images[0]?.src || "/images/heritage/colosseo-hero.webp",
          width: 1200,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export const revalidate = 300;

export default async function PDPPage({ params }: PDPPageProps) {
  const { slug, locale } = await params;
  const product = getProductBySlug(slug);
  const prodT = await getTranslations("product");

  if (!product) {
    notFound();
  }

  // Build translated accordion items
  const accordionItems = [
    {
      title: prodT("accordion.shipping.title"),
      content: (
        <div className="space-y-2">
          <p>{prodT("accordion.shipping.content1")}</p>
          <p>{prodT("accordion.shipping.content2")}</p>
          <p className="font-medium">{prodT("accordion.shipping.content3")}</p>
        </div>
      ),
    },
    {
      title: prodT("accordion.returns.title"),
      content: (
        <div className="space-y-2">
          <p>{prodT("accordion.returns.content1")}</p>
          <p>
            {prodT("accordion.returns.content2Before")}
            <a href={`/${locale}/recesso/modulo`} className="text-[var(--accent)] underline">
              {prodT("accordion.returns.content2Link")}
            </a>
            {prodT("accordion.returns.content2After")}
          </p>
          <p>{prodT("accordion.returns.content3")}</p>
          <p>{prodT("accordion.returns.content4")}</p>
        </div>
      ),
    },
    {
      title: prodT("accordion.warranty.title"),
      content: (
        <div className="space-y-2">
          <p>{prodT("accordion.warranty.content1")}</p>
          <p>{prodT("accordion.warranty.content2")}</p>
          <p>
            {prodT("accordion.warranty.content3Before")}
            <a
              href="mailto:assistenza@mpvitalia.it"
              className="text-[var(--accent)] underline"
            >
              assistenza@mpvitalia.it
            </a>
            {prodT("accordion.warranty.content3After")}
          </p>
        </div>
      ),
    },
    {
      title: prodT("accordion.care.title"),
      content: (
        <div className="space-y-2">
          <p>{prodT("accordion.care.content1")}</p>
          <p>{prodT("accordion.care.content2")}</p>
          <p>{prodT("accordion.care.content3")}</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <ProductJSONLD
        name={product.name}
        description={product.description}
        slug={product.slug}
        price={product.price_eur}
        image={product.images[0]?.src}
        color={product.color}
        availability={product.stock_status}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: prodT("breadcrumbCollection"), href: "/prodotti" },
            { label: product.name },
          ]}
        />

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-4">
          <div className="reveal">
            <ProductGallery
              images={product.images}
              productName={product.name}
              thumbnailLabel={prodT("galleryThumbnail")}
            />
          </div>

          <div className="reveal">
            <ProductInfo
              slug={product.slug}
              name={product.name}
              price={product.price_eur}
              ivaRate={product.iva_rate}
              description={product.description}
              materials={product.materials}
              dimensions={product.dimensions}
              weightKg={product.weight_kg}
              color={product.color}
              stockStatus={product.stock_status}
              image={product.images[0]?.src}
            />
          </div>
        </div>

        <div className="reveal">
          <ProductAccordion items={accordionItems} />
        </div>

        <div className="reveal">
          <RecommendationCarousel
            currentSlug={product.slug}
            title={prodT("recommendations")}
          />
        </div>
      </div>
    </>
  );
}
