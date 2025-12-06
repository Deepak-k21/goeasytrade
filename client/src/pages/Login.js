import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1 className="auth-welcome-text">Welcome to GoEasyTrade</h1>
        <p className="auth-tagline">
          Your premier platform for seamless trading experiences. Join us to explore a world of opportunities.
        </p>
        <p className="auth-signup-prompt">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo"><span className="dark-blue-letter">G</span><span className="light-blue-letter">o</span><span className="dark-blue-letter">E</span><span className="light-blue-letter">asy</span><span className="dark-blue-letter">T</span><span className="light-blue-letter">rade</span></h1>
            <h2>User Login</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Forgot your password? <Link to="/forgot-password">Reset</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

