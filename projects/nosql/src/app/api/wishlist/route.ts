import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import Wishlist from '@/model/wishlist'

export async function POST(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const { productId } = await request.json()

  try {
    await Wishlist.create({
      username: currentUser.username,
      productId,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false })
  }
}

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const { productId } = await request.json()

  await Wishlist.findOneAndDelete({
    username: currentUser.username,
    productId,
  })

  return NextResponse.json({ success: true })
}
