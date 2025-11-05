
import type { Product } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CartItem = {
  quantity: number;
} & Product;

type CartState = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const calculateTotals = (items: CartItem[]) => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { itemCount, total };
}

export const useCart = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      itemCount: 0,
      total: 0,
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        let updatedItems;
        if (existingItem) {
          updatedItems = currentItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedItems = [...currentItems, { ...product, quantity: 1 }];
        }
        const { itemCount, total } = calculateTotals(updatedItems);
        set({ items: updatedItems, itemCount, total });
      },
      removeItem: (productId) => {
        const updatedItems = get().items.filter((item) => item.id !== productId);
        const { itemCount, total } = calculateTotals(updatedItems);
        set({ items: updatedItems, itemCount, total });
      },
      updateItemQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        const updatedItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        const { itemCount, total } = calculateTotals(updatedItems);
        set({ items: updatedItems, itemCount, total });
      },
      clearCart: () => set({ items: [], itemCount: 0, total: 0 }),
    }),
    {
      name: 'shopora-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
