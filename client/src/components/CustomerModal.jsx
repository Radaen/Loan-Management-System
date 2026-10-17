import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, ShieldCheck, MapPin, Briefcase, Phone, Mail, CreditCard } from 'lucide-react';
import { translations } from '../translations';

export function CustomerModal({ isOpen, onClose, onSave, editingCustomer = null, lang = 'km' }) {
  const t = translations[lang];

  const [form, setForm] = useState({
    fullName: '',
    khmerName: '',
    nationalId: '',
    gender: 'Male',
    dob: '1995-01-01',
    phone: '',
    email: '',
    occupation: '',
    monthlyIncome: '',
    street: '',
    village: '',
    commune: '',
    district: '',
    province: 'Phnom Penh',
    guarantorName: '',
    guarantorPhone: '',
    guarantorRelation: '',
    guarantorId: '',
    collateralType: 'Vehicle',
    collateralDesc: '',
    collateralValue: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setForm({
        fullName: editingCustomer.fullName || '',
        khmerName: editingCustomer.khmerName || '',
        nationalId: editingCustomer.nationalId || '',
        gender: editingCustomer.gender || 'Male',
        dob: editingCustomer.dob ? new Date(editingCustomer.dob).toISOString().split('T')[0] : '1995-01-01',
        phone: editingCustomer.phone || '',
        email: editingCustomer.email || '',
        occupation: editingCustomer.occupation || '',
        monthlyIncome: editingCustomer.monthlyIncome || '',
        street: editingCustomer.address?.street || '',
        village: editingCustomer.address?.village || '',
        commune: editingCustomer.address?.commune || '',
        district: editingCustomer.address?.district || '',
        province: editingCustomer.address?.province || 'Phnom Penh',
        guarantorName: editingCustomer.guarantor?.name || '',
        guarantorPhone: editingCustomer.guarantor?.phone || '',
        guarantorRelation: editingCustomer.guarantor?.relationship || '',
        guarantorId: editingCustomer.guarantor?.nationalId || '',
        collateralType: editingCustomer.collateral?.type || 'None',
        collateralDesc: editingCustomer.collateral?.description || '',
        collateralValue: editingCustomer.collateral?.estimatedValue || ''
      });
    } else {
      setForm({
        fullName: '',
        khmerName: '',
        nationalId: '',
        gender: 'Male',
        dob: '1995-01-01',
        phone: '',
        email: '',
        occupation: 'Self-employed',
        monthlyIncome: '800',
        street: 'Street 2004',
        village: 'Teuk Thla',
        commune: 'Sen Sok',
        district: 'Sen Sok',
        province: 'Phnom Penh',
        guarantorName: '',
        guarantorPhone: '',
        guarantorRelation: 'Relative',
        guarantorId: '',
        collateralType: 'Vehicle',
        collateralDesc: 'Honda Dream 2023',
        collateralValue: '1800'
      });
    }
    setError('');
  }, [editingCustomer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.nationalId || !form.phone || !form.monthlyIncome) {
      setError(lang === 'km' ? 'សូមបំពេញឈ្មោះ, អត្តសញ្ញាណប័ណ្ណ, លេខទូរស័ព្ទ និងប្រាក់ចំណូល' : 'Please provide Full Name, National ID, Phone, and Monthly Income');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        fullName: form.fullName.trim(),
        khmerName: form.khmerName.trim(),
        nationalId: form.nationalId.trim(),
        gender: form.gender,
        dob: form.dob,
        phone: form.phone.trim(),
        email: form.email.trim(),
        occupation: form.occupation.trim(),
        monthlyIncome: Number(form.monthlyIncome),
        address: {
          street: form.street,
          village: form.village,
          commune: form.commune,
          district: form.district,
          province: form.province
        },
        guarantor: {
          name: form.guarantorName,
          phone: form.guarantorPhone,
          relationship: form.guarantorRelation,
          nationalId: form.guarantorId
        },
        collateral: {
          type: form.collateralType,
          description: form.collateralDesc,
          estimatedValue: Number(form.collateralValue || 0)
        }
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred while saving customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 1 in Flowchart</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                {editingCustomer 
                  ? (lang === 'km' ? 'កែប្រែព័ត៌មានអតិថិជន' : 'Edit Customer Profile') 
                  : (lang === 'km' ? 'ចុះឈ្មោះអតិថិជនថ្មី (Register Customer)' : 'Register New Customer')}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
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

          {/* Section: Personal Info */}
          <div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <CreditCard className="w-4 h-4" />
              <span>{lang === 'km' ? 'ព័ត៌មានផ្ទាល់ខ្លួន (Personal Information)' : 'Personal Information'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ឈ្មោះជាអក្សរឡាតាំង (Full Name)*' : 'Full Name (Latin)*'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sokha Chan"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ឈ្មោះជាភាសាខ្មែរ (Khmer Name)' : 'Khmer Name'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. ចាន់ សុខា"
                  value={form.khmerName}
                  onChange={(e) => setForm({ ...form, khmerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'លេខអត្តសញ្ញាណប័ណ្ណ (National ID)*' : 'National ID / Passport*'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 010293847"
                  value={form.nationalId}
                  onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ភេទ (Gender)' : 'Gender'}
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Male">Male / ប្រុស</option>
                  <option value="Female">Female / ស្រី</option>
                  <option value="Other">Other / ផ្សេងៗ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'លេខទូរស័ព្ទ (Phone Number)*' : 'Phone Number*'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 012 345 678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'អ៊ីមែល (Email)' : 'Email Address'}
                </label>
                <input
                  type="email"
                  placeholder="sokha@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Income & Employment */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Briefcase className="w-4 h-4" />
              <span>{lang === 'km' ? 'មុខរបរ និងប្រាក់ចំណូល (Employment & Income)' : 'Employment & Income'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'មុខរបរ / វិជ្ជាជីវៈ (Occupation)' : 'Occupation'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Officer / Small Business"
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ប្រាក់ចំណូលប្រចាំខែ ($ Monthly Income)*' : 'Monthly Income ($ USD)*'}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 1000"
                  value={form.monthlyIncome}
                  onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <MapPin className="w-4 h-4" />
              <span>{lang === 'km' ? 'អាសយដ្ឋានបច្ចុប្បន្ន (Address)' : 'Current Address'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ផ្ទះលេខ / ផ្លូវ (Street)' : 'Street'}
                </label>
                <input
                  type="text"
                  placeholder="Street"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ខណ្ឌ / ស្រុក (District)' : 'District'}
                </label>
                <input
                  type="text"
                  placeholder="District"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'រាជធានី / ខេត្ត (Province)' : 'Province'}
                </label>
                <input
                  type="text"
                  placeholder="Province"
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Guarantor & Collateral */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'km' ? 'អ្នកធានា & ទ្រព្យបញ្ចាំ (Guarantor & Collateral)' : 'Guarantor & Collateral'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ឈ្មោះអ្នកធានា (Guarantor Name)' : 'Guarantor Name'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dara Chan"
                  value={form.guarantorName}
                  onChange={(e) => setForm({ ...form, guarantorName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'លេខទូរស័ព្ទអ្នកធានា' : 'Guarantor Phone'}
                </label>
                <input
                  type="text"
                  placeholder="098 776 554"
                  value={form.guarantorPhone}
                  onChange={(e) => setForm({ ...form, guarantorPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'ប្រភេទទ្រព្យបញ្ចាំ' : 'Collateral Type'}
                </label>
                <select
                  value={form.collateralType}
                  onChange={(e) => setForm({ ...form, collateralType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="None">None / គ្មាន</option>
                  <option value="Vehicle">Vehicle / យានយន្ត</option>
                  <option value="Land Title">Land Title / ប្លង់ដី</option>
                  <option value="Jewelry">Jewelry / គ្រឿងអលង្ការ</option>
                  <option value="Other">Other / ផ្សេងៗ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {lang === 'km' ? 'តម្លៃប៉ាន់ស្មានទ្រព្យ ($ Value)' : 'Estimated Value ($)'}
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={form.collateralValue}
                  onChange={(e) => setForm({ ...form, collateralValue: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

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
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : (editingCustomer ? t.save : t.registerCustomer)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
