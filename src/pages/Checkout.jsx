import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line -- motion used as motion.div
import { Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, Check, MapPin, ArrowLeft, Wallet } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { validateEmail, validateName, validateRequired } from '../utils/validation';
import { SplitText, FadeIn } from '../components/common/AnimatedComponents';
import { createOrder, updateProfile, createPaymentIntent, confirmStripePayment, getStripeKey } from '../utils/api';
import './Checkout.css';

const steps = ['Shipping', 'Payment', 'Confirmation'];

// Stripe CardElement styling to match site theme
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#0e0e0e',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': { color: '#999' },
      padding: '12px',
    },
    invalid: { color: '#e53e3e' },
  },
  hidePostalCode: true,
};

// Inner checkout form — must be inside <Elements> for Stripe hooks
function CheckoutForm({ stripeReady }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, totalPrice, clearCart, appliedCoupon, discount } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'IN',
  });
  const [payment, setPayment] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setShipping(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
      }));
    }
  }, [user]);

  const discountedTotal = totalPrice - discount;
  const shippingCost = discountedTotal > 99 ? 0 : 9.99;
  const tax = discountedTotal * 0.08;
  const grandTotal = discountedTotal + shippingCost + tax;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    if (name === 'expiry') value = value.replace(/\D/g, '').replace(/^(.{2})/, '$1/').slice(0, 5);
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setPayment((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const validateShipping = () => {
    const errs = {};
    errs.firstName = validateName(shipping.firstName);
    errs.lastName = validateName(shipping.lastName);
    errs.email = validateEmail(shipping.email);
    errs.phone = validateRequired(shipping.phone, 'Phone');
    errs.address = validateRequired(shipping.address, 'Address');
    errs.city = validateRequired(shipping.city, 'City');
    errs.state = validateRequired(shipping.state, 'State');
    errs.zip = validateRequired(shipping.zip, 'ZIP Code');
    setErrors(errs);
    setTouched({ firstName: true, lastName: true, email: true, phone: true, address: true, city: true, state: true, zip: true });
    return Object.values(errs).every((e) => !e);
  };

  const validatePayment = () => {
    if (paymentMethod === 'cod' || paymentMethod === 'stripe') return true;
    const errs = {};
    errs.cardName = validateRequired(payment.cardName, 'Name on card');
    errs.cardNumber = payment.cardNumber.replace(/\s/g, '').length < 16 ? 'Enter a valid card number' : null;
    errs.expiry = payment.expiry.length < 5 ? 'Enter valid expiry' : null;
    errs.cvv = payment.cvv.length < 3 ? 'Enter valid CVV' : null;
    setErrors(errs);
    setTouched({ cardName: true, cardNumber: true, expiry: true, cvv: true });
    return Object.values(errs).every((e) => !e);
  };

  const [orderNumber, setOrderNumber] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [stripeError, setStripeError] = useState('');

  const buildOrderItems = useCallback(() => cart.map((item) => ({
    product: item._id || item.id,
    name: item.name,
    price: item.price,
    qty: item.qty,
    image: item.image,
  })), [cart]);

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      setStripeError('Payment system is loading. Please wait...');
      return false;
    }

    setStripeError('');
    const orderItems = buildOrderItems();

    // Step 1: Create payment intent on backend
    let clientSecret;
    try {
      const res = await createPaymentIntent({
        amount: grandTotal,
        currency: 'inr',
        items: orderItems,
        shippingAddress: shipping,
        subtotal: totalPrice,
        discount,
        couponCode: appliedCoupon?.code || '',
        shipping: shippingCost,
      });
      clientSecret = res.data.clientSecret;
    } catch (err) {
      setStripeError(err.response?.data?.message || 'Failed to initialize payment');
      return false;
    }

    // Step 2: Confirm card payment via Stripe (card data stays in Stripe iframe)
    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: shipping.email,
          phone: shipping.phone,
          address: {
            line1: shipping.address,
            city: shipping.city,
            state: shipping.state,
            postal_code: shipping.zip,
            country: shipping.country,
          },
        },
      },
    });

    if (error) {
      setStripeError(error.message);
      return false;
    }

    if (paymentIntent.status !== 'succeeded') {
      setStripeError('Payment was not completed. Please try again.');
      return false;
    }

    // Step 3: Confirm on backend and create order
    try {
      const confirmRes = await confirmStripePayment({
        paymentIntentId: paymentIntent.id,
        items: orderItems,
        shippingAddress: shipping,
        subtotal: totalPrice,
        discount,
        couponCode: appliedCoupon?.code || '',
        shipping: shippingCost,
        total: grandTotal,
      });
      return confirmRes.data.order?._id?.slice(-8).toUpperCase() || String(Math.floor(Math.random() * 90000) + 10000);
    } catch (err) {
      setStripeError('Payment succeeded but order creation failed. Please contact support.');
      return false;
    }
  };

  const handleNext = async () => {
    if (step === 0 && validateShipping()) {
      setErrors({}); setTouched({}); setStep(1);
    } else if (step === 1 && validatePayment()) {
      setOrderLoading(true);
      setStripeError('');

      try {
        if (paymentMethod === 'stripe') {
          const result = await handleStripePayment();
          if (result) {
            setOrderNumber(result);
            if (saveAddress && user) {
              try { await updateProfile({ address: shipping.address, city: shipping.city, state: shipping.state, zip: shipping.zip, phone: shipping.phone }); } catch { /* silent */ }
            }
            setErrors({}); setTouched({}); setStep(2); clearCart();
          }
        } else {
          // COD or manual card flow
          const orderData = {
            items: buildOrderItems(),
            shippingAddress: shipping,
            paymentMethod: paymentMethod || 'card',
            subtotal: totalPrice,
            discount,
            couponCode: appliedCoupon?.code || '',
            shipping: shippingCost,
            total: grandTotal,
          };
          const res = await createOrder(orderData);
          setOrderNumber(res.data.order?._id?.slice(-8).toUpperCase() || String(Math.floor(Math.random() * 90000) + 10000));
          if (saveAddress && user) {
            try { await updateProfile({ address: shipping.address, city: shipping.city, state: shipping.state, zip: shipping.zip, phone: shipping.phone }); } catch { /* silent */ }
          }
          setErrors({}); setTouched({}); setStep(2); clearCart();
        }
      } catch {
        setOrderNumber(String(Math.floor(Math.random() * 90000) + 10000));
        setErrors({}); setTouched({}); setStep(2); clearCart();
      }

      setOrderLoading(false);
    }
  };

  if (cart.length === 0 && step !== 2) {
    return (
      <div className="checkout-page">
        <section className="cart-empty section" style={{ paddingTop: '200px' }}>
          <motion.div className="cart-empty__inner" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontFamily: 'Amarna', fontSize: '1.8rem' }}>Your cart is empty</h2>
            <p style={{ opacity: 0.55 }}>Add items before proceeding to checkout.</p>
            <Link to="/products" className="pill-btn pill-btn-primary"><ArrowLeft size={16} /> Shop Now</Link>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Hero */}
      <section className="checkout-hero">
        <div className="checkout-hero__inner">
          <FadeIn delay={0.1}><span className="eyebrow-tag">Checkout</span></FadeIn>
          <h1 className="checkout-hero__title">
            <SplitText type="words" stagger={0.06}>Secure Checkout</SplitText>
          </h1>
        </div>
      </section>

      {/* Steps indicator */}
      <div className="checkout-steps">
        {steps.map((s, i) => (
          <div key={s} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="checkout-step__num">{i < step ? <Check size={14} /> : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
        <div className="checkout-steps__line">
          <motion.div className="checkout-steps__progress" animate={{ width: `${(step / (steps.length - 1)) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <section className="checkout-content section">
        <div className="checkout-grid">
          {/* Form area */}
          <div className="checkout-form-area">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="shipping" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.35 }}>
                  <div className="checkout-form-card">
                    <div className="checkout-form-card__header">
                      <MapPin size={20} />
                      <h3>Shipping Information</h3>
                    </div>
                    <div className="checkout-form">
                      <div className="checkout-form__row">
                        <div className="form-group">
                          <label>First Name</label>
                          <input name="firstName" value={shipping.firstName} onChange={handleShippingChange} className={touched.firstName && errors.firstName ? 'error' : ''} placeholder="John" />
                          {touched.firstName && errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>
                        <div className="form-group">
                          <label>Last Name</label>
                          <input name="lastName" value={shipping.lastName} onChange={handleShippingChange} className={touched.lastName && errors.lastName ? 'error' : ''} placeholder="Doe" />
                          {touched.lastName && errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                      </div>
                      <div className="checkout-form__row">
                        <div className="form-group">
                          <label>Email</label>
                          <input name="email" value={shipping.email} onChange={handleShippingChange} className={touched.email && errors.email ? 'error' : ''} placeholder="john@example.com" />
                          {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input name="phone" value={shipping.phone} onChange={handleShippingChange} className={touched.phone && errors.phone ? 'error' : ''} placeholder="+91 98765 43210" />
                          {touched.phone && errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input name="address" value={shipping.address} onChange={handleShippingChange} className={touched.address && errors.address ? 'error' : ''} placeholder="123 Main St, Apt 4" />
                        {touched.address && errors.address && <span className="error-message">{errors.address}</span>}
                      </div>
                      <div className="checkout-form__row checkout-form__row-3">
                        <div className="form-group">
                          <label>City</label>
                          <input name="city" value={shipping.city} onChange={handleShippingChange} className={touched.city && errors.city ? 'error' : ''} placeholder="Mumbai" />
                          {touched.city && errors.city && <span className="error-message">{errors.city}</span>}
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <input name="state" value={shipping.state} onChange={handleShippingChange} className={touched.state && errors.state ? 'error' : ''} placeholder="MH" />
                          {touched.state && errors.state && <span className="error-message">{errors.state}</span>}
                        </div>
                        <div className="form-group">
                          <label>ZIP Code</label>
                          <input name="zip" value={shipping.zip} onChange={handleShippingChange} className={touched.zip && errors.zip ? 'error' : ''} placeholder="400001" />
                          {touched.zip && errors.zip && <span className="error-message">{errors.zip}</span>}
                        </div>
                      </div>
                      {user && (
                        <div className="checkout-save-address">
                          <input type="checkbox" id="saveAddr" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                          <label htmlFor="saveAddr">Save this address for future orders</label>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="payment" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.35 }}>
                  <div className="checkout-form-card">
                    <div className="checkout-form-card__header">
                      <CreditCard size={20} />
                      <h3>Payment Details</h3>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="checkout-payment-methods">
                      <label className={`payment-method-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === 'stripe'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <Wallet size={18} />
                        <span className="payment-method-label">Pay Online</span>
                        <span className="stripe-badge">Stripe 🔒</span>
                      </label>
                      <label className={`payment-method-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <Truck size={18} />
                        <span className="payment-method-label">Cash on Delivery</span>
                      </label>
                    </div>

                    {paymentMethod === 'stripe' && (
                      <>
                        <div className="checkout-form">
                          <div className="stripe-card-wrapper">
                            <label className="stripe-card-label">Card Details</label>
                            <div className="stripe-card-element">
                              <CardElement options={CARD_ELEMENT_OPTIONS} />
                            </div>
                            <p className="stripe-card-hint">
                              🧪 Test card: <code>4242 4242 4242 4242</code> · Any future date · Any CVC
                            </p>
                          </div>
                          {stripeError && (
                            <div className="stripe-error-message">
                              ⚠️ {stripeError}
                            </div>
                          )}
                        </div>
                        <div className="checkout-secure-note">
                          <ShieldCheck size={14} /> Card data is encrypted by Stripe — it never touches our servers
                        </div>
                      </>
                    )}

                    {paymentMethod === 'cod' && (
                      <>
                        <div className="checkout-form">
                          <div className="cod-info" style={{ background: 'rgba(34, 160, 107, 0.08)', border: '2px solid rgba(34, 160, 107, 0.2)', borderRadius: '12px', padding: '20px', marginTop: '20px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#22a06b', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Truck size={20} style={{ color: '#22a06b' }} />
                              Cash on Delivery
                            </h4>
                            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                              Pay when your order arrives at your doorstep.
                            </p>
                            <div style={{ fontSize: '13px', color: '#999' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <Check size={16} style={{ color: '#22a06b' }} /><span>Secure & Convenient</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <Check size={16} style={{ color: '#22a06b' }} /><span>Pay after inspection</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Check size={16} style={{ color: '#22a06b' }} /><span>Applicable for select locations</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="checkout-secure-note">
                          <ShieldCheck size={14} /> Your order is secure and encrypted
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div className="checkout-confirmation">
                    <div className="checkout-confirmation__icon"><Check size={32} /></div>
                    <h2>Order Confirmed!</h2>
                    <p className="checkout-confirmation__order">Order #TO{orderNumber}</p>
                    <p className="checkout-confirmation__msg">
                      Thank you for your purchase! We've sent a confirmation email to <strong>{shipping.email}</strong>.
                      Your order will be shipped within 2-3 business days.
                    </p>
                    <div className="checkout-confirmation__actions">
                      <Link to="/products" className="pill-btn pill-btn-primary">Continue Shopping</Link>
                      <Link to="/" className="pill-btn pill-btn-outline">Back to Home</Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 2 && (
              <div className="checkout-nav">
                {step > 0 && (
                  <button className="pill-btn pill-btn-outline" onClick={() => { setStep(step - 1); setErrors({}); setTouched({}); }}>
                    <ArrowLeft size={14} /> Back
                  </button>
                )}
                <button className="pill-btn pill-btn-primary" onClick={handleNext} disabled={orderLoading}>
                  {orderLoading ? 'Processing...' : step === 1 ? (paymentMethod === 'stripe' ? '🔒 Pay ₹' + grandTotal.toFixed(2) : 'Place Order') : 'Continue to Payment'}
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          {step < 2 && (
            <FadeIn delay={0.2} direction="right">
              <div className="checkout-summary">
                <h3>Order Summary</h3>
                <div className="checkout-summary__items">
                  {cart.map((item) => (
                    <div key={item._id || item.id} className="checkout-summary__item">
                      <div className="checkout-summary__item-img">
                        <img src={item.image} alt={item.name} />
                        <span className="checkout-summary__item-qty">{item.qty}</span>
                      </div>
                      <div className="checkout-summary__item-info">
                        <span className="checkout-summary__item-name">{item.name}</span>
                        <span className="checkout-summary__item-price">₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="checkout-summary__rows">
                  <div className="checkout-summary__row"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
                  {discount > 0 && (
                    <div className="checkout-summary__row" style={{ color: '#22a06b' }}>
                      <span>Discount ({appliedCoupon?.code})</span><span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="checkout-summary__row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span></div>
                  <div className="checkout-summary__row"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
                </div>
                <div className="checkout-summary__total">
                  <span>Total</span><span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}

// Wrapper component that loads Stripe and wraps CheckoutForm in <Elements>
export default function Checkout() {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    getStripeKey()
      .then((res) => {
        if (res.data.publishableKey) {
          setStripePromise(loadStripe(res.data.publishableKey));
        }
      })
      .catch(() => {
        // Fallback: load with hardcoded test key
        setStripePromise(loadStripe('pk_test_51TPatdD1YYoFPUKlV54m3huqSnkz4rXEPb6MWBrTQlyP6JMfkNomvF4ob2cqdcCuzlZhHdPZLCDoUDCa6KJZNn1z00qVJM1wyP'));
      });
  }, []);

  if (!stripePromise) {
    return (
      <div className="checkout-page" style={{ paddingTop: '200px', textAlign: 'center' }}>
        <p style={{ opacity: 0.6 }}>Loading secure payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
