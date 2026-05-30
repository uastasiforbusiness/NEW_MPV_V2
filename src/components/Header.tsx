"use client";

import { useState, useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const headerT = useTranslations("header");
  const commonT = useTranslations("common");
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: headerT("navHome") },
    { href: "/prodotti", label: headerT("navCollezione") },
  ];

  const mobileLinks = [
    { href: "/", label: headerT("navHome") },
    { href: "/prodotti", label: headerT("navCollezione") },
    { href: "/carrello", label: headerT("cartLabel") },
  ];

  return (
    <>
      {/* Skip to content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--surface)] focus:text-[var(--foreground)] focus:rounded-[var(--radius-md)] focus:shadow-lg focus:outline-2 focus:outline-[var(--accent)]"
      >              {commonT("skipToContent")}
      </a>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 header-entrance ${
          scrolled
            ? "bg-[var(--surface)]/97 backdrop-blur-lg shadow-[0_1px_0_0_var(--border)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[4.5rem] lg:h-20">
            {/* Logo mark + wordmark */}
            <Link
              href="/"
              className="flex items-center gap-3 group relative logo-entrance"
            >
              <Logo
                variant={scrolled ? "dark" : "light"}
                mode="compact"
                size={44}
                effect="shimmer"
                className="h-11 sm:h-12 w-auto drop-shadow-[0_0_12px_rgba(201,169,110,0.6)]"
              />
              <span className="hidden sm:flex flex-col leading-none">
                <span
                  className="text-[1.05rem] font-semibold tracking-[0.22em] text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-display, var(--font-sans))" }}
                >
                  MPV
                </span>
                <span className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[var(--brand-gold)] mt-0.5">
                  Italia
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10 header-item-entrance" style={{ animationDelay: "250ms" }}>
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative text-[0.8rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 py-1 group ${
                      isActive
                        ? "text-[var(--foreground)]"
                        : "text-[var(--neutral-600)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-px bg-[var(--brand-gold)] transition-all duration-400 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 header-item-entrance" style={{ animationDelay: "400ms" }}>
              {/* Language Switcher — compact pill in header */}
              <div className="hidden md:block">
                <LanguageSwitcher variant="compact" />
              </div>

              {/* Cart */}
              <Link
                href="/carrello"
                className="relative p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--neutral-600)] hover:text-[var(--foreground)] transition-colors duration-300"
                aria-label={
                  itemCount > 0
                    ? headerT("cartLabelWithItems", { count: itemCount })
                    : headerT("cartLabel")
                }
              >
                <svg
                  className="w-[1.1rem] h-[1.1rem]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-[var(--accent)] text-white text-[10px] font-semibold flex items-center justify-center shadow-sm px-0.5">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--neutral-600)] hover:text-[var(--foreground)] transition-colors duration-300"
                aria-label={
                  isMenuOpen
                    ? headerT("mobileMenuClose")
                    : headerT("mobileMenuOpen")
                }
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span
                    className={`block h-px bg-current transition-all duration-300 origin-center ${
                      isMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                    }`}
                  />
                  <span
                    className={`block h-px bg-current transition-all duration-200 ${
                      isMenuOpen ? "opacity-0 scale-x-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-px bg-current transition-all duration-300 origin-center ${
                      isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Gold accent line at bottom when scrolled */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--brand-gold-muted) 30%, var(--brand-gold-muted) 70%, transparent)",
          }}
        />
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-opacity duration-400 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0D0B09]/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-[var(--surface)] shadow-2xl transition-transform duration-500 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-20 px-8">
            <div className="space-y-1">
              {mobileLinks.map((link, i) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`block py-3.5 text-sm font-medium uppercase tracking-[0.15em] hover:text-[var(--foreground)] hover:pl-2 transition-all duration-300 border-b border-[var(--border)] ${
                      isActive ? "text-[var(--foreground)] pl-2 border-l-2 border-l-[var(--brand-gold)]" : "text-[var(--neutral-600)]"
                    }`}
                    style={{ transitionDelay: isMenuOpen ? `${i * 80}ms` : "0ms" }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Language Switcher */}
            <div className="mt-8 flex justify-center">
              <LanguageSwitcher />
            </div>

            <div className="mt-8 filigree">
              <span>✦</span>
            </div>

            <p className="mt-6 text-xs text-[var(--neutral-400)] font-light leading-relaxed">
              {headerT("mobileDesc")}
              <br />
              {headerT("mobileDesc2")}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
