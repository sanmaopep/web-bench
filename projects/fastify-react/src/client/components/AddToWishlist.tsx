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