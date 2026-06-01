import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import React from "react";

// ─── next-intl mocks ──────────────────────────────────────────

vi.mock("next-intl", () => ({
  useLocale: () => "it",
  useTranslations: (namespace?: string) => {
    const prefix = namespace ? `${namespace}.` : "";
    const t = (key: string, values?: Record<string, string | number>) => {
      const fullKey = `${prefix}${key}`;
      if (
        fullKey === "header.cartLabelWithItems" &&
        values?.count !== undefined
      ) {
        return `Carrello (${values.count} articoli)`;
      }
      if (fullKey === "common.skipToContent") {
        return "Salta al contenuto";
      }
      return fullKey;
    };
    t.rich = (_key: string) => _key;
    t.markup = (key: string) => key;
    t.raw = (key: string) => key;
    t.has = () => true;
    t.namespace = () => t;
    return t;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: () => async (key: string) => key,
  getMessages: () => async () => ({}),
}));

vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: ({ children, ...props }: React.ComponentProps<"a">) =>
      React.createElement("a", props, children),
    redirect: vi.fn(),
    usePathname: () => "/",
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    getPathname: () => "/",
  }),
}));

// ─── @/i18n/navigation mock ───────────────────────────────────

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) =>
    React.createElement("a", props, children),
  redirect: vi.fn(),
  usePathname: () => "/",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  getPathname: () => "/",
}));

// ─── next/image mock ─────────────────────────────────────────

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const rest = { ...props };
    delete rest.fill;
    delete rest.priority;
    return React.createElement("img", rest as React.ImgHTMLAttributes<HTMLImageElement>);
  },
}));

// ─── zustand mock ────────────────────────────────────────────

const defaultCartState = {
  items: [] as Array<{
    productId: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
  }>,
  isHydrated: true,
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  getItemCount: vi.fn().mockReturnValue(0),
  getSubtotal: vi.fn().mockReturnValue(0),
  setHydrated: vi.fn(),
};

let mockCartState = { ...defaultCartState };

vi.mock("@/store/cart", () => ({
  useCartStore: (selector?: (state: typeof defaultCartState) => unknown) => {
    if (selector) return selector(mockCartState);
    return mockCartState;
  },
}));

// Helper to update cart state in tests
export function setMockCartState(
  overrides: Partial<typeof defaultCartState>
) {
  mockCartState = { ...mockCartState, ...overrides };
}

// Helper to reset cart state between tests
export function resetMockCartState() {
  mockCartState = { ...defaultCartState };
}
