import React from 'react';
import { GovernmentEmblem } from './GovernmentEmblem';
import { ShieldCheck, Heart, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300 font-bengali">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-center gap-3">
            <GovernmentEmblem size={44} />
            <div>
              <h3 className="text-base font-bold text-white">
                বাংলাদেশ জন্ম নিবন্ধন তথ্য অনুসন্ধান পোর্টাল
              </h3>
              <p className="text-xs text-slate-400 font-english">
                Government Style Birth Registration Information System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>সিকিউর এনক্রিপ্টেড ব্যাকএন্ড প্রক্সি সক্রিয়</span>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200">অফিসিয়াল ডিসক্লেইমার</h4>
            <p className="leading-relaxed">
              এই ওয়েব অ্যাপ্লিকেশনটি জন্ম ও মৃত্যু নিবন্ধন তথ্যাদি প্রদর্শনের জন্য তৈরি একটি দ্রুত অনুসন্ধান পোর্টাল। সর্বজনীন তথ্যের সঠিকতা যাচাই প্রক্সি সার্ভারের মাধ্যমে সম্পন্ন হয়।
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200">গোপনীয়তা ও নিরাপত্তা</h4>
            <p className="leading-relaxed">
              ব্যবহারকারীর যেকোনো তথ্য স্থানীয় ক্লায়েন্ট সাইড ব্রাউজারে সংরক্ষিত থাকে। ক্লাউড সার্ভারে কোনো সংবেদনশীল ব্যক্তিগত পাসওয়ার্ড বা তথ্য সঞ্চয় করা হয় না।
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200">ডেভেলপার ডিটেইলস</h4>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <Code className="w-3.5 h-3.5" />
                <span>Developer Name: X C</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Senior Full Stack Developer, UI/UX Designer & Cyber Security Expert
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} বাংলাদেশ জন্ম নিবন্ধন তথ্য অনুসন্ধান। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>

      </div>
    </footer>
  );
};
