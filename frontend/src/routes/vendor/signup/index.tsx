import { VendorSignupForm } from '@/components/forms/vendor-signup-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vendor/signup/')({
  component: VendorHome,
})

function VendorHome() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-muted min-h-svh md:p-10">
      <div className="flex flex-col w-full max-w-sm gap-6">
        <VendorSignupForm />
      </div>
    </div>
  )
}
