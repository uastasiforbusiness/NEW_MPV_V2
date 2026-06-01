---
name: new-component
description: Scaffold a new React component following project conventions
disable-model-invocation: true
---

Create a new component following MPV Italia conventions.

## Rules
- Server Components by default, add "use client" only if needed (state, effects, event handlers)
- Tailwind CSS v4 for styling, use CSS vars (--foreground, --surface, --brand-gold, etc.)
- Italian market: all user-facing text via next-intl `useTranslations()`
- Co-locate related files (component + styles + types in same directory)

## Directory mapping
- UI primitives → src/components/ui/
- Product components → src/components/product/
- Cart components → src/components/cart/
- Checkout components → src/components/checkout/
- Legal components → src/components/legal/

## Template

```tsx
// Server component (default)
import { useTranslations } from "next-intl";

export function ComponentName({ ...props }: ComponentNameProps) {
  const t = useTranslations("namespace");
  return (
    <div className="...">
      {t("key")}
    </div>
  );
}

// If client component needed, add at top:
"use client";
```

## Props
User provides: component name, directory, and brief description of what it should do.
