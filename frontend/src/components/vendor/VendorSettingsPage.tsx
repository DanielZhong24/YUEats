import { useState } from 'react'
import { Trash2, Loader2, Building2, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteRestaurant, useMyRestaurants } from '@/hooks/useVendorApi'
import { useVendorContext } from '@/context/VendorContext'
import { useNavigate } from '@tanstack/react-router'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'

export default function VendorSettingsPage() {
  const { activeRestaurantId } = useVendorContext()
  const { data: restaurants, isLoading } = useMyRestaurants()
  const { mutate: deleteRestaurant, isPending } = useDeleteRestaurant()
  const navigate = useNavigate()

  // --- Local State for Modal ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const selectedRestaurant = restaurants?.find(r => r.id === activeRestaurantId)

  const handleConfirmDelete = () => {
    if (!selectedRestaurant) return

    deleteRestaurant(selectedRestaurant.id, {
      onSuccess: () => {
        toast.success(`"${selectedRestaurant.restaurantName}" has been deleted.`)
        
        // 1. Clear selection from local storage
        localStorage.removeItem('vendor_active_restaurant')
        
        // 2. Close modal
        setIsDeleteModalOpen(false)
        
        // 3. Redirect and refresh
        navigate({ to: '/vendor/' })
        window.location.reload()
      },
      onError: (error: any) => {
        toast.error("Failed to delete restaurant", {
          description: error.message || "Please try again later."
        })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }

  if (!selectedRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <Building2 size={48} className="mb-4 opacity-20" />
        <p>No restaurant selected. Please use the switcher in the top bar.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage configuration for <span className="font-semibold">{selectedRestaurant.restaurantName}</span>
        </p>
      </header>

      {/* General Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b dark:border-slate-700 flex items-center gap-3">
          <Building2 className="text-blue-500" size={20} />
          <h2 className="font-semibold text-lg dark:text-white">General Information</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Restaurant Name</label>
            <p className="text-lg font-medium dark:text-slate-200">{selectedRestaurant.restaurantName}</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-400">Address</label>
            <p className="text-lg font-medium dark:text-slate-200">{selectedRestaurant.address}</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30 overflow-hidden">
        <div className="p-4 bg-red-100/50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-900/30">
          <h2 className="flex items-center gap-2 text-red-800 dark:text-red-400 font-bold">
            <ShieldAlert size={20} />
            Danger Zone
          </h2>
        </div>
        
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <p className="font-bold text-red-900 dark:text-red-200">Delete this restaurant</p>
            <p className="text-sm text-red-700/70 dark:text-slate-400 max-w-md">
              Deleting this restaurant will remove all menu items, orders, and data. 
              This action is permanent and cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 active:scale-95"
          >
            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            Delete Restaurant
          </button>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        targetName={selectedRestaurant.restaurantName}
        isLoading={isPending}
      />
    </div>
  )
}