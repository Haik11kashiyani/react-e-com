import React, { useState, useCallback, useEffect } from 'react';
import CartContext from './CartContext';

const COUPONS = {
  'WELCOME10': { type: 'percent', value: 10, label: '10% Off — Welcome Offer' },
  'SAVE20': { type: 'percent', value: 20, label: '20% Off — Seasonal Sale' },
  'FLAT50': { type: 'flat', value: 50, label: '$50 Off — Premium Deal' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'Free Shipping' },
  'VW15': { type: 'percent', value: 15, label: '15% Off — VirtualWare Exclusive' },
};

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vw_wishlist')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('vw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const applyCoupon = useCallback((code) => {
    const upper = code.trim().toUpperCase();
    if (!upper) { setCouponError('Enter a coupon code'); return false; }
    const coupon = COUPONS[upper];
    if (!coupon) { setCouponError('Invalid coupon code'); setAppliedCoupon(null); return false; }
    setAppliedCoupon({ code: upper, ...coupon });
    setCouponError('');
    showToast(`Coupon "${upper}" applied!`);
    return true;
  }, [showToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError('');
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => { setItems([]); setAppliedCoupon(null); }, []);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      }
      showToast('Added to wishlist');
      return [...prev, productId];
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') discount = totalPrice * (appliedCoupon.value / 100);
    else if (appliedCoupon.type === 'flat') discount = Math.min(appliedCoupon.value, totalPrice);
  }

  return (
    <CartContext.Provider
      value={{
        items, addToCart, removeFromCart, updateQty, clearCart,
        totalItems, totalPrice, toast,
        appliedCoupon, couponError, applyCoupon, removeCoupon, discount,
        availableCoupons: COUPONS,
        wishlist, toggleWishlist, isInWishlist,
      }}
    >
      {children}
      {toast && (
        <div className="toast toast-green">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
}
