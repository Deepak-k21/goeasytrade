import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#00BAF2'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user.businessInfo && !allowedRoles.includes(user.businessInfo.role)) {
    // Redirect to a dashboard based on their existing role or a general unauthorized page
    if (user.businessInfo.role === 'seller') {
      return <Navigate to="/seller/primary" replace />;
    } else if (user.businessInfo.role === 'buyer') {
      return <Navigate to="/buyer" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;

