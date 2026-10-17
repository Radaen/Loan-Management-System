import React from 'react';
import { X, Printer, CheckCircle, Receipt, ArrowRight } from 'lucide-react';
import { translations } from '../translations';

export function PaymentReceiptModal({ isOpen, onClose, payment, loan, lang = 'km' }) {
  const t = translations[lang];

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-scaleIn print:bg-white print:border-none print:shadow-none print:p-0">
        {/* Top Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white text-sm">
              {lang === 'km' ? 'បង្កាន់ដៃបង់ប្រាក់ផ្លូវការ' : 'Official Payment Receipt'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-slate-900 text-slate-200 print:text-black print:bg-white space-y-5">
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-700 print:border-slate-300 pb-4">
            <div className="text-lg font-black tracking-tight text-white print:text-black">
              LOANFLOW PRO MICROFINANCE
            </div>
            <div className="text-[11px] text-slate-400 print:text-slate-600">
              {lang === 'km' ? 'បង្កាន់ដៃទទួលប្រាក់កម្ចី (Loan Repayment Receipt)' : 'Official Repayment Voucher'}
            </div>
            <div className="text-xs font-mono font-bold text-blue-400 print:text-blue-700 mt-1">
              {payment.receiptNumber}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600">Date & Time:</span>
              <span className="font-medium text-white print:text-black">
                {new Date(payment.paymentDate || payment.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600">Loan Reference:</span>
              <span className="font-mono font-bold text-blue-400 print:text-blue-700">
                {loan?.loanId || payment.loan?.loanId || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600">Customer Name:</span>
              <span className="font-bold text-white print:text-black">
                {loan?.customer?.fullName || payment.customer?.fullName || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600">Payment Channel:</span>
              <span className="font-medium text-white print:text-black">
                {payment.paymentMethod || 'ABA Pay'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600">Transaction Ref:</span>
              <span className="font-mono text-white print:text-black">
                {payment.transactionRef || 'N/A'}
              </span>
            </div>
          </div>

          {/* Total Paid Block */}
          <div className="p-4 rounded-xl bg-slate-800/80 print:bg-slate-100 border border-slate-700 print:border-slate-300 text-center">
            <span className="text-xs text-slate-400 print:text-slate-600 font-semibold block uppercase">
              Amount Paid (ទឹកប្រាក់បានបង់)
            </span>
            <span className="text-2xl font-black text-emerald-400 print:text-emerald-700 mt-1 block">
              ${payment.amount?.toFixed(2)} USD
            </span>
          </div>

          {/* Balance info */}
          <div className="flex justify-between text-xs py-1 border-t border-dashed border-slate-700 print:border-slate-300">
            <span className="text-slate-400 print:text-slate-600">Remaining Balance:</span>
            <span className="font-bold text-amber-400 print:text-amber-700">
              ${(loan?.remainingBalance ?? 0).toLocaleString()} USD
            </span>
          </div>

          {/* Stamp */}
          <div className="text-center pt-2">
            <div className="inline-block px-4 py-1.5 rounded-lg border-2 border-emerald-500/50 text-emerald-400 print:text-emerald-700 text-xs font-bold uppercase tracking-wider transform -rotate-2">
              ✓ OFFICIAL PAID / ទូទាត់រួច
            </div>
            <div className="text-[10px] text-slate-500 print:text-slate-500 mt-2">
              Thank you for choosing LoanFlow Pro!
            </div>
          </div>
        </div>

        {/* Footer (hidden when printing) */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end no-print">
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
