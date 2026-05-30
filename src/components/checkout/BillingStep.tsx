"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Button } from "@/components/ui";
import { validateCF, validatePIVA, validateSDICode } from "@/lib/validation";
import type { Address } from "@/types/order";

interface BillingData {
  sameAsShipping: boolean;
  address: Address;
  cf: string;
  piva: string;
  sdi_code: string;
}

interface BillingStepProps {
  data: BillingData;
  shippingAddress: Address;
  onUpdate: (data: BillingData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BillingStep({
  data,
  shippingAddress,
  onUpdate,
  onNext,
  onBack,
}: BillingStepProps) {
  const t = useTranslations("checkout.billing");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (data.cf) {
      const cfResult = validateCF(data.cf);
      if (!cfResult.valid) newErrors.cf = cfResult.error!;
    }

    if (data.piva) {
      const pivaResult = validatePIVA(data.piva);
      if (!pivaResult.valid) newErrors.piva = pivaResult.error!;
    }

    if (data.sdi_code) {
      const sdiResult = validateSDICode(data.sdi_code);
      if (!sdiResult.valid) newErrors.sdi_code = sdiResult.error!;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const currentAddress = data.sameAsShipping ? shippingAddress : data.address;

  const updateField = (field: keyof BillingData | keyof Address, value: string) => {
    if (field === "cf" || field === "piva" || field === "sdi_code" || field === "sameAsShipping") {
      onUpdate({ ...data, [field]: value });
    } else {
      onUpdate({ ...data, address: { ...data.address, [field]: value } });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-serif text-xl font-semibold mb-6">
        {t("title")}
      </h2>

      {/* Same as shipping toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.sameAsShipping}
          onChange={(e) => onUpdate({ ...data, sameAsShipping: e.target.checked })}
          className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
        />
        <span className="text-sm">{t("sameAsShipping")}</span>
      </label>

      {!data.sameAsShipping && (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t("firstName")} value={currentAddress.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
            <Input label={t("lastName")} value={currentAddress.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
          </div>
          <Input label={t("address")} value={currentAddress.street} onChange={(e) => updateField("street", e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label={t("cap")} value={currentAddress.cap} onChange={(e) => updateField("cap", e.target.value)} required maxLength={5} />
            <Input label={t("city")} value={currentAddress.city} onChange={(e) => updateField("city", e.target.value)} required />
            <Input label={t("province")} value={currentAddress.province} onChange={(e) => updateField("province", e.target.value)} required />
          </div>
        </div>
      )}

      <hr className="border-[var(--border)] my-6" />

      <div className="space-y-4">
        <Input
          label={t("cf")}
          value={data.cf}
          onChange={(e) => updateField("cf", e.target.value)}
          placeholder={t("cfPlaceholder")}
          maxLength={16}
          error={errors.cf}
        />

        <Input
          label={t("piva")}
          value={data.piva}
          onChange={(e) => updateField("piva", e.target.value)}
          placeholder={t("pivaPlaceholder")}
          maxLength={11}
          error={errors.piva}
        />

        <Input
          label={t("sdi")}
          value={data.sdi_code}
          onChange={(e) => updateField("sdi_code", e.target.value.toUpperCase())}
          placeholder={t("sdiPlaceholder")}
          maxLength={7}
          error={errors.sdi_code}
        />
      </div>

      <div className="flex items-center justify-between pt-4 gap-4">
        <Button type="button" variant="ghost" onClick={onBack}>
          Indietro
        </Button>
        <Button type="submit" size="lg">
          Continua
        </Button>
      </div>
    </form>
  );
}
