import LiveOrderStatus from './LiveOrderStatus'

export default function OrdersPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">My Orders</h1>
        <p className="text-slate-500 font-medium">Tracking and history</p>
      </div>

      {/* Put your live tracking bars here */}
      <LiveOrderStatus />
      
      {/* You can add a 'History' section here later */}
    </div>
  )
}