



// const express = require('express');
// const { 
//   initializeAdmin,
//   getAdmins,
//   getAdmin,
//   updateAdmin,
//   deleteAdmin,
//   createAdmin
// } = require('../controllers/adminController');
// const { protect, admin } = require('../middleware/auth');

// const router = express.Router();

// router.post('/init', initializeAdmin);

// router.route('/')
//   .get(protect, admin, getAdmins)
//   .post(protect, admin, createAdmin);

// router.route('/:id')
//   .get(protect, admin, getAdmin)
//   .put(protect, admin, updateAdmin)
//   .delete(protect, admin, deleteAdmin);

// module.exports = router;

// routes/adminRoutes.js
const express = require('express');
const { 
  initializeAdmin,
  createDoctor,
  getDoctors,
  getSpecializations,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  verifyDoctor
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public route for initial admin setup
router.post('/init', initializeAdmin);

// Protected admin routes
router.post('/doctors', protect, admin, createDoctor);
router.get('/doctors',  getDoctors);
router.get('/specializations', getSpecializations);

router.get('/:id', getDoctorById);

router.put('/doctors/:id', protect, admin, updateDoctor);
router.delete('/doctors/:id', protect, admin, deleteDoctor);
router.patch('/doctors/:id/verify', protect, admin, verifyDoctor);

module.exports = router;