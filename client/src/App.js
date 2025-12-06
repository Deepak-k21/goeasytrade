import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoadingPage from './pages/LoadingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import BusinessForm from './pages/BusinessForm';
import Confirmation from './pages/Confirmation';
import AuthCallback from './pages/AuthCallback';
import PrivateRoute from './components/PrivateRoute';
import RoleDetails from './pages/RoleDetails';
import SellerPrimaryDetails from './pages/SellerPrimaryDetails';
import BuyerMarket from './pages/BuyerMarket';
import SellerDomesticDescription from './pages/SellerDomesticDescription'; // Import new component

// Placeholder Components for new routes
const SellerImportDescription = () => <div>Seller Import Description Page</div>;
const SellerImportRecap = () => <div>Seller Import Recap Page</div>;
const BuyerDomesticHVI = () => <div>Buyer Domestic HVI Page (Empty)</div>;
const BuyerDomesticDescription = () => <div>Buyer Domestic Description Page (Empty)</div>;
const BuyerImportDescription = () => <div>Buyer Import Description Page (Empty)</div>;
const BuyerImportRecap = () => <div>Buyer Import Recap Page (Empty)</div>;
const BuyerInquiryCotton = () => <div>Buyer Inquiry Cotton Page (Empty)</div>;
const MMFPage = () => <div>MMF Page (Empty)</div>;
const YARNPage = () => <div>YARN Page (Empty)</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Seller Side Routes */}
          <Route
            path="/seller/domestic-hvi"
            element={
              <PrivateRoute>
                <BusinessForm /> {/* This now handles HVI uploads and other docs */}
              </PrivateRoute>
            }
          />
          <Route
            path="/seller/domestic-description"
            element={
              <PrivateRoute>
                <SellerDomesticDescription />
              </PrivateRoute>
            }
          />
          <Route
            path="/seller/import-description"
            element={
              <PrivateRoute>
                <SellerImportDescription />
              </PrivateRoute>
            }
          />
          <Route
            path="/seller/import-recap"
            element={
              <PrivateRoute>
                <SellerImportRecap />
              </PrivateRoute>
            }
          />

          {/* Buyer Side Routes */}
          <Route
            path="/buyer/domestic-hvi"
            element={
              <PrivateRoute>
                <BuyerDomesticHVI />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer/domestic-description"
            element={
              <PrivateRoute>
                <BuyerDomesticDescription />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer/import-description"
            element={
              <PrivateRoute>
                <BuyerImportDescription />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer/import-recap"
            element={
              <PrivateRoute>
                <BuyerImportRecap />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer/inquiry-cotton"
            element={
              <PrivateRoute>
                <BuyerInquiryCotton />
              </PrivateRoute>
            }
          />

          {/* MMF and YARN Routes */}
          <Route
            path="/mmf"
            element={
              <PrivateRoute>
                <MMFPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/yarn"
            element={
              <PrivateRoute>
                <YARNPage />
              </PrivateRoute>
            }
          />

          {/* Existing routes, ensure proper order */}
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
          <Route
            path="/role"
            element={
              <PrivateRoute>
                <RoleDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/seller/primary"
            element={
              <PrivateRoute allowedRoles={['seller']}>
                <SellerPrimaryDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer"
            element={
              <PrivateRoute allowedRoles={['buyer']}>
                <BuyerMarket />
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

