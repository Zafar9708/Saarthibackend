// const User = require('../models/User');
// const { generateToken } = require('../utils/generateToken');

// // @desc    Initialize admin user (One-time setup)
// // @route   POST /api/admin/init
// // @access  Public (Should be disabled after first use)
// const initializeAdmin = async (req, res) => {
//   try {
//     // Check if admin already exists
//     const adminExists = await User.findOne({ role: 'admin' });
    
//     if (adminExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'Admin user already exists. Use login instead.'
//       });
//     }

//     const { name, email, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide name, email and password'
//       });
//     }

//     // Create admin user
//     const adminUser = await User.create({
//       name,
//       email,
//       password,
//       role: 'admin'
//     });

//     const token = generateToken(adminUser._id, 'admin');

//     res.status(201).json({
//       success: true,
//       message: 'Admin user created successfully',
//       data: {
//         _id: adminUser._id,
//         name: adminUser.name,
//         email: adminUser.email,
//         role: adminUser.role,
//         token
//       }
//     });

//   } catch (error) {
//     console.error('Admin initialization error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during admin initialization'
//     });
//   }
// };

// // @desc    Get all admins
// // @route   GET /api/admin
// // @access  Private (Admin only)
// const getAdmins = async (req, res) => {
//   try {
//     const admins = await User.find({ role: 'admin' }).select('-password');
    
//     res.json({
//       success: true,
//       count: admins.length,
//       data: admins
//     });
//   } catch (error) {
//     console.error('Get admins error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching admins'
//     });
//   }
// };

// // @desc    Get single admin
// // @route   GET /api/admin/:id
// // @access  Private (Admin only)
// const getAdmin = async (req, res) => {
//   try {
//     const admin = await User.findOne({ 
//       _id: req.params.id, 
//       role: 'admin' 
//     }).select('-password');

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: 'Admin not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: admin
//     });
//   } catch (error) {
//     console.error('Get admin error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching admin'
//     });
//   }
// };

// // @desc    Update admin
// // @route   PUT /api/admin/:id
// // @access  Private (Admin only)
// const updateAdmin = async (req, res) => {
//   try {
//     const { name, email } = req.body;
    
//     // Find admin and update
//     const admin = await User.findOneAndUpdate(
//       { _id: req.params.id, role: 'admin' },
//       { 
//         $set: { 
//           name, 
//           email 
//         } 
//       },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: 'Admin not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Admin updated successfully',
//       data: admin
//     });
//   } catch (error) {
//     console.error('Update admin error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error updating admin'
//     });
//   }
// };

// // @desc    Delete admin (Cannot delete last admin)
// // @route   DELETE /api/admin/:id
// // @access  Private (Admin only)
// const deleteAdmin = async (req, res) => {
//   try {
//     // Check if this is the last admin
//     const adminCount = await User.countDocuments({ role: 'admin' });
    
//     if (adminCount <= 1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot delete the last admin user'
//       });
//     }

//     const admin = await User.findOneAndDelete({ 
//       _id: req.params.id, 
//       role: 'admin' 
//     });

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: 'Admin not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Admin deleted successfully',
//       data: {}
//     });
//   } catch (error) {
//     console.error('Delete admin error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error deleting admin'
//     });
//   }
// };

// // @desc    Create additional admin (by existing admin)
// // @route   POST /api/admin
// // @access  Private (Admin only)
// const createAdmin = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user already exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // Create new admin
//     const adminUser = await User.create({
//       name,
//       email,
//       password,
//       role: 'admin'
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Admin created successfully',
//       data: {
//         _id: adminUser._id,
//         name: adminUser.name,
//         email: adminUser.email,
//         role: adminUser.role
//       }
//     });
//   } catch (error) {
//     console.error('Create admin error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error creating admin'
//     });
//   }
// };

// module.exports = {
//   initializeAdmin,
//   getAdmins,
//   getAdmin,
//   updateAdmin,
//   deleteAdmin,
//   createAdmin
// };

// controllers/adminController.js
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { specializations } = require('../models/Doctor');


// @desc    Initialize admin user (One-time setup)
// @route   POST /api/admin/init
// @access  Public (Should be disabled after first use)
const initializeAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({});
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists. Use login instead.'
      });
    }

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Create admin user
    const adminUser = await Admin.create({
      name,
      email,
      password
    });

    const token = generateToken(adminUser._id, 'admin');

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin',
        token
      }
    });

  } catch (error) {
    console.error('Admin initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin initialization'
    });
  }
};

// @desc    Create doctor (by admin)
// @route   POST /api/admin/doctors
// @access  Private (Admin only)
const createDoctor = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      specialization,
      specializations: doctorSpecializations,
      degree,
      qualifications, 
      experience, 
      licenseNumber, 
      hospital, 
      contactNumber,
      consultationFee,
      languages,
      about,
      address
    } = req.body;

    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });

    if (doctorExists) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already exists with this email or license number'
      });
    }

    // Validate specializations
    if (doctorSpecializations && !doctorSpecializations.every(spec => specializations.includes(spec))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid specializations provided'
      });
    }

    // Create doctor with all frontend fields
    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialization, // Main specialization (department)
      specializations: doctorSpecializations || [specialization], // Multiple specializations
      degree: degree || 'MBBS, MD',
      qualifications: Array.isArray(qualifications) ? qualifications : [qualifications],
      experience,
      licenseNumber,
      hospital,
      contactNumber,
      consultationFee,
      languages: Array.isArray(languages) ? languages : ['English'],
      about: about || `Experienced ${specialization} specialist with ${experience} of practice.`,
      address,
      isVerified: true // Admin created doctors are automatically verified
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        specializations: doctor.specializations,
        degree: doctor.degree,
        hospital: doctor.hospital,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        isVerified: doctor.isVerified
      }
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email or license number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating doctor'
    });
  }
};


const getSpecializations = async (req, res) => {
  try {
    res.json({
      success: true,
      data: specializations
    });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching specializations'
    });
  }
};

// @desc    Get all doctors (for admin)
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
const getDoctors = async (req, res) => {
  try {
    const { department, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    let filter = { isActive: true };
    
    // Filter by department/specialization
    if (department && department !== 'All') {
      filter.specialization = department;
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { specializations: { $in: [new RegExp(search, 'i')] } },
        { hospital: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Doctor.countDocuments(filter);

    // Transform data to match frontend structure
    const transformedDoctors = doctors.map(doctor => ({
      id: doctor._id,
      name: doctor.name,
      degree: doctor.degree,
      department: doctor.specialization,
      specialization: doctor.specializations,
      experience: doctor.experience,
      rating: doctor.rating,
      reviews: doctor.reviews,
      fee: `₹${doctor.consultationFee}`,
      availability: doctor.availability,
      languages: doctor.languages,
      about: doctor.about,
      hospital: doctor.hospital
    }));

    res.json({
      success: true,
      data: transformedDoctors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDoctors: total
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctors'
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Transform to match frontend structure
    const transformedDoctor = {
      id: doctor._id,
      name: doctor.name,
      degree: doctor.degree,
      department: doctor.specialization,
      specialization: doctor.specializations,
      experience: doctor.experience,
      rating: doctor.rating,
      reviews: doctor.reviews,
      fee: `₹${doctor.consultationFee}`,
      availability: doctor.availability,
      languages: doctor.languages,
      about: doctor.about,
      hospital: doctor.hospital,
      contactNumber: doctor.contactNumber,
      email: doctor.email
    };

    res.json({
      success: true,
      data: transformedDoctor
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor'
    });
  }
};

// @desc    Update doctor (by admin)
// @route   PUT /api/admin/doctors/:id
// @access  Private (Admin only)
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating doctor'
    });
  }
};

// @desc    Delete doctor (by admin)
// @route   DELETE /api/admin/doctors/:id
// @access  Private (Admin only)
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting doctor'
    });
  }
};

// @desc    Verify doctor (by admin)
// @route   PATCH /api/admin/doctors/:id/verify
// @access  Private (Admin only)
const verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: { isVerified: true } },
      { new: true }
    ).select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor verified successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Verify doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error verifying doctor'
    });
  }
};

module.exports = {
  initializeAdmin,
  createDoctor,
  getDoctors,
  getSpecializations,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  verifyDoctor
};