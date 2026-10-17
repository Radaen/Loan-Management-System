import React, { useState, useEffect } from 'react';
import { api } from './api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CustomerList } from './components/CustomerList';
import { CustomerModal } from './components/CustomerModal';
import { LoanList } from './components/LoanList';
import { LoanApplyModal } from './components/LoanApplyModal';
import { LoanReviewModal } from './components/LoanReviewModal';
import { LoanDisburseModal } from './components/LoanDisburseModal';
import { PaymentModal } from './components/PaymentModal';
import { PaymentList } from './components/PaymentList';
import { LoanDetailsModal } from './components/LoanDetailsModal';
import { PaymentReceiptModal } from './components/PaymentReceiptModal';
import { LoanCalculatorModal } from './components/LoanCalculatorModal';
import { translations } from './translations';
import { RefreshCw } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState('km'); // default Khmer as requested by user
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data State
  const [dbStatus, setDbStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [isLoanApplyModalOpen, setIsLoanApplyModalOpen] = useState(false);
  const [applyForCustomerId, setApplyForCustomerId] = useState(null);

  const [isLoanReviewModalOpen, setIsLoanReviewModalOpen] = useState(false);
  const [reviewingLoan, setReviewingLoan] = useState(null);

  const [isLoanDisburseModalOpen, setIsLoanDisburseModalOpen] = useState(false);
  const [disbursingLoan, setDisbursingLoan] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payingLoan, setPayingLoan] = useState(null);

  const [isLoanDetailsModalOpen, setIsLoanDetailsModalOpen] = useState(false);
  const [viewingLoan, setViewingLoan] = useState(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [viewingPaymentLoan, setViewingPaymentLoan] = useState(null);

  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusRes, statsRes, custRes, loanRes, payRes] = await Promise.all([
        api.getSystemStatus(),
        api.getDashboardStats(),
        api.getCustomers(),
        api.getLoans(),
        api.getPayments()
      ]);

      setDbStatus(statusRes);
      setStats(statsRes);
      setCustomers(custRes);
      setLoans(loanRes);
      setPayments(payRes);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for customer
  const handleSaveCustomer = async (data) => {
    if (editingCustomer) {
      await api.updateCustomer(editingCustomer._id || editingCustomer.customerId, data);
    } else {
      await api.createCustomer(data);
    }
    await fetchData();
  };

  const handleOpenEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleApplyForCustomer = (customer) => {
    setApplyForCustomerId(customer._id || customer.customerId);
    setIsLoanApplyModalOpen(true);
  };

  // Handlers for Loan Workflow Steps
  const handleLoanCreated = async (newLoan) => {
    await fetchData();
    setViewingLoan(newLoan);
    setIsLoanDetailsModalOpen(true);
  };

  const handleReviewComplete = async (loanId, payload) => {
    await api.reviewLoan(loanId, payload);
    await fetchData();
  };

  const handleDisburseComplete = async (loanId, payload) => {
    await api.disburseLoan(loanId, payload);
    await fetchData();
  };

  const handlePaymentComplete = async (loanId, payload) => {
    const res = await api.makePayment(loanId, payload);
    await fetchData();
    return res;
  };

  const handleViewReceipt = (payment, loan) => {
    setViewingPayment(payment);
    setViewingPaymentLoan(loan);
    setIsReceiptModalOpen(true);
  };

  const handleViewLoanDetails = (loan) => {
    setViewingLoan(loan);
    setIsLoanDetailsModalOpen(true);
  };

  const pendingCount = loans.filter(l => l.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Left Sidebar Menu */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        dbStatus={dbStatus}
        pendingCount={pendingCount}
        onOpenRegisterCustomer={() => {
          setEditingCustomer(null);
          setIsCustomerModalOpen(true);
        }}
        onOpenApplyLoan={() => {
          setApplyForCustomerId(null);
          setIsLoanApplyModalOpen(true);
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (Offset by Sidebar on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          lang={lang}
          setLang={setLang}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenApplyLoan={() => {
            setApplyForCustomerId(null);
            setIsLoanApplyModalOpen(true);
          }}
          onOpenRegisterCustomer={() => {
            setEditingCustomer(null);
            setIsCustomerModalOpen(true);
          }}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Loading Indicator */}
          {loading && (
            <div className="mb-4 flex items-center justify-center p-3 rounded-xl bg-blue-900/20 border border-blue-500/20 text-blue-300 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              <span>Loading database records...</span>
            </div>
          )}

          {/* View 1: Dashboard */}
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              loans={loans}
              customers={customers}
              lang={lang}
              onViewLoan={handleViewLoanDetails}
              onOpenApplyLoan={() => {
                setApplyForCustomerId(null);
                setIsLoanApplyModalOpen(true);
              }}
              onOpenRegisterCustomer={() => {
                setEditingCustomer(null);
                setIsCustomerModalOpen(true);
              }}
              onOpenCalculator={() => setIsCalculatorModalOpen(true)}
              onOpenReview={(loan) => {
                setReviewingLoan(loan);
                setIsLoanReviewModalOpen(true);
              }}
              onOpenDisburse={(loan) => {
                setDisbursingLoan(loan);
                setIsLoanDisburseModalOpen(true);
              }}
              onOpenPayment={(loan) => {
                setPayingLoan(loan);
                setIsPaymentModalOpen(true);
              }}
            />
          )}

          {/* View 2: Loans */}
          {activeTab === 'loans' && (
            <LoanList
              loans={loans}
              lang={lang}
              onViewLoan={handleViewLoanDetails}
              onOpenApplyLoan={() => {
                setApplyForCustomerId(null);
                setIsLoanApplyModalOpen(true);
              }}
              onOpenReview={(loan) => {
                setReviewingLoan(loan);
                setIsLoanReviewModalOpen(true);
              }}
              onOpenDisburse={(loan) => {
                setDisbursingLoan(loan);
                setIsLoanDisburseModalOpen(true);
              }}
              onOpenPayment={(loan) => {
                setPayingLoan(loan);
                setIsPaymentModalOpen(true);
              }}
            />
          )}

          {/* View 3: Customers */}
          {activeTab === 'customers' && (
            <CustomerList
              customers={customers}
              lang={lang}
              onOpenRegister={() => {
                setEditingCustomer(null);
                setIsCustomerModalOpen(true);
              }}
              onApplyForCustomer={handleApplyForCustomer}
              onEditCustomer={handleOpenEditCustomer}
            />
          )}

          {/* View 4: Payments */}
          {activeTab === 'payments' && (
            <PaymentList
              payments={payments}
              loans={loans}
              lang={lang}
              onViewReceipt={handleViewReceipt}
              onOpenPayment={(loan) => {
                setPayingLoan(loan);
                setIsPaymentModalOpen(true);
              }}
            />
          )}

          {/* View 6: Calculator Tool */}
          {activeTab === 'calculator' && (
            <div className="max-w-3xl mx-auto">
              <LoanCalculatorModal
                isOpen={true}
                onClose={() => setActiveTab('dashboard')}
                lang={lang}
                onApplyWithValues={(vals) => {
                  setActiveTab('loans');
                  setIsLoanApplyModalOpen(true);
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* ALL WORKFLOW MODALS */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        editingCustomer={editingCustomer}
        lang={lang}
      />

      <LoanApplyModal
        isOpen={isLoanApplyModalOpen}
        onClose={() => setIsLoanApplyModalOpen(false)}
        customers={customers}
        initialCustomerId={applyForCustomerId}
        onLoanCreated={handleLoanCreated}
        lang={lang}
      />

      <LoanReviewModal
        isOpen={isLoanReviewModalOpen}
        onClose={() => setIsLoanReviewModalOpen(false)}
        loan={reviewingLoan}
        onReviewComplete={handleReviewComplete}
        lang={lang}
      />

      <LoanDisburseModal
        isOpen={isLoanDisburseModalOpen}
        onClose={() => setIsLoanDisburseModalOpen(false)}
        loan={disbursingLoan}
        onDisburseComplete={handleDisburseComplete}
        lang={lang}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        loan={payingLoan}
        onPaymentComplete={handlePaymentComplete}
        onViewReceipt={handleViewReceipt}
        lang={lang}
      />

      <LoanDetailsModal
        isOpen={isLoanDetailsModalOpen}
        onClose={() => setIsLoanDetailsModalOpen(false)}
        loan={viewingLoan}
        lang={lang}
        onOpenReview={(l) => {
          setReviewingLoan(l);
          setIsLoanReviewModalOpen(true);
        }}
        onOpenDisburse={(l) => {
          setDisbursingLoan(l);
          setIsLoanDisburseModalOpen(true);
        }}
        onOpenPayment={(l) => {
          setPayingLoan(l);
          setIsPaymentModalOpen(true);
        }}
        onViewReceipt={handleViewReceipt}
      />

      <PaymentReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={viewingPayment}
        loan={viewingPaymentLoan}
        lang={lang}
      />

      {activeTab !== 'calculator' && (
        <LoanCalculatorModal
          isOpen={isCalculatorModalOpen}
          onClose={() => setIsCalculatorModalOpen(false)}
          lang={lang}
          onApplyWithValues={(vals) => {
            setIsLoanApplyModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
