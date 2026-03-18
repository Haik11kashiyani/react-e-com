import React, { useState, useEffect } from 'react';
import { Trash2, Star } from 'lucide-react';
import { fetchReviews, adminDeleteReview } from '../../utils/api';
import { SkeletonReviewsPage } from '../../components/common/SkeletonLoader';
import '../admin.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadReviews = () => {
    setLoading(true);
    fetchReviews()
      .then(res => setReviews(res.data.reviews || []))
      .catch(() => showToast('Failed to load reviews', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReviews(); }, []);

  const handleDelete = async (id) => {
    try {
      await adminDeleteReview(id);
      showToast('Review deleted');
      setConfirmDelete(null);
      loadReviews();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const renderStars = (rating) => (
    <div className="admin-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? '#fdcb6e' : 'none'} stroke={i < rating ? '#fdcb6e' : '#555'} />
      ))}
    </div>
  );

  if (loading && reviews.length === 0) return <SkeletonReviewsPage />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reviews</h1>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Product</th>
              <th>Type</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length ? reviews.map(r => (
              <tr key={r._id}>
                <td style={{ fontWeight: 500 }}>{r.name}</td>
                <td>{renderStars(r.rating)}</td>
                <td style={{ maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.text}</td>
                <td>{r.product || '—'}</td>
                <td><span className={`admin-badge ${r.isTestimonial ? 'active' : 'user'}`}>{r.isTestimonial ? 'Testimonial' : 'Review'}</span></td>
                <td style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setConfirmDelete(r._id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="admin-empty"><p>No reviews found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="admin-modal-header"><h3>Delete Review?</h3></div>
            <div className="admin-modal-body"><p className="admin-confirm-text">This action cannot be undone.</p></div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
};

export default AdminReviews;
