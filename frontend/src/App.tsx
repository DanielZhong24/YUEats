import { RouterProvider } from '@tanstack/react-router'
import { AuthProvider, useAuth } from './auth/provider'
import { router } from './router'

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}

export default App
