import { prisma } from '@/libs/db'
import '../admin.css'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany()

  return (
    <div>
      <h2 className="admin-section-title">Product Management</h2>
      
      {products.length === 0 ? (
        <p className="admin-no-items">No products found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} id={`admin_product_${product.id}`}>
                <td>{product.id}</td>
                <td>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="admin-product-image" 
                  />
                </td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}