import React, { useState } from 'react';
import { X, SendHorizontal, DollarSign, Calendar, CreditCard, CheckCircle2 } from 'lucide-react';
import { translations } from '../translations';

export function LoanDisburseModal({ isOpen, onClose, loan, onDisburseComplete, lang = 'km' }) {
  const t = translations[lang];

  const [form, setForm] = useState({
    disbursementMethod: 'Bank Transfer (ABA)',
    disbursementRef: `DISB-${Math.floor(100000 + Math.random() * 900000)}`,
    disbursementDate: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !loan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await onDisburseComplete(loan._id || loan.loanId, {
        disbursementMethod: form.disbursementMethod,
        disbursementRef: form.disbursementRef,
        disbursementDate: form.disbursementDate
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to disburse loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <SendHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Flowchart Step 5</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'km' ? 'បើកផ្តល់ប្រាក់កម្ចី (Disburse Loan)' : 'Disburse Loan Capital'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-300">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Loan Disbursal Amount Banner */}
          <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-blue-300 font-medium block">
                {lang === 'km' ? 'ទឹកប្រាក់ត្រូវបើកផ្តល់' : 'Disbursement Amount'}
              </span>
              <span className="text-2xl font-extrabold text-white">
                ${loan.amount?.toLocaleString()} USD
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Borrower</span>
              <span className="font-bold text-white">{loan.customer?.fullName}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {lang === 'km' ? 'មធ្យោបាយបើកផ្តល់ (Payment Channel)*' : 'Disbursement Method*'}
            </label>
            <select
              value={form.disbursementMethod}
              onChange={(e) => setForm({ ...form, disbursementMethod: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="Bank Transfer (ABA)">Bank Transfer (ABA Bank)</option>
              <option value="Wing Bank">Wing Bank / Wing Agent</option>
              <option value="ACLEDA Pay">ACLEDA Bank</option>
              <option value="Cash">Cash at Counter</option>
              <option value="Cheque">Bank Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {lang === 'km' ? 'លេខប្រតិបត្តិការ / លេខយោង (Reference ID)' : 'Transaction Reference / Cheque No.'}
            </label>
            <input
              type="text"
              required
              value={form.disbursementRef}
              onChange={(e) => setForm({ ...form, disbursementRef: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {lang === 'km' ? 'កាលបរិច្ឆេទបើកផ្តល់ (Disbursement Date)' : 'Disbursement Date'}
            </label>
            <input
              type="date"
              required
              value={form.disbursementDate}
              onChange={(e) => setForm({ ...form, disbursementDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            ℹ️ {lang === 'km'
              ? 'បន្ទាប់ពីបើកផ្តល់ប្រាក់កម្ចី ស្ថានភាពនឹងប្តូរទៅជា ACTIVE ហើយកាលវិភាគសងប្រាក់នឹងចាប់ផ្តើមដំណើរការ។'
              : 'Disbursing this loan transitions the status to ACTIVE and begins the official repayment schedule.'}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800">
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Disbursing...' : (lang === 'km' ? 'បញ្ជាក់ការបើកផ្តល់ប្រាក់' : 'Confirm Disbursement')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
