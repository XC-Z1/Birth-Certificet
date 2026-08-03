import React from 'react';
import { GovernmentEmblem } from './GovernmentEmblem';
import { ShieldCheck, PhoneCall, ExternalLink, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t-2 border-[#d4af37] bg-slate-950 text-slate-300 font-bengali">
      
      {/* Official Bangladesh Flag Color Accent Strip */}
      <div className="h-1.5 w-full bg-[#006a4e] relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f42a41]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          
          <div className="flex items-center gap-3.5">
            <div className="bg-white rounded-full p-1 border border-[#d4af37]">
              <GovernmentEmblem size={46} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
              </h3>
              <p className="text-xs text-[#d4af37] font-semibold">
                রেজিস্ট্রার জেনারেলের কার্যালয়, জন্ম ও মৃত্যু নিবন্ধন • স্থানীয় সরকার বিভাগ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 bg-slate-900 px-3.5 py-2 rounded-xl border border-amber-500/30">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>সহায়তা নম্বর: <strong>১৬১০১ / ৩৩৩</strong></span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-emerald-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>নিরাপদ প্রক্সি যাচাইকরণ</span>
            </div>
          </div>

        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-1">
              গুরুত্বপূর্ণ সরকারি ওয়েবসাইটসমূহ
            </h4>
            <ul className="space-y-1.5 pt-1 text-slate-300">
              <li>
                <a href="https://bangladesh.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                  <span>জাতীয় তথ্য বাতায়ন (bangladesh.gov.bd)</span>
                </a>
              </li>
              <li>
                <a href="https://bdris.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                  <span>জন্ম ও মৃত্যু নিবন্ধন ওয়েবসাইট (bdris.gov.bd)</span>
                </a>
              </li>
              <li>
                <a href="https://lgd.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                  <span>স্থানীয় সরকার বিভাগ (lgd.gov.bd)</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-1">
              জরুরি নির্দেশনা ও সহায়তা
            </h4>
            <p className="leading-relaxed">
              অনলাইন জন্ম নিবন্ধন সনদে যেকোনো নাম, তারিখ বা ঠিকানা সংশোধনের জন্য আপনার স্থানীয় নিবন্ধক কার্যালয়ে (ইউনিয়ন পরিষদ / পৌরসভা / সিটি কর্পোরেশন) আবেদন জমা দিন।
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-1">
              কারিগরি ও ডেভেলপমেন্ট তথ্য
            </h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <Code className="w-3.5 h-3.5" />
                <span>Developer Name: X C</span>
              </div>
              <p className="text-[11px] text-slate-400">
                বাংলাদেশ ডিজিটাল সার্ভিসেস ডিজাইন সিস্টেম ও সিকিউরিটি প্রোটোকল মেনে প্রস্তুতকৃত।
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center text-xs text-slate-500 gap-2 text-center">
          <p>© {new Date().getFullYear()} গণপ্রজাতন্ত্রী বাংলাদেশ সরকার। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>

      </div>
    </footer>
  );
};

