"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  total: number;
  onPaymentMethodChange?: (method: string) => void;
}

export function PaymentStep({ onNext, onBack, total, onPaymentMethodChange }: PaymentStepProps) {
  const t = useTranslations("checkout.payment");
  const [paymentMethod, setPaymentMethod] = useState<"nexi" | "paypal">("nexi");

  const handlePaymentMethodChange = (method: "nexi" | "paypal") => {
    setPaymentMethod(method);
    onPaymentMethodChange?.(method);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-semibold mb-6">
        {t("title")}
      </h2>

      <p className="text-sm text-[var(--muted)]">
        {t("desc")}
      </p>

      {/* Payment Methods */}
      <div className="space-y-3">
        {/* Nexi */}
        <label
          className={`
            flex items-center gap-4 p-4 border rounded-[var(--radius-md)] cursor-pointer
            transition-all duration-[var(--transition-fast)]
            ${
              paymentMethod === "nexi"
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] hover:border-[var(--border-strong)]"
            }
          `}
        >
          <input
            type="radio"
            name="payment"
            value="nexi"
            checked={paymentMethod === "nexi"}
            onChange={() => handlePaymentMethodChange("nexi")}
            className="w-4 h-4 text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("creditCard")}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {t("creditCardDesc")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold px-2 py-1 bg-[var(--neutral-100)] rounded">Visa</span>
            <span className="text-xs font-bold px-2 py-1 bg-[var(--neutral-100)] rounded">MC</span>
          </div>
        </label>

        {/* PayPal */}
        <label
          className={`
            flex items-center gap-4 p-4 border rounded-[var(--radius-md)] cursor-pointer
            transition-all duration-[var(--transition-fast)]
            ${
              paymentMethod === "paypal"
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] hover:border-[var(--border-strong)]"
            }
          `}
        >
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={() => handlePaymentMethodChange("paypal")}
            className="w-4 h-4 text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{t("paypal")}</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {t("paypalDesc")}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-[#0070BA] text-white rounded">PayPal</span>
        </label>
      </div>

      <div className="bg-[var(--neutral-50)] rounded-[var(--radius-md)] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs text-[var(--muted)]">
          {t("secure", { provider: paymentMethod === "nexi" ? "Nexi XPay" : "PayPal" })}
        </p>
        <p className="text-sm font-semibold text-[var(--accent)]">
          Importo: €{total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 gap-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          Indietro
        </Button>
        <Button onClick={onNext} size="lg">
          Continua
        </Button>
      </div>
    </div>
  );
}
