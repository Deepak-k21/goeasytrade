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
  gstNo: {
    type: String,
    required: true
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
      required: true
    },
    filename: String,
    path: String,
    uploadedAt: Date
  },
  primaryContactNo: {
    type: String,
    required: true
  },
  secondaryContactNo: {
    type: String
  },
  primaryEmailId: {
    type: String,
    required: true,
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
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Business', businessSchema);

