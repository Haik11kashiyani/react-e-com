import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, Check, MapPin, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { validateEmail, validateName, validateRequired } from '../utils/validation';
import { SplitText, FadeIn, RevealText } from '../components/common/AnimatedComponents';
import './Checkout.css';

const steps = ['Shipping', 'Payment', 'Confirmation'];

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'US',
  });
  const [payment, setPayment] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const shippingCost = totalPrice > 99 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shippingCost + tax;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/^(.{2})/, '$1/').slice(0, 5);
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
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
    const errs = {};
    errs.cardName = validateRequired(payment.cardName, 'Name on card');
    errs.cardNumber = payment.cardNumber.replace(/\s/g, '').length < 16 ? 'Enter a valid card number' : null;
    errs.expiry = payment.expiry.length < 5 ? 'Enter valid expiry' : null;
    errs.cvv = payment.cvv.length < 3 ? 'Enter valid CVV' : null;
    setErrors(errs);
    setTouched({ cardName: true, cardNumber: true, expiry: true, cvv: true });
    return Object.values(errs).every((e) => !e);
  };

  const handleNext = () => {
    if (step === 0 && validateShipping()) {
      setErrors({}); setTouched({}); setStep(1);
    } else if (step === 1 && validatePayment()) {
      setErrors({}); setTouched({}); setStep(2); clearCart();
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
                          <input name="phone" value={shipping.phone} onChange={handleShippingChange} className={touched.phone && errors.phone ? 'error' : ''} placeholder="+1 (555) 000-0000" />
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
                          <input name="city" value={shipping.city} onChange={handleShippingChange} className={touched.city && errors.city ? 'error' : ''} placeholder="San Francisco" />
                          {touched.city && errors.city && <span className="error-message">{errors.city}</span>}
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <input name="state" value={shipping.state} onChange={handleShippingChange} className={touched.state && errors.state ? 'error' : ''} placeholder="CA" />
                          {touched.state && errors.state && <span className="error-message">{errors.state}</span>}
                        </div>
                        <div className="form-group">
                          <label>ZIP Code</label>
                          <input name="zip" value={shipping.zip} onChange={handleShippingChange} className={touched.zip && errors.zip ? 'error' : ''} placeholder="94105" />
                          {touched.zip && errors.zip && <span className="error-message">{errors.zip}</span>}
                        </div>
                      </div>
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
                    <div className="checkout-form">
                      <div className="form-group">
                        <label>Name on Card</label>
                        <input name="cardName" value={payment.cardName} onChange={handlePaymentChange} className={touched.cardName && errors.cardName ? 'error' : ''} placeholder="John Doe" />
                        {touched.cardName && errors.cardName && <span className="error-message">{errors.cardName}</span>}
                      </div>
                      <div className="form-group">
                        <label>Card Number</label>
                        <input name="cardNumber" value={payment.cardNumber} onChange={handlePaymentChange} className={touched.cardNumber && errors.cardNumber ? 'error' : ''} placeholder="4242 4242 4242 4242" />
                        {touched.cardNumber && errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                      </div>
                      <div className="checkout-form__row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input name="expiry" value={payment.expiry} onChange={handlePaymentChange} className={touched.expiry && errors.expiry ? 'error' : ''} placeholder="MM/YY" />
                          {touched.expiry && errors.expiry && <span className="error-message">{errors.expiry}</span>}
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input name="cvv" value={payment.cvv} onChange={handlePaymentChange} className={touched.cvv && errors.cvv ? 'error' : ''} placeholder="123" />
                          {touched.cvv && errors.cvv && <span className="error-message">{errors.cvv}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="checkout-secure-note">
                      <ShieldCheck size={14} /> Your payment information is secure and encrypted
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div className="checkout-confirmation">
                    <div className="checkout-confirmation__icon">
                      <Check size={32} />
                    </div>
                    <h2>Order Confirmed!</h2>
                    <p className="checkout-confirmation__order">Order #VW{Math.floor(Math.random() * 90000) + 10000}</p>
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
                <button className="pill-btn pill-btn-primary" onClick={handleNext}>
                  {step === 1 ? 'Place Order' : 'Continue to Payment'}
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
                    <div key={item.id} className="checkout-summary__item">
                      <div className="checkout-summary__item-img">
                        <img src={item.image} alt={item.name} />
                        <span className="checkout-summary__item-qty">{item.qty}</span>
                      </div>
                      <div className="checkout-summary__item-info">
                        <span className="checkout-summary__item-name">{item.name}</span>
                        <span className="checkout-summary__item-price">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="checkout-summary__rows">
                  <div className="checkout-summary__row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                  <div className="checkout-summary__row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span></div>
                  <div className="checkout-summary__row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                </div>
                <div className="checkout-summary__total">
                  <span>Total</span><span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
