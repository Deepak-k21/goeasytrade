import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/user/me')
        .then(response => {
          login(token, response.data);
          navigate('/business-form');
        })
        .catch(() => {
          navigate('/login?error=authentication_failed');
        });
    } else {
      navigate('/login?error=authentication_failed');
    }
  }, [searchParams, login, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px',
      color: '#00BAF2'
    }}>
      Completing authentication...
    </div>
  );
};

export default AuthCallback;

