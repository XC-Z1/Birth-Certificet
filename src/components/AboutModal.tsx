import React from 'react';
import { X, HelpCircle, FileText, CheckCircle2, ShieldCheck, Download, Printer, PhoneCall, Globe, ChevronRight } from 'lucide-react';
import { GovernmentEmblem } from './GovernmentEmblem';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-bengali no-print">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      ></div>

      {/* Modal Dialog */}
      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
          
          {/* Top Government Strip Header */}
          <div className="bg-[#006a4e] text-white p-5 sm:p-6 border-b-4 border-[#d4af37] flex items-center justify-between relative">
            <div className="flex items-center space-x-3.5">
              <div className="bg-white rounded-full p-1 border border-[#d4af37] shadow-sm shrink-0">
                <GovernmentEmblem size={42} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold font-bengali text-white leading-tight">
                    সাইট ব্যবহার নির্দেশিকা ও পোর্টাল পরিচিতি
                  </h3>
                </div>
                <p className="text-[#d4af37] text-xs font-semibold uppercase tracking-wider font-english mt-0.5">
                  Birth Registration Portal Usage Guide & Information
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white transition-all active:scale-95 border border-emerald-600/50"
              title="বন্ধ করুন (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-slate-800 dark:text-slate-200">
            
            {/* Intro Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#006a4e] text-white shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-xs sm:text-sm leading-relaxed font-bengali">
                <p className="font-bold text-[#006a4e] dark:text-emerald-300 text-base mb-1">
                  পোর্টাল সম্পর্কে
                </p>
                এটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের নিয়ম মেনে স্থানীয় সরকার বিভাগের জন্ম ও মৃত্যু নিবন্ধন ডেটাবেজের তথ্য সরাসরি অনলাইনে দ্রুত ও নির্ভুলভাবে যাচাই করার একটি আধুনিক ওয়েব সেবা।
              </div>
            </div>

            {/* Step by Step Guide Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <FileText className="w-5 h-5 text-[#006a4e] dark:text-emerald-400" />
                <span>যেভাবে জন্ম নিবন্ধন তথ্য যাচাই করবেন (ধাপসমূহ):</span>
              </h4>

              <div className="space-y-3">
                
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#006a4e] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর দিন
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      খুঁজতে চাওয়া সনদের ১৭ সংখ্যার ডিজিটাল জন্ম নিবন্ধন নম্বরটি (BRN) ইনপুট বক্সে নির্ভুলভাবে টাইপ করুন।
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#006a4e] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      জন্ম তারিখ নির্বাচন করুন
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      ক্যালেন্ডার ইনপুট ফিল্ড থেকে সংশ্লিষ্ট ব্যক্তির জন্ম তারিখ (YYYY-MM-DD ফরম্যাটে) নির্বাচন করুন।
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#006a4e] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      "সার্চ করুন" বোতামে ক্লিক করুন
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      তথ্য দেওয়ার পর সবুজ "সার্চ করুন" বোতামে চাপ দিলে সিস্টেম প্রক্সি ব্যাকএন্ড থেকে তথ্য যাচাই শুরু করবে।
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#006a4e] text-white font-mono font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    ৪
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      সনদ তথ্য প্রদর্শন ও অফিশিয়াল PDF ডাউনলোড
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      তথ্য মিললে অফিসিয়াল লেআউটসহ ডিজিটাল সনদ প্রদর্শিত হবে। আপনি "পিডিএফ ডাউনলোড" বা "প্রিন্ট করুন" অপশন পাবেন।
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Key Features Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <ShieldCheck className="w-5 h-5 text-[#006a4e] dark:text-emerald-400" />
                <span>পোর্টালের মূল সুবিধা ও বৈশিষ্ট্যসমূহ:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>বাংলা ও ইংরেজি দ্বৈত ভাষায় সমন্বিত সনদ</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>অফিশিয়াল কালার ফরম্যাটে হাই-কোয়ালিটি PDF</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>সরাসরি A4 প্রিন্ট উপযোগী পেজ লেআউট</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>সুরক্ষিত ব্যাকএন্ড প্রক্সি ডাটা এনক্রিপশন</span>
                </div>
              </div>
            </div>

            {/* Official Helpline Support Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <PhoneCall className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>সহায়তা ও হটলাইন নম্বর (Helpline):</span>
              </div>
              <p className="text-xs leading-relaxed">
                জন্ম নিবন্ধন সংক্রান্ত যেকোনো অসঙ্গতি বা সংশোধনের জন্য নিকটস্থ ইউনিয়ন পরিষদ, পৌরসভা, সিটি কর্পোরেশন কার্যালয় অথবা জাতীয় কল সেন্টার <strong>৩৩৩</strong> এ যোগাযোগ করুন।
              </p>
            </div>

            {/* Application & Correction FAQ Guidelines */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <HelpCircle className="w-5 h-5 text-[#006a4e] dark:text-emerald-400" />
                <span>আবেদন, সংশোধন ও ফি সম্পর্কিত সাধারণ প্রশ্নাবলী (FAQ):</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm text-[#006a4e] dark:text-emerald-300">
                    প্রশ্ন: নতুন জন্ম নিবন্ধনের সরকারি ফি কত?
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    শিশুর বয়সের ৪৫ দিনের মধ্যে আবেদন বিনামূল্যে। ৪৫ দিন থেকে ৫ বছর পর্যন্ত ২৫ টাকা এবং ৫ বছরের উর্ধ্বে বয়স হলে ৫০ টাকা সরকারি ফি প্রযোজ্য।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm text-[#006a4e] dark:text-emerald-300">
                    প্রশ্ন: নাম বা জন্ম তারিখ ভুল থাকলে কীভাবে সংশোধন করব?
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    BDRIS অনলাইন পোর্টালে (bdris.gov.bd) "জন্ম নিবন্ধন তথ্য সংশোধন" লিংকে আবেদন করে প্রয়োজনীয় প্রমাণপত্রসহ (যেমন: এনআইডি, শিক্ষা সনদ, বা ডাক্তারী সনদ) সংশ্লিষ্ট নিবন্ধক অফিসে জমা দিন।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm text-[#006a4e] dark:text-emerald-300">
                    প্রশ্ন: পুরনো এনালগ সনদকে ১৭ ডিজিটের ডিজিটালে রূপান্তর করব কীভাবে?
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    আপনার এলাকাভুক্ত নিবন্ধক অফিসে (ইউপি/পৌরসভা/সিটি কর্পোরেশন) হস্তলিখিত বা পুরোনো সনদের মূল কপি নিয়ে গিয়ে অনলাইন এনট্রি সম্পন্ন করে ১৭ ডিজিটের ডিজিটাল ব্রন নম্বর গ্রহণ করুন।
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              গভর্নমেন্ট ডিজিটাল সার্ভিস পোর্টাল v2.5
            </span>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white text-xs font-bold font-bengali transition-all active:scale-95 shadow"
            >
              বুঝেছি, ধন্যবাদ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
