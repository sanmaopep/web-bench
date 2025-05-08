import { createBrowserRouter, Outlet } from 'react-router'

/**
 * React Router v7.5.0
 */

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    hasErrorBoundary: true,
    children: [
      {
        index: true,
        element: <div>Home</div>,
      },
      {
        path: '/login',
        element: <div>Login</div>,
      },
      {
        path: '*',
        element: <div>404 Error</div>,
      },
    ],
  },
])
