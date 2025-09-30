// routes/doctorRoutes.js
const express = require('express');
const { 
  getDoctors, 
  getDoctor, 
  updateProfile, 
  getMyProfile 
} = require('../controllers/doctorController');
const { protect, doctor } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctor);

// Protected doctor routes
router.get('/profile/me', protect, doctor, getMyProfile);
router.put('/profile', protect, doctor, updateProfile);

module.exports = router;