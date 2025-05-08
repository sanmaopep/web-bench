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
