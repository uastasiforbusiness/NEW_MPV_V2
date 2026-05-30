import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatCurrency } from "@/lib/iva";

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  stockStatus: string;
  priority?: boolean;
  /** Translated labels (i18n support) */
  stockLabel?: string;
  ctaLabel?: string;
  ivaLabel?: string;
  /** Index for decorative number (1-based) */
  index?: number;
}

const defaultStockLabels: Record<string, { label: string; className: string }> = {
  disponibile: {
    label: "Disponibile",
    className: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  },
  su_ordinazione: {
    label: "Su Ordinazione",
    className: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  },
  esaurito: {
    label: "Esaurito",
    className: "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
  },
};

export function ProductCard({
  slug,
  name,
  price,
  image,
  color,
  stockStatus,
  priority = false,
  stockLabel,
  ctaLabel = "Scopri",
  ivaLabel = "IVA inclusa",
  index,
}: ProductCardProps) {
  const defaultStock = defaultStockLabels[stockStatus] || defaultStockLabels.esaurito;
  const stock = {
    label: stockLabel || defaultStock.label,
    className: defaultStock.className,
  };

  // Numero decorativo formattato (01, 02, 03…)
  const decoNum = index !== undefined ? String(index + 1).padStart(2, "0") : null;

  return (
    <Link
      href={`/prodotti/${slug}`}
      className="group block luxury-card"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--neutral-100)] rounded-[var(--radius-lg)]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
          priority={priority}
        />

        {/* Hover overlay — gradiente più ricco */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/50 via-[#0D0B09]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Stock badge */}
        <div className="absolute top-4 left-4">
          <span className={`text-[0.75rem] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 border backdrop-blur-sm ${stock.className}`}>
            {stock.label}
          </span>
        </div>

        {/* Numero decorativo — appare in hover, stile editoriale */}
        {decoNum && (
          <div className="absolute top-3 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out translate-y-2 group-hover:translate-y-0">
            <span
              className="text-[3.5rem] font-serif font-light leading-none text-white/20 select-none"
              aria-hidden="true"
            >
              {decoNum}
            </span>
          </div>
        )}

        {/* Gold corner accent on hover */}
        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-3 right-3 w-8 h-px bg-[var(--brand-gold)]" />
          <div className="absolute bottom-3 right-3 w-px h-8 bg-[var(--brand-gold)]" />
        </div>

        {/* View CTA — visible on mobile, enhanced on hover */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500 ease-out">
          <span className="text-white text-[0.75rem] font-semibold uppercase tracking-[0.22em] px-6 py-2.5 bg-[var(--brand-charcoal)]/80 backdrop-blur-sm border border-white/10">
            {ctaLabel}
          </span>
        </div>
      </div>

      {/* Text Content */}
      <div className="pt-5 pb-2">
        <p className="text-[0.7rem] text-[var(--brand-gold)] font-semibold uppercase tracking-[0.2em] mb-2">
          {color}
        </p>
        <h3 className="font-serif text-xl font-normal leading-tight mb-3 group-hover:text-[var(--accent)] transition-colors duration-300">
          {name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-base font-medium text-[var(--foreground)]">
            {formatCurrency(price)}
          </span>
          <span className="text-[0.7rem] text-[var(--neutral-400)] uppercase tracking-wider font-light">
            {ivaLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
