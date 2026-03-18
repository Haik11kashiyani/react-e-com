import React from 'react';
import './SkeletonLoader.css';

// Shimmer overlay used by all skeleton variants
const Shimmer = () => (
  <div className="skeleton-shimmer">
    <div className="skeleton-shimmer-inner" />
  </div>
);

// ─── Generic Blocks ──────────────────────────────
export const SkeletonText = ({ lines = 3, width }) => (
  <div className="skeleton-text-group">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton-block skeleton-text-line"
        style={{ width: width || (i === lines - 1 ? '60%' : '100%'), animationDelay: `${i * 0.06}s` }}
      >
        <Shimmer />
      </div>
    ))}
  </div>
);

// ─── Stat Card (matches admin-stat-card) ─────────
export const SkeletonStat = () => (
  <div className="skeleton-stat-card">
    <div className="skeleton-block skeleton-stat-icon"><Shimmer /></div>
    <div className="skeleton-stat-info">
      <div className="skeleton-block skeleton-stat-number"><Shimmer /></div>
      <div className="skeleton-block skeleton-stat-label"><Shimmer /></div>
    </div>
  </div>
);

// ─── Product Card ────────────────────────────────
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-block skeleton-card-image"><Shimmer /></div>
    <div className="skeleton-card-body">
      <div className="skeleton-block skeleton-card-title"><Shimmer /></div>
      <div className="skeleton-block skeleton-card-subtitle"><Shimmer /></div>
      <div className="skeleton-card-row">
        <div className="skeleton-block skeleton-card-price"><Shimmer /></div>
        <div className="skeleton-block skeleton-card-btn"><Shimmer /></div>
      </div>
    </div>
  </div>
);

// ─── Table Row ───────────────────────────────────
export const SkeletonTableRow = ({ cols = 5, idx = 0 }) => (
  <tr className="skeleton-table-row" style={{ animationDelay: `${idx * 0.06}s` }}>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i}>
        <div className="skeleton-block skeleton-table-cell" style={{ width: i === 0 ? '50%' : i === cols - 1 ? '60%' : '75%' }}><Shimmer /></div>
      </td>
    ))}
  </tr>
);

// ─── Full Table with Header ──────────────────────
export const SkeletonTable = ({ rows = 5, cols = 5, showToolbar = false }) => (
  <div className="skeleton-table-wrap">
    {showToolbar && (
      <div className="skeleton-toolbar">
        <div className="skeleton-block skeleton-toolbar-input"><Shimmer /></div>
        <div className="skeleton-block skeleton-toolbar-btn"><Shimmer /></div>
      </div>
    )}
    <table className="skeleton-table">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}>
              <div className="skeleton-block skeleton-table-header"><Shimmer /></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} cols={cols} idx={i} />
        ))}
      </tbody>
    </table>
  </div>
);

// ═══════════════════════════════════════════════════
// Page-Specific Skeletons (match real component shapes)
// ═══════════════════════════════════════════════════

// ─── Dashboard ───────────────────────────────────
// 4 stat cards → status breakdown → recent orders table
export const SkeletonDashboard = () => (
  <div className="skeleton-dashboard">
    <div className="skeleton-block skeleton-page-heading" style={{ width: '20%' }}><Shimmer /></div>
    <div className="skeleton-stats-grid">
      {[0, 1, 2, 3].map(i => <SkeletonStat key={i} />)}
    </div>
    <div className="skeleton-stats-grid" style={{ marginBottom: 20 }}>
      {[0, 1, 2].map(i => <SkeletonStat key={i} />)}
    </div>
    <SkeletonTable rows={5} cols={5} showToolbar />
    <div className="skeleton-stats-grid" style={{ marginTop: 20 }}>
      <SkeletonStat />
      <SkeletonStat />
    </div>
  </div>
);

// ─── Products Page ───────────────────────────────
// Header + Add button → search/filter toolbar → 7-col table (image, name, brand, cat, price, stock, actions)
export const SkeletonProductsPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-page-header">
      <div className="skeleton-block skeleton-page-heading"><Shimmer /></div>
      <div className="skeleton-block skeleton-header-btn"><Shimmer /></div>
    </div>
    <SkeletonTable rows={6} cols={7} showToolbar />
  </div>
);

// ─── Orders Page ─────────────────────────────────
// Header → filter toolbar → 7-col table (id, customer, items, total, payment, status, date)
export const SkeletonOrdersPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-page-header">
      <div className="skeleton-block skeleton-page-heading"><Shimmer /></div>
    </div>
    <SkeletonTable rows={6} cols={7} showToolbar />
  </div>
);

// ─── Users Page ──────────────────────────────────
// Header → search toolbar → 7-col table (name, email, phone, role, status, joined, actions)
export const SkeletonUsersPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-page-header">
      <div className="skeleton-block skeleton-page-heading"><Shimmer /></div>
    </div>
    <SkeletonTable rows={6} cols={7} showToolbar />
  </div>
);

// ─── Coupons Page ────────────────────────────────
// Header + Add button → 7-col table (code, type, value, label, status, expires, actions)
export const SkeletonCouponsPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-page-header">
      <div className="skeleton-block skeleton-page-heading"><Shimmer /></div>
      <div className="skeleton-block skeleton-header-btn"><Shimmer /></div>
    </div>
    <SkeletonTable rows={5} cols={7} />
  </div>
);

// ─── Reviews Page ────────────────────────────────
// Header → 7-col table (name, rating as stars-shaped, review, product, type, date, actions)
export const SkeletonReviewsPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-page-header">
      <div className="skeleton-block skeleton-page-heading"><Shimmer /></div>
    </div>
    <div className="skeleton-table-wrap">
      <table className="skeleton-table">
        <thead>
          <tr>
            {['Name', 'Rating', 'Review', 'Product', 'Type', 'Date', 'Actions'].map(h => (
              <th key={h}><div className="skeleton-block skeleton-table-header"><Shimmer /></div></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="skeleton-table-row" style={{ animationDelay: `${i * 0.06}s` }}>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '70%' }}><Shimmer /></div></td>
              <td>
                <div className="skeleton-stars-row">
                  {[0,1,2,3,4].map(s => <div key={s} className="skeleton-block skeleton-star"><Shimmer /></div>)}
                </div>
              </td>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '90%' }}><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '60%' }}><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-badge"><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '65%' }}><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-action-btn"><Shimmer /></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Contacts Page ───────────────────────────────
// Header → 6-col table (status badge, name, email, subject, date, actions)
export const SkeletonContactsPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-page-header">
      <div className="skeleton-block skeleton-page-heading"><Shimmer /></div>
    </div>
    <div className="skeleton-table-wrap">
      <table className="skeleton-table">
        <thead>
          <tr>
            {['Status', 'Name', 'Email', 'Subject', 'Date', 'Actions'].map(h => (
              <th key={h}><div className="skeleton-block skeleton-table-header"><Shimmer /></div></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="skeleton-table-row" style={{ animationDelay: `${i * 0.06}s` }}>
              <td><div className="skeleton-block skeleton-badge"><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '70%' }}><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '80%' }}><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '85%' }}><Shimmer /></div></td>
              <td><div className="skeleton-block skeleton-table-cell" style={{ width: '60%' }}><Shimmer /></div></td>
              <td>
                <div className="skeleton-actions-row">
                  <div className="skeleton-block skeleton-action-btn"><Shimmer /></div>
                  <div className="skeleton-block skeleton-action-btn"><Shimmer /></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Generic fallback ────────────────────────────
export const SkeletonPage = () => (
  <div className="skeleton-page">
    <div className="skeleton-block skeleton-page-heading" style={{ width: '30%' }}><Shimmer /></div>
    <SkeletonTable rows={6} cols={5} showToolbar />
  </div>
);
