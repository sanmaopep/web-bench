// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { getCurrentUser } from '@/actions/auth'
import Product from '@/model/product'
import Order from '@/model/order'
import Comment from '@/model/comment'
import AddToWishlistButton from './AddToWishlistButton'
import AddToCartButton from './AddToCartButton'
import CommentForm from './CommentForm'
import ProductComments from './ProductComments'
import './styles.css'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await Product.findById(id)
  const currentUser = await getCurrentUser()

  if (!product) {
    return <div>Product Not Found</div>
  }

  let canComment = false
  if (currentUser) {
    const hasFinishedOrder = await Order.findOne({
      username: currentUser.username,
      status: 'Finished',
      'items.productId': product._id
    })
    
    const hasCommented = await Comment.findOne({
      username: currentUser.username,
      productId: product._id
    })

    canComment = hasFinishedOrder && !hasCommented
  }

  return (
    <div className="product-detail">
      <img className="product-image" src={product.image} alt={product.name} />
      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">${product.price}</p>
        <p className="product-quantity">Quantity: {product.quantity}</p>
        <p className="product-description">{product.description}</p>
        <AddToWishlistButton productId={String(product._id)} />
        <AddToCartButton productId={String(product._id)} />
      </div>
      
      <div className="product-comments-section">
        <ProductComments productId={String(product._id)} />
        {canComment && <CommentForm productId={String(product._id)} />}
      </div>
    </div>
  )
}