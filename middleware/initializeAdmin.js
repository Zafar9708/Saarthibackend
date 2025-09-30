// // middleware/initializeAdmin.js
// const User = require('../models/User');

// const initializeAdmin = async () => {
//   try {
//     const adminExists = await User.findOne({ role: 'admin' });
    
//     if (!adminExists) {
//       // Create default admin user
//       const adminUser = await User.create({
//         name: 'System Administrator',
//         email: 'admin@saarthi.com',
//         password: 'admin123', 
//         role: 'admin'
//       });
      
//       console.log('✅ Admin user created successfully:', adminUser.email);
//     } else {
//       console.log('ℹ️  Admin user already exists');
//     }
//   } catch (error) {
//     console.error('❌ Admin initialization error:', error);
//   }
// };

// module.exports = initializeAdmin;


// controllers/adminController.js
