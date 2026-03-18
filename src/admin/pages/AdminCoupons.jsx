import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { fetchCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon } from '../../utils/api';
import { SkeletonCouponsPage } from '../../components/common/SkeletonLoader';
import '../admin.css';

const emptyCoupon = { code: '', type: 'percent', value: '', label: '', isActive: true, expiresAt: '' };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCoupons = () => {
    setLoading(true);
    fetchCoupons()
      .then(res => setCoupons(res.data.coupons || []))
      .catch(() => showToast('Failed to load coupons', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCoupons(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCoupon);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code || '', type: c.type || 'percent', value: c.value || '',
      label: c.label || '', isActive: c.isActive !== false,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().split('T')[0] : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.value || !form.label) {
      showToast('Please fill required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        expiresAt: form.expiresAt || undefined,
      };
      if (editing) {
        await adminUpdateCoupon(editing._id, payload);
        showToast('Coupon updated!');
      } else {
        await adminCreateCoupon(payload);
        showToast('Coupon created!');
      }
      setModalOpen(false);
      loadCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteCoupon(id);
      showToast('Coupon deleted');
      setConfirmDelete(null);
      loadCoupons();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  if (loading && coupons.length === 0) return <SkeletonCouponsPage />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Coupons</h1>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Label</th>
              <th>Status</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length ? coupons.map(c => (
              <tr key={c._id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.code}</td>
                <td style={{ textTransform: 'capitalize' }}>{c.type}</td>
                <td>{c.type === 'percent' ? `${c.value}%` : c.type === 'shipping' ? 'Free' : `₹${c.value}`}</td>
                <td>{c.label}</td>
                <td><span className={`admin-badge ${c.isActive ? 'active' : 'inactive'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                <td style={{ fontSize: 12 }}>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setConfirmDelete(c._id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="admin-empty"><p>No coupons found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Coupon' : 'New Coupon'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Code *</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" />
                </div>
                <div className="admin-form-group">
                  <label>Type *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="percent">Percent</option>
                    <option value="flat">Flat</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Value *</label>
                  <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Expires At</label>
                  <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Label *</label>
                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. 20% off your order" />
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="couponActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: 'auto' }} />
                <label htmlFor="couponActive" style={{ margin: 0 }}>Active</label>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="admin-modal-header"><h3>Delete Coupon?</h3></div>
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

export default AdminCoupons;
