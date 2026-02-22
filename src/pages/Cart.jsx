import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line -- motion used as motion.div
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { SplitText, FadeIn } from '../components/common/AnimatedComponents';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQty, totalItems, totalPrice, clearCart } = useCart();

  const shipping = totalPrice > 99 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="cart-page">
      {/* Hero */}
      <section className="cart-hero">
        <div className="cart-hero__inner">
          <FadeIn delay={0.1}>
            <span className="eyebrow-tag">Your Cart</span>
          </FadeIn>
          <h1 className="cart-hero__title">
            <SplitText type="words" stagger={0.06}>Shopping Cart</SplitText>
          </h1>
          <FadeIn delay={0.4}>
            <p className="cart-hero__sub">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
          </FadeIn>
        </div>
      </section>

      {cart.length === 0 ? (
        <section className="cart-empty section">
          <motion.div
            className="cart-empty__inner"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="cart-empty__icon">
              <ShoppingBag size={48} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Discover our premium products.</p>
            <Link to="/products" className="pill-btn pill-btn-primary">
              <ArrowLeft size={16} /> Browse Products
            </Link>
          </motion.div>
        </section>
      ) : (
        <section className="cart-content section">
          <div className="cart-grid">
            {/* Items */}
            <div className="cart-items">
              <div className="cart-items__header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="cart-item__product">
                      <Link to={`/products/${item.id}`} className="cart-item__img-wrap">
                        <img src={item.image} alt={item.name} />
                      </Link>
                      <div className="cart-item__info">
                        <Link to={`/products/${item.id}`} className="cart-item__name">{item.name}</Link>
                        <span className="cart-item__brand">{item.brand}</span>
                      </div>
                    </div>

                    <div className="cart-item__price">${item.price.toFixed(2)}</div>

                    <div className="cart-item__qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="cart-item__total">${(item.price * item.qty).toFixed(2)}</div>

                    <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="cart-items__footer">
                <button className="pill-btn pill-btn-outline" onClick={clearCart}>Clear Cart</button>
                <Link to="/products" className="pill-btn pill-btn-outline">
                  <ArrowLeft size={14} /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <FadeIn delay={0.2} direction="right">
              <div className="cart-summary">
                <h3 className="cart-summary__title">Order Summary</h3>

                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary__row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <b className="free-ship">FREE</b> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="cart-summary__row">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-summary__total">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <motion.div
                    className="cart-summary__free"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Truck size={14} /> Free shipping applied!
                  </motion.div>
                )}

                <Link to="/checkout" className="pill-btn pill-btn-primary cart-checkout-btn">
                  <CreditCard size={16} /> Proceed to Checkout
                </Link>

                <div className="cart-summary__guarantees">
                  <div><ShieldCheck size={14} /> Secure Checkout</div>
                  <div><Truck size={14} /> Fast Delivery</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}
    </div>
  );
}
