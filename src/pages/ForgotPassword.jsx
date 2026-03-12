import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, KeyRound } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { FadeIn } from '../components/common/AnimatedComponents';
import './Auth.css';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = code, 3 = new password, 4 = success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    setErrors({});
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (code.length < 6) {
      setErrors({ code: 'Please enter the 6-digit code' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card forgot-card">
        {step === 1 && (
          <FadeIn>
            <div className="forgot-icon-wrap">
              <Mail size={32} />
            </div>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">Enter your email address and we'll send you a verification code to reset your password.</p>
            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">Sending...</span>
                ) : (
                  <><Send size={16} /> Send Reset Code</>
                )}
              </button>
              <div className="auth-footer">
                <p><Link to="/login"><ArrowLeft size={14} /> Back to Login</Link></p>
              </div>
            </form>
          </FadeIn>
        )}

        {step === 2 && (
          <FadeIn>
            <div className="forgot-icon-wrap">
              <KeyRound size={32} />
            </div>
            <h2 className="auth-title">Enter Code</h2>
            <p className="auth-subtitle">We've sent a 6-digit verification code to <strong>{email}</strong></p>
            <form onSubmit={handleCodeSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}); }}
                  className={errors.code ? 'error' : ''}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '20px' }}
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
              </div>
              <button type="submit" className="btn-auth">Verify Code</button>
              <div className="auth-footer">
                <p>Didn't receive the code? <button type="button" className="link-btn" onClick={() => { setStep(1); }}>Resend</button></p>
              </div>
            </form>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn>
            <div className="forgot-icon-wrap">
              <KeyRound size={32} />
            </div>
            <h2 className="auth-title">New Password</h2>
            <p className="auth-subtitle">Create a strong password for your account.</p>
            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }}
                  className={errors.newPassword ? 'error' : ''}
                  placeholder="Enter new password"
                />
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </FadeIn>
        )}

        {step === 4 && (
          <FadeIn>
            <div className="forgot-success">
              <div className="forgot-success__icon">
                <CheckCircle size={48} />
              </div>
              <h2 className="auth-title">Password Reset!</h2>
              <p className="auth-subtitle">Your password has been successfully reset. You can now log in with your new credentials.</p>
              <Link to="/login" className="btn-auth" style={{ display: 'inline-flex', justifyContent: 'center', textDecoration: 'none' }}>
                Go to Login
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
