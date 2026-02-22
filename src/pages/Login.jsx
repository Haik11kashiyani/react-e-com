import React, { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/validation';
import './Auth.css'; // We'll create this for shared auth styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
      console.log('Login successful', formData);
      // Proceed with login logic
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account to continue</p>
        
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

          <button type="submit" className="btn-auth">Login</button>
          
          <div className="auth-footer">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
