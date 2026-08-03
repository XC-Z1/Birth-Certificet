import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full glass-card rounded-2xl p-6 sm:p-10 shadow-xl border border-emerald-600/20 space-y-6 animate-pulse">
      
      {/* Top Header Banner Skeleton */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        <div className="space-y-2 flex-1 max-w-md mx-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mx-auto"></div>
        </div>
        <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
      </div>

      {/* BRN Banner Skeleton */}
      <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>

      {/* Grid Details Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl space-y-4">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          </div>
        </div>

        <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl space-y-4">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>

    </div>
  );
};
