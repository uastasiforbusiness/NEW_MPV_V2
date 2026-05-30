import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PrivacyLinks } from "@/components/legal";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export async function Footer() {
  const t = await getTranslations();

  const productLinks = [
    { href: "/prodotti/sofa-negro", label: t("footer.productNegro") },
    { href: "/prodotti/sofa-rosa", label: t("footer.productRosa") },
    { href: "/prodotti/sofa-verde", label: t("footer.productVerde") },
  ];

  return (
    <footer className="bg-[var(--brand-charcoal)] text-white mt-auto relative reveal">
      {/* Gold line at top */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand-gold)]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand — 5 cols */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <Logo
                variant="dark"
                mode="compact"
                size={32}
                effect="glow"
                className="h-8 w-auto"
              />
              <span className="flex flex-col leading-none">
                <span
                  className="text-base font-semibold tracking-[0.22em] text-white"
                  style={{ fontFamily: "var(--font-display, var(--font-sans))" }}
                >
                  MPV
                </span>
                <span className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[var(--brand-gold-muted)] mt-0.5">
                  Italia
                </span>
              </span>
            </div>
            <p className="text-sm text-[var(--neutral-400)] max-w-xs font-light leading-relaxed mb-6">
              {t("footer.brandDesc")}
            </p>
            <p className="text-[0.7rem] text-[var(--neutral-500)] uppercase tracking-[0.2em]">
              {t("common.madeInItaly")}
            </p>
          </div>

          {/* Links — 3 cols */}
          <div className="md:col-span-3">
            <h4 className="overline text-[var(--brand-gold-muted)] mb-6">
              {t("footer.collectionTitle")}
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--neutral-400)] hover:text-[var(--brand-gold)] transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — 4 cols */}
          <div className="md:col-span-4">
            <h4 className="overline text-[var(--brand-gold-muted)] mb-6">
              {t("footer.contactsTitle")}
            </h4>
            <ul className="space-y-3 text-sm text-[var(--neutral-400)] font-light">
              <li>
                <a
                  href="mailto:info@mpvitalia.it"
                  className="hover:text-[var(--brand-gold)] transition-colors duration-300"
                >
                  info@mpvitalia.it
                </a>
              </li>
              <li>
                <a
                  href="mailto:spedizioni@mpvitalia.it"
                  className="hover:text-[var(--brand-gold)] transition-colors duration-300"
                >
                  spedizioni@mpvitalia.it
                </a>
              </li>
              <li className="pt-2 text-[var(--neutral-500)]">
                MPV Italia
                <br />
                Via Artigianato, 1 — Milano
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[var(--brand-graphite)]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.7rem] text-[var(--neutral-500)] font-light tracking-wide">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <PrivacyLinks />
          </div>
        </div>
      </div>
    </footer>
  );
}
