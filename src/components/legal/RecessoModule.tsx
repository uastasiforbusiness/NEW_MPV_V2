"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input } from "@/components/ui";

export function RecessoModule() {
  const t = useTranslations("legal.recesso");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    orderId: "",
    date: new Date().toISOString().split("T")[0],
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API endpoint
    console.log("Recesso form submitted:", formData);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--success)]/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-[var(--success)] text-xl">✓</span>
        </div>
        <h2 className="font-serif text-xl font-semibold mb-2">
          {t("successTitle")}
        </h2>
        <p className="text-sm text-[var(--muted)]">
          {t("successDesc", { orderId: formData.orderId })}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] p-8">
        <h2 className="font-serif text-xl font-semibold mb-2">
          {t("title")}
        </h2>
        <p className="text-sm text-[var(--muted)] mb-6">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("firstName")}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label={t("lastName")}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label={t("email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label={t("orderNumber")}
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            placeholder={t("orderPlaceholder")}
            required
          />
          <Input
            label={t("date")}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reason"
              className="text-sm font-medium text-[var(--foreground)]"
            >
              {t("reason")}
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] text-[var(--foreground)] placeholder:text-[var(--muted)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] resize-none"
              placeholder={t("reasonPlaceholder")}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" fullWidth>
              {t("submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
