import axios from 'axios';

// Instance configured to match your Vendor service
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all orders for the current customer (GET /orders/user/:userId)
 *
 */
export async function getCustomerOrders(userId: number) {
  const res = await api.get(`/orders/user/${userId}`);
  return res.data;
}

/**
 * Get details for a single order (GET /orders/:orderId)
 *
 */
export async function getOrderById(orderId: number) {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
}

/**
 * Get all restaurants for the customer to browse (GET /restaurants)
 *
 */
export async function getRestaurants() {
  const res = await api.get('/restaurants');
  return res.data;
}

/**
 * Get the menu items for a selected restaurant (GET /restaurants/:id/menu-items)
 *
 */
export async function getRestaurantMenu(restaurantId: number | string) {
  const res = await api.get(`/restaurants/${restaurantId}/menu-items`);
  return res.data;
}