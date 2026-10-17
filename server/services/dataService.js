import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isMongoOnline } from '../config/db.js';
import { Customer } from '../models/Customer.js';
import { Loan } from '../models/Loan.js';
import { Payment } from '../models/Payment.js';
import { calculateSchedule } from '../utils/loanCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadLocalData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading db.json, returning empty template:', e.message);
    }
  }
  return { customers: [], loans: [], payments: [] };
}

function saveLocalData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving db.json:', e.message);
  }
}

// Generate simple Unique IDs
export function generateId(prefix = 'ID') {
  const random = Math.floor(1000 + Math.random() * 9000);
  const time = Date.now().toString().slice(-4);
  return `${prefix}-${time}-${random}`;
}

export const DataService = {
  // ----------------- CUSTOMER -----------------
  async getCustomers() {
    if (isMongoOnline()) {
      return await Customer.find().sort({ createdAt: -1 });
    }
    const data = loadLocalData();
    return data.customers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getCustomerById(id) {
    if (isMongoOnline()) {
      return await Customer.findById(id) || await Customer.findOne({ customerId: id });
    }
    const data = loadLocalData();
    return data.customers.find(c => c._id === id || c.customerId === id) || null;
  },

  async createCustomer(custData) {
    const customerId = custData.customerId || `CUST-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord = {
      ...custData,
      customerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isMongoOnline()) {
      const created = new Customer(newRecord);
      return await created.save();
    }

    const data = loadLocalData();
    newRecord._id = 'cust_' + Date.now();
    data.customers.push(newRecord);
    saveLocalData(data);
    return newRecord;
  },

  async updateCustomer(id, updateData) {
    if (isMongoOnline()) {
      return await Customer.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true });
    }
    const data = loadLocalData();
    const idx = data.customers.findIndex(c => c._id === id || c.customerId === id);
    if (idx !== -1) {
      data.customers[idx] = { ...data.customers[idx], ...updateData, updatedAt: new Date().toISOString() };
      saveLocalData(data);
      return data.customers[idx];
    }
    return null;
  },

  async deleteCustomer(id) {
    if (isMongoOnline()) {
      return await Customer.findByIdAndDelete(id);
    }
    const data = loadLocalData();
    data.customers = data.customers.filter(c => c._id !== id && c.customerId !== id);
    saveLocalData(data);
    return { success: true };
  },

  // ----------------- LOAN (Matching Flowchart) -----------------
  async getLoans(filter = {}) {
    if (isMongoOnline()) {
      return await Loan.find(filter).populate('customer').sort({ createdAt: -1 });
    }
    const data = loadLocalData();
    let loans = [...data.loans];
    if (filter.status) {
      loans = loans.filter(l => l.status === filter.status);
    }
    // Attach customer data
    return loans.map(l => {
      const cust = data.customers.find(c => c._id === l.customer || c.customerId === l.customer);
      return {
        ...l,
        customer: cust || l.customer
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getLoanById(id) {
    if (isMongoOnline()) {
      return await Loan.findById(id).populate('customer') || await Loan.findOne({ loanId: id }).populate('customer');
    }
    const data = loadLocalData();
    const loan = data.loans.find(l => l._id === id || l.loanId === id);
    if (!loan) return null;
    const cust = data.customers.find(c => c._id === loan.customer || c.customerId === loan.customer);
    return {
      ...loan,
      customer: cust || loan.customer
    };
  },

  // Flowchart Step 2: Submit Loan Application
  async submitLoanApplication(payload) {
    const loanId = payload.loanId || `LN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const calc = calculateSchedule(
      payload.amount,
      payload.interestRate,
      payload.termMonths,
      payload.applicationDate || new Date(),
      payload.interestType || 'declining'
    );

    const newLoan = {
      ...payload,
      loanId,
      status: 'PENDING',
      currentStep: 'SUBMITTED', // Flowchart: Submit Loan Application
      totalInterest: calc.totalInterest,
      totalPayable: calc.totalPayable,
      monthlyPayment: calc.monthlyPayment,
      totalPaid: 0,
      remainingBalance: calc.totalPayable,
      schedule: calc.schedule, // Preview schedule
      applicationDate: payload.applicationDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isMongoOnline()) {
      const created = new Loan(newLoan);
      return await (await created.save()).populate('customer');
    }

    const data = loadLocalData();
    newLoan._id = 'loan_' + Date.now();
    data.loans.push(newLoan);
    saveLocalData(data);
    const cust = data.customers.find(c => c._id === newLoan.customer || c.customerId === newLoan.customer);
    return { ...newLoan, customer: cust || newLoan.customer };
  },

  // Flowchart Step 3 & 4: Review Loan Application -> Approved? (Yes -> Create Loan / No -> Reject Loan -> End)
  async reviewLoan(loanIdOrMongoId, { decision, reviewNotes, rejectionReason }) {
    const loan = await this.getLoanById(loanIdOrMongoId);
    if (!loan) throw new Error('Loan not found');

    const updateFields = {
      reviewNotes: reviewNotes || ''
    };

    if (decision === 'APPROVED') {
      // Approved? YES -> Create Loan & Ready for schedule
      updateFields.status = 'APPROVED';
      updateFields.currentStep = 'APPROVED';
      updateFields.approvedAt = new Date().toISOString();
      updateFields.rejectionReason = '';
    } else if (decision === 'REJECTED') {
      // Approved? NO -> Reject Loan -> End
      updateFields.status = 'REJECTED';
      updateFields.currentStep = 'REJECTED';
      updateFields.rejectionReason = rejectionReason || 'Requirements not met';
    } else {
      throw new Error("Invalid decision. Must be 'APPROVED' or 'REJECTED'");
    }

    return await this.updateLoan(loan._id || loan.loanId, updateFields);
  },

  // Flowchart Step 5: Disburse Loan
  async disburseLoan(loanIdOrMongoId, { disbursementMethod = 'Bank Transfer (ABA)', disbursementRef = '', disbursementDate = new Date() }) {
    const loan = await this.getLoanById(loanIdOrMongoId);
    if (!loan) throw new Error('Loan not found');

    if (loan.status !== 'APPROVED') {
      throw new Error(`Cannot disburse loan in status ${loan.status}. Loan must be APPROVED first.`);
    }

    // Generate active schedule based on actual disbursement date
    const calc = calculateSchedule(
      loan.amount,
      loan.interestRate,
      loan.termMonths,
      disbursementDate,
      loan.interestType || 'declining'
    );

    const updateFields = {
      status: 'ACTIVE',
      currentStep: 'DISBURSED',
      disbursedAt: new Date(disbursementDate).toISOString(),
      disbursementMethod,
      disbursementRef,
      schedule: calc.schedule,
      totalInterest: calc.totalInterest,
      totalPayable: calc.totalPayable,
      monthlyPayment: calc.monthlyPayment,
      remainingBalance: calc.totalPayable,
      totalPaid: 0
    };

    return await this.updateLoan(loan._id || loan.loanId, updateFields);
  },

  // Flowchart Step 6 & 7: Customer Makes Payment -> Fully Paid? (Yes -> Close Loan / No -> Continue Payment)
  async makePayment(loanIdOrMongoId, paymentPayload) {
    const loan = await this.getLoanById(loanIdOrMongoId);
    if (!loan) throw new Error('Loan not found');

    if (loan.status !== 'ACTIVE') {
      throw new Error(`Payments can only be accepted for ACTIVE disbursed loans. Current status is ${loan.status}`);
    }

    const payAmount = Number(paymentPayload.amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }

    const paymentDate = paymentPayload.paymentDate || new Date().toISOString();
    const receiptNumber = `RCP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const paymentId = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create payment record
    const paymentRecord = {
      paymentId,
      receiptNumber,
      loan: loan._id || loan.loanId,
      customer: loan.customer?._id || loan.customer,
      amount: payAmount,
      paymentDate,
      paymentMethod: paymentPayload.paymentMethod || 'ABA Pay',
      transactionRef: paymentPayload.transactionRef || '',
      notes: paymentPayload.notes || '',
      installmentNumber: paymentPayload.installmentNumber || 1,
      createdAt: new Date().toISOString()
    };

    // Update Loan schedule installments
    const schedule = [...(loan.schedule || [])];
    let amountLeftToApply = payAmount;

    for (let item of schedule) {
      if (amountLeftToApply <= 0) break;
      const unpaidOnThis = item.totalDue - (item.paidAmount || 0);
      if (unpaidOnThis > 0) {
        const canPay = Math.min(amountLeftToApply, unpaidOnThis);
        item.paidAmount = Math.round(((item.paidAmount || 0) + canPay) * 100) / 100;
        item.paidDate = paymentDate;
        amountLeftToApply = Math.round((amountLeftToApply - canPay) * 100) / 100;

        if (item.paidAmount >= item.totalDue) {
          item.status = 'PAID';
        } else {
          item.status = 'PARTIAL';
        }
      }
    }

    const newTotalPaid = Math.round(((loan.totalPaid || 0) + payAmount) * 100) / 100;
    const newRemainingBalance = Math.max(0, Math.round(((loan.totalPayable || 0) - newTotalPaid) * 100) / 100);

    const updateFields = {
      schedule,
      totalPaid: newTotalPaid,
      remainingBalance: newRemainingBalance
    };

    // Flowchart Decision: Fully Paid?
    if (newRemainingBalance <= 0) {
      // YES -> Close Loan -> End
      updateFields.status = 'CLOSED';
      updateFields.currentStep = 'CLOSED';
      updateFields.closedAt = new Date().toISOString();
    } else {
      // NO -> Continue Payment (loops back to Customer Makes Payment)
      updateFields.status = 'ACTIVE';
      updateFields.currentStep = 'IN_REPAYMENT';
    }

    // Save payment
    if (isMongoOnline()) {
      const newPay = new Payment(paymentRecord);
      await newPay.save();
      await Loan.findByIdAndUpdate(loan._id, updateFields);
    } else {
      const data = loadLocalData();
      paymentRecord._id = 'pay_' + Date.now();
      data.payments.push(paymentRecord);
      const loanIdx = data.loans.findIndex(l => l._id === loan._id || l.loanId === loan.loanId);
      if (loanIdx !== -1) {
        data.loans[loanIdx] = { ...data.loans[loanIdx], ...updateFields, updatedAt: new Date().toISOString() };
      }
      saveLocalData(data);
    }

    const updatedLoan = await this.getLoanById(loan._id || loan.loanId);
    return {
      payment: paymentRecord,
      loan: updatedLoan,
      isFullyPaid: newRemainingBalance <= 0
    };
  },

  async updateLoan(id, updateData) {
    if (isMongoOnline()) {
      return await Loan.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true }).populate('customer');
    }
    const data = loadLocalData();
    const idx = data.loans.findIndex(l => l._id === id || l.loanId === id);
    if (idx !== -1) {
      data.loans[idx] = { ...data.loans[idx], ...updateData, updatedAt: new Date().toISOString() };
      saveLocalData(data);
      const cust = data.customers.find(c => c._id === data.loans[idx].customer || c.customerId === data.loans[idx].customer);
      return { ...data.loans[idx], customer: cust || data.loans[idx].customer };
    }
    return null;
  },

  // ----------------- PAYMENTS -----------------
  async getPayments(filter = {}) {
    if (isMongoOnline()) {
      return await Payment.find(filter).populate('loan').populate('customer').sort({ createdAt: -1 });
    }
    const data = loadLocalData();
    let payments = [...data.payments];
    return payments.map(p => {
      const loan = data.loans.find(l => l._id === p.loan || l.loanId === p.loan);
      const customer = data.customers.find(c => c._id === p.customer || c.customerId === p.customer);
      return {
        ...p,
        loan: loan || p.loan,
        customer: customer || p.customer
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // ----------------- DASHBOARD METRICS -----------------
  async getDashboardStats() {
    const loans = await this.getLoans();
    const customers = await this.getCustomers();
    const payments = await this.getPayments();

    const totalLoans = loans.length;
    const pendingLoans = loans.filter(l => l.status === 'PENDING').length;
    const approvedLoans = loans.filter(l => l.status === 'APPROVED').length;
    const activeLoans = loans.filter(l => l.status === 'ACTIVE').length;
    const closedLoans = loans.filter(l => l.status === 'CLOSED').length;
    const rejectedLoans = loans.filter(l => l.status === 'REJECTED').length;

    const totalDisbursed = loans
      .filter(l => l.status === 'ACTIVE' || l.status === 'CLOSED')
      .reduce((sum, l) => sum + (l.amount || 0), 0);

    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalOutstanding = loans
      .filter(l => l.status === 'ACTIVE')
      .reduce((sum, l) => sum + (l.remainingBalance || 0), 0);

    return {
      totalCustomers: customers.length,
      totalLoans,
      pendingLoans,
      approvedLoans,
      activeLoans,
      closedLoans,
      rejectedLoans,
      totalDisbursed: Math.round(totalDisbursed * 100) / 100,
      totalCollected: Math.round(totalCollected * 100) / 100,
      totalOutstanding: Math.round(totalOutstanding * 100) / 100,
      recentLoans: loans.slice(0, 5),
      recentPayments: payments.slice(0, 5)
    };
  },

  async clearAllData() {
    if (isMongoOnline()) {
      await Customer.deleteMany({});
      await Loan.deleteMany({});
      await Payment.deleteMany({});
    }
    const empty = { customers: [], loans: [], payments: [] };
    saveLocalData(empty);
    return { success: true, message: 'All database records cleared cleanly' };
  }
};
