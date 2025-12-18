import { createFileRoute } from '@tanstack/react-router'
import RestaurantDetail from '@/components/customer/RestaurantDetail'

export const Route = createFileRoute('/customer/restaurant/$restaurantId')({
  component: RestaurantDetail,
})