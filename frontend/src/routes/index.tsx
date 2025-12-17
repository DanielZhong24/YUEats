import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <div className="flex flex-wrap items-center min-h-screen justify-evenly">
        <Link to="/customer">
          <Button>Customer</Button>
        </Link>
        <Link to="/vendor">
          <Button>Vendor</Button>
        </Link>
        <Link to="/courier">
          <Button>Courier</Button>
        </Link>
      </div>
    </div>
  )
}
