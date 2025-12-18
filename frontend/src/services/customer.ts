import axios from 'axios'

// Instance configured to match your Vendor service
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Sends cookies/session headers with every request
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * RESTAURANT & MENU SERVICES
 * Based on RestaurantController.java
 */
export const getRestaurants = async () => {
  const { data } = await api.get('/restaurants')
  return data
}

export const getRestaurantMenu = async (restaurantId: number) => {
  const { data } = await api.get(`/restaurants/${restaurantId}/menu-items`)
  return data
}

/**
 * Get details for a single order (GET /orders/:orderId)
 *
 */
// Remove userId parameter - backend should get it from session
export const getCustomerOrders = async () => {
  const { data } = await api.get('/orders/user')
  return data
}

export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders', orderData)
  return data
}

export const getOrderStatus = async (orderId: number) => {
  const { data } = await api.get(`/orders/${orderId}`)
  return data
}
