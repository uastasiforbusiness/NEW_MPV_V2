import { formatCurrency } from "@/lib/iva";

interface ProductJSONLDProps {
  name: string;
  description: string;
  slug: string;
  price: number;
  image: string;
  color: string;
  availability: string;
}

const availabilityMap: Record<string, string> = {
  disponibile: "https://schema.org/InStock",
  su_ordinazione: "https://schema.org/PreOrder",
  esaurito: "https://schema.org/OutOfStock",
};

export function ProductJSONLD({
  name,
  description,
  slug,
  price,
  image,
  color,
  availability,
}: ProductJSONLDProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [`https://www.mpvitalia.it${image}`],
    sku: slug,
    mpn: slug,
    brand: {
      "@type": "Brand",
      name: "MPV Italia",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.mpvitalia.it/prodotti/${slug}`,
      priceCurrency: "EUR",
      price: price,
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      itemCondition: "https://schema.org/NewCondition",
      availability: availabilityMap[availability] || availabilityMap.esaurito,
      seller: {
        "@type": "Organization",
        name: "MPV Italia",
      },
    },
    color,
    material: "Velluto, Memory Foam, Legno Massello",
    countryOfOrigin: {
      "@type": "Country",
      name: "Italy",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
