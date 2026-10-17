import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  installmentNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  principalDue: { type: Number, required: true },
  interestDue: { type: Number, required: true },
  totalDue: { type: Number, required: true },
  remainingPrincipal: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  paidDate: { type: Date },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'PARTIAL', 'OVERDUE'],
    default: 'PENDING'
  }
});

const loanSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0 // e.g. 12 means 12% per year (1% per month)
    },
    interestType: {
      type: String,
      enum: ['declining', 'flat'],
      default: 'declining'
    },
    termMonths: {
      type: Number,
      required: true,
      min: 1
    },
    loanType: {
      type: String,
      enum: ['Personal', 'Business', 'Agriculture', 'Vehicle', 'Housing', 'Emergency'],
      default: 'Personal'
    },
    purpose: {
      type: String,
      default: ''
    },
    applicationDate: {
      type: Date,
      default: Date.now
    },
    // Flowchart State
    status: {
      type: String,
      enum: ['PENDING', 'REJECTED', 'APPROVED', 'ACTIVE', 'CLOSED'],
      default: 'PENDING',
      index: true
    },
    // Flowchart step indicators
    currentStep: {
      type: String,
      enum: [
        'SUBMITTED',       // Loan application submitted
        'UNDER_REVIEW',    // In review
        'REJECTED',        // Rejected -> End
        'APPROVED',        // Approved -> Create Loan
        'SCHEDULE_READY',  // Schedule generated
        'DISBURSED',       // Disbursed -> Active
        'IN_REPAYMENT',    // Customer making payments
        'CLOSED'           // Fully Paid -> Closed -> End
      ],
      default: 'SUBMITTED'
    },
    reviewNotes: {
      type: String,
      default: ''
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: Date
    },
    disbursedAt: {
      type: Date
    },
    disbursementMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer (ABA)', 'Wing Bank', 'ACLEDA Pay', 'Cheque'],
      default: 'Bank Transfer (ABA)'
    },
    disbursementRef: {
      type: String,
      default: ''
    },
    totalInterest: {
      type: Number,
      default: 0
    },
    totalPayable: {
      type: Number,
      default: 0
    },
    monthlyPayment: {
      type: Number,
      default: 0
    },
    totalPaid: {
      type: Number,
      default: 0
    },
    remainingBalance: {
      type: Number,
      default: 0
    },
    schedule: [installmentSchema],
    closedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Loan = mongoose.model('Loan', loanSchema);
