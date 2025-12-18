import { Link } from '@tanstack/react-router'
import { Button } from './button'
import { useAuth } from '@/auth/provider' // Import your auth hook

export function Hero({
  title = 'Delicious food, delivered fast',
  subtitle = 'Find your favorite local restaurants and get food delivered to your door.',
}) {
  const { user } = useAuth() // Get the current user

  // Helper to determine where the "Dashboard" button goes
  const getDashboardLink = () => {
    if (user?.userRole === 'VENDOR') return '/vendor'
    if (user?.userRole === 'COURIER') return '/courier'
    return '/customer'
  }

  return (
    <section className="w-full relative min-h-screen py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-4 text-lg text-slate-100/90">{subtitle}</p>

          <div className="mt-8 flex items-center gap-3">
            {user ? (
              /* LOGGED IN: Only show Dashboard button */
              <Link to={getDashboardLink()}>
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              /* GUEST: Show both buttons */
              <>
                <Link to="/auth" search={{ mode: 'signup', redirect: '/' }}>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700">
                    Get started
                  </Button>
                </Link>
                <Link to="/auth" search={{ mode: 'login', redirect: '/' }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:bg-white/90"
                  >
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
