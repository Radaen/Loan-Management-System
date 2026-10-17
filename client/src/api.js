const API_BASE = '/api';

export const api = {
  // System Status
  async getSystemStatus() {
    const res = await fetch(`${API_BASE}/system/status`);
    return await res.json();
  },

  async seedData() {
    const res = await fetch(`${API_BASE}/system/seed`, { method: 'POST' });
    return await res.json();
  },

  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return await res.json();
  },

  // Calculator
  async previewCalculator(data) {
    const res = await fetch(`${API_BASE}/calculator/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Customers
  async getCustomers() {
    const res = await fetch(`${API_BASE}/customers`);
    return await res.json();
  },

  async getCustomer(id) {
    const res = await fetch(`${API_BASE}/customers/${id}`);
    return await res.json();
  },

  async createCustomer(data) {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create customer');
    }
    return await res.json();
  },

  async updateCustomer(id, data) {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteCustomer(id) {
    const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
    return await res.json();
  },

  // Loans (Matching Flowchart)
  async getLoans(status = '') {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE}/loans${query}`);
    return await res.json();
  },

  async getLoan(id) {
    const res = await fetch(`${API_BASE}/loans/${id}`);
    return await res.json();
  },

  // Flowchart Step 2: Submit Loan Application
  async applyLoan(data) {
    const res = await fetch(`${API_BASE}/loans/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit loan application');
    }
    return await res.json();
  },

  // Flowchart Step 3 & 4: Review Loan Application (Approved? Yes -> Create Loan / No -> Reject Loan -> End)
  async reviewLoan(id, reviewData) {
    const res = await fetch(`${API_BASE}/loans/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to review loan');
    }
    return await res.json();
  },

  // Flowchart Step 5: Disburse Loan
  async disburseLoan(id, disburseData) {
    const res = await fetch(`${API_BASE}/loans/${id}/disburse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disburseData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to disburse loan');
    }
    return await res.json();
  },

  // Flowchart Step 6 & 7: Customer Makes Payment -> Fully Paid? (Yes -> Close Loan / No -> Continue Payment)
  async makePayment(id, paymentData) {
    const res = await fetch(`${API_BASE}/loans/${id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to make payment');
    }
    return await res.json();
  },

  // Payments
  async getPayments(loanId = '') {
    const query = loanId ? `?loan=${encodeURIComponent(loanId)}` : '';
    const res = await fetch(`${API_BASE}/payments${query}`);
    return await res.json();
  }
};
