import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mpvitalia.it";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/checkout/",
        "/it/checkout/",
        "/en/checkout/",
        "/es/checkout/",
        "/carrello/",
        "/it/carrello/",
        "/en/carrello/",
        "/es/carrello/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
