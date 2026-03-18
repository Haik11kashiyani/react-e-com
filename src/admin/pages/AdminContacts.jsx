import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Mail } from 'lucide-react';
import { fetchContactMessages, markContactRead, deleteContactMessage } from '../../utils/api';
import { SkeletonContactsPage } from '../../components/common/SkeletonLoader';
import '../admin.css';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMsg, setViewMsg] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadMessages = () => {
    setLoading(true);
    fetchContactMessages()
      .then(res => setMessages(res.data.messages || []))
      .catch(() => showToast('Failed to load messages', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMessages(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markContactRead(id);
      showToast('Marked as read');
      loadMessages();
    } catch {
      showToast('Failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContactMessage(id);
      showToast('Message deleted');
      setConfirmDelete(null);
      loadMessages();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  const handleView = async (msg) => {
    setViewMsg(msg);
    if (!msg.isRead) {
      try {
        await markContactRead(msg._id);
        loadMessages();
      } catch {/* ignore */}
    }
  };

  if (loading && messages.length === 0) return <SkeletonContactsPage />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contact Messages</h1>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length ? messages.map(m => (
              <tr key={m._id} style={{ fontWeight: m.isRead ? 400 : 600 }}>
                <td><span className={`admin-badge ${m.isRead ? 'read' : 'unread'}`}>{m.isRead ? 'Read' : 'Unread'}</span></td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.subject}</td>
                <td style={{ fontSize: 12 }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleView(m)} title="View">
                      <Eye size={14} />
                    </button>
                    {!m.isRead && (
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleMarkRead(m._id)} title="Mark Read">
                        <Mail size={14} />
                      </button>
                    )}
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setConfirmDelete(m._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="admin-empty"><p>No messages</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View message modal */}
      {viewMsg && (
        <div className="admin-modal-overlay" onClick={() => setViewMsg(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{viewMsg.subject}</h3>
              <button className="admin-modal-close" onClick={() => setViewMsg(null)}>×</button>
            </div>
            <div className="admin-modal-body">
              <div style={{ marginBottom: 12, fontSize: 13, color: '#8b8b9e' }}>
                <strong style={{ color: '#e0e0e0' }}>{viewMsg.name}</strong> &lt;{viewMsg.email}&gt;
                <br />
                <span style={{ fontSize: 11 }}>{new Date(viewMsg.createdAt).toLocaleString()}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#ccc', whiteSpace: 'pre-wrap' }}>{viewMsg.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="admin-modal-header"><h3>Delete Message?</h3></div>
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

export default AdminContacts;
