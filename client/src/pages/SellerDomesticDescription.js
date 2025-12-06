import React, { useState } from 'react';
import './SellerDomesticDescription.css';

const SellerDomesticDescription = () => {
  const initialCropDetail = {
    cropYear: '',
    state: '',
    station: '',
    lotNumber: '',
    warehouse: '',
    nameOfTheLab: '',
    scl: '',
    sl_mm: '',
    mic: '',
    gtex: '',
    rd: '',
    b: '',
    cg: '',
    ur: '',
    sf: '',
    elg: '',
    offerQuantity: '',
    offerPrice: '',
  };

  // This state will hold all crop details, simulating data from multiple users
  const [allCropDetails, setAllCropDetails] = useState([
    // Example of existing data
    {
      cropYear: '2023',
      state: 'TN',
      station: 'Wani',
      lotNumber: '2105',
      warehouse: 'Wani Wart Thiagaraja',
      nameOfTheLab: 'Lab A',
      scl: '12.3',
      sl_mm: '26.45',
      mic: '4.35',
      gtex: '21.2',
      rd: '81.5',
      b: '8.8',
      cg: '31-1',
      ur: '51',
      sf: '11.3',
      elg: '4.2',
      offerQuantity: '100',
      offerPrice: '57500',
    },
  ]);

  // State for the new entry being typed by the current user
  const [newCropDetail, setNewCropDetail] = useState(initialCropDetail);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCropDetail(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new crop detail to the list of all crop details
    setAllCropDetails(prev => [...prev, newCropDetail]);
    // Clear the form for a new entry
    setNewCropDetail(initialCropDetail);
  };

  const columnHeaders = [
    { label: 'Crop Year', name: 'cropYear', type: 'text' },
    { label: 'State', name: 'state', type: 'text' },
    { label: 'Station', name: 'station', type: 'text' },
    { label: 'Lot Number', name: 'lotNumber', type: 'text' },
    { label: 'Warehouse', name: 'warehouse', type: 'text' },
    { label: 'Name of the Lab', name: 'nameOfTheLab', type: 'text' },
    { label: 'SCL', name: 'scl', type: 'text' },
    { label: 'SL(mm)', name: 'sl_mm', type: 'text' },
    { label: 'Mic', name: 'mic', type: 'text' },
    { label: 'Gtex', name: 'gtex', type: 'text' },
    { label: 'Rd', name: 'rd', type: 'text' },
    { label: '+b', name: 'b', type: 'text' },
    { label: 'CG', name: 'cg', type: 'text' },
    { label: 'UR%', name: 'ur', type: 'text' },
    { label: 'SF%', name: 'sf', type: 'text' },
    { label: 'ELG', name: 'elg', type: 'text' },
    { label: 'Offer Quantity', name: 'offerQuantity', type: 'number' },
    { label: 'Offer Price', name: 'offerPrice', type: 'number' },
  ];

  return (
    <div className="seller-domestic-description-container">
      <div className="description-card">
        <h2>Seller Domestic Description</h2>
        <form onSubmit={handleSubmit}>
          <div className="table-responsive">
            <table className="crop-details-table">
              <thead>
                <tr>
                  {columnHeaders.map((header) => (
                    <th key={header.name}>{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allCropDetails.map((detail, rowIndex) => (
                  <tr key={rowIndex} className="existing-data-row">
                    {columnHeaders.map((header) => (
                      <td key={`${rowIndex}-${header.name}`}>{detail[header.name]}</td>
                    ))}
                  </tr>
                ))}
                <tr className="new-entry-row">
                  {columnHeaders.map((header) => (
                    <td key={`new-${header.name}`}>
                      <input
                        type={header.type}
                        name={header.name}
                        value={newCropDetail[header.name]}
                        onChange={handleChange}
                        placeholder={header.label}
                        required
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <button type="submit" className="add-row-button">Add New Crop Detail</button>
        </form>
      </div>
    </div>
  );
};

export default SellerDomesticDescription;
