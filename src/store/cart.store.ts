import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  increaseQty: (cartItemId: string) => void;
  decreaseQty: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (menuItemId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === menuItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === menuItem.id
                  ? { ...i, quantity: i.quantity + quantity, subtotal: menuItem.price * (i.quantity + quantity) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { id: menuItem.id, menu_item: menuItem, quantity, subtotal: menuItem.price * quantity }],
          };
        });
      },

      removeItem: (cartItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== cartItemId) })),

      increaseQty: (cartItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === cartItemId
              ? { ...i, quantity: i.quantity + 1, subtotal: i.menu_item.price * (i.quantity + 1) }
              : i
          ),
        })),

      decreaseQty: (cartItemId) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === cartItemId
                ? { ...i, quantity: i.quantity - 1, subtotal: i.menu_item.price * (i.quantity - 1) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((s, i) => s + i.subtotal, 0),
      getItemCount: (menuItemId) => get().items.find((i) => i.id === menuItemId)?.quantity || 0,
    }),
    { name: "foodash-cart" }
  )
);
