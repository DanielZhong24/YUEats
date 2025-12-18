import axios from 'axios';

// --- Type Definitions ---

export type Restaurant = {
  id: string
  name: string
  address?: string
}

export type RestaurantCreationRequest = {
  restaurantName: string
  ownerId: number
  address: string
  bannerImgUrl: string
}

export type CreateMenuItemData = {
  itemName: string
  description: string
  price: number
  imgUrl: string
  category: string
  isAvailable: boolean
}
// --- Axios Configuration ---

// This instance automatically uses the Env Variable or defaults to localhost:8080
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Sends cookies/session headers with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- API Methods ---

/**
 * Get all restaurants for the current vendor (GET /restaurants)
 */
export async function getVendorRestaurants() {
  const res = await api.get('/restaurants');
  return res.data as any[];
}

/**
 * Create a new restaurant (POST /restaurants)
 */
export async function createRestaurant(req: RestaurantCreationRequest) {
  const res = await api.post('/restaurants', req);
  return res.data;
}

/**
 * Create a menu item for a specific restaurant (POST /restaurants/:id/menu-item)
 */
// src/services/vendor.ts

// ... imports

export async function createMenuItem({ restaurantId, payload }: { restaurantId: number | string, payload: CreateMenuItemData }) {
  
  // 1. Backend is a JAVA RECORD, so keys must match exactly 1:1
  const backendPayload = {
    itemName: payload.itemName,
    description: payload.description,
    price: payload.price,
    imgUrl: payload.imgUrl,
    category: payload.category,
    
    // ✅ CORRECT: Keep it as 'isAvailable' to match the Java Record component
    isAvailable: payload.isAvailable 
  }

  // ✅ CORRECT: Ensure URL is PLURAL "menu-items"
  const res = await api.post(`/restaurants/${restaurantId}/menu-items`, backendPayload)
  
  return res.data
}
// --- Mocks / Helpers ---

/**
 * MOCK: Analytics data (Backend endpoint might not exist yet)
 */
export async function getAnalytics(restaurantId?: string) {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({ 
            orders: 1234, 
            revenue: 12345, 
            activeItems: 48, 
            restaurantId: restaurantId || null 
        }),
      200,
    ),
  );
}



export async function getMyRestaurants() {
 
  const res = await api.get('/vendors/me/restaurants'); 
  return res.data as Restaurant[];
}
export async function getRestaurantMenu(restaurantId: string | number) {
  const res = await api.get(`/restaurants/${restaurantId}/menu-items`)
  return res.data
}


export async function deleteMenuItem(restaurantId: number | string, itemId: number) {
  await api.delete(`/restaurants/${restaurantId}/menu-items/${itemId}`)
}

export async function updateMenuItem(restaurantId: number | string, itemId: number, data: Partial<CreateMenuItemData>) {
  const res = await api.put(`/restaurants/${restaurantId}/menu-items/${itemId}`, data)
  return res.data
}

export async function deleteRestaurant(restaurantId: string | number) {
  // This matches your @DeleteMapping("/{id}")
  await api.delete(`/restaurants/${restaurantId}`);
}

// Add these to your existing vendor.ts

/**
 * Get all orders for a specific restaurant (Vendor View)
 */
export async function getRestaurantOrders(restaurantId: string | number) {
  const res = await api.get(`/orders/restaurant/${restaurantId}`);
  return res.data;
}

/**
 * Get details for a specific order (Customer View)
 */
export async function getOrderDetails(orderId: number) {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
}

/**
 * Simulate Driver Pickup (Moves status to IN_TRANSIT)
 */
export async function simulatePickup(orderId: number) {
  const res = await api.patch(`/orders/${orderId}/pickup`);
  return res.data;
}

export async function startOrderPreparation(orderId: number) {
  const res = await api.patch(`/orders/${orderId}/start-prep`);
  return res.data;
}