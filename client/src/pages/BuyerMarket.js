import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './BusinessForm.css';

const BuyerMarket = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidForm, setBidForm] = useState({}); // { [listingId]: { quantity: '', price: '' } }
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/listings');
      setListings(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submitBid = async (id) => {
    try {
      const payload = bidForm[id] || {};
      await axios.post(`/api/listings/${id}/bids`, {
        quantity: Number(payload.quantity),
        price: Number(payload.price)
      });
      setBidForm(prev => ({ ...prev, [id]: { quantity: '', price: '' } }));
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to place bid');
    }
  };

  const setField = (id, key, value) => {
    setBidForm(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: value } }));
  };

  return (
    <div className="business-form-container">
      <div className="business-form-card">
        <div className="form-header">
          <h1 className="form-logo"><span className="highlight-letter">G</span>o<span className="highlight-letter">E</span>asy<span className="highlight-letter">T</span>rade</h1>
          <h2>Buyer Marketplace</h2>
          <button type="button" className="btn-secondary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="form-step">
            {listings.length === 0 && <div className="info-box">No active listings yet.</div>}
            {listings.map(l => (
              <div key={l._id} className="address-section" style={{ marginBottom: 16 }}>
                <h4>Seller Listing</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Crop Year</label>
                    <input readOnly value={l.primaryDetails?.cropYear || ''} />
                  </div>
                  <div className="form-group">
                    <label>Station</label>
                    <input readOnly value={l.primaryDetails?.station || ''} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Lot Number</label>
                    <input readOnly value={l.primaryDetails?.lotNumber || ''} />
                  </div>
                  <div className="form-group">
                    <label>Warehouse</label>
                    <input readOnly value={l.primaryDetails?.warehouse || ''} />
                  </div>
                </div>
                <div className="form-group">
                  <label>States</label>
                  <input readOnly value={(l.primaryDetails?.states || []).join(', ')} />
                </div>

                <h4>HVI Quality</h4>
                <div className="form-row">
                  <div className="form-group"><label>SCI</label><input readOnly value={l.quality?.SCI ?? ''} /></div>
                  <div className="form-group"><label>SL (mm)</label><input readOnly value={l.quality?.SLmm ?? ''} /></div>
                  <div className="form-group"><label>MIC</label><input readOnly value={l.quality?.MIC ?? ''} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>GTEX</label><input readOnly value={l.quality?.GTEX ?? ''} /></div>
                  <div className="form-group"><label>RD</label><input readOnly value={l.quality?.RD ?? ''} /></div>
                  <div className="form-group"><label>+B</label><input readOnly value={l.quality?.BPlus ?? ''} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>CG</label><input readOnly value={l.quality?.CG ?? ''} /></div>
                  <div className="form-group"><label>UR%</label><input readOnly value={l.quality?.URPercent ?? ''} /></div>
                  <div className="form-group"><label>SF%</label><input readOnly value={l.quality?.SFPercent ?? ''} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>ELG</label><input readOnly value={l.quality?.ELG ?? ''} /></div>
                  <div className="form-group"><label>Offer Qty</label><input readOnly value={l.quality?.offerQty ?? ''} /></div>
                  <div className="form-group"><label>Offer Price</label><input readOnly value={l.quality?.offerPrice ?? ''} /></div>
                </div>

                <div className="form-row">
                  <div className="form-group"><label>Incoterms</label><input readOnly value={l.incoterms || ''} /></div>
                  <div className="form-group"><label>Status</label><input readOnly value={l.status || ''} /></div>
                  <div className="form-group"><label>Valid Date To Bid</label><input readOnly value={l.validDateToBid ? new Date(l.validDateToBid).toLocaleDateString() : ''} /></div>
                </div>

                <h4>Place Your Bid</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bid Quantity</label>
                    <input type="number" value={bidForm[l._id]?.quantity || ''} onChange={e=>setField(l._id,'quantity',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Bid Price</label>
                    <input type="number" value={bidForm[l._id]?.price || ''} onChange={e=>setField(l._id,'price',e.target.value)} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-primary" onClick={()=>submitBid(l._id)}>Submit Bid</button>
                </div>

                {l.bids && l.bids.length > 0 && (
                  <div className="address-section" style={{marginTop:16}}>
                    <h4>Current Bids (High to Low)</h4>
                    {l.bids.sort((a,b)=>b.price-a.price).map(b=> (
                      <div key={b._id} className="form-row">
                        <div className="form-group"><label>Qty</label><input readOnly value={b.quantity} /></div>
                        <div className="form-group"><label>Price</label><input readOnly value={b.price} /></div>
                        <div className="form-group"><label>Time</label><input readOnly value={new Date(b.createdAt).toLocaleString()} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerMarket;
