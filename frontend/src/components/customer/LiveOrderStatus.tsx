import { useAuth } from '@/auth/provider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as customerService from '@/services/customer'
import { Loader2, PackageCheck, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'

const STATUS_STEPS = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED']

export default function LiveOrderStatus() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['active-orders', user?.id],
    queryFn: () => customerService.getMyActiveOrders(Number(user?.id)),
    enabled: !!user?.id,
    refetchInterval: 5000, 
  })

  const cancelMutation = useMutation({
    mutationFn: (orderId: number) => axios.patch(`${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/cancel`, {}, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-orders'] })
      toast.success("Order cancelled successfully")
    },
    onError: (err: any) => toast.error(err.response?.data || "Could not cancel order")
  })

  const ordersList = Array.isArray(orders) ? orders : []
  const activeOrders = ordersList.filter((o: any) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED')
  const pastOrders = ordersList.filter((o: any) => o.status === 'DELIVERED' || o.status === 'CANCELLED')

  if (isLoading) return <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-red-600" /></div>

  return (
    <div className="space-y-12 mt-8 pb-20 max-w-2xl mx-auto">
      <section className="space-y-6">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Live Tracking</h2>

        {activeOrders.map((order: any) => {
          const currentStep = STATUS_STEPS.indexOf(order.status)
          return (
            <div key={order.id} className="bg-white border rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Order #{order.id}</span>
                  <h3 className="font-bold text-lg">{order.restaurant.restaurantName}</h3>
                </div>
                {/* CANCEL BUTTON: Only visible during PENDING status */}
                {order.status === 'PENDING' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => cancelMutation.mutate(order.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold text-xs"
                  >
                    <XCircle size={14} className="mr-1" /> Cancel Order
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="relative mt-4 mb-14 px-2">
                <div className="absolute top-2 left-0 w-full h-[3px] bg-slate-100 rounded-full" />
                <div
                  className="absolute top-2 left-0 h-[3px] bg-red-600 transition-all duration-1000 rounded-full"
                  style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
                <div className="flex justify-between items-center w-full">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center relative">
                      <div className={`w-4 h-4 rounded-full border-2 z-10 ${idx <= currentStep ? 'bg-red-600 border-red-600' : 'bg-white border-slate-200'}`} />
                      <div className="absolute top-6 w-20 text-center">
                        <span className={`text-[8px] font-black uppercase ${idx === currentStep ? 'text-red-600' : 'text-slate-300'}`}>
                          {step.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* --- ORDER HISTORY --- */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-400 uppercase tracking-tighter border-t pt-10">Order History</h2>
        <div className="grid grid-cols-1 gap-4">
          {pastOrders.map((order: any) => (
            <div key={order.id} className="flex items-center justify-between p-5 bg-slate-50 border rounded-2xl">
              <div className="flex items-center gap-4">
                <PackageCheck className={order.status === 'DELIVERED' ? 'text-green-500' : 'text-slate-300'} size={24} />
                <div>
                  <h4 className="font-bold text-slate-900">{order.restaurant.restaurantName}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order #{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">${order.totalPrice.toFixed(2)}</p>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}