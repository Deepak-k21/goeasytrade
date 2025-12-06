const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const listingSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  primaryDetails: {
    cropYear: String,
    states: [String],
    station: String,
    lotNumber: String,
    warehouse: String,
    labourName: String
  },
  quality: {
    SCI: Number,
    SLmm: Number,
    MIC: Number,
    GTEX: Number,
    RD: Number,
    BPlus: Number,
    CG: Number,
    URPercent: Number,
    SFPercent: Number,
    ELG: Number,
    offerQty: Number,
    offerPrice: Number
  },
  incoterms: { type: String, enum: ['FOR','Ex.Whs','Ex-works','CIF','CFR','FOB'] },
  payment: {
    EMD: Number,
    finalPayment: Number,
    paymentDueDate: Date
  },
  status: { type: String, enum: ['Submit','Hold','Cancel'], default: 'Submit' },
  validDateToBid: Date,
  bids: [bidSchema]
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
