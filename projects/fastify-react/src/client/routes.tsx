import { createBrowserRouter } from 'react-router'
import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import RootLayout from './root'
import NotFound from './pages/not-found'
import Products from './pages/products'
import ProductDetail from './pages/product-detail'
import Profile from './pages/profile'
import ProductManagement from './pages/admin/product-management'
import UserManagement from './pages/admin/user-management'
import OrderManagement from './pages/admin/order-management'
import Wishlist from './pages/wishlist'
import Orders from './pages/orders'
import OrderDetail from './pages/order-detail'

/**
 * React Router v7.5.0
 */

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    hasErrorBoundary: true,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/products/:product_id',
        element: <ProductDetail />,
      },
      {
        path: '/profile/:username',
        element: <Profile />,
      },
      {
        path: '/admin/products',
        element: <ProductManagement />,
      },
      {
        path: '/admin/users',
        element: <UserManagement />,
      },
      {
        path: '/admin/orders',
        element: <OrderManagement />,
      },
      {
        path: '/wishlist',
        element: <Wishlist />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '/order/:order_id',
        element: <OrderDetail />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])