const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\d\s\-\+\(\)]{7,20}$/, 'Please provide a valid phone number'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: [
          'Engineering',
          'Marketing',
          'Sales',
          'Human Resources',
          'Finance',
          'Operations',
          'Design',
          'Product',
          'Support',
          'Legal',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
      max: [10000000, 'Salary seems unrealistically high'],
    },
    dateOfJoining: {
      type: Date,
      required: [true, 'Date of joining is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Terminated'],
      default: 'Active',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);
