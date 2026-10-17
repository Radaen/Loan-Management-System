import React from 'react';
import { Menu, PlusCircle, Users, Globe, Database, Sparkles } from 'lucide-react';
import { translations } from '../translations';

export function Header({ 
  activeTab, 
  lang, 
  setLang, 
  onOpenMobileMenu, 
  onOpenApplyLoan, 
  onOpenRegisterCustomer 
}) {
  const t = translations[lang];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: t.dashboard, desc: lang === 'km' ? 'ទិដ្ឋភាពទូទៅនៃផលប័ត្រកម្ចី និងស្ថិតិហិរញ្ញវត្ថុ' : 'Executive Portfolio Summary & Metrics' };
      case 'loans':
        return { title: t.loans, desc: lang === 'km' ? 'គ្រប់គ្រងពាក្យស្នើសុំ ការអនុម័ត និងកាលវិភាគកម្ចី' : 'Loan Applications & Repayment Pipeline' };
      case 'customers':
        return { title: t.customers, desc: lang === 'km' ? 'បញ្ជីឈ្មោះអតិថិជន ប្រាក់ចំណូល និងទ្រព្យបញ្ចាំ' : 'Customer Profiles & Collateral Registry' };
      case 'payments':
        return { title: t.payments, desc: lang === 'km' ? 'ប្រវត្តិការបង់ប្រាក់សង និងបង្កាន់ដៃទទួលប្រាក់' : 'Repayment Transactions & Official Receipts' };
      case 'calculator':
        return { title: t.calculator, desc: lang === 'km' ? 'ម៉ាស៊ីនគណនាប្រាក់កម្ចី និងកាលវិភាគសង' : 'Interactive Amortization Simulator' };
      default:
        return { title: t.dashboard, desc: '' };
    }
  };

  const { title, desc } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition lg:hidden"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {desc}
            </p>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Apply Button */}
          <button
            onClick={onOpenApplyLoan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'km' ? '+ ស្នើកម្ចីថ្មី' : '+ Apply Loan'}</span>
            <span className="sm:hidden">{lang === 'km' ? '+ ស្នើកម្ចី' : '+ Loan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
