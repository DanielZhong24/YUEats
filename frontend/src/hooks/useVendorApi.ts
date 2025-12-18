import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as vendorApi from '@/services/vendor' 
import { toast } from 'sonner';

// --- Restaurant Hooks ---

/**
 * Fetch all restaurants owned by the current vendor.
 */
export function useMyRestaurants() {
  return useQuery({
    queryKey: ['vendor', 'my-restaurants'],
    queryFn: vendorApi.getMyRestaurants,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

/**
 * Hook to register a new restaurant.
 */
export function useCreateRestaurant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: vendorApi.RestaurantCreationRequest) => vendorApi.createRestaurant(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendor', 'my-restaurants'] })
      toast.success("Restaurant created successfully");
    },
  })
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => vendorApi.deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'my-restaurants'] });
      toast.success("Restaurant deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Delete failed", { description: error.message });
    }
  });
}


export function useRestaurantMenu(restaurantId: number | string) {
  return useQuery({
    queryKey: ['vendor', 'menu', restaurantId],
    queryFn: () => vendorApi.getRestaurantMenu(restaurantId),
    enabled: !!restaurantId, 
  })
}


export function useCreateMenuItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (vars: { restaurantId: number | string, payload: vendorApi.CreateMenuItemData }) => 
      vendorApi.createMenuItem(vars),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'menu', variables.restaurantId] })
      toast.success("Item added to menu");
    }
  })
}


export function useUpdateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restaurantId, itemId, data }: { restaurantId: number | string, itemId: number, data: any }) => 
      vendorApi.updateMenuItem(restaurantId, itemId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['vendor', 'menu', vars.restaurantId] })
      toast.success("Item updated");
    }
  })
}

export function useDeleteMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ restaurantId, itemId }: { restaurantId: number | string, itemId: number }) => 
      vendorApi.deleteMenuItem(restaurantId, itemId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['vendor', 'menu', vars.restaurantId] })
      toast.success("Item removed");
    }
  })
}

export function useRestaurantOrders(restaurantId: number | string) {
  return useQuery({
    queryKey: ['vendor', 'orders', restaurantId],
    queryFn: async () => {
      try {
        const data = await vendorApi.getRestaurantOrders(restaurantId);
        return data;
      } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
      }
    },
    enabled: !!restaurantId,
    refetchInterval: 5000, 
  });
}

export function useVerifyDriverCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, code }: { orderId: number; code: string }) => 
      vendorApi.verifyDriverCode(orderId, code),
    onSuccess: () => {
      // Refresh kitchen orders so the verified order "disappears" to In Transit
      queryClient.invalidateQueries({ queryKey: ['vendor', 'orders'] });
      toast.success("Handover confirmed! Order is now in transit.");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Invalid pickup code. Check driver's phone.";
      toast.error("Verification Failed", { description: msg });
    }
  });
}


export function useStartPreparation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => vendorApi.startOrderPreparation(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'orders'] });
      toast.success("Order sent to kitchen!");
    }
  });
}


export function usePickupOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => vendorApi.simulatePickup(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'orders'] });
      toast.success(`Order #${orderId} marked as picked up.`);
    },
    onError: (err: any) => {
      toast.error("Action failed", { description: err.message });
    }
  });
}