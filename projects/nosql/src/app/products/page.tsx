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
