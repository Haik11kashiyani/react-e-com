import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, Video } from 'lucide-react';
import { fetchCarouselItems, adminCreateCarouselItem, adminUpdateCarouselItem, adminDeleteCarouselItem } from '../../../utils/api';
import './AdminLayout.css'; 

export default function AdminCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [video, setVideo] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetchCarouselItems();
      setItems(res.data || []);
    } catch (error) {
      console.error('Failed to load carousel items', error);
      alert('Failed to load carousel items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setIsEditing(true);
      setEditId(item._id);
      setVideo(item.video);
      setText(item.text);
      setCategory(item.category);
      setOrder(item.order || 0);
    } else {
      setIsEditing(false);
      setEditId(null);
      setVideo('');
      setText('');
      setCategory('');
      setOrder(items.length > 0 ? Math.max(...items.map(i => i.order || 0)) + 1 : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { video, text, category, order };

    try {
      if (isEditing) {
        await adminUpdateCarouselItem(editId, data);
      } else {
        await adminCreateCarouselItem(data);
      }
      handleOpenForm(); // reset
      loadItems();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving carousel item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this carousel slide?')) return;
    try {
      await adminDeleteCarouselItem(id);
      loadItems();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting carousel item');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Carousel Management</h1>
          <p className="admin-subtitle">Update the Giant Wheel homepage videos</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '30px' }}>
        <h2 className="admin-card-title">{isEditing ? 'Edit' : 'Add New'} Carousel Slide</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Video URL / Path</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Video size={18} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="/assets/videos/1.mp4" 
                  required 
                  value={video} 
                  onChange={e => setVideo(e.target.value)} 
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Slide Title Text (e.g. Next-Gen Smartphones)</label>
              <input 
                type="text" 
                required 
                value={text} 
                onChange={e => setText(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Linked Category ID (e.g. phone, laptop)</label>
              <input 
                type="text" 
                required 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
              />
              <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>Must match a real product category to show sidebar items.</small>
            </div>

            <div className="form-group">
              <label>Order Position</label>
              <input 
                type="number" 
                required 
                value={order} 
                onChange={e => setOrder(Number(e.target.value))} 
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
             {isEditing && (
               <button type="button" onClick={() => handleOpenForm(null)} className="btn-secondary">Cancel</button>
             )}
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
              {isEditing ? 'Update Slide' : 'Add Slide'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Active Carousel Slides</h2>
        
        {loading ? (
          <p>Loading slides...</p>
        ) : items.length === 0 ? (
          <p>No slides added yet. The default hardcoded wheel will show until you add one.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Video Asset</th>
                  <th>Display Title</th>
                  <th>Category Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>#{item.order}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#0f172a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <Video size={16} color="#38bdf8" />
                        </div>
                        <span style={{ fontSize: '12px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.video}</span>
                      </div>
                    </td>
                    <td><strong>{item.text}</strong></td>
                    <td><span className="marquee-sidebar__product-tag" style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '12px', fontSize: '11px' }}>{item.category}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon view" onClick={() => handleOpenForm(item)} title="Edit"><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(item._id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
