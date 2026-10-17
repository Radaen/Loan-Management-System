import React from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { translations } from '../translations';

export function Dashboard({ 
  stats, 
  loans, 
  customers, 
  lang, 
  onViewLoan, 
  onOpenApplyLoan, 
  onOpenRegisterCustomer, 
  onOpenCalculator,
  onOpenReview,
  onOpenDisburse,
  onOpenPayment
}) {
  const t = translations[lang];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Pending Review</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">Approved / Ready</span>;
      case 'ACTIVE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active / Disbursed</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">Closed / Paid</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-800/40 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Loan Management System (LMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចីឆ្លាតវៃ' : 'Next-Gen Loan Management Platform'}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {lang === 'km' 
              ? 'គ្រប់គ្រងលំហូរការងារកម្ចីគ្រប់ដំណាក់កាល ចាប់ពីការចុះឈ្មោះអតិថិជន ពាក្យស្នើសុំ ការអនុម័ត ការបើកផ្តល់ប្រាក់ រហូតដល់ការសងផ្ដាច់'
              : 'Complete lifecycle engine conforming to your Loan Workflow Flowchart. Automate customer applications, loan approvals, disbursements, repayments, and closure.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenApplyLoan}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              {lang === 'km' ? '+ ដាក់ពាក្យស្នើសុំកម្ចីថ្មី' : '+ Submit New Application'}
            </button>
            <button
              onClick={onOpenRegisterCustomer}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {lang === 'km' ? '+ ចុះឈ្មោះអតិថិជន' : '+ Register Customer'}
            </button>
            <button
              onClick={onOpenCalculator}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {lang === 'km' ? '🧮 គណនាការប្រាក់' : '🧮 Loan Calculator'}
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Disbursed */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 hover:border-blue-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.totalDisbursed}</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">
            {formatCurrency(stats?.totalDisbursed)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {lang === 'km' ? 'ដើមទុនបានបើកផ្តល់សរុប' : 'Total principal disbursed'}
          </div>
        </div>

        {/* Total Repayments Collected */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 hover:border-blue-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.totalCollected}</span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white">
            {formatCurrency(stats?.totalCollected)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {lang === 'km' ? 'ប្រាក់ដើម + ការប្រាក់ប្រមូលបាន' : 'Principal + interest collected'}
          </div>
        </div>

        {/* Total Outstanding Balance */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 hover:border-blue-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.totalOutstanding}</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-amber-400">
            {formatCurrency(stats?.totalOutstanding)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {lang === 'km' ? 'សមតុល្យកំពុងរង់ចាំការសង' : 'Active portfolio outstanding'}
          </div>
        </div>

        {/* Active & Pending Applications */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-xl p-5 hover:border-blue-500/40 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.pendingLoans}</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stats?.pendingLoans || 0}</span>
            <span className="text-xs text-amber-400 font-medium">
              ({stats?.activeLoans || 0} {lang === 'km' ? 'កំពុងសង' : 'Active'})
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {lang === 'km' ? 'ពាក្យស្នើរង់ចាំការសម្រេច' : 'Applications awaiting officer review'}
          </div>
        </div>
      </div>

      {/* Quick Status Portfolio Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">{lang === 'km' ? 'អតិថិជនសរុប' : 'Total Customers'}</span>
            <span className="text-xl font-bold text-white mt-0.5 block">{customers?.length || 0}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">{lang === 'km' ? 'កម្ចីបានអនុម័ត' : 'Approved Loans'}</span>
            <span className="text-xl font-bold text-blue-400 mt-0.5 block">{stats?.approvedLoans || 0}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">{lang === 'km' ? 'កម្ចីសងរួចរាល់' : 'Fully Settled'}</span>
            <span className="text-xl font-bold text-purple-400 mt-0.5 block">{stats?.closedLoans || 0}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">{lang === 'km' ? 'កម្ចីបានបដិសេធ' : 'Rejected'}</span>
            <span className="text-xl font-bold text-red-400 mt-0.5 block">{stats?.rejectedLoans || 0}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Recent Applications & Pipeline Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              {lang === 'km' ? 'ពាក្យស្នើសុំ និងកម្ចីថ្មីៗ (Recent Loans)' : 'Recent Loan Applications'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'km' ? 'ត្រួតពិនិត្យ ដំណើរការ និងតាមដានកម្ចីតាម Flowchart' : 'Manage and advance loans through the approval & repayment pipeline'}
            </p>
          </div>
          <button
            onClick={() => onOpenApplyLoan()}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>{lang === 'km' ? 'មើលទាំងអស់' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Loan ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Rate / Term</th>
                <th className="py-3 px-4">Monthly Due</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 font-medium">
              {loans && loans.length > 0 ? (
                loans.slice(0, 8).map((loan) => (
                  <tr key={loan._id || loan.loanId} className="hover:bg-slate-700/30 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">
                      {loan.loanId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{loan.customer?.fullName || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{loan.customer?.phone || loan.customer?.khmerName || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      {formatCurrency(loan.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {loan.interestRate}% / {loan.termMonths} mo
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {formatCurrency(loan.monthlyPayment)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={loan.remainingBalance > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                        {formatCurrency(loan.remainingBalance)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(loan.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* Contextual Flowchart Action Button */}
                      {loan.status === 'PENDING' && (
                        <button
                          onClick={() => onOpenReview(loan)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition"
                        >
                          {lang === 'km' ? 'ត្រួតពិនិត្យ' : 'Review'}
                        </button>
                      )}
                      {loan.status === 'APPROVED' && (
                        <button
                          onClick={() => onOpenDisburse(loan)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition"
                        >
                          {lang === 'km' ? 'បើកផ្តល់កម្ចី' : 'Disburse'}
                        </button>
                      )}
                      {loan.status === 'ACTIVE' && (
                        <button
                          onClick={() => onOpenPayment(loan)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition"
                        >
                          {lang === 'km' ? 'បង់ប្រាក់សង' : 'Pay'}
                        </button>
                      )}
                      {loan.status === 'CLOSED' && (
                        <button
                          onClick={() => onViewLoan(loan)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-purple-300 transition"
                        >
                          {lang === 'km' ? 'បិទរួចរាល់ ✓' : 'Settled ✓'}
                        </button>
                      )}
                      {loan.status === 'REJECTED' && (
                        <button
                          onClick={() => onViewLoan(loan)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-red-300 transition"
                        >
                          {lang === 'km' ? 'បដិសេធ ✕' : 'Rejected'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    No loan applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
