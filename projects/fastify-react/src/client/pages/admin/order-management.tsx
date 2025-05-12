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
import { useAuth } from '../../context/auth';
import './order-management.css';

interface Order {
  id: number;
  username: string;
  date: string;
  status: string;
  totalPrice: number;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders');
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

    fetchOrders();
  }, [navigate, user]);

  const handlePassRefundReview = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/approve-refund`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update the order in the list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'Refund Passed' } 
              : order
          )
        );
      } else {
        setError(data.message || 'Failed to approve refund');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  if (loading) return <div className="admin-orders-loading">Loading orders...</div>;
  if (error) return <div className="admin-orders-error">{error}</div>;

  return (
    <div className="admin-orders-container">
      <h1 className="admin-orders-title">Order Management</h1>
      
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} id={`admin_order_${order.id}`}>
              <td>{order.id}</td>
              <td>{order.username}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td className={`status-${order.status.toLowerCase().replace(' ', '-')}`}>
                {order.status}
              </td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>
                {order.status === 'Refund Reviewing' && (
                  <button 
                    className="pass-refund-review-button"
                    onClick={() => handlePassRefundReview(order.id)}
                  >
                    Approve Refund
                  </button>
                )}
              </td>
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

export default OrderManagement;