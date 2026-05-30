import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it", "es"],
  defaultLocale: "it",
  localePrefix: "as-needed",
});
