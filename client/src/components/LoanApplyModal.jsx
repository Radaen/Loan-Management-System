import React, { useState, useEffect } from 'react';
import { X, Send, Calculator, AlertCircle, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import { api } from '../api';
import { translations } from '../translations';

export function LoanApplyModal({ isOpen, onClose, customers, initialCustomerId = null, onLoanCreated, lang = 'km' }) {
  const t = translations[lang];

  const [form, setForm] = useState({
    customer: '',
    amount: '3000',
    interestRate: '12',
    termMonths: '6',
    loanType: 'Personal',
    interestType: 'declining',
    purpose: ''
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCustomerId) {
      setForm(prev => ({ ...prev, customer: initialCustomerId }));
    } else if (customers.length > 0 && !form.customer) {
      setForm(prev => ({ ...prev, customer: customers[0]._id || customers[0].customerId }));
    }
  }, [initialCustomerId, customers, isOpen]);

  // Recalculate preview live whenever amount, rate, term or interestType changes
  useEffect(() => {
    if (!form.amount || !form.interestRate || !form.termMonths) return;
    const fetchPreview = async () => {
      try {
        const res = await api.previewCalculator({
          amount: Number(form.amount),
          interestRate: Number(form.interestRate),
          termMonths: Number(form.termMonths),
          interestType: form.interestType
        });
        setPreview(res);
      } catch (err) {
        console.error('Preview error:', err);
      }
    };
    fetchPreview();
  }, [form.amount, form.interestRate, form.termMonths, form.interestType]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customer) {
      setError(lang === 'km' ? 'សូមជ្រើសរើសអតិថិជន' : 'Please select a customer');
      return;
    }
    if (Number(form.amount) <= 0) {
      setError(lang === 'km' ? 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង ០' : 'Loan amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customer: form.customer,
        amount: Number(form.amount),
        interestRate: Number(form.interestRate),
        termMonths: Number(form.termMonths),
        loanType: form.loanType,
        interestType: form.interestType,
        purpose: form.purpose
      };

      const result = await api.applyLoan(payload);
      onLoanCreated(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomerObj = customers.find(c => (c._id === form.customer || c.customerId === form.customer));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 2 in Flowchart</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'km' ? 'ដាក់ពាក្យស្នើសុំប្រាក់កម្ចី (Submit Loan Application)' : 'Submit Loan Application'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Select Customer */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">
              {lang === 'km' ? 'ជ្រើសរើសអតិថិជន (Select Customer)*' : 'Select Customer*'}
            </label>
            <select
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c._id || c.customerId} value={c._id || c.customerId}>
                  {c.customerId} - {c.fullName} {c.khmerName ? `(${c.khmerName})` : ''} - Income: ${c.monthlyIncome}
                </option>
              ))}
            </select>

            {selectedCustomerObj && (
              <div className="mt-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Monthly Income: <strong className="text-emerald-400">${selectedCustomerObj.monthlyIncome}</strong></span>
                <span className="text-slate-400">Phone: <strong className="text-white">{selectedCustomerObj.phone}</strong></span>
                <span className="text-slate-400">National ID: <strong className="text-white">{selectedCustomerObj.nationalId}</strong></span>
              </div>
            )}
          </div>

          {/* Loan Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'ចំនួនប្រាក់កម្ចី ($ USD)*' : 'Loan Amount ($ USD)*'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="100"
                  step="50"
                  placeholder="3000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'អត្រាការប្រាក់ (% ក្នុងមួយឆ្នាំ)*' : 'Interest Rate (% per year)*'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  step="0.5"
                  placeholder="12"
                  value={form.interestRate}
                  onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-3 top-2 text-slate-400 font-semibold">%</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {(Number(form.interestRate) / 12).toFixed(2)}% {lang === 'km' ? 'ក្នុងមួយខែ' : 'per month'}
              </span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'រយៈពេលសង (ខែ)*' : 'Repayment Term (Months)*'}
              </label>
              <select
                value={form.termMonths}
                onChange={(e) => setForm({ ...form, termMonths: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="36">36 Months (3 Years)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'វិធីសាស្ត្រគណនាការប្រាក់' : 'Calculation Method'}
              </label>
              <select
                value={form.interestType}
                onChange={(e) => setForm({ ...form, interestType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="declining">Declining Balance (Equal Installment - EMI)</option>
                <option value="flat">Flat Interest Rate</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'ប្រភេទកម្ចី (Loan Type)' : 'Loan Category'}
              </label>
              <select
                value={form.loanType}
                onChange={(e) => setForm({ ...form, loanType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="Personal">Personal / ផ្ទាល់ខ្លួន</option>
                <option value="Business">Business / អាជីវកម្ម</option>
                <option value="Agriculture">Agriculture / កសិកម្ម</option>
                <option value="Vehicle">Vehicle / យានយន្ត</option>
                <option value="Housing">Housing / លំនៅដ្ឋាន</option>
                <option value="Emergency">Emergency / បន្ទាន់</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                {lang === 'km' ? 'គោលបំណងកម្ចី (Purpose)' : 'Loan Purpose'}
              </label>
              <input
                type="text"
                placeholder="e.g. Business expansion, Equipment purchase"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Live Amortization Preview */}
          {preview && (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>{lang === 'km' ? 'ការគណនាបឋម (Estimated Repayment)' : 'Schedule Calculation'}</span>
                </span>
                <span className="text-[11px] text-slate-400">Step 5 Preview</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">{t.monthlyPayment}</div>
                  <div className="text-base font-bold text-white mt-0.5">${preview.monthlyPayment}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">{t.totalInterest}</div>
                  <div className="text-base font-bold text-amber-400 mt-0.5">${preview.totalInterest}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">{t.totalPayable}</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">${preview.totalPayable}</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : (lang === 'km' ? 'ដាក់ពាក្យស្នើសុំ (Submit)' : 'Submit Application')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
