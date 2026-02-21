import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allProducts, lowStockProducts] = await Promise.all([
          productAPI.getAll(),
          productAPI.getLowStock(),
        ]);

        setStats({
          totalProducts: allProducts.data.products.length,
          lowStockProducts: lowStockProducts.data.products.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'Admin':
        return 'Administrator';
      case 'Store Manager':
        return 'Store Manager';
      case 'Employee':
        return 'Employee';
      default:
        return 'User';
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p className="role-badge">{getRoleDisplay()}</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card warning">
          <h3>Low Stock Items</h3>
          <p className="stat-number">{stats.lowStockProducts}</p>
        </div>
      </div>

      <div className="role-info">
        <h2>Your Permissions</h2>
        <div className="permissions-list">
          {user?.role === 'Admin' && (
            <>
              <div className="permission">✓ Create, Read, Update, Delete Products</div>
              <div className="permission">✓ Create, Read, Update, Delete Users</div>
              <div className="permission">✓ View All Reports</div>
              <div className="permission">✓ Access Admin Dashboard</div>
            </>
          )}
          {user?.role === 'Store Manager' && (
            <>
              <div className="permission">✓ Create, Read, Update, Delete Products</div>
              <div className="permission">✗ Cannot manage users</div>
              <div className="permission">✓ View Product Reports</div>
            </>
          )}
          {user?.role === 'Employee' && (
            <>
              <div className="permission">✓ View Product Details</div>
              <div className="permission">✗ Cannot create or edit products</div>
              <div className="permission">✗ Cannot manage users</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
