import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/**
 * Fetch available orders in READY_FOR_PICKUP status
 * Matches: GET /couriers/available
 */
export const getAvailableOrders = async () => {
  const { data } = await api.get('/couriers/available');
  return data; //
};

/**
 * Claim an order from the pool
 * Matches: POST /couriers/claim/{id}
 */
export const claimOrder = async (orderId: number) => {
  const { data } = await api.post(`/couriers/claim/${orderId}`);
  return data; //
};

/**
 * Confirm bag collection (Moves status to IN_TRANSIT)
 * Matches: POST /couriers/pickup/{id}
 */
export const confirmPickup = async (orderId: number) => {
  // Note: No 'code' body sent because the vendor doesn't have it
  const { data } = await api.post(`/couriers/pickup/${orderId}`);
  return data; //
};

/**
 * Helper to get the courier's currently active job
 * This filters the user's orders for those not yet DELIVERED or CANCELLED
 */
export const getMyActiveTasks = async () => {
  const { data } = await api.get('/orders/courier');
  return data.find((o: any) => 
    o.status === 'PICKED_UP' || o.status === 'IN_TRANSIT'
  ) || null; //
};