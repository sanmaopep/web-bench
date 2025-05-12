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

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import Product from '@/model/product'
import './style.css'

export default async function AdminProductsPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'admin') {
    redirect('/login')
  }

  const products = await Product.find()

  return (
    <div className="admin-products">
      <h1>Product Management</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Description</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={String(product._id)} id={`admin_product_${product._id}`}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <img src={product.image} alt={product.name} className="admin-product-image" />
              </td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
