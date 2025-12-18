import { useState } from 'react'
import RestaurantSwitcher from './RestaurantSwitcher'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CreateRestaurantModal from '@/components/vendor/RestaurantCreatePage' // 👈 Import your new modal

export default function Topbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-6">
          {/* Large restaurant switcher — clear, prominent */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2 shadow-sm">
            <RestaurantSwitcher className="text-lg" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick action buttons — prominent */}
          <Button
            onClick={() => setIsModalOpen(true)} // 👈 Open modal on click
            className="px-4 py-2 rounded-lg bg-red-600 text-white shadow hover:bg-red-900 flex items-center gap-2"
          >
            <Plus size={18} />
            Create Restaurant
          </Button>
        </div>
      </header>

      {/* Render the Modal here */}
      <CreateRestaurantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}