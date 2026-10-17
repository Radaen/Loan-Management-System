import React, { useState } from 'react';
import { Search, UserPlus, Phone, MapPin, Briefcase, DollarSign, PlusCircle, Eye, Edit2 } from 'lucide-react';
import { translations } from '../translations';

export function CustomerList({ customers, lang, onOpenRegister, onApplyForCustomer, onEditCustomer }) {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(q) ||
      c.khmerName?.toLowerCase().includes(q) ||
      c.nationalId?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.customerId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{lang === 'km' ? 'បញ្ជីឈ្មោះអតិថិជន (Customer Directory)' : 'Customer Directory'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              {customers.length} {lang === 'km' ? 'នាក់' : 'records'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'km' ? 'គ្រប់គ្រងព័ត៌មានអតិថិជន ប្រាក់ចំណូល និងទ្រព្យបញ្ចាំ' : 'Manage registered borrowers, credit profiles, and collateral information'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរកឈ្មោះ, ទូរស័ព្ទ, ID...' : 'Search customer by name, ID, phone...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>

          <button
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'km' ? '+ ចុះឈ្មោះអតិថិជន' : '+ Register Customer'}</span>
          </button>
        </div>
      </div>

      {/* Customers Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((cust) => (
            <div
              key={cust._id || cust.customerId}
              className="bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/40 rounded-2xl p-5 flex flex-col justify-between transition group shadow-md"
            >
              <div>
                {/* Top Row: ID Badge & Gender */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-700">
                    {cust.customerId}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">
                    {cust.gender || 'Male'}
                  </span>
                </div>

                {/* Customer Name */}
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                  {cust.fullName}
                </h3>
                {cust.khmerName && (
                  <p className="text-xs text-blue-300/80 font-medium">{cust.khmerName}</p>
                )}

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{cust.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{cust.occupation || 'N/A'}</span>
                    <span className="text-emerald-400 font-semibold ml-auto">
                      ${cust.monthlyIncome}/mo
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {cust.address?.district ? `${cust.address.district}, ` : ''}{cust.address?.province || 'Phnom Penh'}
                    </span>
                  </div>
                </div>

                {/* Collateral Tag */}
                {cust.collateral && cust.collateral.type !== 'None' && (
                  <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-[11px] flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Collateral:</span>
                    <span className="font-medium text-amber-400">
                      {cust.collateral.type} (${cust.collateral.estimatedValue})
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-700/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => onEditCustomer(cust)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'កែប្រែ' : 'Edit'}</span>
                </button>

                <button
                  onClick={() => onApplyForCustomer(cust)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition flex items-center gap-1.5 ml-auto"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ស្នើកម្ចី' : 'Apply Loan'}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            {lang === 'km' ? 'រកមិនឃើញអតិថិជនទេ' : 'No customers found matching your search.'}
          </div>
        )}
      </div>
    </div>
  );
}
