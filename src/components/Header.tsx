import React from 'react';
import { Moon, Sun, Menu, Star } from 'lucide-react';
import { GovernmentEmblem } from './GovernmentEmblem';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onToggleSidebar: () => void;
  searchCounter: number;
  onOpenHistory: () => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onToggleSidebar,
  searchCounter,
  onOpenHistory,
  favoriteCount
}) => {
  return (
    <header className="no-print sticky top-0 z-40 w-full bg-[#006a4e] h-20 border-b-4 border-[#d4af37] shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Left: Mobile Menu & Govt Emblem Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-white hover:bg-emerald-800 focus:outline-none transition-colors"
            title="মেনু খুলুন (Toggle Menu)"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* Government Emblem Logo - Geometric Balance Theme */}
          <div className="flex items-center space-x-3.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-white rounded-full flex items-center justify-center p-0.5 border-2 border-[#d4af37] shadow-md group-hover:scale-105 transition-transform">
              <GovernmentEmblem size={44} />
            </div>

            <div>
              <h1 className="text-white font-bold text-base sm:text-xl leading-tight font-bengali">
                বাংলাদেশ জন্ম নিবন্ধন তথ্য অনুসন্ধান
              </h1>
              <p className="text-[#d4af37] text-[10px] sm:text-xs uppercase tracking-widest font-semibold font-english">
                Birth Registration Information Search Portal
              </p>
            </div>
          </div>
        </div>

        {/* Right: Developer Tag, Favorites & Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Developer Tag */}
          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-white/70 text-[10px] uppercase tracking-tighter">Developed by</span>
            <span className="text-[#d4af37] font-bold text-xs tracking-widest font-mono">X C</span>
          </div>

          {/* Favorites Button */}
          <button
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg text-white hover:bg-emerald-800 transition-colors"
            title="সংরক্ষিত ইতিহাস ও প্রিয় অনুসন্ধান"
          >
            <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]/20" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {favoriteCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-white transition-all duration-300 border border-emerald-600/50 flex items-center justify-center"
            title={darkMode ? 'ডার্ক মোড (লাইট মোডে পরিবর্তন করুন)' : 'লাইট মোড (ডার্ক মোডে পরিবর্তন করুন)'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Moon className="w-5 h-5 text-[#d4af37] animate-fadeIn" />
            ) : (
              <Sun className="w-5 h-5 text-[#d4af37] animate-fadeIn" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
