import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { Button } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("notFoundTitle"),
    description: t("notFoundDescription"),
  };
}

export default async function LocaleNotFound() {
  const t = await getTranslations("errors.notFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)]">
      <div className="text-center max-w-md px-8">
        <p className="font-serif text-6xl font-bold text-[var(--accent)] mb-4">
          {t("code")}
        </p>
        <h1 className="font-serif text-2xl font-bold mb-3">
          {t("title")}
        </h1>
        <p className="text-sm text-[var(--muted)] mb-8">
          {t("desc")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" variant="outline" size="lg">
            {t("ctaHome")}
          </Button>
          <Button href="/prodotti" size="lg">
            {t("ctaProducts")}
          </Button>
        </div>
      </div>
    </div>
  );
}
