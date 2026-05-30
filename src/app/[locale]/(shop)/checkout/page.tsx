"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/ui";
import {
  CheckoutStepper,
  ShippingStep,
  BillingStep,
  PaymentStep,
  OrderReview,
} from "@/components/checkout";
import { useCartStore } from "@/store/cart";
import type { Address } from "@/types/order";

const defaultAddress: Address = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  province: "",
  cap: "",
  country: "Italia",
  phone: "",
};

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = useCartStore((s) => s.items);
  const isHydrated = useCartStore((s) => s.isHydrated);

  // Shipping address state
  const [shippingAddress, setShippingAddress] =
    useState<Address>(defaultAddress);

  // Billing state
  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    address: defaultAddress,
    cf: "",
    piva: "",
    sdi_code: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("nexi");

  // Hydrate the store
  useEffect(() => {
    useCartStore.persist.rehydrate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push("/carrello");
    }
  }, [isHydrated, items, router]);

  if (!isHydrated || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const handleShippingNext = () => setCurrentStep(2);
  const handleBillingNext = () => setCurrentStep(3);
  const handlePaymentNext = () => setCurrentStep(4);

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    // In production, this would:
    // 1. Create the order in Supabase
    // 2. Create a Nexi/PayPal payment session
    // 3. Redirect to the payment page

    // For now, simulate and redirect to confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(
        `/checkout/conferma?orderId=ORD-${Date.now().toString(36).toUpperCase()}`
      );
    }, 1500);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: t("title"), href: "/carrello" },
          { label: t("title") },
        ]}
      />

      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-8">
        {t("title")}
      </h1>

      <CheckoutStepper currentStep={currentStep} />

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 sm:p-8">
        {currentStep === 1 && (
          <ShippingStep
            data={shippingAddress}
            onUpdate={setShippingAddress}
            onNext={handleShippingNext}
          />
        )}

        {currentStep === 2 && (
          <BillingStep
            data={billingData}
            shippingAddress={shippingAddress}
            onUpdate={setBillingData}
            onNext={handleBillingNext}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <PaymentStep
            onNext={handlePaymentNext}
            onBack={() => setCurrentStep(2)}
            total={total}
            onPaymentMethodChange={setPaymentMethod}
          />
        )}

        {currentStep === 4 && (
          <OrderReview
            shippingAddress={shippingAddress}
            billingAddress={
              billingData.sameAsShipping
                ? shippingAddress
                : billingData.address
            }
            paymentMethod={paymentMethod}
            onBack={() => setCurrentStep(3)}
            onSubmit={handleSubmitOrder}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
