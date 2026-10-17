import { DataService } from './services/dataService.js';
import { isMongoOnline } from './config/db.js';
import { Customer } from './models/Customer.js';
import { Loan } from './models/Loan.js';
import { Payment } from './models/Payment.js';
import { calculateSchedule } from './utils/loanCalculator.js';

export async function seedInitialData() {
  const existingCustomers = await DataService.getCustomers();
  if (existingCustomers && existingCustomers.length > 0) {
    return { count: existingCustomers.length, seeded: false };
  }

  console.log('[Seed] Inserting realistic loan management workflow data...');

  // 1. Customers
  const customer1 = await DataService.createCustomer({
    customerId: 'CUST-1001',
    fullName: 'Sokha Chan',
    khmerName: 'ចាន់ សុខា',
    nationalId: '010293847',
    gender: 'Male',
    dob: new Date('1992-05-15'),
    phone: '012 889 977',
    email: 'sokha.chan@example.com',
    address: { street: 'St 271', village: 'Toul Toumpoung', commune: 'Chamkarmon', district: 'Chamkarmon', province: 'Phnom Penh' },
    occupation: 'Software Engineer',
    monthlyIncome: 1200,
    guarantor: { name: 'Dara Chan', phone: '098 776 554', relationship: 'Brother', nationalId: '010293848' },
    collateral: { type: 'Vehicle', description: 'Honda Dream 2024 (Plate: 1JJ-8899)', estimatedValue: 2400 }
  });

  const customer2 = await DataService.createCustomer({
    customerId: 'CUST-1002',
    fullName: 'Bopha Pich',
    khmerName: 'ពេជ្រ បុប្ផា',
    nationalId: '020495821',
    gender: 'Female',
    dob: new Date('1995-09-20'),
    phone: '015 667 332',
    email: 'bopha.pich@example.com',
    address: { street: 'National Road 6', village: 'Svay Dangkum', commune: 'Siem Reap', district: 'Siem Reap', province: 'Siem Reap' },
    occupation: 'Coffee Shop Owner',
    monthlyIncome: 1800,
    guarantor: { name: 'Vicheka Pich', phone: '089 332 114', relationship: 'Mother', nationalId: '020495820' },
    collateral: { type: 'Land Title', description: 'Commercial plot 120sqm (Siem Reap)', estimatedValue: 35000 }
  });

  const customer3 = await DataService.createCustomer({
    customerId: 'CUST-1003',
    fullName: 'Rithy Meng',
    khmerName: 'ម៉េង រិទ្ធី',
    nationalId: '030998812',
    gender: 'Male',
    dob: new Date('1988-12-05'),
    phone: '097 554 112',
    email: 'rithy.meng@example.com',
    address: { street: 'St 598', village: 'Toul Kork', commune: 'Boeung Kak', district: 'Toul Kork', province: 'Phnom Penh' },
    occupation: 'Logistics Manager',
    monthlyIncome: 1500,
    guarantor: { name: 'Chenda Meng', phone: '012 443 322', relationship: 'Wife', nationalId: '030998813' },
    collateral: { type: 'None', description: '', estimatedValue: 0 }
  });

  const customer4 = await DataService.createCustomer({
    customerId: 'CUST-1004',
    fullName: 'Channary Heng',
    khmerName: 'ហេង ចាន់ណារី',
    nationalId: '040887766',
    gender: 'Female',
    dob: new Date('1998-03-12'),
    phone: '081 223 344',
    email: 'channary.heng@example.com',
    address: { street: 'Preah Monivong Blvd', village: 'Boeung Trabek', commune: 'Chamkarmon', district: 'Chamkarmon', province: 'Phnom Penh' },
    occupation: 'Accountant',
    monthlyIncome: 850,
    guarantor: { name: 'Sopheak Heng', phone: '070 889 900', relationship: 'Father', nationalId: '040887765' },
    collateral: { type: 'Vehicle', description: 'Toyota Prius 2010', estimatedValue: 8500 }
  });

  // 2. Loans covering all flowchart states
  // State A: ACTIVE (Disbursed, 2 payments made, continuing repayments)
  const loan1 = await DataService.submitLoanApplication({
    loanId: 'LN-2026-001',
    customer: customer1._id || customer1.customerId,
    amount: 3000,
    interestRate: 12, // 12% per year = 1% / month
    termMonths: 6,
    loanType: 'Personal',
    purpose: 'Home renovation and electronics purchase',
    interestType: 'declining'
  });
  await DataService.reviewLoan(loan1._id || loan1.loanId, { decision: 'APPROVED', reviewNotes: 'Good salary history and clean guarantor verification' });
  await DataService.disburseLoan(loan1._id || loan1.loanId, {
    disbursementMethod: 'Bank Transfer (ABA)',
    disbursementRef: 'ABA-TRX-998822',
    disbursementDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
  });
  // Make 1st payment
  await DataService.makePayment(loan1._id || loan1.loanId, {
    amount: 517.65,
    paymentMethod: 'ABA Pay',
    transactionRef: 'PAY-ABA-001',
    notes: 'Month 1 installment',
    paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  });
  // Make 2nd payment
  await DataService.makePayment(loan1._id || loan1.loanId, {
    amount: 517.65,
    paymentMethod: 'ABA Pay',
    transactionRef: 'PAY-ABA-002',
    notes: 'Month 2 installment',
    paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  });

  // State B: PENDING (Application submitted, waiting for Review)
  await DataService.submitLoanApplication({
    loanId: 'LN-2026-002',
    customer: customer2._id || customer2.customerId,
    amount: 10000,
    interestRate: 10,
    termMonths: 12,
    loanType: 'Business',
    purpose: 'Expand coffee shop seating and buy espresso machines',
    interestType: 'declining'
  });

  // State C: APPROVED (Approved, ready to Disburse Loan)
  const loan3 = await DataService.submitLoanApplication({
    loanId: 'LN-2026-003',
    customer: customer3._id || customer3.customerId,
    amount: 2000,
    interestRate: 14,
    termMonths: 6,
    loanType: 'Personal',
    purpose: 'Emergency family medical expenses',
    interestType: 'declining'
  });
  await DataService.reviewLoan(loan3._id || loan3.loanId, { decision: 'APPROVED', reviewNotes: 'Collateral waived due to verified stable salary.' });

  // State D: REJECTED (Loan Application rejected -> End)
  const loan4 = await DataService.submitLoanApplication({
    loanId: 'LN-2026-004',
    customer: customer4._id || customer4.customerId,
    amount: 15000,
    interestRate: 15,
    termMonths: 24,
    loanType: 'Vehicle',
    purpose: 'Luxury car purchase',
    interestType: 'declining'
  });
  await DataService.reviewLoan(loan4._id || loan4.loanId, {
    decision: 'REJECTED',
    reviewNotes: 'Debt-to-income ratio too high (monthly repayment exceeds 60% of monthly income)',
    rejectionReason: 'Debt-to-income ratio exceeds 60% limit without sufficient collateral'
  });

  // State E: CLOSED (Fully Paid Loan -> Close Loan -> End)
  const loan5 = await DataService.submitLoanApplication({
    loanId: 'LN-2026-005',
    customer: customer2._id || customer2.customerId,
    amount: 1000,
    interestRate: 12,
    termMonths: 2,
    loanType: 'Emergency',
    purpose: 'Quick inventory restock',
    interestType: 'declining'
  });
  await DataService.reviewLoan(loan5._id || loan5.loanId, { decision: 'APPROVED', reviewNotes: 'Fast-track approval for loyal customer' });
  await DataService.disburseLoan(loan5._id || loan5.loanId, {
    disbursementMethod: 'Cash',
    disbursementRef: 'CASH-DISB-005',
    disbursementDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000)
  });
  // Pay off completely
  const fullPayable = loan5.totalPayable || 1015;
  await DataService.makePayment(loan5._id || loan5.loanId, {
    amount: fullPayable,
    paymentMethod: 'Wing Bank',
    transactionRef: 'WING-SETTLE-ALL',
    notes: 'Full early loan payoff completed!'
  });

  console.log('[Seed] Seed completed successfully!');
  return { count: 4, seeded: true };
}
