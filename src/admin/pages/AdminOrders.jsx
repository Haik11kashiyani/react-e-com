import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllOrders, updateOrderStatus, downloadMonthlyReport } from '../../utils/api';
import { SkeletonOrdersPage } from '../../components/common/SkeletonLoader';
import '../admin.css';

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [toast, setToast] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const now = new Date();
  const [reportYear, setReportYear] = useState(now.getFullYear());
  const [reportMonth, setReportMonth] = useState(now.getMonth() + 1);
  const [reportLoading, setReportLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (statusFilter !== 'all') params.status = statusFilter;
    fetchAllOrders(params)
      .then(res => {
        setOrders(res.data.orders || []);
        setPagination(res.data.pagination || {});
      })
      .catch(() => showToast('Failed to load orders', 'error'))
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('techorbit_token');
      console.log('Admin token exists:', !!token);
      console.log('Updating order:', orderId, 'to status:', newStatus);
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (err) {
      console.error('Status update error:', err.response?.data || err.message);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleReportDownload = async (format) => {
    setReportLoading(true);
    try {
      const res = await downloadMonthlyReport({
        year: reportYear,
        month: reportMonth,
        format,
      });

      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      const filename = `monthly-report-${reportYear}-${String(reportMonth).padStart(2, '0')}.${ext}`;
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      showToast(`Downloaded ${filename}`);
    } catch {
      showToast('Failed to download report', 'error');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading && orders.length === 0) return <SkeletonOrdersPage />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <select className="admin-filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className="admin-filter-select" value={reportMonth} onChange={(e) => setReportMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
          <input
            className="admin-search-input"
            style={{ maxWidth: 110 }}
            type="number"
            value={reportYear}
            onChange={(e) => setReportYear(Number(e.target.value))}
          />
          <button className="admin-btn admin-btn-ghost" onClick={() => handleReportDownload('excel')} disabled={reportLoading}>
            {reportLoading ? 'Preparing...' : 'Export Excel'}
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => handleReportDownload('pdf')} disabled={reportLoading}>
            {reportLoading ? 'Preparing...' : 'Export PDF'}
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? orders.map(order => (
              <React.Fragment key={order._id}>
                <tr onClick={() => setExpandedId(expandedId === order._id ? null : order._id)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{order._id.slice(-6)}</td>
                  <td>{order.user?.firstName} {order.user?.lastName}<br /><span style={{ fontSize: 11, color: '#8b8b9e' }}>{order.user?.email}</span></td>
                  <td>{order.items?.length || 0}</td>
                  <td style={{ fontWeight: 600 }}>₹{order.total?.toLocaleString()}</td>
                  <td style={{ textTransform: 'uppercase', fontSize: 11 }}>{order.paymentMethod}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={order.status || 'pending'}
                      onChange={e => { e.stopPropagation(); handleStatusChange(order._id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
                {expandedId === order._id && (
                  <tr>
                    <td colSpan={7} style={{ padding: '12px 24px', background: 'rgba(108,92,231,0.03)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
                        <div>
                          <strong style={{ color: '#a29bfe', fontSize: 12 }}>Items</strong>
                          {order.items?.map((item, i) => (
                            <div key={i} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              {item.name} × {item.qty} — ₹{(item.price * item.qty).toLocaleString()}
                            </div>
                          ))}
                        </div>
                        <div>
                          <strong style={{ color: '#a29bfe', fontSize: 12 }}>Shipping</strong>
                          <p style={{ margin: '4px 0', color: '#8b8b9e' }}>
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                            {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                            {order.shippingAddress?.state} — {order.shippingAddress?.zip}
                          </p>
                          {order.couponCode && <p style={{ color: '#00cec9', fontSize: 12 }}>Coupon: {order.couponCode} (−₹{order.discount})</p>}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )) : (
              <tr><td colSpan={7} className="admin-empty"><p>No orders found</p></td></tr>
            )}
          </tbody>
        </table>

        {pagination.pages > 1 && (
          <div className="admin-pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span>Page {page} of {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default AdminOrders;
