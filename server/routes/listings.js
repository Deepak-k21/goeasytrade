const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Business = require('../models/Business');

// Create a listing
router.post('/', auth, async (req, res) => {
  try {
    const sellerId = req.user._id;
    const data = req.body;
    const listing = await Listing.create({ sellerId, ...data });
    res.json({ message: 'Listing created', listing });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get all listings (for buyers)
router.get('/', auth, async (_req, res) => {
  try {
    const listings = await Listing.find({ status: { $ne: 'Cancel' } })
      .populate({
        path: 'sellerId',
        select: 'name email businessInfo',
        populate: {
          path: 'businessInfo',
          model: 'Business',
          select: 'primaryContactNo primaryEmailId businessAddress role sellerInfo'
        }
      })
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get single listing with bids sorted high->low
router.get('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: 'sellerId',
        select: 'name email businessInfo',
        populate: {
          path: 'businessInfo',
          model: 'Business',
          select: 'primaryContactNo primaryEmailId businessAddress role sellerInfo'
        }
      });
    if (!listing) return res.status(404).json({ message: 'Not found' });
    listing.bids = listing.bids.sort((a, b) => b.price - a.price);
    res.json(listing);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Place a bid on a listing
router.post('/:id/bids', auth, async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    listing.bids.push({ userId: req.user._id, quantity: Number(quantity), price: Number(price) });
    await listing.save();
    listing.bids = listing.bids.sort((a, b) => b.price - a.price);
    res.json({ message: 'Bid placed', listing });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
