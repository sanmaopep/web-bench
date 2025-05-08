'use server'

import { getCurrentUser } from './auth'

export async function rechargeCoin() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }
    
    const userIndex = global.db.data.users.findIndex(u => u.username === currentUser.username)
    
    if (userIndex === -1) {
      return { success: false, error: 'User not found' }
    }
    
    // Add 1000 coins to the user's account
    global.db.data.users[userIndex].coin += 1000
    await global.db.write()
    
    return { success: true, coin: global.db.data.users[userIndex].coin }
  } catch (error) {
    return { success: false, error: 'Failed to recharge' }
  }
}