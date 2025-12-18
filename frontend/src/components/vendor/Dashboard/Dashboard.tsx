import { useVendorContext } from '@/context/VendorContext'
import { useQuery } from '@tanstack/react-query'
import * as vendorService from '@/services/vendor'
import AnalyticsCard from './AnalyticsCard'
import Charts from './Charts'
import { Store, Plus, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export default function Dashboard() {
  const { activeRestaurantId, restaurants, isLoading: contextLoading } = useVendorContext()

  // 1. Queries (Only enabled if we actually have a restaurant ID)
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['vendor-orders', activeRestaurantId],
    queryFn: () => vendorService.getRestaurantOrders(activeRestaurantId!),
    enabled: !!activeRestaurantId,
  })

  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['restaurant-menu', activeRestaurantId],
    queryFn: () => vendorService.getRestaurantMenu(activeRestaurantId!),
    enabled: !!activeRestaurantId,
  })

  // 2. Loading State
  if (contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    )
  }

  // 3. THE "ONE" EMPTY STATE: Only show this if the list is truly empty
  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-12">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-full mb-6">
          <Store size={48} className="text-orange-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
          Setup Your Restaurant
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
          Welcome to the YUEats vendor portal! Register your first campus location to start receiving orders.
        </p>
   
      </div>
    )
  }

  // 4. Calculations for real dashboard data
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 italic tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your current location performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnalyticsCard title="Orders" value={ordersLoading ? "..." : orders.length.toString()} />
        <AnalyticsCard title="Revenue" value={ordersLoading ? "..." : `$${totalRevenue.toFixed(2)}`} />
        <AnalyticsCard title="Active Items" value={menuLoading ? "..." : menuItems.length.toString()} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold mb-6">Recent Activity</h3>
        <Charts orders={orders} />
      </div>
    </div>
  )
}