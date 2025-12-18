import { createFileRoute } from '@tanstack/react-router'
import RestaurantCreatePage from '@/components/vendor/RestaurantCreatePage'

export const Route = createFileRoute('/_authenticated/vendor/restaurants/create/')({
  component: () => (
    <RestaurantCreatePage 
      isOpen={true} 
      onClose={() => window.history.back()} 
    />
  ),
})
export default Route
