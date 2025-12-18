import { useLogoutMutation } from '@/auth/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: { redirect: window.location.pathname, mode: 'login' },
      })
    }
  },
  component: DashboardComponent,
})

function DashboardComponent() {
  const { auth } = Route.useRouteContext()
  const logoutMutation = useLogoutMutation()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => logoutMutation.mutate()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
        <p className="text-gray-600">
          Hello, <strong>{auth.user?.email}</strong>! You are successfully
          authenticated.
        </p>
        <p className="text-sm text-gray-500 mt-2">Email: {auth.user?.email}</p>
      </div>
    </div>
  )
}
