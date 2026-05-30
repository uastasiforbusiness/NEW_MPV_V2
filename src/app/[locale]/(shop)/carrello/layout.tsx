import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("cartTitle"),
    description: t("cartDescription"),
  };
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
