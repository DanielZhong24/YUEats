import { useCustomerOrders } from '@/hooks/useCustomerApi';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Package, Clock, Utensils, CheckCircle, MapPin, History } from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useCustomerOrders(user?.id || 0);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const ordersList = Array.isArray(orders) ? orders : [];
  const activeOrders = ordersList.filter(o => 
    ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'IN_TRANSIT'].includes(o.status)
  );
  const pastOrders = ordersList.filter(o => o.status === 'COMPLETED');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 min-h-screen bg-transparent">
      <header className="flex justify-between items-center border-b pb-6 border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
            <Package className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">My Orders</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Live Tracking</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {activeOrders.map((order) => (
          <CustomerOrderCard key={order.id} order={order} />
        ))}
        {activeOrders.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed rounded-[3rem] border-slate-800">
            <Utensils size={64} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-xl">No active orders</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerOrderCard({ order }: { order: any }) {
  const status = order.status;

  return (
    <div className={`relative rounded-[2.5rem] p-8 shadow-2xl flex flex-col gap-6 border-2 bg-slate-900 
      ${status === 'READY_FOR_PICKUP' ? 'border-emerald-600/50' : 'border-slate-800'}`}>
      
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">
          {order.restaurant?.name || 'Restaurant'}
        </h3>
        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-200 border border-slate-700">
          {status}
        </span>
      </div>

      <div className="flex items-center gap-6 py-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-500">
          {status === 'READY_FOR_PICKUP' ? <CheckCircle size={32} /> : <Clock size={32} />}
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase">{status.replace('_', ' ')}</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Order #{order.id}</p>
        </div>
      </div>

      <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800/60">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700 pb-2 mb-3">Your Items</p>
        <div className="space-y-2">
          {order.orderDetails?.map((item: any) => (
            <div key={item.id} className="text-sm font-bold text-slate-200">
              {item.quantity}x {item.menuItem?.name}
            </div>
          ))}
        </div>
      </div>

      {status === 'READY_FOR_PICKUP' && (
        <div className="mt-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Pickup Code</p>
          <p className="text-3xl font-black text-white tracking-widest uppercase">{order.pickupCode || 'N/A'}</p>
        </div>
      )}
    </div>
  );
}