import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BusinessForm.css';

const BusinessForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    certificateOfIncorporation: null,
    gstNo: '',
    companyPanCard: null,
    msmeType: 'MSME',
    msmeRegistration: null,
    primaryContactNo: '',
    secondaryContactNo: '',
    primaryEmailId: '',
    secondaryEmailId: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    contactAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [name]: value
      }
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload only PDF files');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      setError('');
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.certificateOfIncorporation) {
          setError('Please upload Certificate of Incorporation');
          return false;
        }
        if (!formData.gstNo.trim()) {
          setError('Please enter GST No');
          return false;
        }
        if (!formData.companyPanCard) {
          setError('Please upload Company PAN Card');
          return false;
        }
        if (!formData.msmeRegistration) {
          setError('Please upload MSME Registration or Declaration');
          return false;
        }
        break;
      case 2:
        if (!formData.primaryContactNo.trim()) {
          setError('Please enter Primary Contact No');
          return false;
        }
        if (!formData.primaryEmailId.trim()) {
          setError('Please enter Primary Email ID');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmailId)) {
          setError('Please enter a valid Primary Email ID');
          return false;
        }
        if (formData.secondaryEmailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.secondaryEmailId)) {
          setError('Please enter a valid Secondary Email ID');
          return false;
        }
        break;
      case 3:
        const businessAddr = formData.businessAddress;
        if (!businessAddr.street.trim() || !businessAddr.city.trim() || 
            !businessAddr.state.trim() || !businessAddr.pincode.trim()) {
          setError('Please fill all Business Address fields');
          return false;
        }
        const contactAddr = formData.contactAddress;
        if (!contactAddr.street.trim() || !contactAddr.city.trim() || 
            !contactAddr.state.trim() || !contactAddr.pincode.trim()) {
          setError('Please fill all Contact Address fields');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('certificateOfIncorporation', formData.certificateOfIncorporation);
      submitData.append('companyPanCard', formData.companyPanCard);
      submitData.append('msmeRegistration', formData.msmeRegistration);
      submitData.append('gstNo', formData.gstNo);
      submitData.append('msmeType', formData.msmeType);
      submitData.append('primaryContactNo', formData.primaryContactNo);
      submitData.append('secondaryContactNo', formData.secondaryContactNo);
      submitData.append('primaryEmailId', formData.primaryEmailId);
      submitData.append('secondaryEmailId', formData.secondaryEmailId);
      submitData.append('businessAddress', JSON.stringify(formData.businessAddress));
      submitData.append('contactAddress', JSON.stringify(formData.contactAddress));

      await axios.post('/api/business/submit', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-form-container">
      <div className="business-form-card">
        <div className="form-header">
          <h1 className="form-logo">GoEasyTrade</h1>
          <h2>Business Information</h2>
          <div className="progress-bar">
            <div className="progress-step">
              <div className={`step-number ${currentStep >= 1 ? 'active' : ''}`}>1</div>
              <span className="step-label">Documents</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className={`step-number ${currentStep >= 2 ? 'active' : ''}`}>2</div>
              <span className="step-label">Contact</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className={`step-number ${currentStep >= 3 ? 'active' : ''}`}>3</div>
              <span className="step-label">Address</span>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Documents */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Upload Required Documents</h3>
              
              <div className="file-upload-group">
                <label>Certificate of Incorporation (PDF) *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'certificateOfIncorporation')}
                    required
                  />
                  <span className="file-name">
                    {formData.certificateOfIncorporation 
                      ? formData.certificateOfIncorporation.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="gstNo">GST No *</label>
                <input
                  type="text"
                  id="gstNo"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter GST Number"
                />
              </div>

              <div className="file-upload-group">
                <label>Company PAN Card (PDF) *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'companyPanCard')}
                    required
                  />
                  <span className="file-name">
                    {formData.companyPanCard 
                      ? formData.companyPanCard.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="msmeType">MSME Registration Type *</label>
                <select
                  id="msmeType"
                  name="msmeType"
                  value={formData.msmeType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MSME">MSME Registration</option>
                  <option value="Non-MSME">MSME Declaration (Non-MSME)</option>
                </select>
              </div>

              <div className="file-upload-group">
                <label>MSME Registration/Declaration (PDF) *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'msmeRegistration')}
                    required
                  />
                  <span className="file-name">
                    {formData.msmeRegistration 
                      ? formData.msmeRegistration.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Contact Information</h3>
              
              <div className="form-group">
                <label htmlFor="primaryContactNo">Primary Contact No *</label>
                <input
                  type="tel"
                  id="primaryContactNo"
                  name="primaryContactNo"
                  value={formData.primaryContactNo}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter primary contact number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondaryContactNo">Secondary Contact No</label>
                <input
                  type="tel"
                  id="secondaryContactNo"
                  name="secondaryContactNo"
                  value={formData.secondaryContactNo}
                  onChange={handleInputChange}
                  placeholder="Enter secondary contact number (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="primaryEmailId">Primary Email ID *</label>
                <input
                  type="email"
                  id="primaryEmailId"
                  name="primaryEmailId"
                  value={formData.primaryEmailId}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter primary email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondaryEmailId">Secondary Email ID</label>
                <input
                  type="email"
                  id="secondaryEmailId"
                  name="secondaryEmailId"
                  value={formData.secondaryEmailId}
                  onChange={handleInputChange}
                  placeholder="Enter secondary email address (optional)"
                />
              </div>
            </div>
          )}

          {/* Step 3: Addresses */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Address Information</h3>
              
              <div className="address-section">
                <h4>Business Address *</h4>
                <div className="form-group">
                  <label htmlFor="businessStreet">Street Address</label>
                  <input
                    type="text"
                    id="businessStreet"
                    name="street"
                    value={formData.businessAddress.street}
                    onChange={(e) => handleAddressChange(e, 'businessAddress')}
                    required
                    placeholder="Enter street address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="businessCity">City</label>
                    <input
                      type="text"
                      id="businessCity"
                      name="city"
                      value={formData.businessAddress.city}
                      onChange={(e) => handleAddressChange(e, 'businessAddress')}
                      required
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="businessState">State</label>
                    <input
                      type="text"
                      id="businessState"
                      name="state"
                      value={formData.businessAddress.state}
                      onChange={(e) => handleAddressChange(e, 'businessAddress')}
                      required
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="businessPincode">Pincode</label>
                    <input
                      type="text"
                      id="businessPincode"
                      name="pincode"
                      value={formData.businessAddress.pincode}
                      onChange={(e) => handleAddressChange(e, 'businessAddress')}
                      required
                      placeholder="Enter pincode"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="businessCountry">Country</label>
                    <input
                      type="text"
                      id="businessCountry"
                      name="country"
                      value={formData.businessAddress.country}
                      onChange={(e) => handleAddressChange(e, 'businessAddress')}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="address-section">
                <h4>Contact Address *</h4>
                <div className="form-group">
                  <label htmlFor="contactStreet">Street Address</label>
                  <input
                    type="text"
                    id="contactStreet"
                    name="street"
                    value={formData.contactAddress.street}
                    onChange={(e) => handleAddressChange(e, 'contactAddress')}
                    required
                    placeholder="Enter street address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactCity">City</label>
                    <input
                      type="text"
                      id="contactCity"
                      name="city"
                      value={formData.contactAddress.city}
                      onChange={(e) => handleAddressChange(e, 'contactAddress')}
                      required
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactState">State</label>
                    <input
                      type="text"
                      id="contactState"
                      name="state"
                      value={formData.contactAddress.state}
                      onChange={(e) => handleAddressChange(e, 'contactAddress')}
                      required
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactPincode">Pincode</label>
                    <input
                      type="text"
                      id="contactPincode"
                      name="pincode"
                      value={formData.contactAddress.pincode}
                      onChange={(e) => handleAddressChange(e, 'contactAddress')}
                      required
                      placeholder="Enter pincode"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactCountry">Country</label>
                    <input
                      type="text"
                      id="contactCountry"
                      name="country"
                      value={formData.contactAddress.country}
                      onChange={(e) => handleAddressChange(e, 'contactAddress')}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={handleBack} className="btn-secondary">
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={handleNext} className="btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;

