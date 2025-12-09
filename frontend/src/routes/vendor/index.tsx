import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/')({
  component: VendorLayout,
})

function VendorLayout() {
  return (
    <div>
      <div>Should be home page of Vendor</div>
      <div>If !user, go to signup automatically</div>
    </div>
  )
}
