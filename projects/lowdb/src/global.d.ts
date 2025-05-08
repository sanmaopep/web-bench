import { Low } from 'lowdb'

declare global {
  interface User {
    username: string
    password: string
    role: 'admin' | 'user'
    coin: number
  }
  
  interface Product {
    id: string
    name: string
    price: number
    image: string
    description: string
    quantity: number
  }
  
  interface WishlistItem {
    username: string
    productId: string
  }
  
  interface CartItem {
    username: string
    productId: string
    quantity: number
  }

  interface OrderItem {
    productId?: string
    name?: string
    price?: number
    image?: string
    quantity?: number
  }

  interface Order {
    id: string
    username: string
    items: OrderItem[]
    totalPrice: number
    status: string
    createdAt: string
  }
  
  interface Comment {
    id: string
    username: string
    productId: string
    rating: number
    text: string
    createdAt: string
  }
  
  interface Referral {
    referrerUsername: string
    newUserUsername: string
    initialRewardPaid: boolean
    orderRewardPaid: boolean
  }
  
  interface DatabaseData {
    users: User[]
    products: Product[]
    wishlist: WishlistItem[]
    cart: CartItem[]
    orders: Order[]
    comments: Comment[]
    referrals: Referral[]
  }

  var db: Low<DatabaseData>
}