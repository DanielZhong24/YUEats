import { createFileRoute } from '@tanstack/react-router'
import RestaurantDetail from '@/components/customer/RestaurantDetail'

export const Route = createFileRoute('/_authenticated/customer/restaurant/$restaurantId')({
  component: RestaurantDetail,
})