import React, { useRef, useState } from 'react';
import { History, Star, Trash2, ArrowRight, X, Clock, Printer, FileText, Loader2, Download, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { SearchHistoryItem } from '../types';
import { GovernmentEmblem } from './GovernmentEmblem';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onSelectHistory: (item: SearchHistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onToggleFavorite,
  onClearHistory
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen) return null;

  const handleExportPdf = async () => {
    if (!reportRef.current || isExportingPdf || history.length === 0) return;
    setIsExportingPdf(true);

    try {
      const element = reportRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 1000,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const printableWidth = pdfWidth - margin * 2;
      const printableHeight = pdfHeight - margin * 2;

      const imgWidth = printableWidth;
      const imgHeight = (canvas.height * printableWidth) / canvas.width;

      let finalHeight = imgHeight;
      let finalWidth = imgWidth;

      if (finalHeight > printableHeight) {
        finalHeight = printableHeight;
        finalWidth = (canvas.width * printableHeight) / canvas.height;
      }

      const xOffset = margin + (printableWidth - finalWidth) / 2;
      const yOffset = margin;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`BD_Birth_Registration_History_Report_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error('History PDF export error:', error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrintWindow = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Hidden Printable History Report Document for PDF Capture */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <div
          ref={reportRef}
          className="w-[900px] p-8 bg-white text-slate-900 font-bengali space-y-6"
        >
          {/* Official Report Header */}
          <div className="border-b-2 border-[#006a4e] pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GovernmentEmblem size={60} />
              <div>
                <h2 className="text-xl font-bold text-[#006a4e]">
                  গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                </h2>
                <p className="text-sm font-semibold text-slate-700">
                  জন্ম ও মৃত্যু নিবন্ধন কার্যালয় - অনুসন্ধান ইতিহাস বিবরণী
                </p>
                <p className="text-xs text-slate-500 font-english">
                  Office of the Registrar General, Birth and Death Registration Report
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-1">
              <p className="font-bold text-[#006a4e]">অফিসিয়াল তথ্য রিপোর্ট</p>
              <p>রিপোর্ট তারিখ: {new Date().toLocaleDateString('bn-BD')} {new Date().toLocaleTimeString('bn-BD')}</p>
              <p>মোট সংরক্ষিত রেকর্ড: {history.length} টি</p>
            </div>
          </div>

          {/* History Table */}
          <div>
            <table className="w-full border-collapse border border-slate-300 text-left text-xs">
              <thead>
                <tr className="bg-[#006a4e] text-white">
                  <th className="border border-slate-300 p-2.5 font-bold text-center w-12">#</th>
                  <th className="border border-slate-300 p-2.5 font-bold">জন্ম নিবন্ধন নম্বর (BRN)</th>
                  <th className="border border-slate-300 p-2.5 font-bold">নাম (Name)</th>
                  <th className="border border-slate-300 p-2.5 font-bold">জন্ম তারিখ (DOB)</th>
                  <th className="border border-slate-300 p-2.5 font-bold text-center">টাইপ</th>
                  <th className="border border-slate-300 p-2.5 font-bold text-right">অনুসন্ধানের সময়</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="border border-slate-300 p-2 text-center font-bold text-slate-600">
                      {(idx + 1).toLocaleString('bn-BD')}
                    </td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-[#006a4e]">
                      {item.brn}
                    </td>
                    <td className="border border-slate-300 p-2 font-semibold text-slate-800">
                      {item.nameBangla || item.nameEnglish || 'নাম পাওয়া যায়নি'}
                    </td>
                    <td className="border border-slate-300 p-2 font-mono text-slate-700">
                      {item.dob}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold">
                      {item.isFavorite ? (
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          ★ প্রিয়
                        </span>
                      ) : (
                        <span className="text-slate-600">সাধারণ</span>
                      )}
                    </td>
                    <td className="border border-slate-300 p-2 text-right font-mono text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString('bn-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Report Footer */}
          <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs text-slate-500">
            <div>
              <p className="font-semibold text-[#006a4e]">
                * এটি সিস্টেম দ্বারা স্বয়ংক্রিয়ভাবে তৈরি অনলাইন রেকর্ড সংক্ষেপ রিপোর্ট।
              </p>
              <p className="text-[10px] font-mono">Verification Ref: BD-BRN-HIST-{Date.now()}</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-slate-700">Developer Name : X C</p>
              <p className="text-[10px]">Bangladesh Online Birth Verification Portal</p>
            </div>
          </div>

        </div>
      </div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-emerald-900/20 dark:border-emerald-500/20 transition-transform duration-300">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-green-900 text-amber-300 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold font-bengali text-lg">পূর্ববর্তী অনুসন্ধান ও প্রিয় তালিকা</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-amber-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Print History Toolbar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-bengali">
          <span className="text-slate-600 dark:text-slate-400 font-bold">
            মোট আইটেম: {history.length} টি
          </span>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                {/* Print History PDF Download Button */}
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-3 py-1.5 rounded-lg bg-[#006a4e] hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors border-b-2 border-[#d4af37] disabled:opacity-70"
                  title="সম্পূর্ণ হিস্ট্রি রিপোর্ট পিডিএফ হিসেবে ডাউনলোড করুন"
                >
                  {isExportingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  {isExportingPdf ? 'তৈরি হচ্ছে...' : 'প্রিন্ট হিস্ট্রি (PDF)'}
                </button>

                {/* Direct Print */}
                <button
                  onClick={handlePrintWindow}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                  title="প্রিন্ট প্রাকদর্শন"
                >
                  <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </button>

                {/* Clear History */}
                <button
                  onClick={onClearHistory}
                  className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                  title="ইতিহাস মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 space-y-3 text-slate-400">
              <Clock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="font-bengali text-sm font-semibold">কোনো পূর্ববর্তী অনুসন্ধান ইতিহাস পাওয়া যায়নি।</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all flex items-start justify-between gap-3"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-emerald-800 dark:text-emerald-300">
                      {item.brn}
                    </span>
                  </div>

                  <p className="text-xs font-bengali font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {item.nameBangla || item.nameEnglish || 'নাম পাওয়া যায়নি'}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span>DOB: {item.dob}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleDateString('bn-BD')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title={item.isFavorite ? 'প্রিয় তালিকা থেকে সরান' : 'প্রিয় তালিকায় যোগ করুন'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => {
                      onSelectHistory(item);
                      onClose();
                    }}
                    className="p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 transition-colors"
                    title="পুনরায় অনুসন্ধান করুন"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-500 font-bengali">
          আপনার ব্রাউজারের LocalStorage-এ নিরাপদভাবে সংরক্ষিত।
        </div>

      </div>
    </div>
  );
};

