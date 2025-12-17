import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <div className="flex flex-wrap items-center min-h-screen justify-evenly">
        <Button>
          <Link to="/customer">Customer</Link>
        </Button>
        <Button>
          <Link to="/vendor">Vendor</Link>
        </Button>
        <Button>
          <Link to="/drivers">Restaurant</Link>
        </Button>
      </div>
    </div>
  )
}
