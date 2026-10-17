import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Receipt, 
  GitCommit, 
  Calculator, 
  PlusCircle, 
  Database, 
  Globe,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { translations } from '../translations';

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  lang, 
  setLang, 
  dbStatus, 
  pendingCount = 0, 
  onOpenRegisterCustomer, 
  onOpenApplyLoan,
  isMobileOpen = false,
  onCloseMobile = () => {}
}) {
  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'loans', label: t.loans, icon: FileSpreadsheet, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'customers', label: t.customers, icon: Users },
    { id: 'payments', label: t.payments, icon: Receipt },
    { id: 'calculator', label: t.calculator, icon: Calculator },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top: Branding & Quick Actions */}
        <div className="p-5 flex flex-col">
          {/* Logo & Close button on mobile */}
          <div className="flex items-center justify-between mb-6">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => { setActiveTab('dashboard'); onCloseMobile(); }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl shrink-0">
                LF
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight">{t.systemTitle}</span>
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    v1.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {lang === 'km' ? 'ប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចី' : 'Loan Management'}
                </div>
              </div>
            </div>

            <button 
              onClick={onCloseMobile} 
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-2 mb-6">
            <button
              onClick={() => { onOpenApplyLoan(); onCloseMobile(); }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'km' ? '+ ស្នើកម្ចីថ្មី' : '+ Apply Loan'}</span>
            </button>

            <button
              onClick={() => { onOpenRegisterCustomer(); onCloseMobile(); }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'km' ? '+ ចុះឈ្មោះអតិថិជន' : '+ Register Customer'}</span>
            </button>
          </div>

          {/* Navigation Menu Links */}
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
            {lang === 'km' ? 'ម៉ឺនុយមេ (Main Menu)' : 'Main Navigation'}
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); onCloseMobile(); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Database status & Language Switcher */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          {/* MongoDB Status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium">MongoDB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400 font-bold">Online</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'km' ? 'ភាសាខ្មែរ (Khmer)' : 'English'}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 font-bold">
              {lang === 'km' ? '🇰🇭 KM' : '🇺🇸 EN'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
