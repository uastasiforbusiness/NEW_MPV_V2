# MPV Italia — Luxury Pet Furniture E-Commerce

## Purpose
Greenfield Next.js 15 e-commerce platform for MPV Italia, a luxury pet furniture brand (€3.8k–4.5k segment) targeting the Italian market. The project is currently in the pre-development phase with design assets and a technical specification ready.

## Key Files

| File | Description |
|------|-------------|
| `PLAN_MPV_E-COMMERCE.md` | Single source of truth — full technical spec, architecture, phases, compliance requirements |

## Asset Directories

| Directory | Purpose |
|-----------|---------|
| `heritage/` | Hero/sketch images for brand storytelling (see `heritage/AGENTS.md`) |
| `lifestyle/` | Lifestyle photos — owners with pets on sofas (see `lifestyle/AGENTS.md`) |
| `logo/` | Brand logos — luxury SVG variants (see `logo/AGENTS.md`) |
| `products/` | Product photos — sofa_negro, sofa_rosa, sofa_verde (see `products/AGENTS.md`) |

## Planned Architecture (per PLAN_MPV_E-COMMERCE.md)

```
src/
├── app/              # Next.js 15 App Router (pages, layouts, API routes)
├── components/       # UI, cart, checkout, product, legal components
├── lib/              # Supabase, Nexi, PayPal, Invoicetronic, IVA, validation
├── store/            # Zustand cart store
├── types/            # TypeScript interfaces (product, order, customer)
├── data/             # Seed product catalog
└── emails/           # React Email templates
```

## For AI Agents

### Working In This Directory
- Read `PLAN_MPV_E-COMMERCE.md` before making any changes — it is the spec
- All image assets must be converted to WebP before use (products <200KB, heroes <500KB)
- Originals stay in their current directories; converted WebP goes to `public/images/`

### Testing Requirements
- No tests exist yet — Phase 11 (E2E with Playwright) is planned
- Use `next build` as the primary build verification

### Common Patterns
- Next.js 15 App Router with Server Components by default
- `use client` only for cart, checkout, forms, payment SDKs
- Supabase for auth, database, storage, RLS
- Italian compliance: CF/P.IVA validation, IVA 22% breakdown, FatturaPA/SDI

## Dependencies (Planned)

### External
- Next.js 15 — Framework
- Supabase — Backend/Auth/Storage
- Nexi XPay — Italian payments
- PayPal Business — International payments
- Invoicetronic — Electronic invoicing (SDI)
- Resend — Transactional email
- Iubenda — GDPR/CMP compliance
- Umami — Privacy-first analytics
- Tailwind CSS v4 — Styling
- Zustand 5 — Cart state management
- Zod — Schema validation
