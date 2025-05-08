import { NextResponse } from 'next/server'
import { Wishlist, Product } from '@/model'
import { getLoggedInUser } from '@/actions/auth'

export async function GET() {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const wishlistItems = await Wishlist.findAll({
      where: { username: currentUser.username },
      include: [{
        model: Product,
        as: 'product'
      }]
    })
    
    // Extract products from wishlist items
    const products = wishlistItems.map(item => item.product)
    
    return NextResponse.json({ 
      success: true, 
      products 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch wishlist' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { productId } = await request.json()
    
    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: {
        username: currentUser.username,
        productId
      }
    })
    
    return NextResponse.json({ 
      success: true,
      data: { id: wishlistItem.id },
      added: created
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: `Failed to add to wishlist: ${error}`
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getLoggedInUser()
    
    if (!currentUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { productId } = await request.json()
    
    const deleted = await Wishlist.destroy({
      where: {
        username: currentUser.username,
        productId
      }
    })
    
    return NextResponse.json({ 
      success: true,
      deleted: deleted > 0
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to remove from wishlist' 
    }, { status: 500 })
  }
}