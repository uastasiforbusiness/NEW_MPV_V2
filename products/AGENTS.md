<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-28 | Updated: 2026-05-28 -->

# products

## Purpose
Product photography for the MPV Italia sofa catalog. Contains hero shots of each sofa variant used on PLP cards, PDP galleries, and checkout confirmation.

## Key Files

| File | Description |
|------|-------------|
| `sofa_negro.png` | Black sofa product shot (2.0 MB) — PLP card + PDP gallery |
| `sofa_rosa.jpeg` | Pink sofa product shot (2.0 MB) — PLP card + PDP gallery |
| `sofa_verde.jpeg` | Green sofa product shot (524 KB) — PLP card + PDP gallery |

## For AI Agents

### Working In This Directory
- Source assets — **do not serve directly** (up to 2 MB each)
- Convert to WebP via `sharp` CLI: max 200KB for product images
- Store originals here, converted versions in `public/images/products/{slug}/`
- Each product needs multiple sizes: thumbnail (400px), card (600px), gallery (1200px)

### Image Specs
- Target: WebP, max 200KB per size variant
- PLP card: `sizes="(max-width: 768px) 100vw, 33vw"`
- PDP gallery: `sizes="(max-width: 768px) 100vw, 50vw"`
- Use `priority` only on the first PDP gallery image

### Product Mapping
| File | Product Slug | Color |
|------|-------------|-------|
| `sofa_negro.png` | `sofa-negro` | Nero/Black |
| `sofa_rosa.jpeg` | `sofa-rosa` | Rosa/Pink |
| `sofa_verde.jpeg` | `sofa-verde` | Verde/Green |

<!-- MANUAL: -->
