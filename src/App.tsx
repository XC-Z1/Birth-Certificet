import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { CertificateResult } from './components/CertificateResult';
import { HistorySidebar } from './components/HistorySidebar';
import { SkeletonLoader } from './components/SkeletonLoader';
import { Footer } from './components/Footer';
import { BirthRecordResponse, SearchHistoryItem } from './types';
import { playSuccessChime } from './utils/audio';
import { AlertTriangle, CheckCircle2, X, Shield, Users, Search, FileCheck2 } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bd_birth_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<BirthRecordResponse | null>(null);
  
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('bd_birth_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchCounter, setSearchCounter] = useState<number>(12450);

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bd_birth_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bd_birth_theme', 'light');
    }
  }, [darkMode]);

  // Sync history state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bd_birth_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save search history');
    }
  }, [history]);

  // Fetch initial search counter from server
  useEffect(() => {
    fetch('/api/search-counter')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setSearchCounter(data.count);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Perform backend proxy search
  const handleSearch = async (brn: string, dob: string) => {
    setIsLoading(true);
    setError(null);
    setResultData(null);

    try {
      const response = await fetch(`/api/verify-birth-record?brn=${encodeURIComponent(brn)}&dob=${encodeURIComponent(dob)}`);
      const data: BirthRecordResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'জন্ম নিবন্ধন তথ্য অনুসন্ধান ব্যাহত হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিন।');
      }

      setResultData(data);
      setSearchCounter((prev) => prev + 1);

      // Play subtle audio notification chime on successful record load
      playSuccessChime();

      // Trigger celebrate animation on success
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Ignored if canvas fails
      }

      // Add to search history if unique or update timestamp
      setHistory((prev) => {
        const id = `${brn}_${dob}`;
        const existing = prev.find((item) => item.id === id);
        const newItem: SearchHistoryItem = {
          id,
          brn,
          dob,
          timestamp: Date.now(),
          nameBangla: data.nameBangla,
          nameEnglish: data.nameEnglish,
          isFavorite: existing ? existing.isFavorite : false
        };
        const filtered = prev.filter((item) => item.id !== id);
        return [newItem, ...filtered].slice(0, 30); // keep max 30 items
      });

      showToast('জন্ম নিবন্ধন তথ্য সফলতা पूर्वक লোড হয়েছে!');

    } catch (err: any) {
      setError(err.message || 'একটি ত্রুটি ঘটেছে। নেটওয়ার্ক বা তথ্য পুনরায় পরীক্ষা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setError(null);
  };

  const handleToggleFavorite = (brn: string, dob: string) => {
    const id = `${brn}_${dob}`;
    setHistory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = !item.isFavorite;
          showToast(updated ? 'প্রিয় তালিকায় যোগ করা হয়েছে' : 'প্রিয় তালিকা থেকে সরানো হয়েছে');
          return { ...item, isFavorite: updated };
        }
        return item;
      })
    );
  };

  const handleSelectHistoryItem = (item: SearchHistoryItem) => {
    handleSearch(item.brn, item.dob);
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('অনুসন্ধান ইতিহাস মুছে ফেলা হয়েছে');
  };

  const handleCopyAll = () => {
    if (!resultData) return;
    const text = `
========= জন্ম নিবন্ধন তথ্য বিবরণী =========
জন্ম নিবন্ধন নম্বর (BRN): ${resultData.brn || 'N/A'}
নাম (বাংলা): ${resultData.nameBangla || 'N/A'}
Name (English): ${resultData.nameEnglish || 'N/A'}
জন্ম তারিখ (DOB): ${resultData.dateOfBirth || 'N/A'} (${resultData.dateOfBirthEn || ''})
পিতার নাম: ${resultData.fatherName || 'N/A'} (${resultData.fatherNameEn || ''})
পিতার জাতীয়তা: ${resultData.fathersNationality || 'N/A'}
মাতার নাম: ${resultData.motherName || 'N/A'} (${resultData.motherNameEn || ''})
মাতার জাতীয়তা: ${resultData.mothersNationality || 'N/A'}
লিঙ্গ (Gender): ${resultData.gender || 'N/A'} / ${resultData.genderEn || 'N/A'}
জন্মস্থান (Birth Place): ${resultData.birthPlace || 'N/A'} (${resultData.birthPlaceEn || ''})
নিবন্ধন তারিখ: ${resultData.registerDate || 'N/A'}
সনদ ইস্যুর তারিখ: ${resultData.issuanceDate || 'N/A'}
নিবন্ধন কার্যালয়: ${resultData.registerOfficeEn || 'N/A'} (${resultData.registerOfficeLocationEn || ''})
===========================================
    `.trim();

    navigator.clipboard.writeText(text);
    showToast('সকল জন্ম নিবন্ধন তথ্য কপি করা হয়েছে!');
  };

  const handleCopyField = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    showToast(`${label} কপি করা হয়েছে`);
  };

  const favoriteCount = history.filter((i) => i.isFavorite).length;
  const isCurrentFavorite = Boolean(
    resultData && history.find((i) => i.brn === resultData.brn && i.isFavorite)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-bengali antialiased transition-colors duration-300">
      
      {/* Toast Notification Floating at Top Center */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 sm:w-auto animate-fadeIn transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-950/95 via-emerald-900/95 to-slate-900/95 text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#d4af37]/70 backdrop-blur-xl flex items-center justify-between gap-3 text-sm font-bold font-bengali ring-4 ring-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#d4af37] to-amber-600 text-slate-950 shrink-0 shadow-md">
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
              </div>
              <span className="tracking-wide text-emerald-50 text-xs sm:text-sm">{toastMessage}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors shrink-0"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onToggleSidebar={() => setIsSidebarOpen(true)}
        searchCounter={searchCounter}
        onOpenHistory={() => setIsSidebarOpen(true)}
        favoriteCount={favoriteCount}
      />

      {/* History & Favorites Drawer Sidebar */}
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistoryItem}
        onToggleFavorite={(id) => {
          setHistory((prev) =>
            prev.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i))
          );
        }}
        onClearHistory={handleClearHistory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Portal Notice Banner */}
        <div className="no-print bg-emerald-900/10 dark:bg-emerald-900/30 border border-emerald-800/20 dark:border-emerald-600/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-700 text-amber-300 rounded-lg shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                জন্ম ও মৃত্যু নিবন্ধন তথ্য যাচাইকরণ নিরাপদ প্রক্সি পোর্টাল
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                সুরক্ষিত এনক্রিপ্টেড ব্যাকএন্ড প্রক্সি ব্যবহার করে সরাসরি সরকারি ডেটাবেজ যাচাইকরণ।
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono font-semibold bg-white/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 shrink-0">
            <Search className="w-3.5 h-3.5" />
            <span>মোট যাচাই সম্পন্ন: {searchCounter.toLocaleString('bn-BD')}</span>
          </div>
        </div>

        {/* Search Form Card Component */}
        <div className="no-print">
          <SearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            onReset={handleReset}
          />
        </div>

        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="transition-all duration-300">
            <SkeletonLoader />
          </div>
        )}

        {/* Error Alert Box */}
        {error && !isLoading && (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 shadow-lg text-rose-900 dark:text-rose-200 space-y-3 animate-fade-in">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
              <h3 className="text-lg font-bold font-bengali">তথ্য খুঁজে পাওয়া যায়নি বা ত্রুটি ঘটেছে!</h3>
            </div>
            <p className="text-sm font-bengali pl-9 leading-relaxed text-slate-700 dark:text-rose-300">
              {error}
            </p>
            <div className="pl-9 pt-2">
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-600 dark:text-rose-400/80">
                <li>১৭ ডিজিটের জন্ম নিবন্ধন নম্বর সঠিকভাবে টাইপ করেছেন কিনা নিশ্চিত করুন।</li>
                <li>জন্ম তারিখ YYYY-MM-DD ফরম্যাটে সঠিক আছে কিনা দেখুন।</li>
                <li>নেটওয়ার্ক সংযোগ স্থিতিশীল রয়েছে কিনা নিশ্চিত করুন।</li>
              </ul>
            </div>
          </div>
        )}

        {/* Certificate Result Output */}
        {resultData && !isLoading && (
          <div className="animate-fade-in">
            <CertificateResult
              data={resultData}
              onCopyAll={handleCopyAll}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isCurrentFavorite}
              onCopyField={handleCopyField}
            />
          </div>
        )}

        {/* Information FAQs Section when no active search result */}
        {!resultData && !isLoading && (
          <div className="no-print mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-2xl glass-card border border-emerald-900/10 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                ১৭ ডিজিট আবশ্যক
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                জন্ম নিবন্ধন নম্বরটি অবশ্যই ১৭ ডিজিটের হতে হবে। পুরনো ১৬ বা ১৩ ডিজিটের নম্বর হলে স্থানীয় নিবন্ধন অফিসে যোগাযোগ করুন।
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-emerald-900/10 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                পিতা-মাতার তথ্য
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                সার্চের মাধ্যমে অর্জিত সনদে পিতা ও মাতার নাম, জাতীয়তা, জন্ম স্থান ও নিবন্ধন কার্যালয়ের বিবরণ সুবিন্যস্ত থাকে।
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-emerald-900/10 dark:border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                নিরাপদ ও এনক্রিপ্টেড
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                আপনার ব্রাউজার বা ডিভাইসে কোনো গোপন সংবেদনশীল তথ্য অনুপযুক্তভাবে উন্মুক্ত হয় না। সকল অনুসন্ধান ব্যাকএন্ড প্রক্সির মাধ্যমে সুরক্ষিত।
              </p>
            </div>

          </div>
        )}

      </main>

      {/* Footer Section */}
      <div className="no-print">
        <Footer />
      </div>

    </div>
  );
}
