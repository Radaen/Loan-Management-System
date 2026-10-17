import React from 'react';
import { 
  X, 
  Printer, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  User, 
  FileText, 
  SendHorizontal, 
  Sparkles
} from 'lucide-react';
import { translations } from '../translations';

export function LoanDetailsModal({ 
  isOpen, 
  onClose, 
  loan, 
  lang = 'km',
  onOpenReview,
  onOpenDisburse,
  onOpenPayment,
  onViewReceipt
}) {
  const t = translations[lang] || translations.km;

  if (!isOpen || !loan) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">Pending Review</span>;
      case 'APPROVED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">Approved / Ready to Disburse</span>;
      case 'ACTIVE':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active / Disbursed</span>;
      case 'CLOSED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">Closed / Fully Settled</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{loan.loanId}</span>
                {getStatusBadge(loan.status)}
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {loan.customer?.fullName} {loan.customer?.khmerName ? `(${loan.customer?.khmerName})` : ''}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Print Loan Dossier & Schedule"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Key Loan Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">{t.amount}</span>
              <span className="text-lg font-bold text-white mt-0.5 block">
                ${loan.amount?.toLocaleString()} USD
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">{t.monthlyPayment}</span>
              <span className="text-lg font-bold text-blue-400 mt-0.5 block">
                ${loan.monthlyPayment?.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">{t.totalPaid}</span>
              <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                ${loan.totalPaid?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">{t.balance}</span>
              <span className="text-lg font-bold text-amber-400 mt-0.5 block">
                ${loan.remainingBalance?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Workflow Action Bar based on current status */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Workflow Status Action</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {loan.status === 'PENDING' && (lang === 'km' ? 'ពាក្យស្នើសុំកំពុងរង់ចាំការត្រួតពិនិត្យ (Approved / Reject)' : 'Pending loan officer review and decision')}
                {loan.status === 'APPROVED' && (lang === 'km' ? 'កម្ចីត្រូវបានអនុម័ត! ជំហានបន្ទាប់គឺ បើកផ្តល់ប្រាក់កម្ចី (Disburse Loan)' : 'Loan is approved! Ready to disburse capital to customer')}
                {loan.status === 'ACTIVE' && (lang === 'km' ? 'កម្ចីកំពុងសកម្ម! អតិថិជនធ្វើការទូទាត់សង (Customer Makes Payment)' : 'Loan is active! Process repayment installments until fully settled')}
                {loan.status === 'CLOSED' && (lang === 'km' ? 'កម្ចីត្រូវបានសងរួចរាល់ទាំងស្រុង និងបិទបញ្ចប់ជោគជ័យ' : 'Loan has been fully settled and officially closed')}
                {loan.status === 'REJECTED' && (lang === 'km' ? 'កម្ចីត្រូវបានបដិសេធ' : 'Loan application was rejected during review')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {loan.status === 'PENDING' && (
                <button
                  onClick={() => { onClose(); onOpenReview(loan); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition"
                >
                  {lang === 'km' ? 'ត្រួតពិនិត្យ (Review Loan)' : 'Review Loan Application'}
                </button>
              )}
              {loan.status === 'APPROVED' && (
                <button
                  onClick={() => { onClose(); onOpenDisburse(loan); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
                >
                  {lang === 'km' ? 'បើកផ្តល់ប្រាក់ (Disburse Loan)' : 'Disburse Loan Capital'}
                </button>
              )}
              {loan.status === 'ACTIVE' && (
                <button
                  onClick={() => { onClose(); onOpenPayment(loan); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                >
                  {lang === 'km' ? 'បង់ប្រាក់សង (Make Payment)' : 'Record Repayment'}
                </button>
              )}
            </div>
          </div>

          {/* Amortization Schedule Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  {lang === 'km' ? 'កាលវិភាគបង់ប្រាក់ប្រចាំខែ (Amortization Schedule)' : 'Repayment Installment Schedule'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {loan.termMonths} installments • Rate: {loan.interestRate}%/yr • Method: {loan.interestType || 'declining'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">{t.dueDate}</th>
                    <th className="py-2.5 px-3">{t.principal}</th>
                    <th className="py-2.5 px-3">{t.interest}</th>
                    <th className="py-2.5 px-3">{t.monthlyPayment}</th>
                    <th className="py-2.5 px-3">{t.balance}</th>
                    <th className="py-2.5 px-3">{t.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {loan.schedule && loan.schedule.length > 0 ? (
                    loan.schedule.map((item) => (
                      <tr key={item.installmentNumber} className={item.status === 'PAID' ? 'bg-emerald-950/20' : 'hover:bg-slate-800/40'}>
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {item.installmentNumber}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-200">
                          ${item.principalDue?.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-amber-400">
                          ${item.interestDue?.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">
                          ${item.totalDue?.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          ${item.remainingPrincipal?.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3">
                          {item.status === 'PAID' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              PAID ✓
                            </span>
                          ) : item.status === 'PARTIAL' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              PARTIAL (${item.paidAmount})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/50 text-slate-400">
                              PENDING
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-6 text-center text-slate-500">
                        Schedule will be generated upon loan approval and disbursement.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
