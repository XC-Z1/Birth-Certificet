import React, { useState } from 'react';
import { Search, RotateCcw, Calendar, FileText, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface SearchFormProps {
  onSearch: (brn: string, dob: string) => void;
  isLoading: boolean;
  onReset: () => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, onReset }) => {
  const [brn, setBrn] = useState('');
  const [dob, setDob] = useState('');
  const [brnError, setBrnError] = useState('');
  const [dobError, setDobError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;
    setBrnError('');
    setDobError('');

    const cleanBrn = brn.trim();
    if (!cleanBrn) {
      setBrnError('১৭ সংখ্যার জন্ম নিবন্ধন নম্বর প্রদান করুন।');
      isValid = false;
    } else if (!/^\d{17}$/.test(cleanBrn)) {
      setBrnError('জন্ম নিবন্ধন নম্বরটি সঠিক ১৭ সংখ্যার হতে হবে। (কেবল ইংরেজি সংখ্যা)');
      isValid = false;
    }

    if (!dob) {
      setDobError('জন্ম তারিখ নির্বাচন করুন।');
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      setDobError('জন্ম তারিখ YYYY-MM-DD ফরম্যাটে দিন।');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(brn.trim(), dob);
    }
  };

  const handleReset = () => {
    setBrn('');
    setDob('');
    setBrnError('');
    setDobError('');
    onReset();
  };

  // Pre-fill sample valid demo numbers for quick testing
  const handleFillDemo = () => {
    setBrn('20001234567890123');
    setDob('2000-01-15');
    setBrnError('');
    setDobError('');
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-100 dark:border-emerald-900/30 relative overflow-hidden transition-all duration-300 max-w-4xl mx-auto">
      
      {/* Geometric Corner Accent Badge */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-bl-full -mr-8 -mt-8 opacity-60 pointer-events-none"></div>

      <div className="flex items-center justify-between pb-5 mb-6 border-b border-emerald-100 dark:border-slate-800 relative z-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-bengali text-[#006a4e] dark:text-emerald-300 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#006a4e] dark:text-emerald-400" />
            অনুসন্ধান ফিল্টার
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bengali mt-1">
            ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর এবং তারিখ প্রদান করে অনুসন্ধান বোতামে চাপুন।
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemo}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#006a4e] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800/60 transition-colors"
          title="পরীক্ষামূলক তথ্য টাইপ করুন"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          ডেমো ডাটা দিন
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Birth Registration Number Input */}
          <div className="space-y-2">
            <label htmlFor="brn-input" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bengali">
              জন্ম নিবন্ধন নম্বর (BRN) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="brn-input"
                type="text"
                maxLength={17}
                placeholder="যেমন: 20001234567890123"
                value={brn}
                onChange={(e) => {
                  setBrn(e.target.value.replace(/\D/g, ''));
                  if (brnError) setBrnError('');
                }}
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  brnError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#006a4e] focus:ring-[#006a4e]'
                } text-slate-900 dark:text-slate-100 font-mono tracking-wider focus:outline-none focus:ring-2 transition-all text-base sm:text-lg`}
                disabled={isLoading}
              />
              <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-mono">
                {brn.length}/17
              </span>
            </div>
            {brnError && (
              <p className="text-xs font-bengali text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {brnError}
              </p>
            )}
          </div>

          {/* Date of Birth Input */}
          <div className="space-y-2">
            <label htmlFor="dob-input" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-bengali">
              জন্ম তারিখ (Date of Birth) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="dob-input"
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (dobError) setDobError('');
                }}
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  dobError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#006a4e] focus:ring-[#006a4e]'
                } text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all text-base sm:text-lg`}
                disabled={isLoading}
              />
              <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            {dobError && (
              <p className="text-xs font-bengali text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {dobError}
              </p>
            )}
          </div>

        </div>


        {/* Buttons Action Group */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading || (!brn && !dob)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold font-bengali transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white font-bold font-bengali shadow-lg shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-b-2 border-[#d4af37]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>সার্চিং...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 text-[#d4af37]" />
                <span>সার্চ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
