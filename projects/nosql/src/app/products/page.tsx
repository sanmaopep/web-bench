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

import Product from '@/model/product'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await Product.find()

  return (
    <div className="product-list">
      {products.map((product: any) => (
        <Link href={`/products/${product._id}`} key={String(product._id)}>
          <div className="product-card" id={`product_card_${product._id}`}>
            <img className="product-image" src={product.image} alt={product.name} />
            <div className="product-name">{product.name}</div>
            <div className="product-price">${product.price}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
