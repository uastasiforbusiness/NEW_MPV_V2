import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { RecessoModule } from "@/components/legal";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.recesso" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function RecessoPage() {
  const t = await getTranslations("legal.recesso");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: t("title") }]} />

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
          {t("title")}
        </h1>
        <p className="text-[var(--muted)] text-base max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      <RecessoModule />
    </div>
  );
}
