import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { validateEmail } from '../utils/validation';
import './Auth.css';

const VerifyEmail = () => {
  const { verifyOtpAndLogin, resendVerificationOtp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = useMemo(() => location.state?.email || '', [location.state]);

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setServerError(emailError);
      return;
    }

    if (otp.length !== 6) {
      setServerError('Please enter a valid 6-digit OTP');
      return;
    }

    setServerError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const data = await verifyOtpAndLogin(email, otp);
      setSuccessMessage(data.message || 'Email verified successfully');
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setServerError(emailError);
      return;
    }

    setServerError('');
    setSuccessMessage('');
    setResending(true);

    try {
      const data = await resendVerificationOtp(email);
      setSuccessMessage(data.message || 'OTP sent to your email');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Verify Your Email</h2>
        <p className="auth-subtitle">Enter your email and 6-digit OTP to activate your account.</p>

        {serverError && (
          <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {serverError}
          </p>
        )}

        {successMessage && (
          <p style={{ color: '#047857', textAlign: 'center', marginBottom: '1rem' }}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleVerify} className="auth-form">
          <div className="form-group">
            <label htmlFor="verifyEmail">Email</label>
            <input
              type="email"
              id="verifyEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="verifyOtp">OTP</label>
            <input
              type="text"
              id="verifyOtp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            type="button"
            className="btn-auth"
            style={{ marginTop: '0.7rem', background: '#475569' }}
            disabled={resending}
            onClick={handleResendOtp}
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>

          <div className="auth-footer">
            <p>
              Back to <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
