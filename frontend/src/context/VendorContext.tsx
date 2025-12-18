import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type VendorContextType = {
  activeRestaurantId: number | null
  setActiveRestaurantId: (id: number) => void
}

const VendorContext = createContext<VendorContextType | undefined>(undefined)

export function VendorProvider({ children }: { children: ReactNode }) {
  // 1. Initialize from LocalStorage so we don't lose selection on refresh
  const [activeRestaurantId, setActiveRestaurantIdState] = useState<number | null>(() => {
    const saved = localStorage.getItem('vendor_active_restaurant')
    return saved ? parseInt(saved, 10) : null
  })

  // 2. Wrapper to save to LocalStorage whenever it changes
  const setActiveRestaurantId = (id: number) => {
    setActiveRestaurantIdState(id)
    localStorage.setItem('vendor_active_restaurant', id.toString())
  }

  return (
    <VendorContext.Provider value={{ activeRestaurantId, setActiveRestaurantId }}>
      {children}
    </VendorContext.Provider>
  )
}

// 3. Custom Hook for easy usage
export function useVendorContext() {
  const context = useContext(VendorContext)
  if (!context) {
    throw new Error('useVendorContext must be used within a VendorProvider')
  }
  return context
}