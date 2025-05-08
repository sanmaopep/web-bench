import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/actions/auth'
import Comment from '@/model/comment'
import Order from '@/model/order'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const comments = await Comment.find({ productId: (await params).id }).sort('-createdAt')
  return NextResponse.json(comments)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const orders = await Order.find({
    username: currentUser.username,
    status: 'Finished',
    'items.productId': (await params).id
  })

  if (!orders.length) {
    return new Response(null, { status: 403 })
  }

  const existingComment = await Comment.findOne({
    username: currentUser.username,
    productId: (await params).id
  })

  if (existingComment) {
    return new Response(null, { status: 400 })
  }

  const { rating, text } = await request.json()
  
  const comment = await Comment.create({
    username: currentUser.username,
    productId: (await params).id,
    rating,
    text
  })

  return NextResponse.json(comment)
}