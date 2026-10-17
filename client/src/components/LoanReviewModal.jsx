import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, ShieldCheck, DollarSign, Calendar, User } from 'lucide-react';
import { translations } from '../translations';

export function LoanReviewModal({ isOpen, onClose, loan, onReviewComplete, lang = 'km' }) {
  const t = translations[lang];

  const [decision, setDecision] = useState('APPROVED'); // 'APPROVED' | 'REJECTED'
  const [reviewNotes, setReviewNotes] = useState('Income documents verified. Credit risk is within normal parameters.');
  const [rejectionReason, setRejectionReason] = useState('Debt-to-income ratio exceeds acceptable limits');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !loan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await onReviewComplete(loan._id || loan.loanId, {
        decision,
        reviewNotes,
        rejectionReason: decision === 'REJECTED' ? rejectionReason : ''
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit loan review decision');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Flowchart Step 3 & 4</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'km' ? 'ត្រួតពិនិត្យពាក្យស្នើសុំកម្ចី (Review Loan Application)' : 'Review Loan Application'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Loan Applicant Summary */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-blue-400 text-sm">{loan.loanId}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PENDING REVIEW
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Customer:</span>
                <span className="font-bold text-white text-sm">{loan.customer?.fullName}</span>
                <span className="text-[11px] text-slate-400 block">Income: ${loan.customer?.monthlyIncome}/mo</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Requested Amount:</span>
                <span className="font-bold text-emerald-400 text-base">${loan.amount?.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 block">{loan.termMonths} months @ {loan.interestRate}%/yr</span>
              </div>
            </div>

            {loan.purpose && (
              <div className="pt-2 border-t border-slate-700/40 text-[11px] text-slate-400">
                <span>Purpose: </span>
                <span className="text-slate-200">{loan.purpose}</span>
              </div>
            )}
          </div>

          {/* Decision Selection: YES (Approved) vs NO (Reject Loan) */}
          <div>
            <label className="block text-slate-300 font-bold mb-2">
              {lang === 'km' ? 'ការសម្រេចចិត្ត (Approved? Decision Diamond in Flowchart)*' : 'Decision (Flowchart Diamond: Approved?)*'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* YES Option */}
              <button
                type="button"
                onClick={() => setDecision('APPROVED')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  decision === 'APPROVED'
                    ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle className={`w-5 h-5 ${decision === 'APPROVED' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-bold text-xs">YES - Approved</span>
                <span className="text-[10px] text-slate-400 text-center">
                  {lang === 'km' ? 'យល់ព្រម -> Create Loan' : 'Create Loan & Generate Schedule'}
                </span>
              </button>

              {/* NO Option */}
              <button
                type="button"
                onClick={() => setDecision('REJECTED')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  decision === 'REJECTED'
                    ? 'bg-red-600/20 border-red-500 text-white ring-2 ring-red-500/40'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <XCircle className={`w-5 h-5 ${decision === 'REJECTED' ? 'text-red-400' : 'text-slate-500'}`} />
                <span className="font-bold text-xs">NO - Reject Loan</span>
                <span className="text-[10px] text-slate-400 text-center">
                  {lang === 'km' ? 'បដិសេធ -> End Flow' : 'Reject Loan -> End'}
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Note / Rejection Reason */}
          {decision === 'APPROVED' ? (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'កំណត់ចំណាំការអនុម័ត (Approval Notes)' : 'Approval Notes'}
              </label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Notes for credit committee..."
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-red-400 mb-1 font-semibold">
                {lang === 'km' ? 'មូលហេតុនៃការបដិសេធ (Rejection Reason)*' : 'Rejection Reason (Required)*'}
              </label>
              <textarea
                rows={2}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State reason why loan cannot be approved..."
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-red-500/50 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800">
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white shadow-lg transition disabled:opacity-50 ${
                decision === 'APPROVED'
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                  : 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
              }`}
            >
              {decision === 'APPROVED' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>
                {loading
                  ? 'Processing...'
                  : decision === 'APPROVED'
                  ? (lang === 'km' ? 'អនុម័តកម្ចី (Create Loan)' : 'Confirm Approval & Create Loan')
                  : (lang === 'km' ? 'បញ្ជាក់ការបដិសេធ (Reject)' : 'Confirm Rejection (End)')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
