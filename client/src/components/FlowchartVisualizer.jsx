import React from 'react';
import { ArrowDown, ArrowRight, ArrowLeft, ArrowUp, CheckCircle, XCircle, DollarSign, UserPlus, FileText, CheckCheck, Clock, AlertTriangle } from 'lucide-react';

/**
 * FlowchartVisualizer
 * Faithful visual implementation of the user's diagram:
 * Start -> Register Customer -> Submit Loan Application -> Review Loan Application ->
 * Approved? -> (No -> Reject Loan -> End) | (Yes -> Create Loan -> Generate Loan Schedule -> Disburse Loan ->
 * Customer Makes Payment -> Fully Paid? -> (Yes -> Close Loan -> End) | (No -> Continue Payment -> Loops back)
 */
export function FlowchartVisualizer({ currentStep = null, onStepClick = null, compact = false, lang = 'km' }) {
  // Map loan status/step to highlight step ID
  // Steps:
  // 1: REGISTER_CUSTOMER
  // 2: SUBMIT_APPLICATION
  // 3: REVIEW_APPLICATION
  // 4: APPROVED_DECISION
  // 5: REJECTED (End)
  // 6: CREATE_LOAN
  // 7: GENERATE_SCHEDULE
  // 8: DISBURSE_LOAN
  // 9: CUSTOMER_PAYMENT
  // 10: FULLY_PAID_DECISION
  // 11: CONTINUE_PAYMENT (Loop)
  // 12: CLOSE_LOAN (End)

  const isStepActive = (stepName) => {
    if (!currentStep) return false;
    const s = String(currentStep).toUpperCase();

    if (stepName === 'REGISTER_CUSTOMER' && s === 'REGISTER') return true;
    if (stepName === 'SUBMIT_APPLICATION' && (s === 'PENDING' || s === 'SUBMITTED')) return true;
    if (stepName === 'REVIEW_APPLICATION' && s === 'UNDER_REVIEW') return true;
    if (stepName === 'REJECTED' && s === 'REJECTED') return true;
    if (stepName === 'CREATE_LOAN' && s === 'APPROVED') return true;
    if (stepName === 'GENERATE_SCHEDULE' && s === 'SCHEDULE_READY') return true;
    if (stepName === 'DISBURSE_LOAN' && s === 'DISBURSED') return true;
    if (stepName === 'CUSTOMER_PAYMENT' && (s === 'ACTIVE' || s === 'IN_REPAYMENT')) return true;
    if (stepName === 'CLOSE_LOAN' && (s === 'CLOSED' || s === 'COMPLETED')) return true;

    return false;
  };

  const getStepClass = (stepName, baseType = 'blue') => {
    const active = isStepActive(stepName);
    const cursor = onStepClick ? 'cursor-pointer hover:scale-105 transition-all' : '';

    if (baseType === 'start') {
      return `bg-emerald-600 text-white border-2 border-emerald-400 font-semibold rounded-full shadow-lg ${cursor}`;
    }
    if (baseType === 'end') {
      return `bg-slate-700 text-slate-200 border-2 border-slate-500 font-semibold rounded-full shadow-md ${cursor}`;
    }
    if (baseType === 'reject') {
      return active
        ? `bg-red-600 text-white border-2 border-red-300 ring-4 ring-red-500/50 shadow-xl scale-105 font-bold ${cursor}`
        : `bg-red-600 text-white border border-red-400 hover:bg-red-500 shadow-md ${cursor}`;
    }
    if (baseType === 'close') {
      return active
        ? `bg-emerald-600 text-white border-2 border-emerald-300 ring-4 ring-emerald-500/50 shadow-xl scale-105 font-bold ${cursor}`
        : `bg-emerald-700 text-white border border-emerald-500 hover:bg-emerald-600 shadow-md ${cursor}`;
    }
    if (baseType === 'continue') {
      return active
        ? `bg-slate-600 text-white border-2 border-slate-300 ring-4 ring-slate-400/50 shadow-xl scale-105 font-bold ${cursor}`
        : `bg-slate-600 text-slate-200 border border-slate-400 hover:bg-slate-500 shadow-md ${cursor}`;
    }
    if (baseType === 'decision') {
      return active
        ? `bg-teal-700 text-white border-2 border-teal-300 ring-4 ring-teal-400/50 shadow-xl scale-105 font-bold ${cursor}`
        : `bg-teal-800 text-teal-100 border border-teal-400 hover:bg-teal-700 shadow-md ${cursor}`;
    }

    // Standard Blue Box
    return active
      ? `bg-blue-600 text-white border-2 border-blue-300 ring-4 ring-blue-500/50 shadow-xl scale-105 font-bold ${cursor}`
      : `bg-blue-700 text-white border border-blue-400 hover:bg-blue-600 shadow-md ${cursor}`;
  };

  return (
    <div className={`w-full flex flex-col items-center select-none font-sans ${compact ? 'py-4' : 'py-8'}`}>
      {/* Title header if not compact */}
      {!compact && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-300 text-xs font-medium mb-2">
            <span>⚡ Exact Process Workflow Architecture</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            {lang === 'km' ? 'ដ្យាក្រាមដំណើរការប្រាក់កម្ចី (Loan Process Flowchart)' : 'Loan Management Workflow Process'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            {lang === 'km'
              ? 'អនុវត្តតាមជំហាននៃប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចីពិតប្រាកដ ចាប់តាំងពីចុះឈ្មោះរហូតដល់សងផ្ដាច់'
              : 'End-to-end loan lifecycle from customer onboarding to final settlement'}
          </p>
        </div>
      )}

      {/* Main Flowchart Graph */}
      <div className="relative flex flex-col items-center w-full max-w-lg">
        {/* 1. START */}
        <div className={`px-8 py-2 ${getStepClass('START', 'start')} text-center min-w-[130px]`}>
          <span className="text-sm font-bold tracking-wider">Start</span>
        </div>

        {/* Down Arrow */}
        <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
          <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
        </div>

        {/* 2. REGISTER CUSTOMER */}
        <div
          onClick={() => onStepClick && onStepClick('REGISTER_CUSTOMER')}
          className={`mt-2 px-6 py-2.5 rounded text-center w-64 ${getStepClass('REGISTER_CUSTOMER')}`}
        >
          <div className="text-sm font-semibold">Register Customer</div>
          {lang === 'km' && <div className="text-[11px] text-blue-200 font-normal">ចុះឈ្មោះអតិថិជន</div>}
        </div>

        {/* Down Arrow */}
        <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
          <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
        </div>

        {/* 3. SUBMIT LOAN APPLICATION */}
        <div
          onClick={() => onStepClick && onStepClick('SUBMIT_APPLICATION')}
          className={`mt-2 px-6 py-2.5 rounded text-center w-64 ${getStepClass('SUBMIT_APPLICATION')}`}
        >
          <div className="text-sm font-semibold">Submit Loan Application</div>
          {lang === 'km' && <div className="text-[11px] text-blue-200 font-normal">ស្នើសុំប្រាក់កម្ចី</div>}
        </div>

        {/* Down Arrow */}
        <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
          <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
        </div>

        {/* 4. REVIEW LOAN APPLICATION */}
        <div
          onClick={() => onStepClick && onStepClick('REVIEW_APPLICATION')}
          className={`mt-2 px-6 py-2.5 rounded text-center w-64 ${getStepClass('REVIEW_APPLICATION')}`}
        >
          <div className="text-sm font-semibold">Review Loan Application</div>
          {lang === 'km' && <div className="text-[11px] text-blue-200 font-normal">ត្រួតពិនិត្យពាក្យស្នើសុំ</div>}
        </div>

        {/* Down Arrow */}
        <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
          <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
        </div>

        {/* 5. DECISION 1: APPROVED? */}
        <div className="relative mt-2 flex items-center justify-center w-full">
          {/* Diamond Center */}
          <div
            className={`px-5 py-2.5 rounded-md text-center transform rotate-0 ${getStepClass('APPROVED_DECISION', 'decision')} z-10`}
          >
            <div className="text-sm font-bold tracking-wide">Approved?</div>
            {lang === 'km' && <div className="text-[10px] text-teal-200">អនុម័តឬទេ?</div>}
          </div>

          {/* Branch NO -> Reject Loan -> End */}
          <div className="absolute left-[50%] ml-16 flex items-center">
            {/* Horizontal Line & Arrow */}
            <div className="flex items-center">
              <span className="text-sm font-bold text-slate-200 mr-2 -mt-4">No</span>
              <div className="w-12 h-0.5 bg-slate-400 relative">
                <ArrowRight className="w-4 h-4 text-slate-300 absolute -right-2 -top-2" />
              </div>
            </div>

            {/* Reject & End Container */}
            <div className="flex flex-col items-center ml-2">
              <div
                onClick={() => onStepClick && onStepClick('REJECTED')}
                className={`px-5 py-2 rounded text-center min-w-[130px] ${getStepClass('REJECTED', 'reject')}`}
              >
                <div className="text-sm font-bold">Reject Loan</div>
                {lang === 'km' && <div className="text-[10px] text-red-100">បដិសេធកម្ចី</div>}
              </div>

              {/* Down Arrow */}
              <div className="h-5 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
                <ArrowDown className="w-3.5 h-3.5 text-slate-300 absolute -bottom-2" />
              </div>

              {/* End */}
              <div className={`mt-1 px-5 py-1 ${getStepClass('END_REJECT', 'end')} text-center min-w-[90px]`}>
                <span className="text-xs font-bold">End</span>
              </div>
            </div>
          </div>
        </div>

        {/* Branch YES Downwards */}
        <div className="flex flex-col items-center">
          <div className="relative flex flex-col items-center h-10 w-0.5 bg-slate-400 my-0.5">
            <span className="absolute -left-7 top-1 text-sm font-bold text-slate-200">Yes</span>
            <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
          </div>

          {/* 6. CREATE LOAN */}
          <div
            onClick={() => onStepClick && onStepClick('CREATE_LOAN')}
            className={`mt-2 px-6 py-2.5 rounded text-center w-64 ${getStepClass('CREATE_LOAN')}`}
          >
            <div className="text-sm font-semibold">Create Loan</div>
            {lang === 'km' && <div className="text-[11px] text-blue-200 font-normal">បង្កើតកម្ចី</div>}
          </div>

          {/* Down Arrow */}
          <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
            <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
          </div>

          {/* 7. GENERATE LOAN SCHEDULE */}
          <div
            onClick={() => onStepClick && onStepClick('GENERATE_SCHEDULE')}
            className={`mt-2 px-6 py-2.5 rounded text-center w-64 ${getStepClass('GENERATE_SCHEDULE')}`}
          >
            <div className="text-sm font-semibold">Generate Loan Schedule</div>
            {lang === 'km' && <div className="text-[11px] text-blue-200 font-normal">បង្កើតកាលវិភាគសង</div>}
          </div>

          {/* Down Arrow */}
          <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
            <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
          </div>

          {/* 8. DISBURSE LOAN */}
          <div
            onClick={() => onStepClick && onStepClick('DISBURSE_LOAN')}
            className={`mt-2 px-6 py-2.5 rounded text-center w-64 ${getStepClass('DISBURSE_LOAN')}`}
          >
            <div className="text-sm font-semibold">Disburse Loan</div>
            {lang === 'km' && <div className="text-[11px] text-blue-200 font-normal">បើកផ្តល់ប្រាក់កម្ចី</div>}
          </div>

          {/* Down Arrow */}
          <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
            <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
          </div>

          {/* 9. CUSTOMER MAKES PAYMENT (Anchor for repayment loop) */}
          <div
            id="step-customer-payment"
            onClick={() => onStepClick && onStepClick('CUSTOMER_PAYMENT')}
            className={`mt-2 px-6 py-2.5 rounded text-center w-64 ${getStepClass('CUSTOMER_PAYMENT')} relative`}
          >
            <div className="text-sm font-semibold">Customer Makes Payment</div>
            {lang === 'km' && <div className="text-[11px] text-blue-200 font-normal">អតិថិជនបង់ប្រាក់សង</div>}
          </div>

          {/* Down Arrow */}
          <div className="h-6 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
            <ArrowDown className="w-4 h-4 text-slate-300 absolute -bottom-2" />
          </div>

          {/* 10. DECISION 2: FULLY PAID? */}
          <div className="relative mt-2 flex items-center justify-center w-full">
            {/* Diamond Center */}
            <div
              className={`px-5 py-2.5 rounded-md text-center ${getStepClass('FULLY_PAID_DECISION', 'decision')} z-10`}
            >
              <div className="text-sm font-bold tracking-wide">Fully Paid?</div>
              {lang === 'km' && <div className="text-[10px] text-teal-200">សងរួចរាល់ហើយឬនៅ?</div>}
            </div>

            {/* Left Branch: YES -> Close Loan -> End */}
            <div className="absolute right-[50%] mr-14 flex items-center flex-row-reverse">
              <div className="flex items-center flex-row-reverse">
                <span className="text-sm font-bold text-slate-200 ml-2 -mt-4">Yes</span>
                <div className="w-12 h-0.5 bg-slate-400 relative">
                  <ArrowLeft className="w-4 h-4 text-slate-300 absolute -left-2 -top-2" />
                </div>
              </div>

              {/* Close Loan & End Container */}
              <div className="flex flex-col items-center mr-2">
                <div
                  onClick={() => onStepClick && onStepClick('CLOSE_LOAN')}
                  className={`px-5 py-2 rounded text-center min-w-[130px] ${getStepClass('CLOSE_LOAN', 'close')}`}
                >
                  <div className="text-sm font-bold">Close Loan</div>
                  {lang === 'km' && <div className="text-[10px] text-emerald-100">បិទកម្ចីជោគជ័យ</div>}
                </div>

                {/* Down Arrow */}
                <div className="h-5 w-0.5 bg-slate-400 flex items-center justify-center my-0.5 relative">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-300 absolute -bottom-2" />
                </div>

                {/* End */}
                <div className={`mt-1 px-5 py-1 ${getStepClass('END_CLOSE', 'end')} text-center min-w-[90px]`}>
                  <span className="text-xs font-bold">End</span>
                </div>
              </div>
            </div>

            {/* Right Branch: NO -> Continue Payment -> Loop Back to Customer Makes Payment */}
            <div className="absolute left-[50%] ml-14 flex items-center">
              <div className="flex items-center">
                <span className="text-sm font-bold text-slate-200 mr-2 -mt-4">No</span>
                <div className="w-12 h-0.5 bg-slate-400 relative">
                  <ArrowRight className="w-4 h-4 text-slate-300 absolute -right-2 -top-2" />
                </div>
              </div>

              {/* Continue Payment Box */}
              <div
                onClick={() => onStepClick && onStepClick('CONTINUE_PAYMENT')}
                className={`ml-2 px-4 py-2 rounded text-center min-w-[130px] ${getStepClass('CONTINUE_PAYMENT', 'continue')}`}
              >
                <div className="text-xs font-semibold">Continue Payment</div>
                {lang === 'km' && <div className="text-[10px] text-slate-300">បន្តបង់ប្រាក់សង</div>}
              </div>

              {/* Upward Return Line looping to Customer Makes Payment */}
              <div className="hidden sm:block absolute left-[215px] bottom-3 w-8 h-[95px] border-r-2 border-t-2 border-slate-400 rounded-tr-lg">
                <ArrowLeft className="w-4 h-4 text-slate-300 absolute -left-2 -top-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Help Indicator */}
      {!compact && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Start / Close Loan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600"></span>
            <span>Process Action</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-600"></span>
            <span>Decision (Diamond)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-600"></span>
            <span>Rejection (Terminal)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-600"></span>
            <span>Repayment Loop</span>
          </div>
        </div>
      )}
    </div>
  );
}
