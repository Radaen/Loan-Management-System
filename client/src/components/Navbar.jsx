import React from 'react';
import { LayoutDashboard, Users, FileSpreadsheet, Receipt, GitCommit, Calculator, PlusCircle, Database, Globe } from 'lucide-react';
import { translations } from '../translations';

export function Navbar({ activeTab, setActiveTab, lang, setLang, dbStatus, pendingCount = 0, onOpenRegisterCustomer, onOpenApplyLoan }) {
  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'loans', label: t.loans, icon: FileSpreadsheet, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'customers', label: t.customers, icon: Users },
    { id: 'payments', label: t.payments, icon: Receipt },
    { id: 'flowchart', label: t.flowchart, icon: GitCommit },
    { id: 'calculator', label: t.calculator, icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl">
              LF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">{t.systemTitle}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v1.0
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចី' : 'Loan Management System'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: DB status, Language, Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Database indicator */}
            <div
              title={dbStatus?.database || 'Database'}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/80 border border-slate-700 text-emerald-400"
            >
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'km' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}</span>
            </button>

            {/* Action Buttons */}
            <button
              onClick={onOpenRegisterCustomer}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'km' ? '+ អតិថិជន' : '+ Customer'}</span>
            </button>

            <button
              onClick={onOpenApplyLoan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? '+ ស្នើកម្ចី' : '+ Apply Loan'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] whitespace-nowrap font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1 rounded-full text-[9px] bg-amber-500 text-black font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
