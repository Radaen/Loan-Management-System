import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    khmerName: {
      type: String,
      trim: true
    },
    nationalId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    dob: {
      type: Date
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      street: { type: String, default: '' },
      village: { type: String, default: '' },
      commune: { type: String, default: '' },
      district: { type: String, default: '' },
      province: { type: String, default: 'Phnom Penh' }
    },
    occupation: {
      type: String,
      default: 'Self-employed'
    },
    monthlyIncome: {
      type: Number,
      required: true,
      min: 0
    },
    guarantor: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relationship: { type: String, default: '' },
      nationalId: { type: String, default: '' }
    },
    collateral: {
      type: { type: String, default: 'None' }, // Land Title, Vehicle, Jewelry, None
      description: { type: String, default: '' },
      estimatedValue: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['Active', 'Blacklisted'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

export const Customer = mongoose.model('Customer', customerSchema);
