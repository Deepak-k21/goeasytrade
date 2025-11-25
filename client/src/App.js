import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoadingPage from './pages/LoadingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BusinessForm from './pages/BusinessForm';
import Confirmation from './pages/Confirmation';
import AuthCallback from './pages/AuthCallback';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoadingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/business-form"
            element={
              <PrivateRoute>
                <BusinessForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <PrivateRoute>
                <Confirmation />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

