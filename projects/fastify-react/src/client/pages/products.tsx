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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './products.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return <div className="products-loading">Loading products...</div>;
  if (error) return <div className="products-error">{error}</div>;

  return (
    <div className="products-container">
      <h1>Our Products</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div 
              className="product-card" 
              id={`product_card_${product.id}`} 
              key={product.id}
              onClick={() => handleProductClick(product.id)}
            >
              <img className="product-image" src={product.image} alt={product.name} />
              <div className="product-name">{product.name}</div>
              <div className="product-price">${product.price.toFixed(2)}</div>
            </div>
          ))
        ) : (
          <div className="no-products">No products available</div>
        )}
      </div>
    </div>
  );
};

export default Products;