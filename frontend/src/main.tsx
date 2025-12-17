import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import { AuthProvider, useAuth } from './auth'
import { router } from './router'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Inner component to access auth context
function InnerApp() {
  const auth = useAuth()
  const queryClient = TanStackQueryProvider.getContext().queryClient

  return <RouterProvider router={router} context={{ auth, queryClient }} />
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <TanStackQueryProvider.Provider {...TanStackQueryProvider.getContext()}>
          <InnerApp />
        </TanStackQueryProvider.Provider>
      </AuthProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
