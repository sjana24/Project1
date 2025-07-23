// src/store/useCartStore.ts
import { create } from "zustand";

interface CartItem {
  item_id: number;
  quantity: number;
  // Add other fields if needed
}

interface CartState {
  cartItems: CartItem[];
  setCartItemsCount: (items: CartItem[]) => void;
  cartCount: number;
  updateCartCount: () => void;
  cartUpdated: boolean;
  triggerCartUpdate: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  
  setCartItemsCount: (items) => set({ cartItems: items }),
  cartCount: 0,
  cartUpdated: false,

  
  updateCartCount: () => {
    const count = get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
    set({ cartCount: count });
  },
   triggerCartUpdate: () => {
    set((state) => ({ cartUpdated: !state.cartUpdated }));
  },
}));
