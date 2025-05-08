import { Low } from 'lowdb'

declare global {
  interface User {
    username: string
    password: string
    role: 'admin' | 'user'
    coin: number
  }
  
  interface DatabaseData {
    users: User[]
  }

  var db: Low<DatabaseData>
}
