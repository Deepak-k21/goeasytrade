const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  certificateOfIncorporation: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  gstFile: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  companyPanCard: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  msmeRegistration: {
    type: {
      type: String,
      enum: ['MSME', 'Non-MSME'],
      required: false
    },
    filename: String,
    path: String,
    uploadedAt: Date
  },
  cancelCheque: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  primaryContactNo: {
    type: String,
    required: false
  },
  secondaryContactNo: {
    type: String
  },
  primaryEmailId: {
    type: String,
    required: false,
    lowercase: true
  },
  secondaryEmailId: {
    type: String,
    lowercase: true
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  contactAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  role: {
    type: String,
    enum: ['seller', 'buyer'],
  },
  sellerInfo: {
    millTypes: [{ type: String, enum: ['weaving', 'Hosiery', 'OE', 'other'] }],
    millConsumptionPerDay: {
      cotton: { type: Number, default: 0 },
      polyester: { type: Number, default: 0 },
      viscose: { type: Number, default: 0 },
      others: { type: Number, default: 0 }
    },
    cottonOrigin: { type: String, enum: ['domestic', 'import', 'both'] },
    yarnCountPattern: [{ type: String, enum: ['<30', '40-60', '>80'] }],
    spindlesOrOeMachines: { type: Number }
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Business', businessSchema);

