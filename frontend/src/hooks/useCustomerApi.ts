import { useQuery } from '@tanstack/react-query';
import * as customerService from '@/services/customer';

/**
 * Hook to track all orders for a specific user
 */
export const useCustomerOrders = (userId: number) => {
  return useQuery({
    queryKey: ['customerOrders', userId],
    queryFn: () => customerService.getCustomerOrders(userId),
    enabled: !!userId,
    refetchInterval: 5000, // Poll for status changes every 5s
  });
};

/**
 * Hook to list all available restaurants
 */
export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: customerService.getRestaurants,
  });
};