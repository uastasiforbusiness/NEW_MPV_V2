import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "../globals.css";
import { ToastProvider } from "@/components/ui";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { LogoSplash } from "@/components/LogoSplash";
import { ScrollReveal } from "@/components/ScrollReveal";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const localeOgMap: Record<string, string> = {
  it: "it_IT",
  en: "en_US",
  es: "es_ES",
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: "%s | MPV Italia",
    },
    description: t("description"),
    keywords: [
      "luxury pet furniture",
      "designer pet sofa",
      "Italian pet furniture",
      "luxury dog bed",
      "premium cat furniture",
      "MPV Italia",
    ],
    authors: [{ name: "MPV Italia" }],
    creator: "MPV Italia",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.mpvitalia.it"
    ),
    openGraph: {
      type: "website",
      locale: localeOgMap[locale] ?? "it_IT",
      url: "/",
      siteName: "MPV Italia",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: "/images/heritage/colosseo-hero.webp",
          width: 1920,
          height: 1080,
          alt: t("ogTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("twitterDescription"),
      images: ["/images/heritage/colosseo-hero.webp"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="grain min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-[var(--font-sans)]">
        <NextIntlClientProvider messages={messages}>
          <LogoSplash />
          <ScrollReveal />
          <ToastProvider>
            <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
              <CookieBanner />
              <ChatWidget />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
