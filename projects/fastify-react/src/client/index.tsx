import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './routes'
import { AuthProvider } from './context/auth'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)