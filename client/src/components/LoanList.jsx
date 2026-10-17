import React, { useState } from 'react';
import { Search, PlusCircle, Filter, FileText, ArrowRight, Eye, CheckCircle2, XCircle, SendHorizontal, DollarSign } from 'lucide-react';
import { translations } from '../translations';

export function LoanList({ 
  loans, 
  lang, 
  onViewLoan, 
  onOpenApplyLoan,
  onOpenReview,
  onOpenDisburse,
  onOpenPayment
}) {
  const t = translations[lang];
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const statusTabs = [
    { id: 'ALL', label: t.all, count: loans.length },
    { id: 'PENDING', label: t.pendingLoans, count: loans.filter(l => l.status === 'PENDING').length },
    { id: 'APPROVED', label: t.approvedLoans, count: loans.filter(l => l.status === 'APPROVED').length },
    { id: 'ACTIVE', label: t.activeLoans, count: loans.filter(l => l.status === 'ACTIVE').length },
    { id: 'CLOSED', label: t.closedLoans, count: loans.filter(l => l.status === 'CLOSED').length },
    { id: 'REJECTED', label: t.rejectedLoans, count: loans.filter(l => l.status === 'REJECTED').length },
  ];

  const filteredLoans = loans.filter(loan => {
    const matchesStatus = selectedStatus === 'ALL' || loan.status === selectedStatus;
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      loan.loanId?.toLowerCase().includes(q) ||
      loan.customer?.fullName?.toLowerCase().includes(q) ||
      loan.customer?.khmerName?.toLowerCase().includes(q) ||
      loan.customer?.phone?.toLowerCase().includes(q) ||
      loan.loanType?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Pending Review</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">Approved / Ready</span>;
      case 'ACTIVE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active / Disbursed</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">Closed / Settled</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{lang === 'km' ? 'ពាក្យស្នើសុំ និងផលប័ត្រកម្ចី (Loan Portfolio)' : 'Loan Applications & Portfolio'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              {loans.length} {lang === 'km' ? 'កម្ចី' : 'loans'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km' 
              ? 'គ្រប់គ្រងដំណើរការកម្ចីគ្រប់ដំណាក់កាលតាម Flowchart Diagram' 
              : 'Pipeline conforming to your flowchart: Submit -> Review -> Approve/Reject -> Disburse -> Repay -> Close'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរកលេខកម្ចី, ឈ្មោះ...' : 'Search by Loan ID, Borrower...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>

          <button
            onClick={onOpenApplyLoan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'km' ? '+ ស្នើកម្ចីថ្មី' : '+ New Application'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center overflow-x-auto pb-2 gap-2 border-b border-slate-800">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-blue-800 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Loan ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Rate & Term</th>
                <th className="py-3 px-4">Monthly Due</th>
                <th className="py-3 px-4">Remaining Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 font-medium">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan._id || loan.loanId} className="hover:bg-slate-700/30 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {loan.loanId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{loan.customer?.fullName || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{loan.customer?.khmerName || loan.customer?.phone || ''}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] border border-slate-700">
                        {loan.loanType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      ${loan.amount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {loan.interestRate}% / {loan.termMonths} mo
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      ${loan.monthlyPayment?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={loan.remainingBalance > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        ${loan.remainingBalance?.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(loan.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View dossier */}
                        <button
                          onClick={() => onViewLoan(loan)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                          title="View Details & Schedule"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Step-specific Flowchart action button */}
                        {loan.status === 'PENDING' && (
                          <button
                            onClick={() => onOpenReview(loan)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow transition flex items-center gap-1"
                          >
                            <span>Review</span>
                          </button>
                        )}
                        {loan.status === 'APPROVED' && (
                          <button
                            onClick={() => onOpenDisburse(loan)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition flex items-center gap-1"
                          >
                            <SendHorizontal className="w-3.5 h-3.5" />
                            <span>Disburse</span>
                          </button>
                        )}
                        {loan.status === 'ACTIVE' && (
                          <button
                            onClick={() => onOpenPayment(loan)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500">
                    {lang === 'km' ? 'រកមិនឃើញទិន្នន័យកម្ចីទេ' : 'No loans found matching your criteria.'}
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
