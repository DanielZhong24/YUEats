import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import Hero from '@/components/ui/hero'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="bg-background text-foreground">
      {/* HERO SECTION */}
      <div
        className="relative w-full"
        style={{
          backgroundImage: "url('/hero-1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        {/* HEADER */}
        <header className="relative z-20 w-full backdrop-blur sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="YuEats logo"
                className="w-10 h-10 object-cover rounded"
              />
              <span className="font-semibold text-lg text-white">YuEats</span>
            </div>

            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="secondary" className="rounded-full">
                  Login
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="rounded-full">Sign up</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="relative z-10">
          <Hero />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex flex-col items-center bg-background py-12">
        <section className="w-full max-w-8xl mx-auto mt-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {/* CARD 1 */}
            <div className="bg-card text-card-foreground rounded-lg p-6 flex flex-col items-start shadow-sm">
              <div className="w-full h-96 md:h-80 rounded overflow-hidden mb-4 bg-muted flex items-center justify-center">
                <img
                  src="/assets/home/service-1.jpg"
                  alt="Create business account"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-3xl font-bold mb-2">
                Create a business account
              </h3>

              <Link
                to="/business/signup"
                className="text-sm text-primary underline"
              >
                Create business account
              </Link>
            </div>

            {/* CARD 2 */}
            <div className="bg-card text-card-foreground rounded-lg p-6 flex flex-col items-start shadow-sm">
              <div className="w-full h-96 md:h-80 rounded overflow-hidden mb-4 bg-muted flex items-center justify-center">
                <img
                  src="/assets/home/service-2.jpg"
                  alt="Add restaurant"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-3xl font-bold mb-2">Add your restaurant</h3>

              <Link to="/vendor/add" className="text-sm text-primary underline">
                Add restaurant
              </Link>
            </div>

            {/* CARD 3 */}
            <div className="bg-card text-card-foreground rounded-lg p-6 flex flex-col items-start shadow-sm">
              <div className="w-full h-96 md:h-80 rounded overflow-hidden mb-4 bg-muted flex items-center justify-center">
                <img
                  src="/assets/home/service-3.jpg"
                  alt="Sign up to deliver"
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-3xl font-bold mb-2">Sign up to deliver</h3>

              <Link
                to="/courier/signup"
                className="text-sm text-primary underline"
              >
                Sign up to deliver
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
