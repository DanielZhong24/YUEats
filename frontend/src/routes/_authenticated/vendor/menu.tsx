import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { 
  Plus, Search, Edit2, Trash2, 
  Image as ImageIcon, Loader2, ChevronDown, Utensils 
} from 'lucide-react'
import { toast } from 'sonner'

import CreateMenuModal from '@/components/vendor/CreateMenuModal'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { 
  useRestaurantMenu, 
  useMyRestaurants, 
  useDeleteMenuItem,
  useUpdateMenuItem 
} from '@/hooks/useVendorApi'
import { useVendorContext } from '@/context/VendorContext'

export const Route = createFileRoute('/_authenticated/vendor/menu')({
  component: MenuPage,
})

function MenuPage() {
  const { data: myRestaurants, isLoading: isLoadingRestaurants } = useMyRestaurants()
  const { activeRestaurantId } = useVendorContext()
  const activeRestaurant = myRestaurants?.find(r => r.id === activeRestaurantId)

  const { 
    data: menuItems, 
    isLoading: isLoadingMenu, 
  } = useRestaurantMenu(activeRestaurantId || 0) 

  const deleteItem = useDeleteMenuItem()
  const updateItem = useUpdateMenuItem()

  // --- Local State ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [itemToDelete, setItemToDelete] = useState<{id: number, name: string} | null>(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  // --- Handlers ---
  const handleAddNew = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleConfirmDelete = () => {
    if (!activeRestaurantId || !itemToDelete) return

    deleteItem.mutate(
      { restaurantId: activeRestaurantId, itemId: itemToDelete.id },
      {
        onSuccess: () => {
          toast.success(`Removed ${itemToDelete.name} from menu`)
          setItemToDelete(null)
        },
        onError: () => {
          toast.error("Failed to delete item. Please try again.")
        }
      }
    )
  }

  const handleToggleAvailability = (item: any) => {
    if (!activeRestaurantId) return
    const itemId = item.id || item.itemId; 
    const currentStatus = item.available ?? item.isAvailable ?? true
    const newStatus = !currentStatus

    updateItem.mutate({
      restaurantId: activeRestaurantId,
      itemId: itemId,
      data: { ...item, isAvailable: newStatus, available: newStatus }
    }, {
      onSuccess: () => {
        toast.info(`${item.itemName} status updated to ${newStatus ? 'Available' : 'Sold Out'}`)
      }
    })
  }

  // --- Logic & Filtering ---
  // Guard against non-array responses to prevent .map crashes
  const itemsToDisplay = Array.isArray(menuItems) ? menuItems : []

  const categories = useMemo(() => {
    return ['All', ...new Set(itemsToDisplay.map((i: any) => i.category || 'Main'))]
  }, [itemsToDisplay])

  const filteredItems = useMemo(() => {
    return itemsToDisplay.filter((item: any) => {
      const nameToSearch = item.itemName || ""; 
      const matchesSearch = nameToSearch.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [itemsToDisplay, search, filterCategory])

  // --- Loading States ---
  if (isLoadingRestaurants || (activeRestaurantId && isLoadingMenu)) {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4 text-slate-500">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="animate-pulse">Loading your menu...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="text-red-500" size={24} />
            Menu: {activeRestaurant?.restaurantName || 'Select a Restaurant'}
          </h1>
        </div>
        
        <button 
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus size={20} /> Add New Dish
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-red-500 outline-none"
          >
            {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 group transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 border dark:border-slate-700 overflow-hidden flex-shrink-0">
                          {item.imgUrl ? <img src={item.imgUrl} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="m-auto mt-3 text-slate-400" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{item.itemName}</div>
                          <div className="text-sm text-slate-500 truncate max-w-[250px]">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-md border dark:border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      ${item.price?.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border ${
                          item.available 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                          : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-700'
                        }`}
                      >
                        {item.available ? 'Available' : 'Sold Out'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setItemToDelete({ id: item.id, name: item.itemName })} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Utensils size={48} className="opacity-10" />
                      <p className="text-lg font-medium">No menu items found</p>
                      <button onClick={handleAddNew} className="text-red-500 hover:underline text-sm font-bold">Add your first dish</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nice Modals */}
      <CreateMenuModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        restaurantId={activeRestaurantId || 0}
        editItem={editingItem}
      />

      <ConfirmDeleteModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        targetName={itemToDelete?.name || ''}
        isLoading={deleteItem.isPending}
      />
    </div>
  )
}