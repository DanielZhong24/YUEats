import { useVendorContext } from '@/context/VendorContext'

export default function RestaurantSwitcher({
  className,
}: {
  className?: string
}) {
  const { restaurants, activeRestaurantId, setActiveRestaurantId, isLoading } =
    useVendorContext()

  if (isLoading)
    return (
      <span className="text-sm text-slate-400 animate-pulse">Loading...</span>
    )

  // If no restaurants, just show a simple "Setup" link
  if (!restaurants || restaurants.length === 0) {
    return <div>No restaurant yet...</div>
  }

  return (
    <select
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer ${className}`}
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
