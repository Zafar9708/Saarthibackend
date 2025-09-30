
// const jwt = require('jsonwebtoken');

// const generateToken = (userId, role = 'user') => {
//   return jwt.sign(
//     { 
//       userId, 
//       role 
//     },
//     process.env.JWT_SECRET || 'your-secret-key',
//     {
//       expiresIn: '30d',
//     }
//   );
// };

// module.exports = { generateToken };

// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { 
      userId, 
      role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: '30d',
    }
  );
};

module.exports = { generateToken };