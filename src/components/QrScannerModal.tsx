import React, { useState, useRef, useEffect } from 'react';
import { X, QrCode, Camera, Upload, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import jsQR from 'jsqr';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (brn: string, dob: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<{ brn: string; dob: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanError(null);
      setScannedData(null);
    }
  }, [isOpen]);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const parseQrText = (text: string): { brn: string; dob: string } | null => {
    let brn = '';
    let dob = '';

    try {
      // Check if it's a BDRIS URL format e.g. https://everify.bdris.gov.bd/verifying?brn=20001234567890123&dob=2000-01-01
      if (text.includes('brn=') || text.includes('dob=')) {
        const urlParams = new URLSearchParams(text.split('?')[1] || text);
        brn = urlParams.get('brn') || urlParams.get('BRN') || '';
        dob = urlParams.get('dob') || urlParams.get('DOB') || '';
      }

      // Check if JSON format e.g. {"brn": "20001234567890123", "dob": "2000-01-01"}
      if (!brn && (text.startsWith('{') || text.startsWith('['))) {
        const json = JSON.parse(text);
        brn = json.brn || json.BRN || json.birthRegistrationNumber || '';
        dob = json.dob || json.DOB || json.dateOfBirth || '';
      }

      // Fallback regex search for 17-digit number and date YYYY-MM-DD
      if (!brn) {
        const brnMatch = text.match(/\b\d{17}\b/);
        if (brnMatch) brn = brnMatch[0];
      }

      if (!dob) {
        const dobMatch = text.match(/\b(19|20)\d{2}[-/.] (0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/) ||
                         text.match(/\b\d{4}-\d{2}-\d{2}\b/);
        if (dobMatch) dob = dobMatch[0].replace(/\//g, '-');
      }

      if (brn && brn.length === 17) {
        return { brn, dob: dob || '2000-01-01' };
      }
    } catch {
      // Ignored
    }

    return null;
  };

  const startCamera = async () => {
    stopCamera();
    setScanError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickCamera);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setScanError('ক্যামেরা চালু করা সম্ভব হয়নি। অনুগ্রহ করে ছবি আপলোড অপশনটি ব্যবহার করুন।');
    }
  };

  const tickCamera = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            const parsed = parseQrText(code.data);
            if (parsed) {
              setScannedData(parsed);
              stopCamera();
              return;
            }
          }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tickCamera);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);
    setScannedData(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code && code.data) {
            const parsed = parseQrText(code.data);
            if (parsed) {
              setScannedData(parsed);
            } else {
              setScanError('QR কোড থেকে সনদের সঠিক তথ্য পাওয়া যায়নি। নিশ্চিত হয়ে পরিষ্কার ছবি আপলোড করুন।');
            }
          } else {
            setScanError('ছবিতে কোনো স্ক্যানযোগ্য QR কোড সনাক্ত করা যায়নি। অন্য পরিষ্কার ছবি দিন।');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmResult = () => {
    if (scannedData) {
      onScanSuccess(scannedData.brn, scannedData.dob);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-bengali no-print">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      ></div>

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="inline-block w-full max-w-lg my-8 text-left align-middle transition-all transform bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-[#006a4e] text-white p-5 border-b-4 border-[#d4af37] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                <QrCode className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <h3 className="text-lg font-bold">QR কোড স্ক্যানার</h3>
                <p className="text-xs text-emerald-100/90">সনদের QR কোড থেকে স্বয়ংক্রিয় তথ্য ইনপুট</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white transition-all border border-emerald-600/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'upload'
                  ? 'bg-[#006a4e] text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>ছবি আপলোড (Upload File)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                activeTab === 'camera'
                  ? 'bg-[#006a4e] text-white shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>ক্যামেরা স্ক্যান (Live Camera)</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 space-y-5">
            {scannedData ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 space-y-4 text-center animate-fade-in">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-200">
                    QR কোড সফলতা সহকারে পড়া হয়েছে!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    নিচের জন্ম নম্বর ও তারিখ স্বয়ংক্রিয়ভাবে সার্চ ফর্মে যুক্ত করা হবে।
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                    <span className="text-slate-500">BRN:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{scannedData.brn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DOB:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{scannedData.dob}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setScannedData(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                  <button
                    onClick={handleConfirmResult}
                    className="flex-1 py-2.5 rounded-xl bg-[#006a4e] text-white font-bold text-xs shadow-md border-b-2 border-[#d4af37]"
                  >
                    ফর্মে ইনপুট দিন ও সার্চ করুন
                  </button>
                </div>
              </div>
            ) : activeTab === 'upload' ? (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#006a4e] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50/50 text-center">
                  <Upload className="w-10 h-10 text-[#006a4e] dark:text-emerald-400 mb-2" />
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    সনদের ছবি বা QR ফাইল আপলোড করুন
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    PNG, JPG, WEBP ফাইল সমর্থিত
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border-2 border-slate-800 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                  ></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>

                  {isCameraActive && (
                    <div className="absolute inset-0 border-2 border-emerald-500/60 m-8 rounded-xl pointer-events-none animate-pulse flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-emerald-400 opacity-60" />
                    </div>
                  )}
                </div>

                {!isCameraActive && (
                  <button
                    onClick={startCamera}
                    className="w-full py-3 rounded-xl bg-[#006a4e] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>ক্যামেরা পুনরায় সক্রিয় করুন</span>
                  </button>
                )}
              </div>
            )}

            {scanError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{scanError}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
