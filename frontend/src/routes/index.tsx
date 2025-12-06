import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <div className="min-h-screen flex items-center flex-wrap justify-evenly">
        <Button className="hover:cursor-pointer">Customer</Button>
        <Button className="hover:cursor-pointer">Vendor</Button>
        <Button className="hover:cursor-pointer">Restaurant</Button>
      </div>
      <div className="absolute bottom-0 left-0 p-3">
        <ThemeModeToggle />
      </div>
    </div>
  )
}
