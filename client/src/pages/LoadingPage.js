import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingPage.css';

const LoadingPage = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`loading-page ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="logo-container">
          <h1 className="logo-text">GoEasyTrade</h1>
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

