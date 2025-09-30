// // models/Doctor.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const doctorSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   role: {
//     type: String,
//     default: 'doctor',
//     enum: ['doctor']
//   },
//   specialization: {
//     type: String,
//     required: true
//   },
//   qualifications: {
//     type: [String],
//     required: true
//   },
//   experience: {
//     type: Number,
//     required: true
//   },
//   licenseNumber: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   hospital: {
//     type: String,
//     required: true
//   },
//   contactNumber: {
//     type: String,
//     required: true
//   },
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     zipCode: String
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   consultationFee: {
//     type: Number,
//     default: 0
//   },
//   availability: {
//     type: Map,
//     of: [String] // { day: ['time1', 'time2'] }
//   },
//   bio: {
//     type: String,
//     maxlength: 500
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Add methods to your schema
// doctorSchema.methods.matchPassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// doctorSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     next();
//   }
  
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// module.exports = mongoose.model('Doctor', doctorSchema);



// models/Doctor.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define specializations that match frontend
const specializations = [
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Dentistry',
  'Psychiatry',
  'Endocrinology',
  'Gastroenterology',
  'Ophthalmology',
  'ENT'
];

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    default: 'doctor',
    enum: ['doctor']
  },
  // Single specialization (matching frontend department)
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: specializations
  },
  // Multiple specializations for detailed expertise
  specializations: {
    type: [String],
    required: [true, 'At least one specialization is required'],
    validate: {
      validator: function(specs) {
        return specs.length > 0 && specs.every(spec => specializations.includes(spec));
      },
      message: 'Please provide valid specializations'
    }
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  qualifications: {
    type: [String],
    required: [true, 'Qualifications are required']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  availability: {
    days: {
      type: String,
      default: 'Monday - Friday'
    },
    morning: {
      type: String,
      default: '9:00 AM - 1:00 PM'
    },
    evening: {
      type: String,
      default: '5:00 PM - 8:00 PM'
    },
    saturday: {
      type: String,
      default: '9:00 AM - 2:00 PM'
    },
    sunday: {
      type: String,
      default: 'Emergency Only'
    }
  },
  languages: {
    type: [String],
    default: ['English']
  },
  about: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add methods
doctorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Static method to get available specializations
doctorSchema.statics.getSpecializations = function() {
  return specializations;
};

module.exports = mongoose.model('Doctor', doctorSchema);
module.exports.specializations = specializations;