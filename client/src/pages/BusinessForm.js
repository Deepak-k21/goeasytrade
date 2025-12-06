import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BusinessForm.css';

const BusinessForm = () => {
  const navigate = useNavigate();
  // Removed currentStep state and related logic
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkExisting = async () => {
      try {
        const res = await axios.get('/api/business/info');
        const b = res.data;
        if (b?.gstFile?.path && b?.cancelCheque?.path) {
          // Optionally navigate to a success page or role page if all documents are already uploaded
          // navigate('/role'); 
        }
      } catch (_) { /* ignore error, means no existing info */ }
    };
    checkExisting();
  }, [navigate]);

  const [formData, setFormData] = useState({
    certificateOfIncorporation: null,
    gstFile: null,
    companyPanCard: null,
    msmeType: 'MSME',
    msmeRegistration: null,
    cancelCheque: null,
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

  const validateForm = () => {
    // Basic validation for required files for HVI
    if (!formData.gstFile) {
      setError('Please upload GST File (PDF)');
      return false;
    }
    if (!formData.cancelCheque) {
      setError('Please upload Cancel Cheque (PDF)');
      return false;
    }
    // Add more validation for address fields if they are also required
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      if (formData.certificateOfIncorporation) submitData.append('certificateOfIncorporation', formData.certificateOfIncorporation);
      if (formData.companyPanCard) submitData.append('companyPanCard', formData.companyPanCard);
      if (formData.msmeRegistration) submitData.append('msmeRegistration', formData.msmeRegistration);
      if (formData.gstFile) submitData.append('gstFile', formData.gstFile);
      if (formData.cancelCheque) submitData.append('cancelCheque', formData.cancelCheque);
      submitData.append('msmeType', formData.msmeType);
      
      // Append contact and address details
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

      navigate('/confirmation'); // Navigate to a confirmation page or similar
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
          <h1 className="form-logo">
            <span className="highlight-letter">G</span>o
            <span className="highlight-letter">E</span>asy
            <span className="highlight-letter">T</span>rade
          </h1>
          <h2>Seller-Domestic-HVI Uploads & Details</h2>
          {/* Removed Progress Bar */}
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Document Uploads */}
          <div className="form-section-group">
            <h3>Upload Required Documents</h3>

            <div className="file-upload-group">
              <div className="form-row-inline-file">
                <label>Certificate of Incorporation (PDF) (Optional)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'certificateOfIncorporation')}
                  />
                  <span className="file-name">
                    {formData.certificateOfIncorporation 
                      ? formData.certificateOfIncorporation.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>
            </div>

            <div className="file-upload-group">
              <div className="form-row-inline-file">
                <label>GST File (PDF) *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'gstFile')}
                    required
                  />
                  <span className="file-name">
                    {formData.gstFile 
                      ? formData.gstFile.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>
            </div>

            <div className="file-upload-group">
              <div className="form-row-inline-file">
                <label>Company PAN Card (PDF) (Optional)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'companyPanCard')}
                  />
                  <span className="file-name">
                    {formData.companyPanCard 
                      ? formData.companyPanCard.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="msmeType">MSME Registration Type (Optional)</label>
              <select
                id="msmeType"
                name="msmeType"
                value={formData.msmeType}
                onChange={handleInputChange}
              >
                <option value="MSME">MSME Registration</option>
                <option value="Non-MSME">MSME Declaration (Non-MSME)</option>
              </select>
            </div>

            <div className="file-upload-group">
              <div className="form-row-inline-file">
                <label>MSME Registration/Declaration (PDF) (Optional)</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'msmeRegistration')}
                  />
                  <span className="file-name">
                    {formData.msmeRegistration 
                      ? formData.msmeRegistration.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>
            </div>

            <div className="file-upload-group">
              <div className="form-row-inline-file">
                <label>Cancel Cheque (PDF) *</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'cancelCheque')}
                    required
                  />
                  <span className="file-name">
                    {formData.cancelCheque 
                      ? formData.cancelCheque.name 
                      : 'Choose file'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information (Optional) - now part of the same form for HVI */}
          <div className="form-section-group">
            <h3>Contact Information (Optional)</h3>
            <div className="form-group">
              <label htmlFor="primaryContactNo">Primary Contact No</label>
              <input
                type="tel"
                id="primaryContactNo"
                name="primaryContactNo"
                value={formData.primaryContactNo}
                onChange={handleInputChange}
                placeholder="Enter primary contact number (optional)"
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
              <label htmlFor="primaryEmailId">Primary Email ID</label>
              <input
                type="email"
                id="primaryEmailId"
                name="primaryEmailId"
                value={formData.primaryEmailId}
                onChange={handleInputChange}
                placeholder="Enter primary email address (optional)"
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

          {/* Address Information (Optional) - now part of the same form for HVI */}
          <div className="form-section-group">
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
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions-full">
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit All Information'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;

