import { MetadataRoute } from "next";
import { getAllProducts } from "@/data/products";
import { routing } from "@/i18n/routing";

const locales = [...routing.locales];
const defaultLocale = routing.defaultLocale;

/**
 * Generate the locale-prefixed URL for a given path and locale.
 * The default locale (Italian) has no prefix with `as-needed` strategy.
 */
function localizedUrl(siteUrl: string, locale: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return `${siteUrl}${normalizedPath}`;
  }
  return `${siteUrl}/${locale}${normalizedPath}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mpvitalia.it";
  const now = new Date();

  const products = getAllProducts();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/prodotti", priority: 0.9, freq: "weekly" as const },
    { path: "/recesso/modulo", priority: 0.4, freq: "monthly" as const },
  ];

  for (const locale of locales) {
    for (const page of staticPages) {
      // Build alternates for all other locales
      const alternates: Record<string, string> = {};
      for (const altLocale of locales) {
        alternates[altLocale] = localizedUrl(siteUrl, altLocale, page.path || "/");
      }

      entries.push({
        url: localizedUrl(siteUrl, locale, page.path || "/"),
        lastModified: now,
        changeFrequency: page.freq,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    }

    // Product detail pages
    for (const product of products) {
      const productPath = `/prodotti/${product.slug}`;
      const alternates: Record<string, string> = {};
      for (const altLocale of locales) {
        alternates[altLocale] = localizedUrl(siteUrl, altLocale, productPath);
      }

      entries.push({
        url: localizedUrl(siteUrl, locale, productPath),
        lastModified: new Date(product.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
