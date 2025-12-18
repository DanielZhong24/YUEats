import { create } from 'zustand'

export interface CartItem {
  id: number; // This is the menuItemId
  itemName: string;
  price: number;
  quantity: number;
  restaurantId: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: any, restaurantId: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item, restaurantId) => {
    const items = get().items;
    const existingItem = items.find((i) => i.id === item.id);
    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { ...item, restaurantId, quantity: 1 }] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clearCart: () => set({ items: [] }),
  getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));