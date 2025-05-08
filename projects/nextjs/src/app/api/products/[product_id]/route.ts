import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ product_id: string }> }
) {
  const { product_id } = await params

  return new Promise((resolve) => {
    db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, row) => {
      if (err) {
        resolve(NextResponse.json({ success: false, error: err.message }, { status: 500 }))
      } else if (row) {
        resolve(NextResponse.json({ success: true, product: row }))
      } else {
        resolve(NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 }))
      }
    })
  })
}
