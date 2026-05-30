"use client";

import { useTranslations } from "next-intl";

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const t = useTranslations("checkout.steps");

  const steps = [
    { id: 1, label: t("shipping") },
    { id: 2, label: t("billing") },
    { id: 3, label: t("payment") },
    { id: 4, label: t("review") },
  ];

  return (
    <nav aria-label={t("ariaLabel")} className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <li key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                {/* Step Circle */}
                <div
                  className={`
                    w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center text-sm font-medium
                    transition-all duration-[var(--transition-base)]
                    ${
                      isCompleted
                        ? "bg-[var(--accent)] text-white"
                        : isCurrent
                        ? "bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20"
                        : "bg-[var(--neutral-100)] text-[var(--muted)]"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                {/* Label */}
                <span
                  className={`
                    text-sm hidden sm:inline
                    ${isCurrent ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted)]"}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-px mx-4
                    ${isCompleted || currentStep > index + 1
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--border)]"
                    }
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
