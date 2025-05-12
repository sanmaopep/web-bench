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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth';
import './AddToWishlist.css';

interface AddToWishlistProps {
  productId: number;
}

const AddToWishlist: React.FC<AddToWishlistProps> = ({ productId }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, productId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        setIsInWishlist(data.inWishlist);
      }
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsInWishlist(true);
        setFeedback({ 
          message: 'Added to wishlist successfully!', 
          type: 'success' 
        });
      } else {
        setFeedback({ 
          message: data.message || 'Failed to add to wishlist', 
          type: 'error'
        });
      }
    } catch (err) {
      setFeedback({ 
        message: 'Error adding to wishlist', 
        type: 'error'
      });
      console.error(err);
    }

    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setIsInWishlist(false);
        setFeedback({ 
          message: 'Removed from wishlist successfully!', 
          type: 'success'
        });
      } else {
        setFeedback({ 
          message: data.message || 'Failed to remove from wishlist', 
          type: 'error'
        });
      }
    } catch (err) {
      setFeedback({ 
        message: 'Error removing from wishlist', 
        type: 'error'
      });
      console.error(err);
    }

    // Clear feedback after 3 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  return (
    <div>
      <button 
        className={`add-to-wishlist ${isInWishlist ? 'in-wishlist' : ''}`}
        onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
      >
        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
      
      {feedback && (
        <div className={`wishlist-feedback wishlist-${feedback.type}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default AddToWishlist;