<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-05-28 | Updated: 2026-05-28 -->

# heritage

## Purpose
Brand heritage and storytelling images. Contains artistic sketches used as hero visuals on the homepage to communicate the Italian luxury heritage of MPV Italia.

## Key Files

| File | Description |
|------|-------------|
| `colosseo_hero-artistic-sketch.png` | Colosseum-themed hero sketch (2.5 MB) — homepage hero background |
| `sofa_hero-artistic-sketch.jpg` | Sofa-themed hero sketch (3.0 MB) — secondary hero image |

## For AI Agents

### Working In This Directory
- These are source assets — **do not serve directly** (too large for web)
- Convert to WebP via `sharp` CLI: max 500KB for hero images
- Store originals here, converted versions in `public/images/heritage/`
- Use `next/image` with `priority` for hero images (LCP-critical)

### Image Specs
- Target: WebP, max 500KB, 1920px width for desktop hero
- `sizes="(max-width: 768px) 100vw, 100vw"` for full-width heroes

<!-- MANUAL: -->
