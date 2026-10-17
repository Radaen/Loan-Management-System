import express from 'express';
import { DataService } from '../services/dataService.js';
import { calculateSchedule } from '../utils/loanCalculator.js';
import { isMongoOnline } from '../config/db.js';
import { seedInitialData } from '../seed.js';

const router = express.Router();

// ---------------- SYSTEM & STATUS ----------------
router.get('/system/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: isMongoOnline() ? 'MongoDB (Connected)' : 'Local JSON Database (Ready & Persistent)',
    flowchartSteps: [
      { step: 1, name: 'Register Customer', khmer: 'ចុះឈ្មោះអតិថិជន' },
      { step: 2, name: 'Submit Loan Application', khmer: 'ស្នើសុំប្រាក់កម្ចី' },
      { step: 3, name: 'Review Loan Application', khmer: 'ត្រួតពិនិត្យពាក្យស្នើសុំ' },
      { step: 4, name: 'Decision: Approved or Rejected', khmer: 'ការសម្រេចចិត្ត: យល់ព្រម ឬ បដិសេធ' },
      { step: 5, name: 'Generate Loan Schedule', khmer: 'បង្កើតកាលវិភាគសងប្រាក់' },
      { step: 6, name: 'Disburse Loan', khmer: 'បើកផ្តល់ប្រាក់កម្ចី' },
      { step: 7, name: 'Customer Makes Payment', khmer: 'អតិថិជនធ្វើការទូទាត់សង' },
      { step: 8, name: 'Check Fully Paid? Close Loan', khmer: 'សងរួចរាល់? បិទកម្ចីជោគជ័យ' }
    ]
  });
});

router.post('/system/seed', async (req, res) => {
  try {
    const result = await seedInitialData();
    res.json({ success: true, message: 'Database populated with sample data', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/system/clear', async (req, res) => {
  try {
    const result = await DataService.clearAllData();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- DASHBOARD ----------------
router.get('/dashboard/stats', async (req, res) => {
  try {
    const stats = await DataService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- CALCULATOR PREVIEW ----------------
router.post('/calculator/preview', (req, res) => {
  try {
    const { amount, interestRate, termMonths, startDate, interestType } = req.body;
    if (!amount || !interestRate || !termMonths) {
      return res.status(400).json({ error: 'amount, interestRate, and termMonths are required' });
    }
    const calculation = calculateSchedule(amount, interestRate, termMonths, startDate || new Date(), interestType || 'declining');
    res.json(calculation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- CUSTOMERS ----------------
router.get('/customers', async (req, res) => {
  try {
    const customers = await DataService.getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await DataService.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/customers', async (req, res) => {
  try {
    const { fullName, nationalId, phone, monthlyIncome } = req.body;
    if (!fullName || !nationalId || !phone || monthlyIncome === undefined) {
      return res.status(400).json({ error: 'fullName, nationalId, phone, and monthlyIncome are required' });
    }
    const customer = await DataService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/customers/:id', async (req, res) => {
  try {
    const customer = await DataService.updateCustomer(req.params.id, req.body);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/customers/:id', async (req, res) => {
  try {
    await DataService.deleteCustomer(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- LOANS (Flowchart Operations) ----------------
router.get('/loans', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const loans = await DataService.getLoans(filter);
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/loans/:id', async (req, res) => {
  try {
    const loan = await DataService.getLoanById(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Flowchart Step 2: Submit Loan Application
router.post('/loans/apply', async (req, res) => {
  try {
    const { customer, amount, interestRate, termMonths } = req.body;
    if (!customer || !amount || !interestRate || !termMonths) {
      return res.status(400).json({ error: 'customer, amount, interestRate, and termMonths are required' });
    }
    const loan = await DataService.submitLoanApplication(req.body);
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Flowchart Step 3 & 4: Review Loan Application -> Approved?
// decision: 'APPROVED' | 'REJECTED'
router.post('/loans/:id/review', async (req, res) => {
  try {
    const { decision, reviewNotes, rejectionReason } = req.body;
    if (!decision || !['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ error: "decision must be either 'APPROVED' or 'REJECTED'" });
    }
    const loan = await DataService.reviewLoan(req.params.id, { decision, reviewNotes, rejectionReason });
    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Flowchart Step 5: Disburse Loan
router.post('/loans/:id/disburse', async (req, res) => {
  try {
    const { disbursementMethod, disbursementRef, disbursementDate } = req.body;
    const loan = await DataService.disburseLoan(req.params.id, {
      disbursementMethod,
      disbursementRef,
      disbursementDate
    });
    res.json(loan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Flowchart Step 6 & 7: Customer Makes Payment -> Fully Paid? -> Close Loan
router.post('/loans/:id/pay', async (req, res) => {
  try {
    const { amount, paymentMethod, transactionRef, notes, installmentNumber } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }
    const result = await DataService.makePayment(req.params.id, {
      amount,
      paymentMethod,
      transactionRef,
      notes,
      installmentNumber
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ---------------- PAYMENTS ----------------
router.get('/payments', async (req, res) => {
  try {
    const filter = {};
    if (req.query.loan) filter.loan = req.query.loan;
    const payments = await DataService.getPayments(filter);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
