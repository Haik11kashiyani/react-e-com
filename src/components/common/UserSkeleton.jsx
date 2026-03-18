import React from 'react';
import './UserSkeleton.css';

/* ─── Product Card Skeleton (matches p-card) ──── */
export const SkeletonProductCard = () => (
  <div className="u-skel-card">
    <div className="u-skel u-skel-card-img" />
    <div className="u-skel-card-body">
      <div className="u-skel u-skel-card-brand" />
      <div className="u-skel u-skel-card-name" />
      <div className="u-skel u-skel-card-rating" />
      <div className="u-skel-card-price-row">
        <div className="u-skel u-skel-card-price" />
        <div className="u-skel u-skel-card-oldprice" />
      </div>
      <div className="u-skel-card-actions">
        <div className="u-skel u-skel-card-atc" />
        <div className="u-skel u-skel-card-wish" />
      </div>
    </div>
  </div>
);

/* ─── Products Page Skeleton ──────────────────── */
export const SkeletonProductsGrid = ({ count = 8 }) => (
  <div className="u-skel-products">
    <div className="u-skel u-skel-hero" />
    <div className="u-skel-filters">
      <div className="u-skel u-skel-search" />
      <div className="u-skel u-skel-sort" />
    </div>
    <div className="u-skel-cats">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} className="u-skel u-skel-cat-pill" />
      ))}
    </div>
    <div className="u-skel-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  </div>
);

/* ─── Product Detail Skeleton ─────────────────── */
export const SkeletonProductDetail = () => (
  <div className="u-skel-detail">
    <div className="u-skel-breadcrumb">
      <div className="u-skel u-skel-crumb" />
      <div className="u-skel u-skel-crumb-sep" />
      <div className="u-skel u-skel-crumb" />
      <div className="u-skel u-skel-crumb-sep" />
      <div className="u-skel u-skel-crumb" style={{ width: 100 }} />
    </div>
    <div className="u-skel-detail-main">
      {/* Gallery */}
      <div className="u-skel-gallery">
        <div className="u-skel-thumbs">
          {[0, 1, 2].map(i => <div key={i} className="u-skel u-skel-thumb" />)}
        </div>
        <div className="u-skel u-skel-main-img" />
      </div>
      {/* Info */}
      <div className="u-skel-info">
        <div className="u-skel u-skel-info-brand" />
        <div className="u-skel u-skel-info-name" />
        <div className="u-skel-info-rating">
          {[0, 1, 2, 3, 4].map(i => <div key={i} className="u-skel u-skel-star-dot" />)}
        </div>
        <div className="u-skel-info-price-row">
          <div className="u-skel u-skel-info-price" />
          <div className="u-skel u-skel-info-old" />
          <div className="u-skel u-skel-info-save" />
        </div>
        <div className="u-skel u-skel-info-desc" />
        <div className="u-skel-info-colors">
          {[0, 1, 2, 3].map(i => <div key={i} className="u-skel u-skel-color-dot" />)}
        </div>
        <div className="u-skel-info-buttons">
          <div className="u-skel u-skel-info-atc" />
          <div className="u-skel u-skel-info-wishbtn" />
        </div>
        <div className="u-skel-guarantees">
          <div className="u-skel u-skel-guarantee" />
          <div className="u-skel u-skel-guarantee" />
          <div className="u-skel u-skel-guarantee" />
        </div>
      </div>
    </div>
  </div>
);

/* ─── Cart Skeleton ───────────────────────────── */
export const SkeletonCart = () => (
  <div className="u-skel-cart">
    <div className="u-skel u-skel-cart-title" />
    <div className="u-skel-cart-grid">
      <div className="u-skel-cart-items">
        {[0, 1, 2].map(i => (
          <div key={i} className="u-skel-cart-item">
            <div className="u-skel u-skel-cart-item-img" />
            <div className="u-skel-cart-item-info">
              <div className="u-skel u-skel-cart-item-name" />
              <div className="u-skel u-skel-cart-item-brand" />
            </div>
            <div className="u-skel u-skel-cart-item-price" />
            <div className="u-skel u-skel-cart-item-qty" />
            <div className="u-skel u-skel-cart-item-remove" />
          </div>
        ))}
      </div>
      <div className="u-skel-cart-summary">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="u-skel-cart-row">
            <div className="u-skel u-skel-cart-row-label" />
            <div className="u-skel u-skel-cart-row-val" />
          </div>
        ))}
        <div className="u-skel u-skel-cart-total-bar" />
      </div>
    </div>
  </div>
);

/* ─── Wishlist Skeleton ───────────────────────── */
export const SkeletonWishlist = ({ count = 4 }) => (
  <div className="u-skel-wishlist">
    <div className="u-skel u-skel-wish-title" />
    <div className="u-skel-wish-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  </div>
);

/* ─── Profile Skeleton ────────────────────────── */
export const SkeletonProfile = () => (
  <div className="u-skel-profile">
    <div className="u-skel-profile-header">
      <div className="u-skel u-skel-avatar" />
      <div className="u-skel-profile-name">
        <div className="u-skel u-skel-pname" />
        <div className="u-skel u-skel-pemail" />
      </div>
    </div>
    <div className="u-skel-profile-form">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} className="u-skel-form-field">
          <div className="u-skel u-skel-field-label" />
          <div className="u-skel u-skel-field-input" />
        </div>
      ))}
    </div>
  </div>
);
