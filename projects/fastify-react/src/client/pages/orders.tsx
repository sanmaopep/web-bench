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
import './orders.css';

interface Order {
  id: number;
  date: string;
  status: string;
  totalPrice: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="orders-loading">Loading orders...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="orders-empty">You haven't placed any orders yet</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div 
              className="order-item" 
              id={`my_order_${order.id}`}
              key={order.id}
              onClick={() => navigate(`/order/${order.id}`)}
            >
              <div className="order-header">
                <div className="order-id">Order #{order.id}</div>
                <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
              </div>
              <div className="order-content">
                <div className={`order-status status-${order.status.toLowerCase().replace(' ', '-')}`}>
                  Status: {order.status}
                </div>
                <div className="order-total">Total: ${order.totalPrice.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="back-to-home"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Orders;