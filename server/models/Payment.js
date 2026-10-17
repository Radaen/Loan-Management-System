import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    installmentNumber: {
      type: Number,
      default: 1
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    principalPaid: {
      type: Number,
      default: 0
    },
    interestPaid: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'ABA Pay', 'Wing Bank', 'ACLEDA Pay', 'Bank Transfer'],
      default: 'ABA Pay'
    },
    transactionRef: {
      type: String,
      default: ''
    },
    receiptNumber: {
      type: String,
      unique: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Payment = mongoose.model('Payment', paymentSchema);
