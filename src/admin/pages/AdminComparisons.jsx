import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Award } from 'lucide-react';
import { fetchComparisons, adminCreateComparison, adminUpdateComparison, adminDeleteComparison } from '../../../utils/api';
import './AdminLayout.css'; // Inheriting shared admin styles

export default function AdminComparisons() {
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Form State
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([
    { name: '', price: '', originalPrice: '', image: '', winner: false, specs: [{ label: '', value: '', highlight: false }] },
    { name: '', price: '', originalPrice: '', image: '', winner: false, specs: [{ label: '', value: '', highlight: false }] }
  ]);

  useEffect(() => {
    loadComparisons();
  }, []);

  const loadComparisons = async () => {
    setLoading(true);
    try {
      const res = await fetchComparisons();
      setComparisons(res.data || []);
    } catch (error) {
      console.error('Failed to load comparisons', error);
      alert('Failed to load comparisons');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (comp = null) => {
    if (comp) {
      setIsEditing(true);
      setEditId(comp._id);
      setCategory(comp.category);
      setProducts(comp.products);
    } else {
      setIsEditing(false);
      setEditId(null);
      setCategory('');
      setProducts([
        { name: '', price: '', originalPrice: '', image: '', winner: false, specs: [{ label: '', value: '', highlight: false }] },
        { name: '', price: '', originalPrice: '', image: '', winner: false, specs: [{ label: '', value: '', highlight: false }] }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (products.length !== 2) {
      return alert("Exactly 2 products must be defined for comparison.");
    }
    
    const data = { category, products };

    try {
      if (isEditing) {
        await adminUpdateComparison(editId, data);
      } else {
        await adminCreateComparison(data);
      }
      handleOpenForm(); // reset form
      loadComparisons();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving comparison');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comparison block?')) return;
    try {
      await adminDeleteComparison(id);
      loadComparisons();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting comparison');
    }
  };

  const handleProductChange = (prodIndex, field, value) => {
    const updated = [...products];
    updated[prodIndex][field] = value;
    setProducts(updated);
  };

  const addSpec = (prodIndex) => {
    const updated = [...products];
    updated[prodIndex].specs.push({ label: '', value: '', highlight: false });
    setProducts(updated);
  };

  const handleSpecChange = (prodIndex, specIndex, field, value) => {
    const updated = [...products];
    updated[prodIndex].specs[specIndex][field] = value;
    setProducts(updated);
  };

  const removeSpec = (prodIndex, specIndex) => {
    const updated = [...products];
    updated[prodIndex].specs = updated[prodIndex].specs.filter((_, i) => i !== specIndex);
    setProducts(updated);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Comparisons</h1>
          <p className="admin-subtitle">Manage dynamic product face-offs</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '30px' }}>
        <h2 className="admin-card-title">{isEditing ? 'Edit' : 'Create'} Comparison</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Category Title (e.g. Smartphones)</label>
            <input 
              type="text" 
              required 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {products.map((prod, pIdx) => (
              <div key={pIdx} style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
                  Product {pIdx + 1}
                  <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input 
                      type="checkbox" 
                      checked={prod.winner}
                      onChange={e => handleProductChange(pIdx, 'winner', e.target.checked)}
                    />
                    <Award size={14} /> Winner
                  </label>
                </h3>
                
                <div className="form-group">
                  <label>Name</label>
                  <input required type="text" value={prod.name} onChange={e => handleProductChange(pIdx, 'name', e.target.value)} />
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Price</label>
                    <input required type="text" value={prod.price} onChange={e => handleProductChange(pIdx, 'price', e.target.value)} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Original Price</label>
                    <input type="text" value={prod.originalPrice} onChange={e => handleProductChange(pIdx, 'originalPrice', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input required type="text" value={prod.image} onChange={e => handleProductChange(pIdx, 'image', e.target.value)} />
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 600 }}>Specs</h4>
                  {prod.specs.map((spec, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                      <input type="text" placeholder="Label" value={spec.label} onChange={e => handleSpecChange(pIdx, sIdx, 'label', e.target.value)} style={{ width: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} required />
                      <input type="text" placeholder="Value" value={spec.value} onChange={e => handleSpecChange(pIdx, sIdx, 'value', e.target.value)} style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} required />
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Highlight Spec">
                        <input type="checkbox" checked={spec.highlight} onChange={e => handleSpecChange(pIdx, sIdx, 'highlight', e.target.checked)} style={{ width: '16px', height: '16px' }} />
                      </label>
                      <button type="button" onClick={() => removeSpec(pIdx, sIdx)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSpec(pIdx)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Spec
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
             {isEditing && (
               <button type="button" onClick={() => handleOpenForm(null)} className="btn-secondary">Cancel</button>
             )}
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> {isEditing ? 'Update Comparison' : 'Save Comparison'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Existing Comparisons</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : comparisons.length === 0 ? (
          <p>No comparisons added yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Product 1</th>
                  <th>Product 2</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((comp) => (
                  <tr key={comp._id}>
                    <td><strong>{comp.category}</strong></td>
                    <td>{comp.products[0]?.name} {comp.products[0]?.winner && <Award size={12} color="#f59e0b" />}</td>
                    <td>{comp.products[1]?.name} {comp.products[1]?.winner && <Award size={12} color="#f59e0b" />}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon view" onClick={() => handleOpenForm(comp)} title="Edit"><Edit2 size={16} /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(comp._id)} title="Delete"><Trash2 size={16} /></button>
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
