import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BusinessForm.css';

const RoleDetails = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('seller');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sellerInfo, setSellerInfo] = useState({
    millTypes: [],
    millConsumptionPerDay: { cotton: '', polyester: '', viscose: '', others: '' },
    cottonOrigin: '',
    yarnCountPattern: [],
    spindlesOrOeMachines: ''
  });

  const toggleArrayValue = (arr, value) => {
    if (arr.includes(value)) return arr.filter(v => v !== value);
    return [...arr, value];
  };

  const validate = () => {
    if (!role) {
      setError('Please select Seller or Buyer');
      return false;
    }
    if (role === 'seller') {
      const { millConsumptionPerDay, spindlesOrOeMachines } = sellerInfo;
      const nums = [millConsumptionPerDay.cotton, millConsumptionPerDay.polyester, millConsumptionPerDay.viscose, millConsumptionPerDay.others]
        .filter(v => v !== '');
      const allNumeric = nums.every(v => /^\d+(\.\d+)?$/.test(String(v)));
      if (!allNumeric) {
        setError('Please enter numeric values for mill consumption fields');
        return false;
      }
      if (spindlesOrOeMachines !== '' && !/^\d+$/.test(String(spindlesOrOeMachines))) {
        setError('Please enter a numeric value for number of spindles/OE machines');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let payload = { role };
      if (role === 'seller') {
        const si = { ...sellerInfo };
        si.millConsumptionPerDay = {
          cotton: si.millConsumptionPerDay.cotton === '' ? 0 : Number(si.millConsumptionPerDay.cotton),
          polyester: si.millConsumptionPerDay.polyester === '' ? 0 : Number(si.millConsumptionPerDay.polyester),
          viscose: si.millConsumptionPerDay.viscose === '' ? 0 : Number(si.millConsumptionPerDay.viscose),
          others: si.millConsumptionPerDay.others === '' ? 0 : Number(si.millConsumptionPerDay.others)
        };
        si.spindlesOrOeMachines = si.spindlesOrOeMachines === '' ? undefined : Number(si.spindlesOrOeMachines);
        payload.sellerInfo = si;
      }

      await axios.post('/api/business/role', payload);
      if (role === 'seller') {
        navigate('/seller/primary');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save role details. Please try again.');
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
          <h2>Choose your role</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-step">
            <div className="role-switch" style={{ marginBottom: 20 }}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === 'seller'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Seller
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={(e) => setRole(e.target.value)}
                />
                Buyer
              </label>
            </div>

            {role === 'buyer' && (
              <div className="info-box">You selected Buyer. Continue to view available listings and place bids.</div>
            )}

            {role === 'seller' && (
              <>
                <div className="address-section">
                  <h4>Mill Types</h4>
                  <p className="helper" style={{marginTop:-10, color:'#666'}}>Select all applicable types.</p>
                  <div className="checkbox-group" style={{marginTop:10}}>
                    {['weaving','Hosiery','OE','other'].map(mt => (
                      <label key={mt} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={sellerInfo.millTypes.includes(mt)}
                          onChange={() => setSellerInfo(prev => ({
                            ...prev,
                            millTypes: toggleArrayValue(prev.millTypes, mt)
                          }))}
                        /> {mt}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="address-section">
                  <h4>Mill Consumption Per Day</h4>
                  <p className="helper" style={{marginTop:-10, color:'#666'}}>Enter numeric values (per day).</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="consCotton">Cotton</label>
                      <input id="consCotton" type="number" min="0" value={sellerInfo.millConsumptionPerDay.cotton}
                        onChange={(e)=> setSellerInfo(prev=> ({...prev, millConsumptionPerDay: { ...prev.millConsumptionPerDay, cotton: e.target.value }}))} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="consPoly">Polyester</label>
                      <input id="consPoly" type="number" min="0" value={sellerInfo.millConsumptionPerDay.polyester}
                        onChange={(e)=> setSellerInfo(prev=> ({...prev, millConsumptionPerDay: { ...prev.millConsumptionPerDay, polyester: e.target.value }}))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="consViscose">Viscose</label>
                      <input id="consViscose" type="number" min="0" value={sellerInfo.millConsumptionPerDay.viscose}
                        onChange={(e)=> setSellerInfo(prev=> ({...prev, millConsumptionPerDay: { ...prev.millConsumptionPerDay, viscose: e.target.value }}))} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="consOthers">Others</label>
                      <input id="consOthers" type="number" min="0" value={sellerInfo.millConsumptionPerDay.others}
                        onChange={(e)=> setSellerInfo(prev=> ({...prev, millConsumptionPerDay: { ...prev.millConsumptionPerDay, others: e.target.value }}))} />
                    </div>
                  </div>
                </div>

                <div className="address-section">
                  <h4>Cotton Origin</h4>
                  <div className="radio-group">
                    {['domestic','import','both'].map(o => (
                      <label key={o} className="radio-item">
                        <input type="radio" name="cottonOrigin" value={o}
                          checked={sellerInfo.cottonOrigin === o}
                          onChange={(e)=> setSellerInfo(prev=> ({...prev, cottonOrigin: e.target.value }))} /> {o}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="address-section">
                  <h4>Yarn Count Pattern</h4>
                  <div className="checkbox-group">
                    {['<30','40-60','>80'].map(yc => (
                      <label key={yc} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={sellerInfo.yarnCountPattern.includes(yc)}
                          onChange={() => setSellerInfo(prev => ({
                            ...prev,
                            yarnCountPattern: toggleArrayValue(prev.yarnCountPattern, yc)
                          }))}
                        /> {yc}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="address-section">
                  <h4>Capacity</h4>
                  <label htmlFor="spindles">Number of Spindles/OE machine</label>
                  <input id="spindles" type="number" min="0" value={sellerInfo.spindlesOrOeMachines}
                    onChange={(e)=> setSellerInfo(prev=> ({...prev, spindlesOrOeMachines: e.target.value }))} />
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={()=> navigate('/business-form')}>Back</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Continue'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleDetails;
