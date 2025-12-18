import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as customerService from '@/services/customer'
import { toast } from 'sonner'


export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: customerService.getRestaurants,
  })
}

export function useRestaurantMenu(restaurantId: number | string) {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => customerService.getRestaurantMenu(restaurantId),
    enabled: !!restaurantId,
  })
}


export function useActiveOrders(customerId: number | undefined) {
  return useQuery({
    queryKey: ['active-orders', customerId],
    queryFn: () => customerService.getMyActiveOrders(Number(customerId)),
    enabled: !!customerId,
    refetchInterval: 5000, 
  })
}


export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: number) => customerService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-orders'] })
      toast.success("Order cancelled")
    },
    onError: (err: any) => {
      const msg = err.response?.data || "Cannot cancel order at this stage."
      toast.error("Cancellation failed", { description: msg })
    }
  })
}