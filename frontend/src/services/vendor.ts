import axios from 'axios'

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

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// --- API Methods: Restaurant & Menu Management ---

export async function getMyRestaurants() {
  const res = await api.get('/vendors/me/restaurants')
  return res.data as Restaurant[]
}

export async function createRestaurant(req: RestaurantCreationRequest) {
  const res = await api.post('/restaurants', req)
  return res.data
}

export async function deleteRestaurant(restaurantId: string | number) {
  await api.delete(`/restaurants/${restaurantId}`)
}

export async function getRestaurantMenu(restaurantId: string | number) {
  const res = await api.get(`/restaurants/${restaurantId}/menu-items`)
  return res.data
}

export async function createMenuItem({
  restaurantId,
  payload,
}: {
  restaurantId: number | string
  payload: CreateMenuItemData
}) {
  const res = await api.post(`/restaurants/${restaurantId}/menu-items`, payload)
  return res.data
}

export async function updateMenuItem(
  restaurantId: number | string,
  itemId: number,
  data: Partial<CreateMenuItemData>,
) {
  const res = await api.put(`/restaurants/${restaurantId}/menu-items/${itemId}`, data)
  return res.data
}

export async function deleteMenuItem(restaurantId: number | string, itemId: number) {
  await api.delete(`/restaurants/${restaurantId}/menu-items/${itemId}`)
}

// --- API Methods: Order Management & Handshake ---

/**
 * Get all orders for the vendor's kitchen feed.
 */
export async function getRestaurantOrders(restaurantId: string | number) {
  const res = await api.get(`/orders/restaurant/${restaurantId}`)
  return res.data
}

/**
 * HANDSHAKE: Kitchen staff enters the code shown by the driver.
 * Matches backend: @PostMapping("/orders/{orderId}/vendor-verify")
 */
export async function verifyDriverCode(orderId: number, code: string) {
  const res = await api.post(`/orders/${orderId}/vendor-verify`, { code })
  return res.data
}

/**
 * This is the function your hook was looking for.
 * It manually triggers a pickup status change (for testing).
 */
export async function simulatePickup(orderId: number) {
  const res = await api.patch(`/orders/${orderId}/pickup`)
  return res.data
}

/**
 * Manual trigger for simulation (Internal Testing)
 */
export async function startOrderPreparation(orderId: number) {
  const res = await api.patch(`/orders/${orderId}/start-prep`)
  return res.data
}

/**
 * Analytics (Mock)
 */
export async function getAnalytics(restaurantId?: string) {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          orders: 1234,
          revenue: 12345,
          activeItems: 48,
          restaurantId: restaurantId || null,
        }),
      200,
    ),
  )
}