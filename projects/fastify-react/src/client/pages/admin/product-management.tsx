import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/auth';
import './product-management.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, user]);

  if (loading) return <div className="admin-products-loading">Loading products...</div>;
  if (error) return <div className="admin-products-error">{error}</div>;

  return (
    <div className="admin-products-container">
      <h1 className="admin-products-title">Product Management</h1>
      
      <table className="admin-products-table">
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
          {products.map((product) => (
            <tr key={product.id} id={`admin_product_${product.id}`}>
              <td>{product.id}</td>
              <td>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image-thumbnail"
                />
              </td>
              <td>{product.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button 
        className="admin-back-button"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default ProductManagement;