---
version: alpha
name: MPV Italia
description: Riviera Italiana — luxury pet furniture e-commerce. Editorial serif meets precise sans, warm gold accent on charcoal, cinematic imagery.

colors:
  gold: "#C9A96E"
  gold-light: "#D4B87A"
  gold-dark: "#B8985D"
  gold-muted: "#E8D5B0"
  cream: "#FAF8F5"
  cream-warm: "#F5F0E8"
  charcoal: "#1A1A1A"
  graphite: "#2D2D2D"
  espresso: "#3D2B1F"
  champagne: "#F7E7CE"
  neutral-50: "#FAFAF9"
  neutral-100: "#F5F5F0"
  neutral-200: "#E7E5DF"
  neutral-300: "#D4D0C8"
  neutral-400: "#A39E94"
  neutral-500: "#737068"
  neutral-600: "#52504A"
  neutral-700: "#403E3A"
  neutral-800: "#262522"
  neutral-900: "#171614"
  success: "#16A34A"
  error: "#DC2626"
  warning: "#D97706"

typography:
  display-heading:
    fontFamily: "Cormorant Garamond"
    fontSize: "clamp(3rem, 8vw, 7rem)"
    fontWeight: 300
    lineHeight: "0.95"
    letterSpacing: "-0.03em"
  h1:
    fontFamily: "Cormorant Garamond"
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 400
    lineHeight: "1.05"
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Cormorant Garamond"
    fontSize: "clamp(1.8rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  h3:
    fontFamily: "Cormorant Garamond"
    fontSize: "clamp(1.4rem, 3vw, 2rem)"
    fontWeight: 500
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  overline:
    fontFamily: Montserrat
    fontSize: "0.7rem"
    fontWeight: 600
    letterSpacing: "0.25em"
    fontVariation: "uppercase"
  body:
    fontFamily: Montserrat
    fontSize: "0.95rem"
    fontWeight: 300
    lineHeight: "1.8"
    letterSpacing: "0.01em"
  accent-text:
    fontFamily: "Cormorant Garamond"
    fontStyle: italic
    fontWeight: 400

rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  full: "9999px"

spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  4xl: "6rem"
  5xl: "8rem"

components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.gold-dark}"
    textColor: "#FFFFFF"
  button-secondary:
    backgroundColor: "{colors.charcoal}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
  button-secondary-hover:
    backgroundColor: "{colors.graphite}"
    textColor: "#FFFFFF"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.charcoal}"
    rounded: "{rounded.md}"
  button-outline-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.charcoal}"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "#FFFFFF"
  button-danger-hover:
    backgroundColor: "#B91C1C"
    textColor: "#FFFFFF"
  card-product:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.lg}"
  card-product-hover:
    padding: "0"
  surface-dark:
    backgroundColor: "{colors.charcoal}"
    textColor: "#FFFFFF"
  surface-warm:
    backgroundColor: "{colors.cream-warm}"
  filigree-divider:
    backgroundColor: "{colors.gold-muted}"
    height: "1px"
---

## Overview

MPV Italia is a luxury pet furniture brand from Italy — handcrafted sofas for pets starting at €3,800. The design language fuses **editorial Italian elegance** with **digital commerce clarity**: Cormorant Garamond serif for emotional headline moments, Montserrat sans for interface precision, and a warm gold accent on deep charcoal.

The visual identity draws from **Riviera Italiana** aesthetics: warm cream backgrounds, gold filigree details, cinematic hero imagery, and subtle grain texture. Every surface should feel like a luxury atelier, not a typical e-commerce template.

## Colors

### Brand Gold Palette

- **Gold (#C9A96E):** The sole accent color. Used for interactive elements, CTAs, overline labels, and decorative details. Never used for body text or large background fills.
- **Gold Light (#D4B87A):** Accent text highlight in hero sections — the italic "Incontra l'Amore" moment.
- **Gold Dark (#B8985D):** Hover state for gold CTAs. Slightly richer, more grounded.
- **Gold Muted (#E8D5B0):** Decorative borders, filigree lines, and hover accents on neutral surfaces. Always subtle.

### Warm Neutrals

- **Cream (#FAF8F5):** Default page background. Warm, not sterile — the color of Italian marble.
- **Cream Warm (#F5F0E8):** Alternate section background. Slightly warmer for rhythm breaks between sections.
- **Charcoal (#1A1A1A):** Primary dark surface. Headlines, dark sections, footer. Not pure black — softer.
- **Graphite (#2D2D2D):** Secondary dark. Hover state for charcoal buttons, subtle text on dark surfaces.
- **Espresso (#3D2B1F):** Deep warm brown. Used sparingly for rich dark accents.
- **Champagne (#F7E7CE):** Light warm accent. Alternate gold-muted variant.

### Neutral Scale

Warm-biased 10-step scale from 50–900. All neutrals carry a slight warm undertone to stay cohesive with the gold/cream palette. Used for text hierarchy, borders, and muted elements.

### Semantic Colors

- **Success (#16A34A):** Confirmation states only — order confirmed, form valid.
- **Error (#DC2626):** Validation errors, destructive actions. Red variants go darker on hover (#B91C1C → #991B1B).
- **Warning (#D97706):** Caution states, pending actions.

## Typography

### Two-Family System

**Cormorant Garamond** (display/serif): All headlines, display text, accent text, and any moment requiring emotional weight. Used at weight 300–500. The italic variant is reserved for accent-text — Italian editorial voice.

**Montserrat** (body/sans): All interface text, navigation, overlines, body copy, form labels, and button text. Used at weight 300–600. Light (300) for body, medium (500) for labels, semibold (600) for overlines.

### Display Heading

The largest typographic moment — `clamp(3rem, 8vw, 7rem)`, weight 300, line-height 0.95. Reserved for hero sections only. Negative tracking (-0.03em) keeps it editorial, not airy.

### Heading Scale

H1–H3 all use Cormorant Garamond with responsive clamp sizing. Weight 400 for H1/H2 (refined, not heavy), 500 for H3 (slightly stronger for sub-sections). Line-height 1.05–1.1 for tight editorial stacking.

### Overline

Small caps label — 0.7rem, weight 600, 0.25em tracking, uppercase. Always gold-colored. Used as section eyebrow above headings. Preceded by a short gold rule (w-8 h-px).

### Accent Text

Italic Cormorant Garamond, weight 400, gold-colored. The "Italian voice" — used inline within headings to highlight emotional words. Never used for body text or navigation.

### Body Text

Montserrat 0.95rem, weight 300 (light), line-height 1.8. The generous line-height maintains readability at the light weight. Color is neutral-600 by default, not charcoal — slightly softer for extended reading.

## Layout & Spacing

### Spacing Scale

9-step scale from xs (0.25rem) to 5xl (8rem). Page sections use 2xl–4xl vertical padding. Component internal padding uses sm–lg. The scale is deliberately wide — luxury needs breath.

### Max Width

Content container: `max-w-7xl` (80rem / 1280px). Product grid and text blocks stay narrower — `max-w-2xl` to `max-w-4xl` for readability.

### Section Rhythm

Alternate between light (cream) and warm (cream-warm) backgrounds to create visual rhythm. Dark sections (charcoal) are used sparingly for impact — craftsmanship, materials, and CTA moments.

## Elevation & Depth

### Shadows

All shadows use warm-tinted rgb values (`rgb(60 46 30 / ...)`) — never pure black. Five levels:

- **sm:** Subtle lift for cards at rest
- **md:** Default hover elevation
- **lg:** Active/selected card elevation
- **xl:** Maximum hover elevation (luxury-card)
- **gold:** Special shadow with gold tint — used for accent CTAs and highlighted elements

### Atmospheric Effects

- **Grain overlay:** Fixed full-screen SVG noise at 2.5% opacity. Always present on body. Removed in print.
- **Gold radial glows:** Subtle radial gradients (4–6% opacity gold) on dark section backgrounds. Not on light surfaces.
- **Hero vignette:** `box-shadow: inset 0 0 150px 60px rgba(0,0,0,0.3)` — cinematic depth on hero images.

## Shapes

### Border Radius

- **sm (0.25rem):** Small tags, badges
- **md (0.5rem):** Buttons, inputs, cards
- **lg (0.75rem):** Product cards, modal containers
- **xl (1rem):** Feature containers
- **full (9999px):** Pills, avatar circles, notification dots

### Filigree Divider

Decorative horizontal rule with centered ornament (✦). Gradient gold lines fade from transparent through gold-muted to transparent. Used between major sections for visual punctuation.

### Editorial Frame

Images in editorial contexts get a 12px inset border in gold-muted at 50% opacity, increasing to 100% on hover. Never on product thumbnails — only on lifestyle and brand imagery.

## Components

### Button

Five variants: primary (gold bg), secondary (charcoal bg), outline (border only), ghost (transparent), danger (red bg). Four sizes: sm (36px min-h), md (44px min-h), lg (48px min-h), xl (56px min-h). All use Montserrat, font-weight 500, radius-md.

The `btn-luxury` class adds a sweeping light reflection on hover — a `::before` pseudo-element with a 135deg gradient that translates from -100% to 100% on hover. Applied to primary and secondary CTA buttons.

### Product Card

White background, radius-lg, border-luxury (neutral-200 border, gold-muted on hover). Hover lifts 6px with shadow-xl. Ken Burns zoom on image (scale 1.08 over 1.2s). Price in Cormorant Garamond. Availability badge as overline.

### Navigation Header

Sticky, z-40. Transparent on hero, transitions to surface/97% with backdrop-blur-lg after 40px scroll. Gold gradient accent line appears at bottom when scrolled. Mobile menu slides from right, 72% width, with staggered link transitions.

### Dark Section

Charcoal background with subtle gold radial glows. Text always white. Used for craftsmanship and CTA sections — never adjacent to another dark section.

## Do's and Don'ts

### Do

- Use gold as the single accent color across all interactive elements
- Alternate section backgrounds (cream / cream-warm / charcoal) for visual rhythm
- Use Cormorant Garamond italic for emotional inline highlights within headings
- Keep generous whitespace — luxury needs breath between elements
- Use warm-tinted shadows (rgb(60 46 30 / ...)) instead of pure black
- Apply grain overlay for subtle texture across the entire page
- Use clamp() for all typography to maintain editorial scale across viewports

### Don't

- Don't introduce new accent colors — gold is the only brand accent
- Don't use Cormorant Garamond for body text or navigation — it's for headlines only
- Don't place two dark sections adjacent to each other
- Don't use gold for large background fills — it's an accent, not a surface
- Don't use pure black (#000) for any surface — always charcoal (#1A1A1A)
- Don't remove the grain overlay — it prevents the design from feeling flat/digital
- Don't use the display-heading size outside of hero sections
- Don't add decorative icons unless they serve a scannability purpose
