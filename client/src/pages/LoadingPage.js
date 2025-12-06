import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoadingPage.css';

const LoadingPage = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const go = async () => {
      const token = localStorage.getItem('token');
      const timeout = setTimeout(() => setFadeOut(true), 1500);
      try {
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            const res = await axios.get('/api/business/info');
            const business = res?.data;
            setTimeout(() => {
              const hasDocs = Boolean(
                business?.gstFile?.path && business?.cancelCheque?.path
              );

              if (!business || !business.userId) { // Check if business data itself is missing
                navigate('/business-form');
              } else if (!hasDocs) {
                navigate('/business-form');
              } else if (!business?.role) {
                navigate('/role');
              } else if (business.role === 'seller') {
                navigate('/seller/primary');
              } else {
                navigate('/buyer');
              }
            }, 500);
          } catch (e) {
            // If business info not found (e.g., new user), navigate to business-form
            if (e.response && e.response.status === 404) {
              navigate('/business-form');
            } else {
              // If unauthorized or other error, clear token and go to login
              localStorage.removeItem('token');
              delete axios.defaults.headers.common['Authorization'];
              navigate('/login');
            }
          }
        } else {
          setTimeout(() => navigate('/login'), 1200);
        }
      } finally {
        return () => clearTimeout(timeout);
      }
    };
    go();
  }, [navigate]);

  return (
    <div className={`loading-page ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="logo-container">
          <h1 className="logo-text">
            <span className="highlight-letter">G</span>o
            <span className="highlight-letter">E</span>asy
            <span className="highlight-letter">T</span>rade
          </h1>
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

