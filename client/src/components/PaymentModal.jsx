import React, { useState } from 'react';
import { X, DollarSign, CreditCard, CheckCircle, PartyPopper, Receipt, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../translations';

export function PaymentModal({ isOpen, onClose, loan, onPaymentComplete, onViewReceipt, lang = 'km' }) {
  const t = translations[lang];

  // Find next unpaid installment
  const nextInstallment = loan?.schedule?.find(s => s.status !== 'PAID') || { totalDue: loan?.monthlyPayment || 100, installmentNumber: 1 };
  const suggestedAmount = nextInstallment.totalDue - (nextInstallment.paidAmount || 0);

  const [form, setForm] = useState({
    amount: suggestedAmount > 0 ? suggestedAmount.toFixed(2) : (loan?.remainingBalance || 100).toFixed(2),
    paymentMethod: 'ABA Pay',
    transactionRef: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
    notes: `Installment #${nextInstallment.installmentNumber || 1} payment`
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isOpen || !loan) return null;

  const handlePayFullRemaining = () => {
    setForm(prev => ({
      ...prev,
      amount: loan.remainingBalance.toFixed(2),
      notes: 'Full loan payoff / Early settlement'
    }));
  };

  const handlePaySuggested = () => {
    setForm(prev => ({
      ...prev,
      amount: suggestedAmount.toFixed(2),
      notes: `Installment #${nextInstallment.installmentNumber || 1} payment`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amt = Number(form.amount);
    if (isNaN(amt) || amt <= 0) {
      setError(lang === 'km' ? 'សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ' : 'Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const result = await onPaymentComplete(loan._id || loan.loanId, {
        amount: amt,
        paymentMethod: form.paymentMethod,
        transactionRef: form.transactionRef,
        notes: form.notes,
        installmentNumber: nextInstallment.installmentNumber || 1
      });

      // Check if fully paid
      if (result.isFullyPaid) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      }

      setPaymentSuccess(result);
    } catch (err) {
      setError(err.message || 'Payment processing failed');
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
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Flowchart Step 6 & 7</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'km' ? 'អតិថិជនបង់ប្រាក់សង (Customer Makes Payment)' : 'Customer Repayment'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If payment just succeeded */}
        {paymentSuccess ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">
                {lang === 'km' ? 'ការបង់ប្រាក់ជោគជ័យ!' : 'Payment Received Successfully!'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Receipt #{paymentSuccess.payment?.receiptNumber}
              </p>
            </div>

            {/* Decision Check: Fully Paid? */}
            <div className={`p-4 rounded-xl border ${
              paymentSuccess.isFullyPaid 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
            }`}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1">
                {lang === 'km' ? 'លទ្ធផលតាម Flowchart Decision: Fully Paid?' : 'Flowchart Decision: Fully Paid?'}
              </div>

              {paymentSuccess.isFullyPaid ? (
                <div className="space-y-1">
                  <div className="text-base font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
                    <span>YES ➔ CLOSE LOAN (END)</span>
                    <PartyPopper className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-emerald-300">
                    {lang === 'km' 
                      ? 'កម្ចីត្រូវបានសងរួចរាល់ ១០០%! ស្ថានភាពបានប្តូរទៅជា CLOSED (បញ្ចប់ដំណើរការ)' 
                      : 'Loan is 100% paid off. Status transitioned to CLOSED.'}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-base font-bold text-slate-200">
                    NO ➔ CONTINUE PAYMENT (LOOP)
                  </div>
                  <div className="text-xs text-slate-400">
                    {lang === 'km' ? 'សមតុល្យនៅសល់' : 'Remaining Principal Balance'}:{' '}
                    <strong className="text-amber-400">${paymentSuccess.loan?.remainingBalance?.toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onViewReceipt) onViewReceipt(paymentSuccess.payment, paymentSuccess.loan);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition"
              >
                <Receipt className="w-4 h-4 text-blue-400" />
                <span>{lang === 'km' ? 'មើលបង្កាន់ដៃ (Receipt)' : 'View Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
              >
                {lang === 'km' ? 'រួចរាល់ (Done)' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          /* Repayment Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-300">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
                {error}
              </div>
            )}

            {/* Loan Outstanding Info */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">{loan.loanId} - {loan.customer?.fullName}</span>
                <span className="text-xs text-slate-300">
                  {lang === 'km' ? 'សមតុល្យនៅជំពាក់' : 'Outstanding Balance'}:
                </span>
                <span className="text-lg font-bold text-amber-400 ml-1.5">
                  ${loan.remainingBalance?.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Next Installment Due</span>
                <span className="text-sm font-bold text-white">
                  ${suggestedAmount > 0 ? suggestedAmount.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePaySuggested}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition"
              >
                Pay 1 Month (${suggestedAmount.toFixed(2)})
              </button>
              <button
                type="button"
                onClick={handlePayFullRemaining}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
              >
                Pay Full Balance (${loan.remainingBalance.toFixed(2)})
              </button>
            </div>

            {/* Payment Amount */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'ចំនួនទឹកប្រាក់ត្រូវបង់ ($ USD)*' : 'Payment Amount ($ USD)*'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'មធ្យោបាយទូទាត់ (Payment Method)*' : 'Payment Method*'}
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="ABA Pay">ABA Pay / KHQR</option>
                <option value="Wing Bank">Wing Bank / Wing App</option>
                <option value="ACLEDA Pay">ACLEDA Pay / ToanChet</option>
                <option value="Cash">Cash (សាច់ប្រាក់សុទ្ធ)</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Reference */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'លេខយោងប្រតិបត្តិការ (TRX Reference)' : 'Transaction Reference / Receipt ID'}
              </label>
              <input
                type="text"
                value={form.transactionRef}
                onChange={(e) => setForm({ ...form, transactionRef: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'ចំណាំ (Notes)' : 'Payment Notes'}
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800">
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <DollarSign className="w-4 h-4" />
                <span>{loading ? 'Processing...' : (lang === 'km' ? 'បញ្ជាក់ការទូទាត់' : 'Confirm Repayment')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
