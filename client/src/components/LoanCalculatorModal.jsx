import React, { useState, useEffect } from 'react';
import { X, Calculator, DollarSign, Calendar, TrendingUp, Sliders } from 'lucide-react';
import { api } from '../api';
import { translations } from '../translations';

export function LoanCalculatorModal({ isOpen, onClose, lang = 'km', onApplyWithValues }) {
  const t = translations[lang];

  const [amount, setAmount] = useState(5000);
  const [interestRate, setInterestRate] = useState(12);
  const [termMonths, setTermMonths] = useState(12);
  const [interestType, setInterestType] = useState('declining');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const calculate = async () => {
      try {
        const res = await api.previewCalculator({
          amount: Number(amount),
          interestRate: Number(interestRate),
          termMonths: Number(termMonths),
          interestType
        });
        setResult(res);
      } catch (err) {
        console.error(err);
      }
    };
    calculate();
  }, [amount, interestRate, termMonths, interestType, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Simulation Tool</span>
              <h2 className="text-lg font-bold text-white">
                {lang === 'km' ? 'ម៉ាស៊ីនគណនាប្រាក់កម្ចី (Loan Calculator & Simulator)' : 'Loan Amortization Calculator'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 font-semibold">{t.amount}</label>
                <span className="font-bold text-white text-sm">${Number(amount).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$500</span>
                <span>$50,000</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 font-semibold">{t.interestRate}</label>
                <span className="font-bold text-amber-400 text-sm">{interestRate}% / yr</span>
              </div>
              <input
                type="range"
                min="1"
                max="36"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1%</span>
                <span>{(interestRate / 12).toFixed(2)}%/mo</span>
                <span>36%</span>
              </div>
            </div>

            {/* Term */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 font-semibold">{t.termMonths}</label>
                <span className="font-bold text-emerald-400 text-sm">{termMonths} Months</span>
              </div>
              <input
                type="range"
                min="3"
                max="60"
                step="3"
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>3 mos</span>
                <span>60 mos (5 yrs)</span>
              </div>
            </div>
          </div>

          {/* Method selector */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-semibold">Method:</span>
            <button
              onClick={() => setInterestType('declining')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                interestType === 'declining' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Declining Balance (EMI / Annuity)
            </button>
            <button
              onClick={() => setInterestType('flat')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                interestType === 'flat' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Flat Rate
            </button>
          </div>

          {/* Results Summary */}
          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/30 text-center">
                <span className="text-[11px] text-blue-300 block">{t.monthlyPayment}</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  ${result.monthlyPayment?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">per month</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-900/30 border border-amber-500/30 text-center">
                <span className="text-[11px] text-amber-300 block">{t.totalInterest}</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">
                  ${result.totalInterest?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">total interest cost</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-center">
                <span className="text-[11px] text-emerald-300 block">{t.totalPayable}</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  ${result.totalPayable?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">principal + interest</span>
              </div>
            </div>
          )}

          {/* Preview Schedule Table */}
          {result?.schedule && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Simulated Amortization Schedule</span>
                <span className="text-[10px] text-slate-400">Flowchart Step 5 Generator</span>
              </div>
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-700/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="sticky top-0 bg-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Due Date</th>
                      <th className="p-2.5">Principal</th>
                      <th className="p-2.5">Interest</th>
                      <th className="p-2.5">Total Payment</th>
                      <th className="p-2.5">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {result.schedule.map((item) => (
                      <tr key={item.installmentNumber} className="hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold text-white">{item.installmentNumber}</td>
                        <td className="p-2.5 text-slate-400">{new Date(item.dueDate).toLocaleDateString()}</td>
                        <td className="p-2.5 text-slate-200">${item.principalDue?.toFixed(2)}</td>
                        <td className="p-2.5 text-amber-400">${item.interestDue?.toFixed(2)}</td>
                        <td className="p-2.5 font-bold text-white">${item.totalDue?.toFixed(2)}</td>
                        <td className="p-2.5 text-slate-400">${item.remainingPrincipal?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              if (onApplyWithValues) {
                onApplyWithValues({ amount, interestRate, termMonths, interestType });
              }
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition"
          >
            {lang === 'km' ? 'ប្រើប្រាស់តម្លៃនេះដើម្បីស្នើសុំកម្ចី' : 'Apply with these values'}
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
