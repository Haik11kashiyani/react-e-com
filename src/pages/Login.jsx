import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validation';
import useAuth from '../hooks/useAuth';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    let error = null;
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    setTouched({
        email: true,
        password: true
    });

    if (!emailError && !passwordError) {
      setLoading(true);
      setServerError('');
      login(formData.email, formData.password)
        .then((data) => {
          // Admin users go to admin panel, regular users go to home
          if (data.user && data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        })
        .catch((err) => {
          if (err.response?.data?.requiresVerification) {
            navigate('/verify-email', {
              state: {
                email: err.response?.data?.email || formData.email,
              },
            });
            return;
          }

          setServerError(err.response?.data?.message || 'Login failed');
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account to continue</p>
        
        {serverError && <p className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{serverError}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="auth-forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
            <span style={{ margin: '0 6px', color: '#9ca3af' }}>|</span>
            <Link to="/admin/forgot-password">Admin Forgot Password?</Link>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
