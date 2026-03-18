import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Tag, MapPin, Globe, Settings, ChevronRight,
  Copy, Check, Trash2, Plus, Edit2, Save, ArrowLeft, LogOut
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { updateProfile } from '../utils/api';
import { SplitText, FadeIn } from '../components/common/AnimatedComponents';
import './Profile.css';

const tabs = [
  { id: 'coupons', label: 'My Coupons', icon: Tag },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Espa\u00f1ol', flag: '🇪🇸' },
  { code: 'fr', name: 'Fran\u00e7ais', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export default function Profile() {
  const { availableCoupons, appliedCoupon } = useCart();
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('coupons');
  const [copied, setCopied] = useState('');
  const [language, setLanguage] = useState('en');
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', name: 'John Doe', line: '123 Main St, Apt 4', city: 'San Francisco', state: 'CA', zip: '94105', phone: '+1 555-000-1234', isDefault: true },
  ]);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState({ label: '', name: '', line: '', city: '', state: '', zip: '', phone: '' });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    const parts = profileName.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    setSaving(true);
    try {
      const res = await updateProfile({ firstName, lastName, email: profileEmail });
      setUser(res.data.user);
      localStorage.setItem('techorbit_user', JSON.stringify(res.data.user));
    } catch { /* silent */ }
    setSaving(false);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  const saveAddress = () => {
    if (!addrForm.name || !addrForm.line || !addrForm.city) return;
    if (editingAddr) {
      setAddresses((prev) => prev.map((a) => a.id === editingAddr ? { ...a, ...addrForm } : a));
      setEditingAddr(null);
    } else {
      setAddresses((prev) => [...prev, { ...addrForm, id: Date.now(), isDefault: prev.length === 0 }]);
    }
    setAddrForm({ label: '', name: '', line: '', city: '', state: '', zip: '', phone: '' });
    setShowAddrForm(false);
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefault = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const editAddress = (addr) => {
    setAddrForm({ label: addr.label, name: addr.name, line: addr.line, city: addr.city, state: addr.state, zip: addr.zip, phone: addr.phone });
    setEditingAddr(addr.id);
    setShowAddrForm(true);
  };

  if (!user) {
    return (
      <div className="profile-page" style={{ paddingTop: '200px', textAlign: 'center' }}>
        <h2>Please log in to view your profile</h2>
        <Link to="/login" className="pill-btn pill-btn-primary" style={{ marginTop: '1rem' }}>Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Hero */}
      <section className="profile-hero">
        <div className="profile-hero__inner">
          <FadeIn delay={0.1}><span className="eyebrow-tag">Account</span></FadeIn>
          <h1 className="profile-hero__title">
            <SplitText type="words" stagger={0.06}>My Profile</SplitText>
          </h1>
          <FadeIn delay={0.4}>
            <p className="profile-hero__sub">Manage your coupons, addresses, and preferences</p>
          </FadeIn>
        </div>
      </section>

      <section className="profile-content section">
        <div className="profile-grid">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <User size={28} />
              </div>
              <h3 className="profile-card__name">{profileName}</h3>
              <p className="profile-card__email">{profileEmail}</p>
            </div>
            <nav className="profile-nav">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  className={`profile-nav__item ${tab === t.id ? 'active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <t.icon size={16} />
                  <span>{t.label}</span>
                  <ChevronRight size={14} className="profile-nav__arrow" />
                </button>
              ))}
            </nav>
            <button className="pill-btn pill-btn-outline" style={{ width: '100%', marginTop: '1rem' }} onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </aside>

          {/* Main content */}
          <div className="profile-main">
            <AnimatePresence mode="wait">
              {/* === COUPONS TAB === */}
              {tab === 'coupons' && (
                <motion.div key="coupons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <h2 className="profile-section-title">Available Coupons</h2>
                  <p className="profile-section-sub">Copy a code and apply it at checkout for a discount.</p>
                  <div className="coupon-grid">
                    {Object.entries(availableCoupons).map(([code, coupon]) => (
                      <div key={code} className={`coupon-card ${appliedCoupon?.code === code ? 'applied' : ''}`}>
                        <div className="coupon-card__left">
                          <span className="coupon-card__value">
                            {coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'flat' ? `$${coupon.value}` : 'FREE'}
                          </span>
                          <span className="coupon-card__type">
                            {coupon.type === 'shipping' ? 'SHIPPING' : 'OFF'}
                          </span>
                        </div>
                        <div className="coupon-card__right">
                          <span className="coupon-card__label">{coupon.label}</span>
                          <div className="coupon-card__code-row">
                            <code className="coupon-card__code">{code}</code>
                            <button className="coupon-card__copy" onClick={() => copyCode(code)}>
                              {copied === code ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>
                        {appliedCoupon?.code === code && (
                          <span className="coupon-card__badge">Active</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* === ADDRESSES TAB === */}
              {tab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div className="profile-section-header">
                    <div>
                      <h2 className="profile-section-title">Shipping Addresses</h2>
                      <p className="profile-section-sub">Manage your delivery addresses.</p>
                    </div>
                    <button className="pill-btn pill-btn-primary pill-btn-sm" onClick={() => { setShowAddrForm(true); setEditingAddr(null); setAddrForm({ label: '', name: '', line: '', city: '', state: '', zip: '', phone: '' }); }}>
                      <Plus size={14} /> Add Address
                    </button>
                  </div>

                  {showAddrForm && (
                    <motion.div className="addr-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <h3>{editingAddr ? 'Edit Address' : 'New Address'}</h3>
                      <div className="addr-form__grid">
                        <input placeholder="Label (Home, Work...)" value={addrForm.label} onChange={(e) => setAddrForm(p => ({ ...p, label: e.target.value }))} />
                        <input placeholder="Full Name" value={addrForm.name} onChange={(e) => setAddrForm(p => ({ ...p, name: e.target.value }))} />
                        <input placeholder="Street Address" className="addr-form__full" value={addrForm.line} onChange={(e) => setAddrForm(p => ({ ...p, line: e.target.value }))} />
                        <input placeholder="City" value={addrForm.city} onChange={(e) => setAddrForm(p => ({ ...p, city: e.target.value }))} />
                        <input placeholder="State" value={addrForm.state} onChange={(e) => setAddrForm(p => ({ ...p, state: e.target.value }))} />
                        <input placeholder="ZIP Code" value={addrForm.zip} onChange={(e) => setAddrForm(p => ({ ...p, zip: e.target.value }))} />
                        <input placeholder="Phone" value={addrForm.phone} onChange={(e) => setAddrForm(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                      <div className="addr-form__actions">
                        <button className="pill-btn pill-btn-primary pill-btn-sm" onClick={saveAddress}><Save size={14} /> Save</button>
                        <button className="pill-btn pill-btn-outline pill-btn-sm" onClick={() => { setShowAddrForm(false); setEditingAddr(null); }}>Cancel</button>
                      </div>
                    </motion.div>
                  )}

                  <div className="addr-list">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`addr-card ${addr.isDefault ? 'default' : ''}`}>
                        <div className="addr-card__header">
                          <span className="addr-card__label">{addr.label || 'Address'}</span>
                          {addr.isDefault && <span className="addr-card__default-badge">Default</span>}
                        </div>
                        <p className="addr-card__name">{addr.name}</p>
                        <p className="addr-card__line">{addr.line}</p>
                        <p className="addr-card__line">{addr.city}, {addr.state} {addr.zip}</p>
                        {addr.phone && <p className="addr-card__phone">{addr.phone}</p>}
                        <div className="addr-card__actions">
                          {!addr.isDefault && <button onClick={() => setDefault(addr.id)}>Set Default</button>}
                          <button onClick={() => editAddress(addr)}><Edit2 size={12} /> Edit</button>
                          <button className="addr-card__delete" onClick={() => deleteAddress(addr.id)}><Trash2 size={12} /> Remove</button>
                        </div>
                      </div>
                    ))}
                    {addresses.length === 0 && (
                      <p className="profile-empty">No addresses saved yet.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* === LANGUAGE TAB === */}
              {tab === 'language' && (
                <motion.div key="language" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <h2 className="profile-section-title">Language & Region</h2>
                  <p className="profile-section-sub">Choose your preferred display language.</p>
                  <div className="lang-grid">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`lang-card ${language === lang.code ? 'active' : ''}`}
                        onClick={() => setLanguage(lang.code)}
                      >
                        <span className="lang-card__flag">{lang.flag}</span>
                        <span className="lang-card__name">{lang.name}</span>
                        {language === lang.code && <Check size={16} className="lang-card__check" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* === SETTINGS TAB === */}
              {tab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <h2 className="profile-section-title">Account Settings</h2>
                  <p className="profile-section-sub">Update your personal information.</p>
                  <div className="settings-form">
                    <div className="settings-form__group">
                      <label>Full Name</label>
                      <input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                    </div>
                    <div className="settings-form__group">
                      <label>Email Address</label>
                      <input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                    </div>
                    <div className="settings-form__group">
                      <label>Password</label>
                      <input type="password" value="••••••••" readOnly />
                      <button className="settings-change-btn">Change Password</button>
                    </div>
                    <div className="settings-form__group settings-toggle-group">
                      <div>
                        <label>Email Notifications</label>
                        <p>Receive order updates and promotions</p>
                      </div>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle__slider" />
                      </label>
                    </div>
                    <div className="settings-form__group settings-toggle-group">
                      <div>
                        <label>Two-Factor Authentication</label>
                        <p>Add extra security to your account</p>
                      </div>
                      <label className="toggle">
                        <input type="checkbox" />
                        <span className="toggle__slider" />
                      </label>
                    </div>
                    <button className="pill-btn pill-btn-primary pill-btn-sm" style={{ marginTop: '1rem' }} onClick={handleSaveProfile} disabled={saving}>
                      <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
