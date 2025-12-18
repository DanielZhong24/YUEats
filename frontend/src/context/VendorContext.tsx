import React, { createContext, useContext, useState, useEffect } from 'react'
import * as vendorService from '@/services/vendor'
import { useQuery } from '@tanstack/react-query'

interface VendorContextType {
  activeRestaurantId: string | null
  setActiveRestaurantId: (id: string | null) => void // Allow null
  restaurants: any[]
  isLoading: boolean
}

export const VendorContext = createContext<VendorContextType | undefined>(
  undefined,
)

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(
    null,
  )

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['my-restaurants'],
    queryFn: vendorService.getMyRestaurants,
  })

  useEffect(() => {
    // Only auto-select if there are actually restaurants available
    if (restaurants.length > 0 && !activeRestaurantId) {
      setActiveRestaurantId(restaurants[0].id)
    }
  }, [restaurants, activeRestaurantId])

  return (
    <VendorContext.Provider
      value={{
        activeRestaurantId,
        setActiveRestaurantId,
        restaurants,
        isLoading,
      }}
    >
      {children}
    </VendorContext.Provider>
  )
}

export function useVendorContext() {
  const context = useContext(VendorContext)
  if (context === undefined) {
    throw new Error('useVendorContext must be used within a VendorProvider')
  }
  return context
}
