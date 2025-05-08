import { NextResponse } from 'next/server'
import { getLoggedInUser } from '@/actions/auth'
import { User } from '@/model'
import { sequelize } from '@/libs/db'

export async function POST(request: Request) {
  try {
    const currentUser = await getLoggedInUser()
    
    // Check if user is authenticated
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { username } = await request.json()
    
    // Check if user is trying to recharge their own account
    if (currentUser.username !== username) {
      return NextResponse.json({ 
        success: false, 
        error: 'You can only recharge your own account' 
      }, { status: 403 })
    }
    
    try {
      // Recharge 1000 coins
       await User.update(
        { coin: sequelize.literal('coin + 1000') },
        { where: { username } }
      )
      
      return NextResponse.json({ 
        success: true,
        message: 'Successfully recharged 1000 coins'
      })
    } catch (error) {
      throw error
    }
  } catch (error) {
    console.error('Recharge error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to recharge' 
    }, { status: 500 })
  }
}