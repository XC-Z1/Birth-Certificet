import React, { useState } from 'react';
import { SearchHistoryItem } from '../types';
import {
  X,
  History,
  Bookmark,
  Trash2,
  ExternalLink,
  Code,
  Keyboard,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'history' | 'favorites' | 'help';
  setActiveTab: (tab: 'history' | 'favorites' | 'help') => void;
  history: SearchHistoryItem[];
  favorites: SearchHistoryItem[];
  onSelectHistoryItem: (item: SearchHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onRemoveFavorite: (id: string) => void;
  searchCounter: number;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  history,
  favorites,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
  onRemoveFavorite,
  searchCounter
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-bengali">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      {/* Slide-over Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-emerald-600/20 shadow-2xl flex flex-col text-slate-800 dark:text-slate-100 transition-transform duration-300">
          
          {/* Header */}
          <div className="p-4 bg-emerald-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-base font-bengali">অ্যাক্টিভিটি ও কন্ট্রোল প্যানেল</h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-emerald-800 dark:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>ইতিহাস ({history.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'favorites'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>সংরক্ষিত ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'help'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>সহায়তা</span>
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Tab 1: History */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    সাম্প্রতিক সার্চসমূহ (লোকাল হিস্ট্রি)
                  </span>
                  {history.length > 0 && (
                    <button
                      onClick={onClearHistory}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>সব মুছুন</span>
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <History className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm">কোনো অনুসন্ধানের ইতিহাস পাওয়া যায়নি</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-2"
                    >
                      <div
                        onClick={() => {
                          onSelectHistoryItem(item);
                          onClose();
                        }}
                        className="flex-1 cursor-pointer space-y-0.5"
                      >
                        <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {item.brn}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold truncate">
                          {item.record?.nameBangla || 'জন্ম তারিখ: ' + item.dob}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{new Date(item.timestamp).toLocaleString('bn-BD')}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Favorites */}
            {activeTab === 'favorites' && (
              <div className="space-y-3">
                <div className="pb-2 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  সংরক্ষিত সনদ ও প্রিয় সার্চসমূহ
                </div>

                {favorites.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Bookmark className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm">কোনো সেভ করা সনদ নেই</p>
                  </div>
                ) : (
                  favorites.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-2"
                    >
                      <div
                        onClick={() => {
                          onSelectHistoryItem(item);
                          onClose();
                        }}
                        className="flex-1 cursor-pointer space-y-0.5"
                      >
                        <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                          {item.brn}
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {item.record?.nameBangla}
                        </div>
                        <div className="text-[10px] text-slate-500 font-english">
                          {item.record?.nameEnglish}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveFavorite(item.id)}
                        className="p-1.5 rounded-lg text-amber-600 hover:text-red-600 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                        title="সরান"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Help & Shortcuts */}
            {activeTab === 'help' && (
              <div className="space-y-5 text-xs">
                
                {/* Keyboard Shortcuts Table */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    <Keyboard className="w-4 h-4" />
                    <span>কী-বোর্ড শর্টকাটসমূহ</span>
                  </h4>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <span className="text-slate-600 dark:text-slate-300">ইনপুট বক্সে ফোকাস:</span>
                      <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                        Ctrl + K / /
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <span className="text-slate-600 dark:text-slate-300">সনদ প্রিন্ট করুন:</span>
                      <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                        Ctrl + P
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300">মোডাল/প্যানেল বন্ধ:</span>
                      <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-[11px]">
                        Esc
                      </span>
                    </div>
                  </div>
                </div>

                {/* Developer Info Box */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white space-y-2 border border-emerald-700 shadow-md">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Code className="w-4 h-4" />
                    <span>ডেভেলপার অ্যান্ড আর্কিটেক্ট</span>
                  </div>

                  <p className="text-xs text-emerald-200">
                    প্রকল্প নাম: <strong className="text-white">বাংলাদেশ জন্ম নিবন্ধন তথ্য অনুসন্ধান</strong>
                  </p>

                  <div className="pt-1 text-xs">
                    <span className="text-emerald-300 block">Developer Name:</span>
                    <strong className="text-base text-amber-300 font-mono tracking-widest block">
                      M I R Z A F O R
                    </strong>
                    <span className="text-[11px] text-emerald-200/80 font-mono">Senior Full Stack Developer & UI/UX Expert</span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>সিকিউরিটি নোট</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    এই সিস্টেমটি সরাসরি ক্লাউড প্রক্সি ব্যাকএন্ডের মাধ্যমে সুরক্ষিত এনক্রিপ্টেড সংযোগে API প্রসেস করে। কোনো গোপনীয় কী ক্লায়েন্ট সাইডে এক্সপোজ করা হয় না।
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500">
            মোট অনুসন্ধান সেশন সংখ্যা: <strong className="text-slate-800 dark:text-slate-200">{searchCounter}</strong>
          </div>

        </div>
      </div>
    </div>
  );
};
