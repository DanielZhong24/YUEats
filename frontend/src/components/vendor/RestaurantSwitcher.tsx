import { useEffect } from 'react'
import { useMyRestaurants } from '@/hooks/useVendorApi'
import { useVendorContext } from '@/context/VendorContext' // 👈 Import hook

export default function RestaurantSwitcher({ className }: { className?: string }) {
  const { data: restaurants } = useMyRestaurants()
  const { activeRestaurantId, setActiveRestaurantId } = useVendorContext()

  // Auto-select the first restaurant if none is selected yet
  useEffect(() => {
    if (restaurants && restaurants.length > 0 && !activeRestaurantId) {
      setActiveRestaurantId(restaurants[0].id)
    }
  }, [restaurants, activeRestaurantId, setActiveRestaurantId])

  if (!restaurants?.length) {
    return <span className="text-sm text-slate-500">No restaurants</span>
  }

  return (
    <select
      className={`bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer ${className}`}
      // 👇 Bind to Global Context
      value={activeRestaurantId || ''}
      onChange={(e) => setActiveRestaurantId(Number(e.target.value))}
    >
      {restaurants.map((r: any) => (
        <option key={r.id} value={r.id}>
          {r.restaurantName}
        </option>
      ))}
    </select>
  )
}