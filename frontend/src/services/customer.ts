import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getRestaurants = async () => {
  const { data } = await api.get('/restaurants')
  return data
}

export const getRestaurantMenu = async (restaurantId: number | string) => {
  const { data } = await api.get(`/restaurants/${restaurantId}/menu-items`)
  return data
}

export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders', orderData)
  return data
}

export async function getMyActiveOrders(customerId: number) {
  const res = await api.get(`/orders/customer/${customerId}`)
  return res.data
}

export async function cancelOrder(orderId: number) {
  const res = await api.patch(`/orders/${orderId}/cancel`)
  return res.data
}