import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

const CartItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(99),
  image: z.string(),
  color: z.string(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

const CartStateSchema = z.object({
  items: z.array(CartItemSchema),
});

interface CartStore {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  setHydrated: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image,
                color: item.color,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "mpv-cart",
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (state) {
            // Validate with Zod on hydration
            const result = CartStateSchema.safeParse({ items: state.items });
            if (!result.success) {
              console.warn("Cart hydration validation failed, clearing cart");
              state.items = [];
            }
            state.setHydrated();
          }
          if (error) {
            console.error("Cart hydration error:", error);
          }
        };
      },
    }
  )
);
