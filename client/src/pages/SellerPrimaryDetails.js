import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './BusinessForm.css';

const statesList = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
];

const SellerPrimaryDetails = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    cropYear: '',
    states: [],
    station: '',
    lotNumber: '',
    warehouse: '',
    labourName: '',
    quality: {
      SCI: '', SLmm: '', MIC: '', GTEX: '', RD: '', BPlus: '', CG: '', URPercent: '', SFPercent: '', ELG: '', offerQty: '', offerPrice: ''
    },
    incoterms: '',
    payment: { EMD: '', finalPayment: '', paymentDueDate: '' },
    status: 'Submit',
    validDateToBid: ''
  });

  const toggleState = (name) => {
    setForm(prev => ({
      ...prev,
      states: prev.states.includes(name) ? prev.states.filter(s => s !== name) : [...prev.states, name]
    }));
  };

  const handleQualityChange = (key, value) => {
    setForm(prev => ({ ...prev, quality: { ...prev.quality, [key]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        primaryDetails: {
          cropYear: form.cropYear,
          states: form.states,
          station: form.station,
          lotNumber: form.lotNumber,
          warehouse: form.warehouse,
          labourName: form.labourName
        },
        quality: {
          SCI: num(form.quality.SCI),
          SLmm: num(form.quality.SLmm),
          MIC: num(form.quality.MIC),
          GTEX: num(form.quality.GTEX),
          RD: num(form.quality.RD),
          BPlus: num(form.quality.BPlus),
          CG: num(form.quality.CG),
          URPercent: num(form.quality.URPercent),
          SFPercent: num(form.quality.SFPercent),
          ELG: num(form.quality.ELG),
          offerQty: num(form.quality.offerQty),
          offerPrice: num(form.quality.offerPrice)
        },
        incoterms: form.incoterms || undefined,
        payment: {
          EMD: num(form.payment.EMD),
          finalPayment: num(form.payment.finalPayment),
          paymentDueDate: form.payment.paymentDueDate ? new Date(form.payment.paymentDueDate) : undefined
        },
        status: form.status || 'Submit',
        validDateToBid: form.validDateToBid ? new Date(form.validDateToBid) : undefined
      };
      await axios.post('/api/listings', payload);
      navigate('/confirmation');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save listing.');
    } finally {
      setLoading(false);
    }
  };

  const num = (v) => (v === '' ? undefined : Number(v));

  return (
    <div className="business-form-container">
      <div className="business-form-card">
        <div className="form-header">
          <h1 className="form-logo"><span className="highlight-letter">G</span>o<span className="highlight-letter">E</span>asy<span className="highlight-letter">T</span>rade</h1>
          <h2>Seller - Primary Details</h2>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-step">
            <div className="address-section">
              <h4>Basic</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Crop Year</label>
                  <select value={form.cropYear} onChange={e=>setForm(p=>({...p,cropYear:e.target.value}))}>
                    <option value="">Select Year</option>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={`${year}-${String(year+1).slice(2)}`}>{`${year}-${String(year+1).slice(2)}`}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Station</label>
                  <input type="text" value={form.station} onChange={e=>setForm(p=>({...p,station:e.target.value}))} placeholder="Station"/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Lot Number</label>
                  <input type="text" value={form.lotNumber} onChange={e=>setForm(p=>({...p,lotNumber:e.target.value}))} placeholder="Lot number"/>
                </div>
                <div className="form-group">
                  <label>Warehouse</label>
                  <input type="text" value={form.warehouse} onChange={e=>setForm(p=>({...p,warehouse:e.target.value}))} placeholder="Warehouse"/>
                </div>
              </div>
              <div className="form-group">
                <label>Name of the Labour</label>
                <input type="text" value={form.labourName} onChange={e=>setForm(p=>({...p,labourName:e.target.value}))} placeholder="Labour name"/>
              </div>
            </div>

            <div className="address-section">
              <h4>State</h4>
              <select value={form.states[0] || ''} onChange={e=>setForm(p=>({...p,states:[e.target.value]}))}>
                <option value="">Select State</option>
                {statesList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="address-section">
              <h4>HVI Quality Parameters</h4>
              <div className="form-row">
                <div className="form-group"><label>SCI</label>
                  <select value={form.quality.SCI} onChange={e=>handleQualityChange('SCI',e.target.value)}>
                    <option value="">Select SCI</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                  </select>
                </div>
                <div className="form-group"><label>SL (mm)</label>
                  <select value={form.quality.SLmm} onChange={e=>handleQualityChange('SLmm',e.target.value)}>
                    <option value="">Select SL (mm)</option>
                    <option value="28.0">28.0</option>
                    <option value="29.0">29.0</option>
                    <option value="30.0">30.0</option>
                    <option value="31.0">31.0</option>
                    <option value="32.0">32.0</option>
                  </select>
                </div>
                <div className="form-group"><label>MIC</label>
                  <select value={form.quality.MIC} onChange={e=>handleQualityChange('MIC',e.target.value)}>
                    <option value="">Select MIC</option>
                    <option value="3.5">3.5</option>
                    <option value="3.8">3.8</option>
                    <option value="4.0">4.0</option>
                    <option value="4.2">4.2</option>
                    <option value="4.5">4.5</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>GTEX</label>
                  <select value={form.quality.GTEX} onChange={e=>handleQualityChange('GTEX',e.target.value)}>
                    <option value="">Select GTEX</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                  </select>
                </div>
                <div className="form-group"><label>RD</label>
                  <select value={form.quality.RD} onChange={e=>handleQualityChange('RD',e.target.value)}>
                    <option value="">Select RD</option>
                    <option value="65">65</option>
                    <option value="70">70</option>
                    <option value="75">75</option>
                    <option value="80">80</option>
                    <option value="85">85</option>
                  </select>
                </div>
                <div className="form-group"><label>+B</label>
                  <select value={form.quality.BPlus} onChange={e=>handleQualityChange('BPlus',e.target.value)}>
                    <option value="">Select +B</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>CG</label>
                  <select value={form.quality.CG} onChange={e=>handleQualityChange('CG',e.target.value)}>
                    <option value="">Select CG</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="form-group"><label>UR%</label>
                  <select value={form.quality.URPercent} onChange={e=>handleQualityChange('URPercent',e.target.value)}>
                    <option value="">Select UR%</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
                <div className="form-group"><label>SF%</label>
                  <select value={form.quality.SFPercent} onChange={e=>handleQualityChange('SFPercent',e.target.value)}>
                    <option value="">Select SF%</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>ELG</label>
                  <select value={form.quality.ELG} onChange={e=>handleQualityChange('ELG',e.target.value)}>
                    <option value="">Select ELG</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="form-group"><label>Offer Qty</label><input type="number" value={form.quality.offerQty} onChange={e=>handleQualityChange('offerQty',e.target.value)} /></div>
                <div className="form-group"><label>Offer Price</label><input type="number" value={form.quality.offerPrice} onChange={e=>handleQualityChange('offerPrice',e.target.value)} /></div>
              </div>
            </div>

            <div className="address-section">
              <h4>Incoterms</h4>
              <select value={form.incoterms} onChange={e=>setForm(p=>({...p,incoterms:e.target.value}))}>
                <option value="">Select Incoterm</option>
                <option value="FOR">FOR</option>
                <option value="Ex.Whs">Ex.Whs</option>
                <option value="Ex-works">Ex-works</option>
                <option value="CIF">CIF</option>
                <option value="CFR">CFR</option>
                <option value="FOB">FOB</option>
              </select>
            </div>

            <div className="address-section">
              <h4>Payment</h4>
              <div className="form-row">
                <div className="form-group"><label>EMD</label><input type="number" value={form.payment.EMD} onChange={e=>setForm(p=>({...p,payment:{...p.payment,EMD:e.target.value}}))} /></div>
                <div className="form-group"><label>Final PYMT</label><input type="number" value={form.payment.finalPayment} onChange={e=>setForm(p=>({...p,payment:{...p.payment,finalPayment:e.target.value}}))} /></div>
                <div className="form-group"><label>Payment Due Date</label><input type="date" value={form.payment.paymentDueDate} onChange={e=>setForm(p=>({...p,payment:{...p.payment,paymentDueDate:e.target.value}}))} /></div>
              </div>
            </div>

            <div className="address-section">
              <h4>Status</h4>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                <option value="">Select Status</option>
                <option value="Submit">Submit</option>
                <option value="Hold">Hold</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>

            <div className="address-section">
              <h4>Valid Date To Bid</h4>
              <input type="date" value={form.validDateToBid} onChange={e=>setForm(p=>({...p,validDateToBid:e.target.value}))} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={()=>navigate('/role')}>Back</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
            <button type="button" className="btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerPrimaryDetails;
