import { useRestaurantOrders } from '@/hooks/useVendorApi'
import { useVendorContext } from '@/context/VendorContext'
import { ChefHat, Utensils, Clock, Flame, CheckCircle2 } from 'lucide-react'

export default function VendorPrepPage() {
  const { activeRestaurantId } = useVendorContext()
  
  // Fetch orders from the backend with polling
  const { data: orders, isLoading } = useRestaurantOrders(activeRestaurantId || 0)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-blue-500 font-bold uppercase tracking-widest">Loading Kitchen...</div>
      </div>
    )
  }

  // Filter for orders currently being handled by the kitchen
  const ordersList = Array.isArray(orders) ? orders : [];
  const kitchenOrders = ordersList.filter((o: any) => 
    o.status === 'PENDING' || o.status === 'PREPARING'
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-transparent">
      <header className="flex justify-between items-center border-b pb-6 border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
            <ChefHat className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Kitchen Display</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Static Ticket View</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kitchenOrders.map((order: any) => (
          <OrderPrepCard key={order.id} order={order} />
        ))}

        {kitchenOrders.length === 0 && (
          <div className="col-span-full py-32 text-center border-4 border-dashed rounded-[3rem] border-slate-800">
             <Utensils size={64} className="mx-auto text-slate-700 mb-4" />
             <p className="text-slate-500 font-black uppercase tracking-widest text-xl">The kitchen is clear</p>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderPrepCard({ order }: { order: any }) {
  // Logic remains strictly based on the status string from the DB
  const isPreparing = order.status === 'PREPARING';

  return (
    <div className={`
      relative rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6 border-2 transition-none
      ${isPreparing 
        ? 'bg-slate-900 border-blue-600/50' 
        : 'bg-slate-900 border-slate-800'}
    `}>
      
      {/* Header with Order ID and Status Pill */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-black bg-slate-800 text-slate-200 px-4 py-1.5 rounded-full tracking-tighter uppercase border border-slate-700">
          Order #{order.id}
        </span>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
          ${isPreparing ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}
        `}>
          <span className={`w-2 h-2 rounded-full ${isPreparing ? 'bg-blue-400' : 'bg-amber-400'}`} />
          {order.status}
        </div>
      </div>

      {/* Main Status Display - Icons are now static */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 
          ${isPreparing ? 'bg-blue-600/20 text-blue-500' : 'bg-slate-800 text-slate-600'}
        `}>
          {isPreparing ? <Flame size={48} /> : <Clock size={48} />}
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          {isPreparing ? 'Preparing Food' : 'In Order Queue'}
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase mt-1">
          {isPreparing ? 'Currently cooking' : 'Waiting for kitchen space'}
        </p>
      </div>

      {/* Ticket Details */}
      <div className="bg-slate-800/40 border border-slate-800/60 p-5 rounded-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2 mb-3">
          Kitchen Ticket
        </p>
        <div className="space-y-2">
          {order.orderDetails && order.orderDetails.length > 0 ? (
            order.orderDetails.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-200">
                  {item.quantity}x {item.menuItem?.name || 'Menu Item'}
                </span>
                <CheckCircle2 size={14} className="text-slate-700" />
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-600 italic">No items attached</span>
          )}
        </div>
      </div>

      {/* Timestamp info - Static text */}
      <div className="text-center pt-2">
         <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">
           Last Update: {new Date(order.lastUpdated).toLocaleTimeString()}
         </p>
      </div>
    </div>
  )
}