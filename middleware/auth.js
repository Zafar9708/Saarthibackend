
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(' ')[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

//       // Get user from the token
//       req.user = await User.findById(decoded.userId).select('-password');

//       next();
//     } catch (error) {
//       console.error('Token verification error:', error);
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized, token failed'
//       });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized, no token'
//     });
//   }
// };

// const admin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     return res.status(403).json({
//       success: false,
//       message: 'Not authorized as admin'
//     });
//   }
// };

// module.exports = { protect, admin };


// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from the appropriate collection based on role
      let user = null;
      if (decoded.role === 'user') {
        user = await User.findById(decoded.userId).select('-password');
      } else if (decoded.role === 'doctor') {
        user = await Doctor.findById(decoded.userId).select('-password');
      } else if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.userId).select('-password');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = {
        _id: user._id,
        role: decoded.role,
        ...user.toObject()
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

const doctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as doctor'
    });
  }
};

const user = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as user'
    });
  }
};

module.exports = { protect, admin, doctor, user };