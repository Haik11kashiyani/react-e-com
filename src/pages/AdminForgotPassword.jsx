import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Send, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { validateEmail, validatePassword, validateConfirmPassword } from '../utils/validation';
import {
  requestAdminPasswordResetOtp,
  verifyAdminPasswordResetOtp,
  resetAdminPasswordWithOtp,
} from '../utils/api';
import { FadeIn } from '../components/common/AnimatedComponents';
import './Auth.css';

export default function AdminForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const clearMessages = () => {
    setServerError('');
    setSuccessMessage('');
  };

  const sendOtp = async () => {
    const res = await requestAdminPasswordResetOtp({ email });
    setSuccessMessage(res.data?.message || 'Admin reset OTP sent successfully');
    setStep(2);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);

    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});
    clearMessages();
    setLoading(true);

    try {
      await sendOtp();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to send admin reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    clearMessages();
    setLoading(true);

    try {
      await sendOtp();
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to resend admin reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();

    if (code.length < 6) {
      setErrors({ code: 'Please enter the 6-digit code' });
      return;
    }

    setErrors({});
    clearMessages();
    setLoading(true);

    try {
      const res = await verifyAdminPasswordResetOtp({ email, otp: code });
      setSuccessMessage(res.data?.message || 'OTP verified successfully');
      setStep(3);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);

    if (passwordError) nextErrors.newPassword = passwordError;
    if (confirmError) nextErrors.confirmPassword = confirmError;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    clearMessages();
    setLoading(true);

    try {
      const res = await resetAdminPasswordWithOtp({
        email,
        otp: code,
        newPassword,
      });
      setSuccessMessage(res.data?.message || 'Admin password reset successful');
      setStep(4);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to reset admin password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card forgot-card">
        {step === 1 && (
          <FadeIn>
            <div className="forgot-icon-wrap">
              <ShieldAlert size={32} />
            </div>
            <h2 className="auth-title">Admin Recovery</h2>
            <p className="auth-subtitle">
              Enter your admin email to receive a verification code for password reset.
            </p>

            {serverError && <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{serverError}</p>}
            {successMessage && <p style={{ color: '#047857', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</p>}

            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter admin email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? <span className="btn-loading">Sending...</span> : <><Send size={16} /> Send Reset Code</>}
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
            <p className="auth-subtitle">We sent a 6-digit code to <strong>{email}</strong></p>

            {serverError && <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{serverError}</p>}
            {successMessage && <p style={{ color: '#047857', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</p>}

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

              <button type="submit" className="btn-auth" disabled={loading}>{loading ? 'Verifying...' : 'Verify Code'}</button>

              <div className="auth-footer">
                <p>
                  Did not receive the code?
                  <button type="button" className="link-btn" onClick={handleResendOtp} disabled={loading}>Resend</button>
                </p>
              </div>
            </form>
          </FadeIn>
        )}

        {step === 3 && (
          <FadeIn>
            <div className="forgot-icon-wrap">
              <KeyRound size={32} />
            </div>
            <h2 className="auth-title">Set New Admin Password</h2>
            <p className="auth-subtitle">Create a strong password for the admin account.</p>

            {serverError && <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{serverError}</p>}
            {successMessage && <p style={{ color: '#047857', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</p>}

            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }}
                    className={errors.newPassword ? 'error' : ''}
                    placeholder="Enter new password"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowNewPassword(v => !v)} tabIndex={-1}>
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm new password"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
              <h2 className="auth-title">Admin Password Reset</h2>
              <p className="auth-subtitle">
                {successMessage || 'Admin password has been reset. You can now login with the new password.'}
              </p>
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
