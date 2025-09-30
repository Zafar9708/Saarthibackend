// const express = require('express');
// const {
//     register,
//     login,
//     continueAsGuest,
//     getMe
// } = require('../controllers/authController');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.post('/guest', continueAsGuest);
// router.get('/me', protect, getMe);

// module.exports = router;

// routes/authRoutes.js
const express = require('express');
const { register, login, continueAsGuest, getMe,getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest', continueAsGuest);
router.get('/me', protect, getMe);
router.get('/all',getAllUsers)

module.exports = router