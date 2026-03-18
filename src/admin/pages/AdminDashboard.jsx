import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Star } from 'lucide-react';
import { fetchAdminStats } from '../../utils/api';
import { SkeletonDashboard } from '../../components/common/SkeletonLoader';
import '../admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(res => setStats(res.data.stats))
      .catch(err => console.error('Dashboard stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonDashboard />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'purple' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'green' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'orange' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'blue' },
  ];

  const statusColors = {
    pending: 'pending',
    confirmed: 'confirmed',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="admin-stats-grid">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div className="admin-stat-card" key={label}>
            <div className={`admin-stat-icon ${color}`}>
              <Icon size={24} />
            </div>
            <div className="admin-stat-info">
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      {stats?.ordersByStatus && stats.ordersByStatus.length > 0 && (
        <div className="admin-stats-grid" style={{ marginBottom: 28 }}>
          {stats.ordersByStatus.map(({ _id, count }) => (
            <div className="admin-stat-card" key={_id}>
              <div className={`admin-stat-icon ${statusColors[_id] === 'delivered' ? 'green' : _id === 'pending' ? 'orange' : 'purple'}`}>
                <TrendingUp size={20} />
              </div>
              <div className="admin-stat-info">
                <h3>{count}</h3>
                <p style={{ textTransform: 'capitalize' }}>{_id} Orders</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <strong style={{ fontSize: 14 }}>Recent Orders</strong>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders?.length ? stats.recentOrders.map(order => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{order._id.slice(-6)}</td>
                <td>{order.user?.firstName} {order.user?.lastName}</td>
                <td>₹{order.total?.toLocaleString()}</td>
                <td><span className={`admin-badge ${order.status}`}>{order.status}</span></td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="admin-empty"><p>No orders yet</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick stats — reviews and contacts */}
      <div className="admin-stats-grid" style={{ marginTop: 28 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-icon orange">
            <Star size={20} />
          </div>
          <div className="admin-stat-info">
            <h3>{stats?.totalReviews || 0}</h3>
            <p>Total Reviews</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon red">
            <Package size={20} />
          </div>
          <div className="admin-stat-info">
            <h3>{stats?.unreadContacts || 0}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
