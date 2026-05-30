import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "sofa-negro",
    slug: "sofa-negro",
    name: "Divano MPV — Nero",
    description:
      "L'eleganza senza tempo del nero per il tuo pet. Realizzato a mano in Italia con tessuti premium e una struttura in legno massello che garantisce durabilità e comfort. Il rivestimento in velluto idrorepellente protegge da macchie e peli, mentre l'imbottitura in memory foam ad alta densità offre un supporto ergonomico per il tuo animale. Ogni divano è rifinito con dettagli artigianali — cuciture rinforzate, gambe in metallo satinato e un cuscino rimovibile per una facile pulizia.",
    price_eur: 4200,
    iva_rate: 0.22,
    stock_status: "disponibile",
    images: [
      {
        src: "/images/products/sofa-negro.webp",
        alt: "Divano MPV Nero — Vista principale",
        width: 1200,
        height: 800,
      },
      {
        src: "/images/lifestyle/amor-sofa-negro.webp",
        alt: "Divano MPV Nero — Con animale domestico",
        width: 1200,
        height: 800,
      },
      {
        src: "/images/lifestyle/duena-acariciando-perro.webp",
        alt: "Divano MPV Nero — Padrona accarezza il cane",
        width: 1200,
        height: 800,
      },
    ],
    materials:
      "Velluto idrorepellente premium, memory foam ad alta densità, legno massello di faggio, gambe in metallo satinato",
    dimensions: '120 cm (L) x 70 cm (P) x 50 cm (H) — Area letto: 80 cm x 60 cm',
    weight_kg: 25,
    category: "divani",
    color: "Nero",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "sofa-rosa",
    slug: "sofa-rosa",
    name: "Divano MPV — Rosa",
    description:
      "Un tocco di dolcezza con il nostro divano rosa cipria, pensato per gli animali che amano lo stile. La tinta pastello si abbina perfettamente a interni moderni e classici, aggiungendo un dettaglio sofisticato alla tua casa. Realizzato artigianalmente in Italia con tessuto di velluto antimacchia, struttura in legno massello e cuscino removibile. L'imbottitura ortopedica in memory foam garantisce il massimo comfort per il tuo pet durante il riposo.",
    price_eur: 4500,
    iva_rate: 0.22,
    stock_status: "disponibile",
    images: [
      {
        src: "/images/products/sofa-rosa.webp",
        alt: "Divano MPV Rosa — Vista principale",
        width: 1200,
        height: 800,
      },
      {
        src: "/images/lifestyle/mirada-amor-rosa.webp",
        alt: "Divano MPV Rosa — Con animale domestico",
        width: 1200,
        height: 800,
      },
      {
        src: "/images/lifestyle/duena-perro-ojos.webp",
        alt: "Divano MPV Rosa — Legame affettivo",
        width: 1200,
        height: 800,
      },
    ],
    materials:
      "Velluto cipria antimacchia, memory foam ortopedico, legno massello di faggio, gambe in ottone satinato",
    dimensions: '120 cm (L) x 70 cm (P) x 50 cm (H) — Area letto: 80 cm x 60 cm',
    weight_kg: 25,
    category: "divani",
    color: "Rosa",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "sofa-verde",
    slug: "sofa-verde",
    name: "Divano MPV — Verde",
    description:
      "Il verde salvia dona un tocco naturale e rilassante al tuo spazio abitativo. Perfetto per chi cerca un arredo che unisca stile contemporaneo e amore per gli animali. Prodotto artigianalmente in Italia con materiali selezionati, questo divano offre ai tuoi pets un rifugio comodo ed elegante. Il tessuto in velluto ecologico è resistente e facile da pulire, mentre la struttura in legno massello assicura stabilità e lunga durata.",
    price_eur: 3800,
    iva_rate: 0.22,
    stock_status: "su_ordinazione",
    images: [
      {
        src: "/images/products/sofa-verde.webp",
        alt: "Divano MPV Verde — Vista principale",
        width: 1200,
        height: 800,
      },
    ],
    materials:
      "Velluto ecologico premium, memory foam ad alta densità, legno massello di faggio certificato FSC, gambe in metallo nero opaco",
    dimensions: '120 cm (L) x 70 cm (P) x 50 cm (H) — Area letto: 80 cm x 60 cm',
    weight_kg: 25,
    category: "divani",
    color: "Verde Salvia",
    created_at: "2026-01-01T00:00:00Z",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getRelatedProducts(currentSlug: string, limit = 2): Product[] {
  return products.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
