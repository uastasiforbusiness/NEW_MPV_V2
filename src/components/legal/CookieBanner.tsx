"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("legal.cookie");

  useEffect(() => {
    const consent = localStorage.getItem("mpv-cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("mpv-cookie-consent", "all");
    setIsVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem("mpv-cookie-consent", "necessary");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[var(--surface)] border-t border-[var(--border)] shadow-xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-[var(--muted)]">
            {t.rich("text", {
              link: (chunks) => (
                <a
                  href="https://www.iubenda.com/privacy-policy/your_id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={rejectAll}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-2 min-h-[44px]"
          >
            {t("reject")}
          </button>
          <Button onClick={acceptAll} size="sm">
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
