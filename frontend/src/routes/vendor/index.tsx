import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/')({
  component: VendorHome,
})

// TODO: Implement vendor user flow
function VendorHome() {
  return (
    <div>
      <div>Hello "/vendor/"!</div>
      <div>testing</div>
    </div>
  )
}
