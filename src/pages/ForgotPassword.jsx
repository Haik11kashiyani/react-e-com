import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, KeyRound } from 'lucide-react';
import { validateEmail, validatePassword, validateConfirmPassword } from '../utils/validation';
import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
} from '../utils/api';
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
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});
    setServerError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await requestPasswordResetOtp({ email });
      setSuccessMessage(res.data?.message || 'OTP sent successfully');
      setStep(2);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to send reset OTP');
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
    setServerError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await verifyPasswordResetOtp({ email, otp: code });
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
    const errs = {};
    const passwordError = validatePassword(newPassword);
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);

    if (passwordError) errs.newPassword = passwordError;
    if (confirmError) errs.confirmPassword = confirmError;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setServerError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await resetPasswordWithOtp({
        email,
        otp: code,
        newPassword,
      });
      setSuccessMessage(res.data?.message || 'Password reset successful');
      setStep(4);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to reset password');
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
              <Mail size={32} />
            </div>
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">Enter your email address and we'll send you a verification code to reset your password.</p>

            {serverError && <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{serverError}</p>}
            {successMessage && <p style={{ color: '#047857', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</p>}

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
                <p>Didn't receive the code? <button type="button" className="link-btn" onClick={handleEmailSubmit}>Resend</button></p>
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

            {serverError && <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{serverError}</p>}
            {successMessage && <p style={{ color: '#047857', textAlign: 'center', marginBottom: '1rem' }}>{successMessage}</p>}

            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group password-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }}
                    className={errors.newPassword ? 'error' : ''}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>
              <div className="form-group password-group">
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
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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
              <h2 className="auth-title">Password Reset!</h2>
              <p className="auth-subtitle">{successMessage || 'Your password has been successfully reset. You can now log in with your new credentials.'}</p>
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
