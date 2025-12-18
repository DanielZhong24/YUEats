import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as courierService from '@/services/courier';
import { toast } from 'sonner';

export const useCourierDashboard = () => {
  return useQuery({
    queryKey: ['courier-dashboard'],
    queryFn: async () => {
      const [available, active] = await Promise.all([
        courierService.getAvailableOrders(),
        courierService.getMyActiveTasks()
      ]);
      return { available, active };
    },
    refetchInterval: 5000, 
  });
};

export const useCourierActions = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['courier-dashboard'] });

  const claim = useMutation({
    mutationFn: courierService.claimOrder,
    onSuccess: () => {
      invalidate();
      toast.success('Order claimed! Proceed to the restaurant.');
    }
  });

  const pickup = useMutation({
    mutationFn: courierService.confirmPickup,
    onSuccess: () => {
      invalidate();
      toast.success('Pickup confirmed! Your delivery is now in progress.');
    }
  });

  return { claim, pickup };
};