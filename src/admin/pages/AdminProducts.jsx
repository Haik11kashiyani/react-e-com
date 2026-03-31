import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { fetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../utils/api';
import { SkeletonProductsPage } from '../../components/common/SkeletonLoader';
import '../admin.css';

const emptyProduct = {
  name: '', brand: '', price: '', originalPrice: '', category: 'phone',
  description: '', image: '', tag: '', inStock: true, features: '', colors: '',
};

const categories = ['phone', 'laptop', 'audio', 'smartwatch', 'tablet', 'accessories'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== 'all') params.category = category;
    fetchProducts(params)
      .then(res => setProducts(res.data.products || []))
      .catch(() => showToast('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  }, [search, category]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProduct);
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '', brand: p.brand || '', price: p.price || '',
      originalPrice: p.originalPrice || '', category: p.category || 'phone',
      description: p.description || '', image: p.image || '', tag: p.tag || '',
      inStock: p.inStock !== false, features: (p.features || []).join(', '),
      colors: (p.colors || []).join(', '),
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price || (!form.image && !imageFile) || !form.description) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      const normalizedPayload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      let payload = normalizedPayload;
      if (imageFile) {
        payload = new FormData();
        Object.entries(normalizedPayload).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            payload.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v));
          }
        });
        payload.append('imageFile', imageFile);
      }

      if (editing) {
        await adminUpdateProduct(editing._id, payload);
        showToast('Product updated!');
      } else {
        await adminCreateProduct(payload);
        showToast('Product created!');
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteProduct(id);
      showToast('Product deleted');
      setConfirmDelete(null);
      loadProducts();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  if (loading && products.length === 0) return <SkeletonProductsPage />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button className="admin-btn admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? products.map(p => (
              <tr key={p._id}>
                <td>
                  <img src={p.image} alt={p.name} style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', background: '#1a1a2e' }} />
                </td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{p.brand}</td>
                <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                <td>₹{p.price?.toLocaleString()}</td>
                <td><span className={`admin-badge ${p.inStock ? 'active' : 'inactive'}`}>{p.inStock ? 'In Stock' : 'Out'}</span></td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setConfirmDelete(p._id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="admin-empty"><p>No products found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Product' : 'New Product'}</h3>
              <button className="admin-modal-close" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Brand *</label>
                  <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="admin-form-group">
                  <label>Original Price</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Tag</label>
                  <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="e.g. New, Sale" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Image URL *</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Or Upload Local Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                />
                {imageFile && <small style={{ color: '#6b7280' }}>Selected: {imageFile.name}</small>}
              </div>
              <div className="admin-form-group">
                <label>Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Features (comma-separated)</label>
                <input value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label>Colors (comma-separated)</label>
                <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} />
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} style={{ width: 'auto' }} />
                <label htmlFor="inStock" style={{ margin: 0 }}>In Stock</label>
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
            <div className="admin-modal-header"><h3>Delete Product?</h3></div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">Are you sure? This action cannot be undone.</p>
            </div>
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

export default AdminProducts;
