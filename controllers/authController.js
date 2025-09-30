


// const User = require('../models/User');
// const { generateToken } = require('../utils/generateToken');

// const register = async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // Prevent admin registration through normal registration
//         if (role === 'admin') {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Admin registration not allowed through this endpoint'
//             });
//         }

//         // Check if user exists
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'User already exists with this email'
//             });
//         }

//         // Create user
//         const user = await User.create({
//             name,
//             email,
//             password,
//             role: role || 'user' // Default to 'user' role
//         });

//         if (user) {
//             const token = generateToken(user._id, user.role);
            
//             res.status(201).json({
//                 success: true,
//                 message: 'User registered successfully',
//                 data: {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                     token
//                 }
//             });
//         }
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error during registration'
//         });
//     }
// };

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Check for user
//         const user = await User.findOne({ email }).select('+password');
        
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials'
//             });
//         }

//         // Check password
//         const isPasswordMatch = await user.matchPassword(password);
        
//         if (!isPasswordMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Invalid credentials'
//             });
//         }

//         // Generate token with role information
//         const token = generateToken(user._id, user.role);

//         res.json({
//             success: true,
//             message: user.role === 'admin' ? 'Admin login successful' : 'Login successful',
//             data: {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 profileCompleted: user.profileCompleted,
//                 isGuest: user.isGuest,
//                 token
//             }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error during login'
//         });
//     }
// };

// const continueAsGuest = async (req, res) => {
//     try {
//         // Create a guest user with temporary data
//         const guestUser = await User.create({
//             name: 'Guest User',
//             email: `guest_${Date.now()}@saarthi.com`,
//             password: Math.random().toString(36).slice(-8),
//             isGuest: true,
//             role: 'user' // Guests are always regular users
//         });

//         const token = generateToken(guestUser._id, 'user');

//         res.status(201).json({
//             success: true,
//             message: 'Guest session created',
//             data: {
//                 _id: guestUser._id,
//                 name: guestUser.name,
//                 email: guestUser.email,
//                 isGuest: true,
//                 role: 'user',
//                 token
//             }
//         });
//     } catch (error) {
//         console.error('Guest creation error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error creating guest session'
//         });
//     }
// };

// const getMe = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id);
        
//         res.json({
//             success: true,
//             data: user
//         });
//     } catch (error) {
//         console.error('Get user error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server error fetching user data'
//         });
//     }
// };

// module.exports = {
//     register,
//     login,
//     continueAsGuest,
//     getMe
// };


// controllers/authController.js
const User = require('../models/User');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const { generateToken } = require('../utils/generateToken');

// Register - Only for Users
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists in any collection
        const userExists = await User.findOne({ email });
        const adminExists = await Admin.findOne({ email });
        const doctorExists = await Doctor.findOne({ email });

        if (userExists || adminExists || doctorExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user (only regular users can register)
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            const token = generateToken(user._id, 'user');
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: 'user',
                    token
                }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// Login - For all roles (User, Admin, Doctor)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check in all collections simultaneously
        const [userFromUser, userFromDoctor, userFromAdmin] = await Promise.all([
            User.findOne({ email }).select('+password'),
            Doctor.findOne({ email }).select('+password'),
            Admin.findOne({ email }).select('+password')
        ]);

        let user = null;
        let role = '';

        // Determine which user exists and their role
        if (userFromAdmin) {
            user = userFromAdmin;
            role = 'admin';
        } else if (userFromDoctor) {
            user = userFromDoctor;
            role = 'doctor';
        } else if (userFromUser) {
            user = userFromUser;
            role = 'user';
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordMatch = await user.matchPassword(password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token with role information
        const token = generateToken(user._id, role);

        // Base response data
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: role,
            token
        };

        // Add role-specific data
        if (role === 'doctor') {
            responseData.specialization = user.specialization;
            responseData.qualifications = user.qualifications;
            responseData.experience = user.experience;
            responseData.hospital = user.hospital;
            responseData.isVerified = user.isVerified;
            responseData.consultationFee = user.consultationFee;
        } else if (role === 'admin') {
            responseData.permissions = user.permissions;
            responseData.isActive = user.isActive;
        } else if (role === 'user') {
            responseData.isGuest = user.isGuest;
            responseData.profileCompleted = user.profileCompleted;
        }

        // Role-based login messages
        let loginMessage = 'Login successful';
        if (role === 'admin') {
            loginMessage = 'Admin login successful';
        } else if (role === 'doctor') {
            loginMessage = user.isVerified ? 'Doctor login successful' : 'Doctor login successful - Account pending verification';
        }

        res.json({
            success: true,
            message: loginMessage,
            data: responseData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

const continueAsGuest = async (req, res) => {
    try {
        // Create a guest user with temporary data
        const guestUser = await User.create({
            name: 'Guest User',
            email: `guest_${Date.now()}@saarthi.com`,
            password: Math.random().toString(36).slice(-8),
            isGuest: true
        });

        const token = generateToken(guestUser._id, 'user');

        res.status(201).json({
            success: true,
            message: 'Guest session created',
            data: {
                _id: guestUser._id,
                name: guestUser.name,
                email: guestUser.email,
                isGuest: true,
                role: 'user',
                token
            }
        });
    } catch (error) {
        console.error('Guest creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating guest session'
        });
    }
};

const getMe = async (req, res) => {
    try {
        let user = null;

        // Find user based on role from token
        if (req.user.role === 'user') {
            user = await User.findById(req.user._id);
        } else if (req.user.role === 'doctor') {
            user = await Doctor.findById(req.user._id);
        } else if (req.user.role === 'admin') {
            user = await Admin.findById(req.user._id);
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching user data'
        });
    }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "All users fetched successfully",
      data: users, // return the user list
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
    register,
    login,
    continueAsGuest,
    getMe,
    getAllUsers
};