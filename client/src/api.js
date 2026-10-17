const API_BASE = '/api';

// ---------------- LOCAL STORAGE FALLBACK ENGINE (For GitHub Pages & Static Hosting) ----------------
const STORAGE_KEY = 'loanflow_db_v1';

function getLocalDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage read error:', e);
  }
  return { customers: [], loans: [], payments: [] };
}

function saveLocalDB(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

function calculateScheduleLocal(principal, annualRatePct, termMonths, startDate = new Date(), calculationType = 'declining') {
  const p = Number(principal);
  const rAnnual = Number(annualRatePct) / 100;
  const rMonthly = rAnnual / 12;
  const n = parseInt(termMonths, 10);
  const start = new Date(startDate);
  const schedule = [];
  let remainingPrincipal = p;

  if (calculationType === 'flat') {
    const monthlyInterest = (p * rAnnual) / 12;
    const monthlyPrincipal = p / n;
    for (let i = 1; i <= n; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + i);
      const principalDue = i === n ? remainingPrincipal : Math.round(monthlyPrincipal * 100) / 100;
      const interestDue = Math.round(monthlyInterest * 100) / 100;
      const totalDue = Math.round((principalDue + interestDue) * 100) / 100;
      remainingPrincipal = Math.max(0, Math.round((remainingPrincipal - principalDue) * 100) / 100);
      schedule.push({
        installmentNumber: i,
        dueDate: dueDate.toISOString(),
        principalDue,
        interestDue,
        totalDue,
        remainingPrincipal,
        paidAmount: 0,
        status: 'PENDING'
      });
    }
  } else {
    let emi;
    if (rMonthly === 0) emi = p / n;
    else emi = (p * rMonthly * Math.pow(1 + rMonthly, n)) / (Math.pow(1 + rMonthly, n) - 1);
    const monthlyPayment = Math.round(emi * 100) / 100;

    for (let i = 1; i <= n; i++) {
      const dueDate = new Date(start);
      dueDate.setMonth(start.getMonth() + i);
      const interestDue = Math.round((remainingPrincipal * rMonthly) * 100) / 100;
      let principalDue = Math.round((monthlyPayment - interestDue) * 100) / 100;
      if (i === n || principalDue > remainingPrincipal) principalDue = remainingPrincipal;
      const totalDue = Math.round((principalDue + interestDue) * 100) / 100;
      remainingPrincipal = Math.max(0, Math.round((remainingPrincipal - principalDue) * 100) / 100);
      schedule.push({
        installmentNumber: i,
        dueDate: dueDate.toISOString(),
        principalDue,
        interestDue,
        totalDue,
        remainingPrincipal,
        paidAmount: 0,
        status: 'PENDING'
      });
    }
  }

  const totalInterest = schedule.reduce((sum, item) => sum + item.interestDue, 0);
  const totalPayable = schedule.reduce((sum, item) => sum + item.totalDue, 0);
  return {
    schedule,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    monthlyPayment: schedule.length > 0 ? schedule[0].totalDue : 0
  };
}

let backendAvailable = null;

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/system/status`, { signal: AbortSignal.timeout(1500) });
    backendAvailable = res.ok;
  } catch (e) {
    backendAvailable = false;
  }
  return backendAvailable;
}

// ---------------- EXPORTED API CLIENT ----------------
export const api = {
  // System Status
  async getSystemStatus() {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/system/status`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return {
      status: 'online (Browser Cloud Mode)',
      database: 'Browser Persistent Database (Active)',
      flowchartSteps: []
    };
  },

  async seedData() {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/system/seed`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return { success: true };
  },

  // Dashboard Stats
  async getDashboardStats() {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const loans = db.loans || [];
    const payments = db.payments || [];
    const totalDisbursed = loans.filter(l => l.status === 'ACTIVE' || l.status === 'CLOSED').reduce((s, l) => s + (l.amount || 0), 0);
    const totalCollected = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const totalOutstanding = loans.filter(l => l.status === 'ACTIVE').reduce((s, l) => s + (l.remainingBalance || 0), 0);
    return {
      totalCustomers: (db.customers || []).length,
      totalLoans: loans.length,
      pendingLoans: loans.filter(l => l.status === 'PENDING').length,
      approvedLoans: loans.filter(l => l.status === 'APPROVED').length,
      activeLoans: loans.filter(l => l.status === 'ACTIVE').length,
      closedLoans: loans.filter(l => l.status === 'CLOSED').length,
      rejectedLoans: loans.filter(l => l.status === 'REJECTED').length,
      totalDisbursed: Math.round(totalDisbursed * 100) / 100,
      totalCollected: Math.round(totalCollected * 100) / 100,
      totalOutstanding: Math.round(totalOutstanding * 100) / 100,
      recentLoans: loans.slice(0, 5),
      recentPayments: payments.slice(0, 5)
    };
  },

  // Calculator preview
  async previewCalculator(data) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/calculator/preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return calculateScheduleLocal(data.amount, data.interestRate, data.termMonths, data.startDate || new Date(), data.interestType || 'declining');
  },

  // Customers
  async getCustomers() {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/customers`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    return (db.customers || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getCustomer(id) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/customers/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    return db.customers.find(c => c._id === id || c.customerId === id) || null;
  },

  async createCustomer(data) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const newCust = {
      ...data,
      _id: 'cust_' + Date.now(),
      customerId: data.customerId || `CUST-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };
    db.customers.push(newCust);
    saveLocalDB(db);
    return newCust;
  },

  async updateCustomer(id, data) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/customers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const idx = db.customers.findIndex(c => c._id === id || c.customerId === id);
    if (idx !== -1) {
      db.customers[idx] = { ...db.customers[idx], ...data, updatedAt: new Date().toISOString() };
      saveLocalDB(db);
      return db.customers[idx];
    }
    return null;
  },

  async deleteCustomer(id) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    db.customers = db.customers.filter(c => c._id !== id && c.customerId !== id);
    saveLocalDB(db);
    return { success: true };
  },

  // Loans
  async getLoans(status = '') {
    if (await checkBackend()) {
      try {
        const query = status ? `?status=${encodeURIComponent(status)}` : '';
        const res = await fetch(`${API_BASE}/loans${query}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    let list = (db.loans || []).map(l => {
      const cust = db.customers.find(c => c._id === l.customer || c.customerId === l.customer);
      return { ...l, customer: cust || l.customer };
    });
    if (status) list = list.filter(l => l.status === status);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getLoan(id) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/loans/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const loan = db.loans.find(l => l._id === id || l.loanId === id);
    if (!loan) return null;
    const cust = db.customers.find(c => c._id === loan.customer || c.customerId === loan.customer);
    return { ...loan, customer: cust || loan.customer };
  },

  async applyLoan(data) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/loans/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const calc = calculateScheduleLocal(data.amount, data.interestRate, data.termMonths, data.applicationDate || new Date(), data.interestType || 'declining');
    const newLoan = {
      ...data,
      _id: 'loan_' + Date.now(),
      loanId: data.loanId || `LN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PENDING',
      currentStep: 'SUBMITTED',
      totalInterest: calc.totalInterest,
      totalPayable: calc.totalPayable,
      monthlyPayment: calc.monthlyPayment,
      totalPaid: 0,
      remainingBalance: calc.totalPayable,
      schedule: calc.schedule,
      applicationDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    db.loans.push(newLoan);
    saveLocalDB(db);
    const cust = db.customers.find(c => c._id === newLoan.customer || c.customerId === newLoan.customer);
    return { ...newLoan, customer: cust || newLoan.customer };
  },

  async reviewLoan(id, reviewData) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/loans/${id}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const idx = db.loans.findIndex(l => l._id === id || l.loanId === id);
    if (idx !== -1) {
      const isApproved = reviewData.decision === 'APPROVED';
      db.loans[idx] = {
        ...db.loans[idx],
        status: isApproved ? 'APPROVED' : 'REJECTED',
        currentStep: isApproved ? 'APPROVED' : 'REJECTED',
        reviewNotes: reviewData.reviewNotes || '',
        rejectionReason: !isApproved ? (reviewData.rejectionReason || 'Requirements not met') : '',
        approvedAt: isApproved ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      };
      saveLocalDB(db);
      const cust = db.customers.find(c => c._id === db.loans[idx].customer || c.customerId === db.loans[idx].customer);
      return { ...db.loans[idx], customer: cust || db.loans[idx].customer };
    }
    throw new Error('Loan not found');
  },

  async disburseLoan(id, disburseData) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/loans/${id}/disburse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(disburseData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const idx = db.loans.findIndex(l => l._id === id || l.loanId === id);
    if (idx !== -1) {
      const loan = db.loans[idx];
      const calc = calculateScheduleLocal(loan.amount, loan.interestRate, loan.termMonths, disburseData.disbursementDate || new Date(), loan.interestType || 'declining');
      db.loans[idx] = {
        ...loan,
        status: 'ACTIVE',
        currentStep: 'DISBURSED',
        disbursedAt: new Date(disburseData.disbursementDate || new Date()).toISOString(),
        disbursementMethod: disburseData.disbursementMethod || 'Bank Transfer (ABA)',
        disbursementRef: disburseData.disbursementRef || '',
        schedule: calc.schedule,
        totalInterest: calc.totalInterest,
        totalPayable: calc.totalPayable,
        monthlyPayment: calc.monthlyPayment,
        remainingBalance: calc.totalPayable,
        totalPaid: 0,
        updatedAt: new Date().toISOString()
      };
      saveLocalDB(db);
      const cust = db.customers.find(c => c._id === db.loans[idx].customer || c.customerId === db.loans[idx].customer);
      return { ...db.loans[idx], customer: cust || db.loans[idx].customer };
    }
    throw new Error('Loan not found');
  },

  async makePayment(id, paymentData) {
    if (await checkBackend()) {
      try {
        const res = await fetch(`${API_BASE}/loans/${id}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    const idx = db.loans.findIndex(l => l._id === id || l.loanId === id);
    if (idx !== -1) {
      const loan = db.loans[idx];
      const payAmount = Number(paymentData.amount);
      const receiptNumber = `RCP-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const paymentRecord = {
        _id: 'pay_' + Date.now(),
        paymentId: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        receiptNumber,
        loan: loan._id,
        customer: loan.customer,
        amount: payAmount,
        paymentDate: paymentData.paymentDate || new Date().toISOString(),
        paymentMethod: paymentData.paymentMethod || 'ABA Pay',
        transactionRef: paymentData.transactionRef || '',
        notes: paymentData.notes || '',
        installmentNumber: paymentData.installmentNumber || 1,
        createdAt: new Date().toISOString()
      };
      db.payments.push(paymentRecord);

      // Apply to schedule
      const schedule = [...(loan.schedule || [])];
      let amountLeft = payAmount;
      for (let item of schedule) {
        if (amountLeft <= 0) break;
        const unpaid = item.totalDue - (item.paidAmount || 0);
        if (unpaid > 0) {
          const canPay = Math.min(amountLeft, unpaid);
          item.paidAmount = Math.round(((item.paidAmount || 0) + canPay) * 100) / 100;
          amountLeft = Math.round((amountLeft - canPay) * 100) / 100;
          if (item.paidAmount >= item.totalDue) item.status = 'PAID';
          else item.status = 'PARTIAL';
        }
      }

      const newTotalPaid = Math.round(((loan.totalPaid || 0) + payAmount) * 100) / 100;
      const newBalance = Math.max(0, Math.round(((loan.totalPayable || 0) - newTotalPaid) * 100) / 100);
      const isFullyPaid = newBalance <= 0;

      db.loans[idx] = {
        ...loan,
        schedule,
        totalPaid: newTotalPaid,
        remainingBalance: newBalance,
        status: isFullyPaid ? 'CLOSED' : 'ACTIVE',
        currentStep: isFullyPaid ? 'CLOSED' : 'IN_REPAYMENT',
        closedAt: isFullyPaid ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      };
      saveLocalDB(db);
      const cust = db.customers.find(c => c._id === db.loans[idx].customer || c.customerId === db.loans[idx].customer);
      return {
        payment: paymentRecord,
        loan: { ...db.loans[idx], customer: cust || db.loans[idx].customer },
        isFullyPaid
      };
    }
    throw new Error('Loan not found');
  },

  async getPayments(loanId = '') {
    if (await checkBackend()) {
      try {
        const query = loanId ? `?loan=${encodeURIComponent(loanId)}` : '';
        const res = await fetch(`${API_BASE}/payments${query}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    const db = getLocalDB();
    let list = (db.payments || []).map(p => {
      const loan = db.loans.find(l => l._id === p.loan || l.loanId === p.loan);
      const cust = db.customers.find(c => c._id === p.customer || c.customerId === p.customer);
      return { ...p, loan: loan || p.loan, customer: cust || p.customer };
    });
    if (loanId) list = list.filter(p => p.loan?._id === loanId || p.loan?.loanId === loanId || p.loan === loanId);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};
