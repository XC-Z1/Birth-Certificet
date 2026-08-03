import React, { useState } from 'react';
import { Search, RotateCcw, Calendar, FileText, AlertCircle, ShieldCheck } from 'lucide-react';

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

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 dark:border-slate-800 relative transition-all duration-200 max-w-4xl mx-auto">
      
      {/* Header Bar inside Form Card */}
      <div className="pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#006a4e] dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold font-bengali text-[#006a4e] dark:text-emerald-300">
            জন্ম নিবন্ধন তথ্য অনুসন্ধান
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bengali mt-1">
          ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর এবং জন্ম তারিখ প্রদান করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Birth Registration Number Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="brn-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bengali">
                জন্ম নিবন্ধন নম্বর (BRN) <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[11px] font-mono ${brn.length === 17 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}`}>
                {brn.length}/17
              </span>
            </div>

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
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                  brnError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#006a4e] dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                } text-slate-900 dark:text-slate-100 font-mono tracking-wider focus:outline-none transition-all text-base sm:text-lg`}
                disabled={isLoading}
              />
              {brn.length === 17 && (
                <ShieldCheck className="absolute right-3.5 top-3.5 w-5 h-5 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
              )}
            </div>
            {brnError && (
              <p className="text-xs font-bengali text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {brnError}
              </p>
            )}
          </div>

          {/* Date of Birth Input */}
          <div className="space-y-1.5">
            <label htmlFor="dob-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bengali">
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
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                  dobError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#006a4e] dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                } text-slate-900 dark:text-slate-100 focus:outline-none transition-all text-base sm:text-lg`}
                disabled={isLoading}
              />
              <Calendar className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
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
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading || (!brn && !dob)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold font-bengali transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            রিসেট
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white font-bold font-bengali shadow active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base border-b-2 border-[#d4af37]"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>রেকর্ড খোঁজা হচ্ছে...</span>
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

