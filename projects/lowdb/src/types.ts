export interface User {
  username: string
  password: string
  role: 'admin' | 'user'
  coin: number
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  quantity: number
}

export interface WishlistItem {
  username: string
  productId: string
}

export interface CartItem {
  username: string
  productId: string
  quantity: number
}

export interface DatabaseData {
  users: User[]
  products: Product[]
  wishlist?: WishlistItem[]
  cart?: CartItem[]
}