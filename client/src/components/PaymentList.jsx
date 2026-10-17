import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Printer, 
  Eye, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { translations } from '../translations';

export function PaymentList({ 
  payments = [], 
  loans = [], 
  lang = 'km', 
  onViewReceipt,
  onOpenPayment 
}) {
  const t = translations[lang] || translations.km;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all' | 'active_loans'

  const safePayments = Array.isArray(payments) ? payments : [];
  const safeLoans = Array.isArray(loans) ? loans : [];

  // Filter payments
  const filteredPayments = safePayments.filter(p => {
    if (!p) return false;
    const q = (searchTerm || '').toLowerCase();
    const receiptNum = (p.receiptNumber || '').toLowerCase();
    const custName = (p.customer?.fullName || p.customer?.name || '').toLowerCase();
    const loanCode = (p.loan?.loanId || p.loanId || '').toLowerCase();
    const ref = (p.transactionRef || '').toLowerCase();

    return receiptNum.includes(q) || custName.includes(q) || loanCode.includes(q) || ref.includes(q);
  });

  // Active loans that have remaining balance
  const activeLoans = safeLoans.filter(l => l && l.status === 'ACTIVE');

  const totalCollected = safePayments.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + (Number(l?.remainingBalance) || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{lang === 'km' ? 'ការបង់ប្រាក់សង (Repayments & Receipts)' : 'Repayments & Receipts'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              {safePayments.length} {lang === 'km' ? 'ប្រតិបត្តិការ' : 'transactions'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km' 
              ? 'កត់ត្រាការទូទាត់ប្រាក់សង គ្រប់គ្រងបង្កាន់ដៃ និងតាមដានសមតុល្យកម្ចី' 
              : 'Process loan installment payments, print official receipts, and audit transaction records'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរកបង្កាន់ដៃ, ឈ្មោះ...' : 'Search receipt, customer...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-56 sm:w-64"
            />
          </div>

          {activeLoans.length > 0 && onOpenPayment && (
            <button
              onClick={() => onOpenPayment(activeLoans[0])}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'km' ? '+ បង់ប្រាក់សងថ្មី' : '+ Record Payment'}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">{lang === 'km' ? 'ប្រាក់ប្រមូលបានសរុប' : 'Total Collected'}</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
              ${totalCollected.toLocaleString()} USD
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">{lang === 'km' ? 'សមតុល្យកំពុងរង់ចាំការសង' : 'Active Balance Due'}</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">
              ${totalOutstanding.toLocaleString()} USD
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">{lang === 'km' ? 'កម្ចីសកម្មកំពុងសង' : 'Active Repaying Loans'}</span>
            <span className="text-xl font-bold text-blue-400 mt-0.5 block">
              {activeLoans.length} {lang === 'km' ? 'កម្ចី' : 'loans'}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Sub tabs: Repayment History vs Active Loans needing payment */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeSubTab === 'all' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {lang === 'km' ? 'ប្រវត្តិទូទាត់សង (Payment History)' : 'Payment History'} ({safePayments.length})
        </button>

        <button
          onClick={() => setActiveSubTab('active_loans')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeSubTab === 'active_loans' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {lang === 'km' ? 'កម្ចីសកម្មត្រូវបង់សង (Loans to Pay)' : 'Active Loans to Pay'} ({activeLoans.length})
        </button>
      </div>

      {/* SUB TAB 1: Payment History */}
      {activeSubTab === 'all' && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Loan ID</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 font-medium">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((p, idx) => {
                    const associatedLoan = safeLoans.find(l => (
                      l && (l._id === p?.loan?._id || l.loanId === p?.loan?.loanId || l._id === p?.loan || l.loanId === p?.loan)
                    ));
                    const custName = p?.customer?.fullName || p?.customer?.name || associatedLoan?.customer?.fullName || 'N/A';
                    const loanIdText = p?.loan?.loanId || associatedLoan?.loanId || 'N/A';

                    return (
                      <tr key={p?._id || p?.paymentId || idx} className="hover:bg-slate-700/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                          {p?.receiptNumber || `RCP-${idx + 1}`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {p?.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {custName}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {loanIdText}
                        </td>
                        <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                          ${Number(p?.amount || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 text-[11px] border border-slate-700">
                            {p?.paymentMethod || 'ABA Pay'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                          {p?.transactionRef || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onViewReceipt && onViewReceipt(p, associatedLoan || p.loan)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white border border-slate-700 transition inline-flex items-center gap-1.5"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>{lang === 'km' ? 'បង្កាន់ដៃ' : 'Receipt'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500">
                      {lang === 'km' ? 'មិនទាន់មានកំណត់ត្រាបង់ប្រាក់នៅឡើយទេ' : 'No payment records found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: Active Loans to Pay */}
      {activeSubTab === 'active_loans' && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">Loan ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Original Loan</th>
                  <th className="py-3 px-4">Monthly Due</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-4">Remaining Balance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 font-medium">
                {activeLoans.length > 0 ? (
                  activeLoans.map((loan) => (
                    <tr key={loan._id || loan.loanId} className="hover:bg-slate-700/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        {loan.loanId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {loan.customer?.fullName || 'N/A'}
                        <div className="text-[11px] text-slate-400 font-normal">{loan.customer?.phone || ''}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        ${loan.amount?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        ${loan.monthlyPayment?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                        ${loan.totalPaid?.toLocaleString() || 0}
                      </td>
                      <td className="py-3.5 px-4 font-black text-amber-400 text-sm">
                        ${loan.remainingBalance?.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenPayment && onOpenPayment(loan)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition inline-flex items-center gap-1.5"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{lang === 'km' ? 'បង់ប្រាក់សង' : 'Make Payment'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500">
                      {lang === 'km' ? 'គ្មានកម្ចីសកម្មដែលត្រូវបង់សងនៅឡើយទេ' : 'No active loans require payment at this moment.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
