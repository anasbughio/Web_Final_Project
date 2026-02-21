import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const endpoint =
        user?.role === 'Admin' ? '/orders/all' : '/orders/my-orders';
      const response = await fetch(
        `http://localhost:5000/api/products${endpoint}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOrders(data.orders);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      filterStatus === 'All' || order.status === filterStatus;
    const searchMatch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );
  const totalOrders = filteredOrders.length;
  const totalQuantity = filteredOrders.reduce(
    (sum, order) => sum + order.quantity,
    0
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge status-completed">✓ Completed</span>;
      case 'Pending':
        return <span className="badge status-pending">⏳ Pending</span>;
      case 'Cancelled':
        return <span className="badge status-cancelled">✕ Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>📦 Order History</h1>
        <div className="header-info">
          {user?.role === 'Admin' && (
            <span className="info-badge">👑 All Orders</span>
          )}
          {user?.role === 'Employee' && (
            <span className="info-badge">👤 My Orders</span>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <p className="card-label">Total Orders</p>
            <p className="card-value">{totalOrders}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <p className="card-label">Total Quantity</p>
            <p className="card-value">{totalQuantity}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <p className="card-label">Total Revenue</p>
            <p className="card-value">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="status-filter">Status Filter:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Orders</option>
            <option value="Completed">✓ Completed</option>
            <option value="Pending">⏳ Pending</option>
            <option value="Cancelled">✕ Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="search">Search Orders:</label>
          <input
            id="search"
            type="text"
            placeholder="Search by order number, product, or buyer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Buyer</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="order-number">
                    <strong>{order.orderNumber}</strong>
                  </td>
                  <td>
                    <div className="product-info">
                      <p className="product-name">{order.productName}</p>
                      <p className="product-sku">SKU: {order.productSku}</p>
                    </div>
                  </td>
                  <td className="quantity">{order.quantity}</td>
                  <td className="price">${order.unitPrice.toFixed(2)}</td>
                  <td className="total-price">
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </td>
                  <td>
                    <div className="buyer-info">
                      <p className="buyer-name">{order.buyerName}</p>
                      <p className="buyer-email">{order.buyerEmail}</p>
                    </div>
                  </td>
                  <td className="date">{formatDate(order.createdAt)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
