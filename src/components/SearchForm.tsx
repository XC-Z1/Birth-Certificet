import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw, Calendar, FileText, AlertCircle, ShieldCheck, RefreshCw, Lock, XCircle, X, QrCode, History, HelpCircle, Sparkles, Image, Binary } from 'lucide-react';

interface SearchFormProps {
  onSearch: (brn: string, dob: string) => void;
  isLoading: boolean;
  onReset: () => void;
  onOpenQrScanner?: () => void;
  onOpenGuide?: () => void;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  onReset,
  onOpenQrScanner,
  onOpenGuide,
  onOpenHistory,
  historyCount = 0
}) => {
  const [brn, setBrn] = useState('');
  const [dob, setDob] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  // Captcha state: 'code' (e.g. 5-digit image "7K9A2") or 'math' (e.g. "18 + 7")
  const [captchaType, setCaptchaType] = useState<'code' | 'math'>('code');
  const [captchaCode, setCaptchaCode] = useState<string>(''); // Answer
  const [captchaDisplayText, setCaptchaDisplayText] = useState<string>(''); // Text rendered on canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [brnError, setBrnError] = useState('');
  const [dobError, setDobError] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'error' | 'success' }>({
    show: false,
    message: '',
    type: 'error',
  });

  const showToastMsg = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Draw realistic distorted security CAPTCHA on HTML Canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Fill Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // 2. Draw subtle background pattern / grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 15, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 10) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j + 8);
      ctx.stroke();
    }

    // 3. Draw random noise dots
    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Draw squiggly interference lines
    const colors = ['#006a4e', '#0369a1', '#be123c', '#7c2d12', '#431407', '#15803d'];
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.lineWidth = Math.random() * 1.8 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 20, Math.random() * height);
      ctx.bezierCurveTo(
        width * 0.3, Math.random() * height,
        width * 0.7, Math.random() * height,
        width - Math.random() * 20, Math.random() * height
      );
      ctx.stroke();
    }

    // 5. Render characters with random rotation, scale, and color
    const chars = text.split('');
    const charWidth = width / (chars.length + 1);

    chars.forEach((char, index) => {
      ctx.save();
      const fontSize = Math.floor(Math.random() * 5) + 22; // 22px to 27px
      ctx.font = `bold ${fontSize}px "Courier New", monospace, sans-serif`;
      ctx.fillStyle = colors[index % colors.length];

      const x = (index + 0.8) * charWidth;
      const y = height / 2 + Math.floor(Math.random() * 8) - 4;
      const angle = (Math.random() - 0.5) * 0.45; // -13 to +13 degrees

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(char, 0, 8);
      ctx.restore();
    });
  };

  const generateNewCaptcha = () => {
    setCaptchaInput('');
    setCaptchaError('');

    if (captchaType === 'code') {
      // 5-character alphanumeric uppercase code
      const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing O, 0, I, 1
      let result = '';
      for (let i = 0; i < 5; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      setCaptchaCode(result);
      setCaptchaDisplayText(result);
    } else {
      // Math problem e.g. 18 + 7
      const n1 = Math.floor(Math.random() * 25) + 5;
      const n2 = Math.floor(Math.random() * 15) + 1;
      const sum = (n1 + n2).toString();
      setCaptchaCode(sum);
      setCaptchaDisplayText(`${n1} + ${n2} = ?`);
    }
  };

  useEffect(() => {
    generateNewCaptcha();
  }, [captchaType]);

  useEffect(() => {
    if (captchaDisplayText) {
      drawCaptcha(captchaDisplayText);
    }
  }, [captchaDisplayText]);

  // Ensure CAPTCHA refreshes automatically after search request completes
  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading) {
      generateNewCaptcha();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  const validateForm = (): boolean => {
    let isValid = true;
    setBrnError('');
    setDobError('');
    setCaptchaError('');

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

    const userInput = captchaInput.trim();
    if (!userInput) {
      const errMsg = 'ক্যাপচা উত্তর প্রদান করা আবশ্যক।';
      setCaptchaError(errMsg);
      showToastMsg('⚠️ ' + errMsg, 'error');
      isValid = false;
    } else if (userInput.toUpperCase() !== captchaCode.toUpperCase()) {
      const errMsg = 'ক্যাপচা কোড সঠিক হয়নি! ছবির অক্ষরের সাথে মিলিয়ে পুনরায় টাইপ করুন।';
      setCaptchaError(errMsg);
      showToastMsg('❌ ' + errMsg, 'error');
      generateNewCaptcha();
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(brn.trim(), dob);
      // Change CAPTCHA automatically after every search submission
      generateNewCaptcha();
    }
  };

  const handleReset = () => {
    setBrn('');
    setDob('');
    setCaptchaInput('');
    setBrnError('');
    setDobError('');
    setCaptchaError('');
    generateNewCaptcha();
    onReset();
  };

  return (
    <div className="w-full space-y-6 max-w-4xl mx-auto font-bengali relative">
      
      {/* Toast Notification Popup for Captcha Error */}
      {toast.show && (
        <div className="fixed top-5 right-4 sm:right-8 z-50 max-w-md w-[calc(100%-2rem)] bg-gradient-to-r from-rose-600 to-red-700 text-white p-4 rounded-2xl shadow-2xl border-2 border-rose-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl shrink-0">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">ক্যাপচা ভেরিফিকেশন বার্তা</h4>
              <p className="text-xs text-rose-100 font-medium">{toast.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 hover:text-white transition-all shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Official Top Notice Banner */}
      <div className="w-full bg-gradient-to-r from-[#004d38] via-[#006a4e] to-[#004d38] text-white rounded-2xl p-4 sm:p-5 shadow-md border-b-2 border-[#d4af37] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-snug">
              অনলাইন জন্ম নিবন্ধন তথ্য যাচাইকরণ পোর্টালে স্বাগতম
            </h3>
            <p className="text-xs text-emerald-100/90 font-sans">
              নিরাপদ ও তাৎক্ষণিক অনলাইন তথ্য যাচাইকরণ সেবা (BDRIS Verification Service)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 shrink-0 text-xs text-emerald-200">
          <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>অফিসিয়াল নিরাপদ এনক্রিপশন</span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 relative transition-all duration-200">
        
        {/* Header Bar inside Form Card */}
        <div className="pb-5 mb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#006a4e] dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#006a4e] dark:text-emerald-300">
                জন্ম নিবন্ধন তথ্য অনুসন্ধান
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর এবং জন্ম তারিখ প্রদান করুন।
            </p>
          </div>

          {/* Quick Tools Buttons Bar */}
          <div className="flex items-center flex-wrap gap-2 shrink-0">
            {onOpenQrScanner && (
              <button
                type="button"
                onClick={onOpenQrScanner}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                title="সনদের QR কোড থেকে ক্যামেরা বা ছবি দিয়ে তথ্য স্ক্যান করুন"
              >
                <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>QR কোড স্ক্যানার</span>
              </button>
            )}

            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="পূর্বের অনুসন্ধান ইতিহাস দেখুন"
              >
                <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>ইতিহাস ({historyCount})</span>
              </button>
            )}

            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006a4e] dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="আবেদন ও ব্যবহার নির্দেশিকা"
              >
                <HelpCircle className="w-4 h-4 text-[#006a4e] dark:text-emerald-400" />
                <span>নির্দেশিকা ও FAQ</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Birth Registration Number Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="brn-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                    brn.length > 0 && brn.length < 17 
                      ? 'border-amber-500 focus:ring-amber-500' 
                      : brn.length === 17 
                      ? 'border-emerald-500 focus:ring-emerald-500'
                      : brnError 
                      ? 'border-rose-500 focus:ring-rose-500' 
                      : 'border-slate-200 dark:border-slate-700 focus:border-[#006a4e] dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                  } text-slate-900 dark:text-slate-100 font-mono tracking-wider focus:outline-none transition-all text-base sm:text-lg`}
                  disabled={isLoading}
                />
                {brn.length === 17 && (
                  <ShieldCheck className="absolute right-3.5 top-3.5 w-5 h-5 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
                )}
              </div>

              {/* Real-time helper text beneath BRN */}
              {brnError ? (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {brnError}
                </p>
              ) : brn.length > 0 && brn.length < 17 ? (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  ১৭ ডিজিটের সম্পূর্ণ নম্বর প্রদান করুন (আরও {17 - brn.length} টি ডিজিট বাকি)
                </p>
              ) : brn.length === 17 ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর সঠিকভাবে প্রদান করা হয়েছে।
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  ১৭ ডিজিটের ইংরেজি সংখ্যা লিখুন (যেমন: 20001234567890123)
                </p>
              )}
            </div>

            {/* Date of Birth Input */}
            <div className="space-y-1.5">
              <label htmlFor="dob-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                    dob ? 'border-emerald-500 focus:ring-emerald-500' : dobError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:border-[#006a4e] dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                  } text-slate-900 dark:text-slate-100 focus:outline-none transition-all text-base sm:text-lg`}
                  disabled={isLoading}
                />
                <Calendar className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>

              {/* Real-time helper text beneath DOB */}
              {dobError ? (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {dobError}
                </p>
              ) : dob ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  জন্ম তারিখ সঠিকভাবে নির্বাচিত হয়েছে।
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  ক্যালেন্ডার থেকে আপনার জন্ম তারিখ নির্বাচন করুন (YYYY-MM-DD)
                </p>
              )}
            </div>

          </div>

          {/* Authentic Government Security CAPTCHA Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <label htmlFor="captcha-input" className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#006a4e] dark:text-emerald-400" />
                  <span>নিরাপত্তা ক্যাপচা কোড (Security Captcha) <span className="text-rose-500">*</span></span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  ছবির নিরাপত্তা কোডটি নিম্নের বক্সে হুবহু টাইপ করুন।
                </p>
              </div>

              {/* Mode Toggle Switch: Image Code vs Math Challenge */}
              <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCaptchaType('code')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    captchaType === 'code'
                      ? 'bg-[#006a4e] text-white shadow'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                  title="ছবি কোড নিরাপত্তা যাচাই"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>ছবি কোড</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCaptchaType('math')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    captchaType === 'math'
                      ? 'bg-[#006a4e] text-white shadow'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                  title="গাণিতিক হিসাব নিরাপত্তা যাচাই"
                >
                  <Binary className="w-3.5 h-3.5" />
                  <span>গাণিতিক</span>
                </button>
              </div>
            </div>

            {/* Captcha Image Canvas + Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              
              {/* Canvas Image Container */}
              <div className="flex items-center gap-2">
                <div className="relative rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-600 shadow-sm bg-white shrink-0">
                  <canvas
                    ref={canvasRef}
                    width={180}
                    height={50}
                    className="block cursor-pointer select-none"
                    onClick={generateNewCaptcha}
                    title="নতুন ক্যাপচার জন্য ক্লিকে রিফ্রেশ করুন"
                  ></canvas>
                </div>

                <button
                  type="button"
                  onClick={generateNewCaptcha}
                  className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 transition-all active:scale-95 shrink-0"
                  title="নতুন ক্যাপচা ছবি তৈরি করুন (Refresh Captcha)"
                >
                  <RefreshCw className="w-5 h-5 text-[#006a4e] dark:text-emerald-400" />
                </button>
              </div>

              {/* Captcha Input Input Field */}
              <div className="flex-1 space-y-1">
                <div className="relative">
                  <input
                    id="captcha-input"
                    type="text"
                    placeholder={captchaType === 'code' ? 'ছবিতে প্রদর্শিত কোড লিখুন' : 'গাণিতিক উত্তর লিখুন'}
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(captchaType === 'code' ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ''));
                      if (captchaError) setCaptchaError('');
                    }}
                    maxLength={10}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                      captchaError
                        ? 'border-rose-500 focus:ring-rose-500'
                        : captchaInput
                        ? 'border-emerald-500 focus:ring-emerald-500'
                        : 'border-slate-300 dark:border-slate-700 focus:border-[#006a4e] dark:focus:border-emerald-400'
                    } text-slate-900 dark:text-slate-100 font-mono font-bold tracking-widest focus:outline-none transition-all text-base uppercase`}
                    disabled={isLoading}
                  />
                  {captchaInput && !captchaError && (
                    <ShieldCheck className="absolute right-3 top-3 w-5 h-5 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
                  )}
                </div>

                {captchaError ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {captchaError}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {captchaType === 'code' ? 'ছোট বা বড় হাতের ইংরেজি অক্ষর লিখুন' : 'সংখ্যায় সঠিক যোগফল লিখুন'}
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Buttons Action Group */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading || (!brn && !dob && !captchaInput)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              পুনরায় লিখুন (Reset)
            </button>

            <button
              type="submit"
              disabled={isLoading || brn.length !== 17 || !dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white font-bold shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#006a4e] flex items-center justify-center gap-2 text-base border-b-2 border-[#d4af37]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#d4af37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-[#d4af37]" />
                  <span>সার্চ করুন (Search)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


