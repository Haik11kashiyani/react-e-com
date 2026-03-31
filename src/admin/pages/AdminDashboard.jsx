import React, { useState, useEffect, useMemo } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Star, MessageCircle, BarChart3 } from 'lucide-react';
import { fetchAdminStats } from '../../utils/api';
import { SkeletonDashboard } from '../../components/common/SkeletonLoader';
import '../admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error('Dashboard stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  const maxRevenue = useMemo(() => {
    const list = stats?.monthlyTrends || [];
    return Math.max(1, ...list.map((t) => t.revenue || 0));
  }, [stats]);

  if (loading) return <SkeletonDashboard />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'purple' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'green' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'orange' },
    { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'blue' },
    { label: 'Total Reviews', value: stats?.totalReviews || 0, icon: Star, color: 'orange' },
    { label: 'Unread Messages', value: stats?.unreadContacts || 0, icon: MessageCircle, color: 'red' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>

      <div className="admin-stats-grid admin-stats-grid-wide">
        {statCards.map(({ label, value, icon, color }) => (
          <div className="admin-stat-card" key={label}>
            <div className={`admin-stat-icon ${color}`}>
              {React.createElement(icon, { size: 22 })}
            </div>
            <div className="admin-stat-info">
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-table-wrap">
          <div className="admin-table-toolbar">
            <strong style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={16} /> Monthly Revenue Trend
            </strong>
          </div>
          <div className="admin-chart-box">
            {(stats?.monthlyTrends || []).map((point) => (
              <div key={point.month} className="admin-chart-col">
                <div className="admin-chart-col__bar-wrap">
                  <div
                    className="admin-chart-col__bar"
                    style={{ height: `${Math.max(6, ((point.revenue || 0) / maxRevenue) * 160)}px` }}
                    title={`₹${Number(point.revenue || 0).toLocaleString()}`}
                  />
                </div>
                <div className="admin-chart-col__meta">
                  <span>{point.month}</span>
                  <small>₹{Math.round(point.revenue || 0).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-table-wrap">
          <div className="admin-table-toolbar">
            <strong style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} /> Top Selling Products
            </strong>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats?.topProducts?.length ? stats.topProducts.map((p) => (
                <tr key={p.productId}>
                  <td>{p.name}</td>
                  <td>{p.totalSold}</td>
                  <td>₹{Math.round(p.revenue || 0).toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="admin-empty"><p>No product sales data yet</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 24 }}>
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
            {stats?.recentOrders?.length ? stats.recentOrders.map((order) => (
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
    </div>
  );
};

export default AdminDashboard;
