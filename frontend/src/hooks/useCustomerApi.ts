import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as customerService from '@/services/customer';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: customerService.getRestaurants,
  });
};

export const useCustomerOrders = (userId: number) => {
  return useQuery({
    queryKey: ['customerOrders', userId],
    queryFn: () => customerService.getCustomerOrders(userId),
    enabled: !!userId,
    refetchInterval: 5000, // Polling for status changes (PREPARING -> READY)
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
    },
  });
};