import { useAuth } from '@/auth/provider'
import { useQuery } from '@tanstack/react-query'
import * as customerService from '@/services/customer'
import { Clock, Package, MapPin, CheckCircle2, Loader2 } from 'lucide-react'

const STATUS_STEPS = [
  'PENDING',
  'PREPARING',
  'READY_FOR_PICKUP',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
]

export default function LiveOrderStatus() {
  const { user } = useAuth()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['active-orders', user?.id],
    queryFn: () => customerService.getMyActiveOrders(Number(user?.id)),
    enabled: !!user?.id,
    refetchInterval: 5000, // 🔄 Polling every 5s to catch Scheduler updates
  })

  // Filter for orders that aren't Delivered or Cancelled yet
  const activeOrders =
    orders?.filter(
      (o: any) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED',
    ) || []
  console.log(orders)
  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10" />
  if (activeOrders.length === 0) return null

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-black italic">Active Orders</h2>
      {activeOrders.map((order: any) => {
        const currentStep = STATUS_STEPS.indexOf(order.status)

        return (
          <div
            key={order.id}
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Order #{order.id}
                </span>
                <h3 className="font-bold text-lg">
                  {order.restaurant.restaurantName}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500">Pickup Code</p>
                <p className="text-xl font-black text-orange-600 font-mono">
                  {order.pickupCode || '----'}
                </p>
              </div>
            </div>

            {/* Progress Bar Logic */}
            <div className="relative flex justify-between items-center w-full px-2">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-10" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 -z-10 transition-all duration-1000"
                style={{
                  width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />

              {STATUS_STEPS.map((step, idx) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-4 ${
                      idx <= currentStep
                        ? 'bg-green-500 border-green-200'
                        : 'bg-white border-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[8px] font-black mt-2 uppercase ${
                      idx === currentStep ? 'text-green-600' : 'text-slate-300'
                    }`}
                  >
                    {step.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>

            {order.status === 'READY_FOR_PICKUP' && (
              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
                <CheckCircle2 className="text-orange-600 mt-1" size={20} />
                <div>
                  <p className="font-bold text-orange-900">
                    Ready at {order.deliveryAddress}!
                  </p>
                  <p className="text-xs text-orange-700">
                    Give your code to the courier to verify pickup.
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
