// controllers/doctorController.js
const Doctor = require('../models/Doctor');

// @desc    Get all doctors (public)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
    try {
        const { specialization, verified, hospital } = req.query;
        
        let filter = { isVerified: true }; // Only show verified doctors to public
        
        // Filter by specialization
        if (specialization) {
            filter.specialization = new RegExp(specialization, 'i');
        }
        
        // Filter by hospital
        if (hospital) {
            filter.hospital = new RegExp(hospital, 'i');
        }

        const doctors = await Doctor.find(filter).select('-password');
        
        res.json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching doctors'
        });
    }
};

// @desc    Get single doctor (public)
// @route   GET /api/doctors/:id
// @access  Public
const getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Get doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching doctor'
        });
    }
};

// @desc    Update doctor profile (by doctor themselves)
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
const updateProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.user._id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: doctor
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
};

// @desc    Get doctor profile (by doctor themselves)
// @route   GET /api/doctors/profile/me
// @access  Private (Doctor only)
const getMyProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user._id).select('-password');

        res.json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};

module.exports = {
    getDoctors,
    getDoctor,
    updateProfile,
    getMyProfile
};