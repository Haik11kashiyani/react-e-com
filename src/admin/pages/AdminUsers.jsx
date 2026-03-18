import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, ShieldCheck, ShieldOff, UserCheck, UserX } from 'lucide-react';
import { fetchAllUsers, toggleUserActive, updateUserRole, deleteUser } from '../../utils/api';
import { SkeletonUsersPage } from '../../components/common/SkeletonLoader';
import '../admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (search) params.search = search;
    fetchAllUsers(params)
      .then(res => {
        setUsers(res.data.users || []);
        setPagination(res.data.pagination || {});
      })
      .catch(() => showToast('Failed to load users', 'error'))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleToggleActive = async (id) => {
    try {
      await toggleUserActive(id);
      showToast('User status toggled');
      loadUsers();
    } catch {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      showToast(`Role updated to ${newRole}`);
      loadUsers();
    } catch {
      showToast('Failed to update role', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      showToast('User deleted');
      setConfirmDelete(null);
      loadUsers();
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  if (loading && users.length === 0) return <SkeletonUsersPage />;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td><span className={`admin-badge ${u.role}`}>{u.role}</span></td>
                <td><span className={`admin-badge ${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td style={{ fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => handleToggleActive(u._id)}
                      title={u.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                      title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    >
                      {u.role === 'admin' ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    </button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setConfirmDelete(u._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="admin-empty"><p>No users found</p></td></tr>
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

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="admin-modal-header"><h3>Delete User?</h3></div>
            <div className="admin-modal-body">
              <p className="admin-confirm-text">This will permanently delete this user and cannot be undone.</p>
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

export default AdminUsers;
