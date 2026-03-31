import React, { useState, useCallback, useEffect } from 'react';
import CartContext from './CartContext';
import { validateCoupon as validateCouponAPI, fetchCoupons } from '../utils/api';

const FALLBACK_COUPONS = {
  'WELCOME10': { type: 'percent', value: 10, label: '10% Off — Welcome Offer' },
  'SAVE20': { type: 'percent', value: 20, label: '20% Off — Seasonal Sale' },
  'FLAT50': { type: 'flat', value: 50, label: '$50 Off — Premium Deal' },
  'FREESHIP': { type: 'shipping', value: 0, label: 'Free Shipping' },
  'TO15': { type: 'percent', value: 15, label: '15% Off — Techorbit Exclusive' },
};

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState(FALLBACK_COUPONS);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vw_wishlist')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('vw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch coupons from API
  useEffect(() => {
    fetchCoupons()
      .then((res) => {
        const couponsMap = {};
        res.data.coupons.forEach((c) => {
          couponsMap[c.code] = { type: c.type, value: c.value, label: c.label };
        });
        if (Object.keys(couponsMap).length > 0) setAvailableCoupons(couponsMap);
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Calculate totalPrice early for use in applyCoupon
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const applyCoupon = useCallback(async (code) => {
    const upper = code.trim().toUpperCase();
    if (!upper) { setCouponError('Enter a coupon code'); return false; }
    try {
      const res = await validateCouponAPI({ code: upper, subtotal: totalPrice });
      const coupon = res.data.coupon;
      setAppliedCoupon({ code: coupon.code, ...coupon });
      setCouponError('');
      showToast(`Coupon "${coupon.code}" applied!`);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      setCouponError(msg);
      setAppliedCoupon(null);
      return false;
    }
  }, [showToast, totalPrice]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponError('');
  }, []);

  const addToCart = useCallback((product, qty = 1) => {
    const pid = product._id || product.id;
    setItems((prev) => {
      const existing = prev.find((item) => (item._id || item.id) === pid);
      if (existing) {
        return prev.map((item) =>
          (item._id || item.id) === pid ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.name} added to cart`);
  }, [showToast]);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setItems((prev) =>
      prev.map((item) => ((item._id || item.id) === id ? { ...item, qty } : item))
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

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    const minSubtotal = Number(appliedCoupon.minSubtotal || 0);
    if (totalPrice < minSubtotal) {
      discount = 0;
    } else if (appliedCoupon.type === 'percent') {
      const rawDiscount = totalPrice * (appliedCoupon.value / 100);
      discount = appliedCoupon.maxDiscount ? Math.min(rawDiscount, appliedCoupon.maxDiscount) : rawDiscount;
    }
    else if (appliedCoupon.type === 'flat') discount = Math.min(appliedCoupon.value, totalPrice);
  }

  return (
    <CartContext.Provider
      value={{
        items, addToCart, removeFromCart, updateQty, clearCart,
        totalItems, totalPrice, toast,
        appliedCoupon, couponError, applyCoupon, removeCoupon, discount,
        availableCoupons,
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
