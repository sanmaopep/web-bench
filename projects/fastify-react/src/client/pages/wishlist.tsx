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
import { useAuth } from '../context/auth';
import './wishlist.css';

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      
      if (data.success) {
        setWishlistItems(data.items);
      } else {
        setError('Failed to load wishlist');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      } else {
        setError('Failed to remove from wishlist');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  if (loading) return <div className="wishlist-loading">Loading wishlist...</div>;
  if (error) return <div className="wishlist-error">{error}</div>;

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">Your wishlist is empty</div>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => (
            <div 
              className="wishlist-item" 
              id={`wishlist_item_${item.productId}`}
              key={item.id}
            >
              <img className="wishlist-image" src={item.image} alt={item.name} />
              <div className="wishlist-name">{item.name}</div>
              <div className="wishlist-price">${item.price.toFixed(2)}</div>
              <div className="wishlist-actions">
                <button 
                  className="view-product"
                  onClick={() => navigate(`/products/${item.productId}`)}
                >
                  View Product
                </button>
                <button 
                  className="remove-from-wishlist"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="wishlist-back-button"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Wishlist;