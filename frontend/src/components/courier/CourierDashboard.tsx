import { useCourierDashboard, useCourierActions } from '@/hooks/userCourierApi'
import { MapPin, Loader2, Ticket, Navigation, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CourierDashboard() {
  const { data, isLoading } = useCourierDashboard()
  const { claim } = useCourierActions()

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    )

  const active = data?.active
  const pool = data?.available || []

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-20">
      {active ? (
        <div className="bg-slate-900 rounded-4xl p-8 text-white border-b-8 border-red-600 shadow-2xl animate-in fade-in duration-500">
          <h2 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">
            {active.restaurant?.restaurantName}
          </h2>

          <p className="text-slate-400 text-sm mb-8 flex items-center gap-2">
            <MapPin size={14} className="text-red-500" />
            {active.status === 'PICKED_UP'
              ? 'Show Ticket at Restaurant'
              : 'Deliver to Customer'}
          </p>

          {active.status === 'PICKED_UP' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 text-center shadow-inner">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Pickup Handshake Code
                </p>
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-6xl font-black text-slate-900 tracking-widest">
                    {active.pickupCode}
                  </span>
                  <Ticket className="text-red-600 mt-2" size={32} />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                <Loader2 className="animate-spin text-red-500" size={20} />
                <p className="text-xs text-slate-300 leading-tight">
                  Wait for the{' '}
                  <span className="text-red-500 font-bold">Vendor</span> to
                  verify this code.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 p-8 rounded-4xl border border-white/10 text-center">
              <Navigation
                className="mx-auto text-red-500 mb-4 animate-bounce"
                size={48}
              />
              <p className="text-xl font-black uppercase tracking-widest">
                In Transit
              </p>
              <p className="text-sm text-slate-400 mt-2 italic">
                {active.deliveryAddress}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-black italic uppercase text-slate-900">
              Nearby Jobs
            </h2>
            <span className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />{' '}
              Live Feed
            </span>
          </div>

          {pool.length > 0 ? (
            pool.map((order: any) => (
              <div
                key={order.id}
                className="bg-white border p-6 rounded-4xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h4 className="font-black text-xl italic uppercase text-slate-900">
                    {order.restaurant?.restaurantName}
                  </h4>
                  <p className="text-xs text-slate-500 font-bold">
                    {order.deliveryAddress}
                  </p>
                </div>
                <Button
                  onClick={() => claim.mutate(order.id)}
                  disabled={claim.isPending}
                  className="bg-slate-900 hover:bg-red-600 text-white font-black italic rounded-2xl px-8 h-12 ml-4"
                >
                  {claim.isPending ? '...' : 'Claim'}
                </Button>
              </div>
            ))
          ) : (
            <div className="mt-10 p-12 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center text-center bg-slate-50/30">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Coffee className="text-slate-300" size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                Quiet Streets
              </h3>
              <p className="text-slate-500 text-sm max-w-60 mt-2 font-medium">
                No orders available right now. We'll alert you as soon as a new
                job pops up!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
