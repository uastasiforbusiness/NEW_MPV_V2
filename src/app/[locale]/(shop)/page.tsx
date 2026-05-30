import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";
import Image from "next/image";
import { ProductCard } from "@/components/product";
import { Button } from "@/components/ui";
import { getAllProducts } from "@/data/products";
import { formatCurrency } from "@/lib/iva";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });

  // Layout template adds " | MPV Italia", so only pass the unique tagline
  const tagline = `${t("title1")} ${t("title2")} ${t("title3")}`;

  const localeOgLocale: Record<string, string> = {
    it: "it_IT",
    en: "en_US",
    es: "es_ES",
  };

  return {
    title: tagline,
    description: t("subtitle"),
    openGraph: {
      locale: localeOgLocale[locale] ?? "it_IT",
      title: tagline,
      description: t("subtitle"),
    },
  };
}

export default async function HomePage() {
  const products = getAllProducts();
  const t = await getTranslations("home");
  const prodT = await getTranslations("product");
  const commonT = await getTranslations("common");

  const trustMetrics = [
    { value: "100%", label: t("trust.craftsmanship") },
    { value: "2 anni", label: t("trust.warranty") },
    { value: "Free", label: t("trust.delivery") },
    { value: "48h", label: t("trust.express") },
  ];

  const storyPoints = [
    t("brandStory.points.0"),
    t("brandStory.points.1"),
    t("brandStory.points.2"),
    t("brandStory.points.3"),
  ];

  const materials = [
    {
      name: t("craftsmanship.materials.0.name"),
      desc: t("craftsmanship.materials.0.desc"),
    },
    {
      name: t("craftsmanship.materials.1.name"),
      desc: t("craftsmanship.materials.1.desc"),
    },
    {
      name: t("craftsmanship.materials.2.name"),
      desc: t("craftsmanship.materials.2.desc"),
    },
  ];

  const testimonials = [
    {
      quote: t("testimonials.items.0.quote"),
      author: t("testimonials.items.0.author"),
      detail: t("testimonials.items.0.detail"),
      stars: 5,
    },
    {
      quote: t("testimonials.items.1.quote"),
      author: t("testimonials.items.1.author"),
      detail: t("testimonials.items.1.detail"),
      stars: 5,
    },
    {
      quote: t("testimonials.items.2.quote"),
      author: t("testimonials.items.2.author"),
      detail: t("testimonials.items.2.detail"),
      stars: 5,
    },
  ];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative h-[92dvh] min-h-[650px] max-h-[1100px] overflow-hidden">
        <Image
          src="/images/heritage/colosseo-hero.webp"
          alt="MPV Italia — Luxury Pet Furniture"
          fill
          sizes="100vw"
          className="object-cover scale-105"
          style={{ objectPosition: "50% 35%" }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0B09]/90 via-[#0D0B09]/45 to-[#0D0B09]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/70 via-transparent to-[#0D0B09]/25" />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          background: "radial-gradient(ellipse at 15% 60%, var(--brand-gold) 0%, transparent 50%)"
        }} />

        <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
            <div className="max-w-2xl">
              <div className="reveal">
                <p className="overline text-[var(--brand-gold)] mb-5 flex items-center gap-3">
                  <span className="w-8 h-px bg-[var(--brand-gold)]/60" />
                  {t("hero.overline")}
                </p>
              </div>
              <h1 className="display-heading text-white mb-6 reveal" style={{ transitionDelay: "150ms" }}>
                {t("hero.title1")}
                <br />
                <span className="accent-text text-[var(--brand-gold-light)]">{t("hero.title2")}</span>
                <br />
                {t("hero.title3")}
              </h1>
              <p className="text-[var(--neutral-300)] text-base sm:text-lg mb-10 max-w-md font-light leading-relaxed reveal" style={{ transitionDelay: "300ms" }}>
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 reveal" style={{ transitionDelay: "450ms" }}>
                <Button
                  href="/prodotti"
                  size="lg"
                  className="btn-luxury bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] tracking-wide"
                >
                  {t("hero.ctaPrimary")}
                </Button>
                <Button
                  href="/prodotti/sofa-negro"
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white/90 hover:bg-white/8 hover:border-white/40 tracking-wide"
                >
                  {t("hero.ctaSecondary")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal" style={{ transitionDelay: "600ms" }}>
          <span className="text-white/30 text-[0.7rem] uppercase tracking-[0.35em] font-medium">{t("hero.scroll")}</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ─── TRUST RIBBON ─── */}
      <section className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--border)]">
            {trustMetrics.map((metric, i) => (
              <div
                key={i}
                className="py-8 lg:py-10 px-6 lg:px-8 first:pl-0 last:pr-0 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <p className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-normal text-[var(--brand-charcoal)] mb-1">
                  {metric.value}
                </p>
                <p className="text-[0.75rem] text-[var(--neutral-500)] uppercase tracking-[0.18em] font-medium">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRAND STORY ─── */}
      <section className="py-24 lg:py-36 bg-[var(--brand-cream-warm)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 reveal-left">
              <div className="relative aspect-[4/3] overflow-hidden editorial-frame ken-burns">
                <Image
                  src="/images/lifestyle/duena-acariciando-perro.webp"
                  alt={t("brandStory.title1")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 reveal-right">
              <div className="relative">
                <span className="deco-number absolute -top-16 -left-4 lg:-left-8 select-none" aria-hidden="true">01</span>
                <p className="overline mb-5">{t("brandStory.overline")}</p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.8rem] font-normal leading-[1.1] mb-8">
                  {t("brandStory.title1")}
                  <br />
                  <span className="accent-text">{t("brandStory.title2")}</span>
                </h2>
                <p className="body-text mb-5">{t("brandStory.desc1")}</p>
                <p className="body-text mb-10">{t("brandStory.desc2")}</p>

                <div className="filigree">
                  <span>✦</span>
                </div>

                <ul className="space-y-4 reveal-stagger">
                  {storyPoints.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[var(--brand-gold-muted)] flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-gold)]" />
                      </span>
                      <span className="text-[var(--neutral-600)] font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-24 lg:py-36 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6 reveal">
            <div>
              <p className="overline mb-5">{t("collection.overline")}</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal">{t("collection.title")}</h2>
            </div>
            <p className="body-text max-w-sm lg:text-right">{t("collection.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 reveal-stagger">
            {products.map((product, index) => (
              <ProductCard
                key={product.slug}
                slug={product.slug}
                name={product.name}
                price={product.price_eur}
                image={product.images[0].src}
                color={product.color}
                stockStatus={product.stock_status}
                priority={index === 0}
                stockLabel={prodT(`stock.${product.stock_status}`)}
                ctaLabel={commonT("scopri")}
                ivaLabel={commonT("ivaIncluded")}
              />
            ))}
          </div>

          <div className="text-center mt-14 reveal">
            <div className="filigree max-w-xs mx-auto mb-8">
              <span>✦</span>
            </div>
            <Button
              href="/prodotti"
              variant="outline"
              size="lg"
              className="btn-luxury border-[var(--brand-gold-muted)] text-[var(--foreground)] hover:border-[var(--brand-gold)] hover:bg-[var(--brand-gold)]/5 tracking-wide"
            >
              {t("collection.cta")}
            </Button>
          </div>
        </div>
      </section>

      {/* ─── CRAFTSMANSHIP ─── */}
      <section className="py-24 lg:py-36 bg-[var(--brand-charcoal)] text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.04) 0%, transparent 50%)"
        }} />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 reveal-left">
              <p className="overline text-[var(--brand-gold-muted)] mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-[var(--brand-gold)]/40" />
                {t("craftsmanship.overline")}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.8rem] font-normal leading-[1.1] mb-8">
                {t("craftsmanship.title1")}
                <br />
                <span className="accent-text text-[var(--brand-gold-light)]">{t("craftsmanship.title2")}</span>
              </h2>
              <p className="text-[var(--neutral-400)] text-base font-light leading-relaxed mb-10 max-w-md">
                {t("craftsmanship.desc")}
              </p>

              <div className="space-y-8">
                {materials.map((mat, i) => (
                  <div key={i} className="reveal" style={{ transitionDelay: `${(i + 1) * 120}ms` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-gold)]" />
                      <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand-gold-light)]">
                        {mat.name}
                      </h4>
                    </div>
                    <p className="text-[var(--neutral-400)] text-sm font-light leading-relaxed pl-5">
                      {mat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 reveal-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] overflow-hidden ken-burns rounded-sm">
                  <Image
                    src="/images/lifestyle/amor-sofa-negro.webp"
                    alt={t("craftsmanship.materials.0.name")}
                    fill
                    sizes="(max-width: 1024px) 50vw, 35vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 w-6 h-px bg-[var(--brand-gold)]/40" />
                  <div className="absolute top-3 left-3 w-px h-6 bg-[var(--brand-gold)]/40" />
                </div>
                <div className="space-y-4">
                  <div className="relative aspect-square overflow-hidden ken-burns rounded-sm">
                    <Image
                      src="/images/lifestyle/duena-perro-dormido.webp"
                      alt={t("craftsmanship.desc")}
                      fill
                      sizes="(max-width: 1024px) 50vw, 35vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden ken-burns rounded-sm">
                    <Image
                      src="/images/lifestyle/mirada-amor-rosa.webp"
                      alt="MPV Italia"
                      fill
                      sizes="(max-width: 1024px) 50vw, 35vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[var(--brand-gold)] to-transparent opacity-30" />
      </section>

      {/* ─── LIFESTYLE ─── */}
      <section className="py-24 lg:py-36 bg-[var(--brand-cream-warm)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-5 reveal-left">
              <div className="relative aspect-[3/4] overflow-hidden ken-burns">
                <Image
                  src="/images/lifestyle/amor-sofa-negro.webp"
                  alt="MPV Italia"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-xs text-[var(--neutral-400)] italic font-[var(--font-display)]">
                {t("lifestyle.desc")}
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6 lg:space-y-8">
              <div className="reveal-right mb-4">
                <p className="overline mb-3">{t("lifestyle.title")}</p>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-snug">
                  {t("lifestyle.title")}
                  <br />
                  {t("lifestyle.title2")}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="reveal" style={{ transitionDelay: "100ms" }}>
                  <div className="relative aspect-square overflow-hidden ken-burns">
                    <Image
                      src="/images/lifestyle/duena-perro-dormido.webp"
                      alt="MPV Italia"
                      fill
                      sizes="(max-width: 1024px) 40vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="reveal" style={{ transitionDelay: "200ms" }}>
                  <div className="relative aspect-square overflow-hidden ken-burns">
                    <Image
                      src="/images/lifestyle/mirada-amor-rosa.webp"
                      alt="MPV Italia"
                      fill
                      sizes="(max-width: 1024px) 40vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 lg:py-36 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 reveal">
            <p className="overline mb-5">{t("testimonials.overline")}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal">
              {t("testimonials.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 reveal-stagger">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="border-luxury p-8 lg:p-10 bg-[var(--brand-cream)]/30 luxury-card">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.stars }).map((_, s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-[var(--brand-gold)]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="font-[var(--font-display)] text-lg sm:text-xl italic font-normal leading-relaxed text-[var(--brand-charcoal)] mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{testimonial.author}</p>
                  <p className="text-[0.75rem] text-[var(--neutral-400)] uppercase tracking-[0.12em] mt-1">{testimonial.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-[0.7rem] text-[var(--neutral-400)] italic reveal">
            [ {t("testimonials.placeholder")} ]
          </p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section-dark py-28 lg:py-40 text-white relative overflow-hidden">
        <span className="deco-number absolute top-8 right-12 lg:right-20 opacity-[0.06] text-white select-none" aria-hidden="true">02</span>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="overline text-[var(--brand-gold-muted)] mb-6 reveal">{t("cta.overline")}</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal leading-[1.1] mb-8 reveal" style={{ transitionDelay: "150ms" }}>
            {t("cta.title1")}
            <br />
            <span className="accent-text text-[var(--brand-gold-light)]">{t("cta.title2")}</span>
          </h2>
          <p className="text-[var(--neutral-400)] text-base sm:text-lg mb-12 max-w-lg mx-auto font-light leading-relaxed reveal" style={{ transitionDelay: "300ms" }}>
            {t("cta.desc")}
          </p>

          <p className="text-[var(--neutral-500)] text-sm font-light mb-10 reveal" style={{ transitionDelay: "350ms" }}>
            {t("cta.priceFrom", { price: formatCurrency(3800) })}
          </p>

          <div className="reveal" style={{ transitionDelay: "450ms" }}>
            <Button
              href="/prodotti"
              size="xl"
              className="btn-luxury bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] tracking-widest uppercase text-sm"
            >
              {t("cta.cta")}
            </Button>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-[var(--brand-gold)] to-transparent opacity-40" />
        </div>
      </section>
    </>
  );
}
