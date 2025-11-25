import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Confirmation.css';

const Confirmation = () => {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const response = await axios.get('/api/business/info');
      setBusinessInfo(response.data);
    } catch (error) {
      console.error('Error fetching business info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${filePath}`;
  };

  if (loading) {
    return (
      <div className="confirmation-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!businessInfo) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          <h2>No Business Information Found</h2>
          <button onClick={() => navigate('/business-form')} className="btn-primary">
            Fill Business Information
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <h1 className="confirmation-logo">GoEasyTrade</h1>
          <div className="success-icon">✓</div>
          <h2>Registration Successful!</h2>
          <p>All your business information has been submitted successfully.</p>
        </div>

        <div className="confirmation-content">
          <div className="info-section">
            <h3>Uploaded Documents</h3>
            <div className="document-list">
              <div className="document-item">
                <span className="document-label">Certificate of Incorporation:</span>
                {businessInfo.certificateOfIncorporation?.filename ? (
                  <a
                    href={getFileUrl(businessInfo.certificateOfIncorporation.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    {businessInfo.certificateOfIncorporation.filename}
                  </a>
                ) : (
                  <span className="document-missing">Not uploaded</span>
                )}
              </div>

              <div className="document-item">
                <span className="document-label">Company PAN Card:</span>
                {businessInfo.companyPanCard?.filename ? (
                  <a
                    href={getFileUrl(businessInfo.companyPanCard.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    {businessInfo.companyPanCard.filename}
                  </a>
                ) : (
                  <span className="document-missing">Not uploaded</span>
                )}
              </div>

              <div className="document-item">
                <span className="document-label">
                  MSME {businessInfo.msmeRegistration?.type === 'MSME' ? 'Registration' : 'Declaration'}:
                </span>
                {businessInfo.msmeRegistration?.filename ? (
                  <a
                    href={getFileUrl(businessInfo.msmeRegistration.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    {businessInfo.msmeRegistration.filename}
                  </a>
                ) : (
                  <span className="document-missing">Not uploaded</span>
                )}
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Business Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">GST No:</span>
                <span className="info-value">{businessInfo.gstNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">MSME Type:</span>
                <span className="info-value">{businessInfo.msmeRegistration?.type}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Primary Contact No:</span>
                <span className="info-value">{businessInfo.primaryContactNo}</span>
              </div>
              {businessInfo.secondaryContactNo && (
                <div className="info-item">
                  <span className="info-label">Secondary Contact No:</span>
                  <span className="info-value">{businessInfo.secondaryContactNo}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Primary Email:</span>
                <span className="info-value">{businessInfo.primaryEmailId}</span>
              </div>
              {businessInfo.secondaryEmailId && (
                <div className="info-item">
                  <span className="info-label">Secondary Email:</span>
                  <span className="info-value">{businessInfo.secondaryEmailId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-section">
            <h3>Business Address</h3>
            <div className="address-display">
              <p>{businessInfo.businessAddress?.street}</p>
              <p>
                {businessInfo.businessAddress?.city}, {businessInfo.businessAddress?.state} -{' '}
                {businessInfo.businessAddress?.pincode}
              </p>
              <p>{businessInfo.businessAddress?.country}</p>
            </div>
          </div>

          <div className="info-section">
            <h3>Contact Address</h3>
            <div className="address-display">
              <p>{businessInfo.contactAddress?.street}</p>
              <p>
                {businessInfo.contactAddress?.city}, {businessInfo.contactAddress?.state} -{' '}
                {businessInfo.contactAddress?.pincode}
              </p>
              <p>{businessInfo.contactAddress?.country}</p>
            </div>
          </div>
        </div>

        <div className="confirmation-footer">
          <button onClick={() => navigate('/business-form')} className="btn-secondary">
            Edit Information
          </button>
          <button onClick={() => navigate('/')} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

