const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Business = require('../models/Business');
const User = require('../models/User');
const uploadsDir = require('../utils/createUploadsDir');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Upload business information
router.post('/submit', auth, upload.fields([
  { name: 'certificateOfIncorporation', maxCount: 1 },
  { name: 'companyPanCard', maxCount: 1 },
  { name: 'msmeRegistration', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      gstNo,
      msmeType,
      primaryContactNo,
      secondaryContactNo,
      primaryEmailId,
      secondaryEmailId,
      businessAddress,
      contactAddress
    } = req.body;

    // Parse addresses
    const businessAddr = typeof businessAddress === 'string' 
      ? JSON.parse(businessAddress) 
      : businessAddress;
    const contactAddr = typeof contactAddress === 'string' 
      ? JSON.parse(contactAddress) 
      : contactAddress;

    const businessData = {
      userId: req.user._id,
      gstNo,
      msmeRegistration: {
        type: msmeType
      },
      primaryContactNo,
      secondaryContactNo,
      primaryEmailId,
      secondaryEmailId,
      businessAddress: businessAddr,
      contactAddress: contactAddr,
      status: 'completed'
    };

    // Handle file uploads
    if (req.files.certificateOfIncorporation) {
      businessData.certificateOfIncorporation = {
        filename: req.files.certificateOfIncorporation[0].originalname,
        path: req.files.certificateOfIncorporation[0].path,
        uploadedAt: new Date()
      };
    }

    if (req.files.companyPanCard) {
      businessData.companyPanCard = {
        filename: req.files.companyPanCard[0].originalname,
        path: req.files.companyPanCard[0].path,
        uploadedAt: new Date()
      };
    }

    if (req.files.msmeRegistration) {
      businessData.msmeRegistration.filename = req.files.msmeRegistration[0].originalname;
      businessData.msmeRegistration.path = req.files.msmeRegistration[0].path;
      businessData.msmeRegistration.uploadedAt = new Date();
    }

    let business = await Business.findOne({ userId: req.user._id });

    if (business) {
      business = await Business.findByIdAndUpdate(business._id, businessData, { new: true });
    } else {
      business = await Business.create(businessData);
      await User.findByIdAndUpdate(req.user._id, { businessInfo: business._id });
    }

    res.json({ message: 'Business information submitted successfully', business });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get business information
router.get('/info', auth, async (req, res) => {
  try {
    const business = await Business.findOne({ userId: req.user._id });
    if (!business) {
      return res.status(404).json({ message: 'Business information not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

