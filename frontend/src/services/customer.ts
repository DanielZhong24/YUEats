import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, // Sends cookies/session headers with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * RESTAURANT & MENU SERVICES
 * Based on RestaurantController.java
 */
export const getRestaurants = async () => {
  const { data } = await api.get('/restaurants');
  return data;
};

export const getRestaurantMenu = async (restaurantId: number) => {
  const { data } = await api.get(`/restaurants/${restaurantId}/menu-items`);
  return data;
};

/**
 * ORDER SERVICES
 * Based on OrderController.java
 */
export const getCustomerOrders = async (userId: number) => {
  // Matches the logic required for the Customer Dashboard
  const { data } = await api.get(`/orders/user/${userId}`);
  return data;
};

export const createOrder = async (orderData: any) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const getOrderStatus = async (orderId: number) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
};