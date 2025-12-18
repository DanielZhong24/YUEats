import { useState } from 'react'
import { useRestaurantOrders, useVerifyDriverCode } from '@/hooks/useVendorApi'
import { useVendorContext } from '@/context/VendorContext'
import { ChefHat, Utensils, Clock, Flame, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function VendorPrepPage() {
  const { activeRestaurantId } = useVendorContext()
  
  // Fetch orders with automatic polling to catch driver claims (PICKED_UP)
  const { data: orders, isLoading } = useRestaurantOrders(activeRestaurantId || 0)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-red-500 mb-2" size={32} />
        <div className="text-red-500 font-bold uppercase tracking-widest ml-4">Loading Kitchen...</div>
      </div>
    )
  }

  const ordersList = Array.isArray(orders) ? orders : [];
  
  // Updated Filter: Now includes 'PICKED_UP' for the Handshake phase
  const kitchenOrders = ordersList.filter((o: any) => 
    o.status === 'PENDING' || 
    o.status === 'PREPARING' || 
    o.status === 'READY_FOR_PICKUP' ||
    o.status === 'PICKED_UP'
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-transparent">
      <header className="flex justify-between items-center border-b pb-6 border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg">
            <ChefHat className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Kitchen Display</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Live Order Handover</p>
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
  const [code, setCode] = useState('');
  const verifyMutation = useVerifyDriverCode(); // Ensure this hook calls your vendorService.verifyDriverCode

  const isPreparing = order.status === 'PREPARING';
  const isWaitingForDriver = order.status === 'PICKED_UP';

  const handleVerify = () => {
    if (code.length < 4) return toast.error("Please enter a valid code");
    verifyMutation.mutate({ orderId: order.id, code: code.toUpperCase() }, {
      onSuccess: () => {
        setCode('');
        toast.success("Handover confirmed!");
      }
    });
  };

  return (
    <div className={`
      relative rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6 border-2 transition-all duration-300
      ${isWaitingForDriver 
        ? 'bg-slate-800 border-red-500 ring-4 ring-red-500/20' 
        : isPreparing 
          ? 'bg-slate-900 border-red-600/50' 
          : 'bg-slate-900 border-slate-800'}
    `}>
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-black bg-slate-800 text-slate-200 px-4 py-1.5 rounded-full tracking-tighter uppercase border border-slate-700">
          Order #{order.id}
        </span>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
          ${isWaitingForDriver ? 'bg-red-500 text-white' : isPreparing ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}
        `}>
          <span className={`w-2 h-2 rounded-full ${isWaitingForDriver ? 'bg-white animate-ping' : isPreparing ? 'bg-blue-400' : 'bg-amber-400'}`} />
          {isWaitingForDriver ? 'Driver Arrived' : order.status}
        </div>
      </div>

      {/* Action Area: Handshake Input or Status Icon */}
      {isWaitingForDriver ? (
        <div className="bg-slate-700/50 p-6 rounded-[2rem] border border-red-500/30 text-center space-y-4">
          <ShieldCheck className="mx-auto text-red-500" size={40} />
          <p className="text-xs font-black text-white uppercase tracking-widest">Verify Driver Identity</p>
          <Input 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CODE FROM PHONE"
            className="bg-slate-900 border-slate-600 text-white text-center font-black tracking-[0.3em] uppercase h-12"
          />
          <Button 
            onClick={handleVerify}
            disabled={verifyMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black rounded-xl h-12 uppercase italic"
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Release Order'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 
            ${isPreparing ? 'bg-blue-600/20 text-blue-500' : 'bg-slate-800 text-slate-600'}
          `}>
            {isPreparing ? <Flame size={48} /> : <Clock size={48} />}
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            {isPreparing ? 'Preparing Food' : 'Awaiting Collection'}
          </h2>
        </div>
      )}

      {/* Kitchen Ticket Details */}
      <div className="bg-slate-800/40 border border-slate-800/60 p-5 rounded-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2 mb-3">
          Kitchen Ticket
        </p>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {order.orderDetails?.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-200">
                {item.quantity}x {item.menuItem?.itemName}
              </span>
              <CheckCircle2 size={14} className="text-slate-700" />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-2">
         <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">
            Last Update: {new Date(order.lastUpdated).toLocaleTimeString()}
         </p>
      </div>
    </div>
  )
}