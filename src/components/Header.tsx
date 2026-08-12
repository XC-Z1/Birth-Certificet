import React from 'react';
import { Moon, Sun, Menu, HelpCircle, ShieldCheck } from 'lucide-react';
import { GovernmentEmblem } from './GovernmentEmblem';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onToggleSidebar: () => void;
  searchCounter: number;
  onOpenHistory: () => void;
  favoriteCount: number;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onToggleSidebar,
  searchCounter,
  onOpenHistory,
  favoriteCount,
  onOpenAbout
}) => {
  return (
    <header className="no-print sticky top-0 z-40 w-full shadow-md transition-colors duration-200">
      
      {/* Official Government Top Information Strip */}
      <div className="bg-[#004d38] text-white text-[10px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-emerald-700/60 font-bengali">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
            <span className="font-semibold text-emerald-100 text-[10px] sm:text-xs truncate">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার • রেজিস্ট্রার জেনারেলের কার্যালয়, জন্ম ও মৃত্যু নিবন্ধন
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-emerald-200/90 font-mono text-[11px] shrink-0">
            <span>সহায়তা: ১৬১০১ / ৩৩৩</span>
            <span>•</span>
            <span>bdris.gov.bd</span>
          </div>
        </div>
      </div>

      {/* Main Government Navbar Header */}
      <div className="bg-[#006a4e] min-h-[64px] sm:min-h-[76px] py-2 sm:py-2.5 border-b-2 border-[#d4af37]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2">
          
          {/* Left: Mobile Menu & Govt Emblem Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 sm:p-2 rounded-lg text-white hover:bg-emerald-800/80 active:scale-95 focus:outline-none transition-all shrink-0"
              title="মেনু খুলুন (Toggle Menu)"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Government Emblem Logo */}
            <div 
              className="flex items-center space-x-2 group cursor-pointer shrink-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="bg-white rounded-full flex items-center justify-center p-1 border-2 border-[#d4af37] shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <GovernmentEmblem size={38} />
              </div>
            </div>
          </div>

          {/* Right: About / User Guide Button & Theme Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            
            {/* About / User Guide Button */}
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all border border-amber-400/40 text-[11px] sm:text-xs font-bold font-bengali active:scale-95 shadow-sm shrink-0"
              title="সাইট ব্যবহার নির্দেশিকা ও পোর্টাল পরিচিতি"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span className="hidden sm:inline">ব্যবহার নির্দেশিকা</span>
              <span className="sm:hidden">নির্দেশিকা</span>
            </button>

            {/* Theme Toggle Button (Light Mode = Sun, Dark Mode = Moon) */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 sm:p-2 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 active:scale-95 text-white transition-all border border-emerald-600/40 flex items-center justify-center shrink-0"
              title={darkMode ? 'ডার্ক মোড (Moon)' : 'লাইট মোড (Sun)'}
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37]" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              )}
            </button>

            {/* Developer Tag Badge */}
            <div className="hidden md:flex flex-col items-end text-right pl-2 border-l border-emerald-600/50 shrink-0">
              <span className="text-emerald-100/70 text-[9px] uppercase font-mono">Developed By</span>
              <span className="text-[#d4af37] font-bold text-xs tracking-wider font-mono">X C</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};


