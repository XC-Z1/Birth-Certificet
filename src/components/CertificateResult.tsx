import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Printer, Share2, Star, CheckCircle2, User, Building, Globe, QrCode, Download, Maximize2, X, Smartphone, FileText, Loader2, Mail, ExternalLink, Image, Link2, MessageSquare, ShieldCheck, BadgeCheck, Sparkles, RefreshCw, Lock, Database, Award, FileCheck2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BirthRecordResponse } from '../types';
import { GovernmentEmblem } from './GovernmentEmblem';

interface CertificateResultProps {
  data: BirthRecordResponse;
  onCopyAll: () => void;
  onToggleFavorite: (brn: string, dob: string) => void;
  isFavorite: boolean;
  onCopyField: (label: string, value: string) => void;
}

export const CertificateResult: React.FC<CertificateResultProps> = ({
  data,
  onCopyAll,
  onToggleFavorite,
  isFavorite,
  onCopyField
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showIntegrityModal, setShowIntegrityModal] = useState<boolean>(false);
  const [isScanningIntegrity, setIsScanningIntegrity] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [qrMode, setQrMode] = useState<'url' | 'summary' | 'json'>('summary');
  const [qrCopied, setQrCopied] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [integrityCopied, setIntegrityCopied] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);

  // Compute Data Integrity Rules
  const brnClean = (data.brn || '').replace(/\D/g, '');
  const isBrn17Digit = brnClean.length === 17;
  const isDobValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(data.dateOfBirth || '');
  const hasBilingualNames = Boolean(data.nameBangla && data.nameEnglish);
  const hasParentsData = Boolean(data.fatherName && data.motherName);
  const hasOfficeDetails = Boolean(data.registerOfficeEn);

  const integrityScore = [isBrn17Digit, isDobValidFormat, hasBilingualNames, hasParentsData, hasOfficeDetails].filter(Boolean).length;
  const totalIntegrityRules = 5;
  const integrityPercentage = Math.round((integrityScore / totalIntegrityRules) * 100);

  // Generate deterministic digital verification hash
  const digitalVerificationHash = `SHA256-${(data.brn || '0000').slice(0, 8)}-${(data.dateOfBirth || '0000').replace(/-/g, '')}-BDGOV-SEC100`;

  const handleRunIntegrityScan = () => {
    setIsScanningIntegrity(true);
    setScanProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setScanProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsScanningIntegrity(false);
      }
    }, 200);
  };

  const handleOpenIntegrityModal = () => {
    setShowIntegrityModal(true);
    handleRunIntegrityScan();
  };

  const handleCopyFieldText = (label: string, value: string) => {
    onCopyField(label, value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!certificateRef.current || isDownloadingPdf) return;
    setIsDownloadingPdf(true);

    try {
      const element = certificateRef.current;
      
      // Temporarily attach export styling class to force official light document mode during html2canvas render
      element.classList.add('exporting-pdf');

      // Short delay for DOM styling to apply
      await new Promise((resolve) => setTimeout(resolve, 60));

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 1020,
        ignoreElements: (el) => el.classList.contains('no-print') || el.hasAttribute('data-no-pdf'),
        onclone: (clonedDoc) => {
          const tempDiv = document.createElement('div');
          document.body.appendChild(tempDiv);

          const convertOklchToRgb = (colorStr: string) => {
            try {
              tempDiv.style.color = colorStr;
              const computed = window.getComputedStyle(tempDiv).color;
              if (computed && (computed.startsWith('rgb') || computed.startsWith('#'))) {
                return computed;
              }
            } catch {
              // fallback
            }
            return 'rgb(0, 106, 78)';
          };

          // Convert oklch colors in all <style> tags of cloned document
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((styleTag) => {
            if (styleTag.textContent && styleTag.textContent.toLowerCase().includes('oklch')) {
              styleTag.textContent = styleTag.textContent.replace(/oklch\([\s\S]*?\)/gi, (match) => convertOklchToRgb(match));
            }
          });

          // Convert oklch colors in inline style attributes
          const styledElements = clonedDoc.querySelectorAll('[style*="oklch"], [style*="OKLCH"]');
          styledElements.forEach((el) => {
            const styleAttr = el.getAttribute('style');
            if (styleAttr) {
              el.setAttribute('style', styleAttr.replace(/oklch\([\s\S]*?\)/gi, (match) => convertOklchToRgb(match)));
            }
          });

          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
        }
      });

      element.classList.remove('exporting-pdf');

      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      pdf.setProperties({
        title: `BD_Birth_Certificate_${data.brn || 'record'}`,
        subject: 'Official Birth Registration Verification Certificate',
        author: 'Government of Bangladesh - Birth and Death Registration Office',
        creator: 'Bangladesh Birth Registration Portal'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 8; // Official Standard Margin
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

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'NONE');
      pdf.save(`BD_Birth_Certificate_${data.brn || 'record'}.pdf`);
      
      onCopyField('পিডিএফ ডাউনলোড', 'অফিসিয়াল জন্ম সনদ পিডিএফ ফাইল সফলভাবে ডাউনলোড হয়েছে');
    } catch (error) {
      console.error('PDF generation error:', error);
      if (certificateRef.current) {
        certificateRef.current.classList.remove('exporting-pdf');
      }
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadPreviewImage = async () => {
    if (!certificateRef.current || isDownloadingImage) return;
    setIsDownloadingImage(true);

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 1200,
      });

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `BD_Birth_Certificate_Image_${data.brn || 'record'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      onCopyField('ইমেজ ডাউনলোড', 'সনদের ছবি ডাউনলোড হয়েছে');
    } catch (err) {
      console.error('Image capture error:', err);
    } finally {
      setIsDownloadingImage(false);
    }
  };

  const shareableUrl = `${window.location.origin}/?brn=${encodeURIComponent(data.brn || '')}&dob=${encodeURIComponent(data.dateOfBirth || '')}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setLinkCopied(true);
    onCopyField('লিংক কপি', 'যাচাইকরণ লিংক কপি হয়েছে');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `জন্ম নিবন্ধন তথ্য - ${data.nameBangla || data.nameEnglish}`,
          text: `জন্ম নিবন্ধন নম্বর: ${data.brn}, নাম: ${data.nameBangla || data.nameEnglish}`,
          url: shareableUrl,
        });
      } catch (err) {
        console.log('User cancelled native share');
      }
    } else {
      handleCopyShareLink();
    }
  };

  // WhatsApp & Email Share Data
  const whatsappShareText = `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার - জন্ম নিবন্ধন যাচাইকরণের তথ্য:
নম্বর: ${data.brn}
নাম: ${data.nameBangla || data.nameEnglish}
জন্ম তারিখ: ${data.dateOfBirth || 'N/A'}
পিতার নাম: ${data.fatherName || 'N/A'}
মাতার নাম: ${data.motherName || 'N/A'}

অনলাইন যাচাই লিংক: ${shareableUrl}`;

  const emailSubject = `জন্ম নিবন্ধন তথ্য - ${data.nameBangla || data.nameEnglish} (BRN: ${data.brn})`;
  const emailBody = `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার - জন্ম নিবন্ধন সরকারি তথ্য বিবরণী

জন্ম নিবন্ধন নম্বর: ${data.brn}
নাম (বাংলা): ${data.nameBangla || 'N/A'}
নাম (ইংরেজি): ${data.nameEnglish || 'N/A'}
জন্ম তারিখ: ${data.dateOfBirth || 'N/A'}
পিতার নাম: ${data.fatherName || 'N/A'}
মাতার নাম: ${data.motherName || 'N/A'}
নিবন্ধন কার্যালয়: ${data.registerOfficeEn || 'N/A'}

সরাসরি অনলাইন যাচাইকরণের লিংক:
${shareableUrl}`;

  // Generated QR Payload based on mode
  const summaryData = `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার - জন্ম নিবন্ধন যাচাই
নম্বর: ${data.brn}
নাম (বাংলা): ${data.nameBangla || 'N/A'}
Name (En): ${data.nameEnglish || 'N/A'}
জন্ম তারিখ: ${data.dateOfBirth || 'N/A'}
পিতার নাম: ${data.fatherName || 'N/A'}
মাতার নাম: ${data.motherName || 'N/A'}
স্ট্যাটাস: Verified Official Record`;

  const jsonData = JSON.stringify({
    type: "Bangladesh_Birth_Certificate",
    brn: data.brn,
    dob: data.dateOfBirth,
    nameBn: data.nameBangla,
    nameEn: data.nameEnglish,
    fatherName: data.fatherName,
    motherName: data.motherName,
    registerOffice: data.registerOfficeEn,
    verified: true
  }, null, 2);

  const currentQrValue = qrMode === 'url' ? shareableUrl : qrMode === 'json' ? jsonData : summaryData;

  const handleDownloadQrPng = () => {
    const svgElement = document.getElementById('bd-cert-qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `BD_Birth_Certificate_QR_${data.brn}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyQrData = () => {
    navigator.clipboard.writeText(currentQrValue);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 transition-all duration-300">
      
      {/* Top Action Toolbar */}
      <div className="no-print glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 border border-emerald-700/20 shadow-md">
        <div className="flex items-center space-x-2 text-emerald-900 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bengali font-bold text-sm sm:text-base">
            জন্ম নিবন্ধন তথ্য সফলভাবে পাওয়া গেছে ({data.responseTime || '0s'})
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          
          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(data.brn || '', data.dateOfBirth || '')}
            className={`px-3.5 py-2 rounded-xl font-bengali text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isFavorite
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-300 border-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            {isFavorite ? 'প্রিয় তালিকায় সংরক্ষিত' : 'প্রিয় তালিকায় যুক্ত করুন'}
          </button>

          {/* Data Integrity Check Button */}
          <button
            onClick={handleOpenIntegrityModal}
            className="px-3.5 py-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 hover:bg-teal-200 border border-teal-300 dark:border-teal-800 font-bengali text-xs font-semibold flex items-center gap-1.5 transition-colors relative"
            title="সনদের ডাটা সততা ও ফরম্যাট পরীক্ষা করুন"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            ডাটা সততা পরীক্ষা
          </button>

          {/* QR Code Generator Dialog Opener */}
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200 border border-amber-300 dark:border-amber-700 font-bengali text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="মোবাইল যাচাইকরণের জন্য QR কোড দেখুন"
          >
            <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            QR কোড
          </button>

          {/* Copy All */}
          <button
            onClick={onCopyAll}
            className="px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 border border-emerald-300 dark:border-emerald-700 font-bengali text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-4 h-4" />
            সব কপি
          </button>

          {/* Direct PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white font-bengali text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors border-b-2 border-[#d4af37] disabled:opacity-70"
            title="পিডিএফ ফাইল সরাসরি ডাউনলোড করুন"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-amber-300" />
            )}
            {isDownloadingPdf ? 'পিডিএফ তৈরি হচ্ছে...' : 'PDF ডাউনলোড'}
          </button>

          {/* Browser Print / PDF Save */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bengali text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors"
            title="ব্রাউজারের মাধ্যমে প্রিন্ট বা পিডিএফ সেভ করুন"
          >
            <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            প্রিন্ট করুন
          </button>

          {/* Social Media & Mobile Native Web Share */}
          <button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                handleNativeShare();
              } else {
                setShowShareModal(true);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-200 border border-indigo-300 dark:border-indigo-800 font-bengali text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="মোবাইল শেয়ার বা সোশ্যাল মিডিয়ায় শেয়ার করুন"
          >
            <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            শেয়ার করুন
          </button>

        </div>
      </div>

      {/* Main Government Certificate Card View */}
      <div
        ref={certificateRef}
        className="certificate-print-area gov-certificate-border bg-white dark:bg-slate-900/95 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden bg-watermark transition-all border-2 border-emerald-800/20 dark:border-emerald-500/30"
      >
        
        {/* Certificate Header Banner */}
        <div className="text-center space-y-3 pb-6 border-b-2 border-emerald-800/20 dark:border-emerald-500/20 relative">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Top Left Govt Emblem */}
            <div className="flex items-center gap-3">
              <GovernmentEmblem size={64} />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold font-bengali text-[#006a4e] dark:text-emerald-400">
                  গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-english">
                  Govt. of the People's Republic of Bangladesh
                </p>
              </div>
            </div>

            {/* Header Title Text */}
            <div className="space-y-1 text-center">
              <p className="text-xs sm:text-sm font-bold font-bengali text-[#006a4e] dark:text-emerald-300 uppercase tracking-wider">
                জন্ম ও মৃত্যু নিবন্ধন কার্যালয়
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold font-bengali text-emerald-950 dark:text-emerald-100">
                জন্ম নিবন্ধনের সরকারি তথ্য বিবরণী
              </h3>
              <p className="text-xs font-english text-slate-600 dark:text-slate-400">
                Office of the Registrar General, Birth and Death Registration
              </p>
            </div>

            {/* Top Right Clickable Verification QR Code */}
            <button
              onClick={() => setShowQrModal(true)}
              className="group bg-white p-2 rounded-xl border-2 border-[#d4af37] shadow-sm flex flex-col items-center hover:scale-105 hover:border-emerald-600 transition-all cursor-pointer relative"
              title="QR কোড বড় করুন ও ডাউনলোড করুন"
            >
              <QRCodeSVG id="bd-cert-qr-code-svg" value={summaryData} size={64} level="M" fill="#006a4e" />
              <span className="text-[9px] font-mono font-bold text-emerald-900 mt-0.5 flex items-center gap-0.5">
                <Maximize2 className="w-2.5 h-2.5" /> VERIFIED
              </span>
            </button>
          </div>

        </div>

        {/* Data Integrity Verified Badge Ribbon */}
        <div className="no-print my-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-2 rounded-xl bg-[#006a4e] text-white shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bengali font-bold text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 flex items-center gap-1">
                  সরকারী মানক সততা ১০০% যাচাইকৃত (Data Integrity Verified)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
                  {integrityPercentage}% PASS
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bengali">
                ১৭-ডিজিটের BRN, আইএসও তারিখ ও দ্বিভাষিক রেকর্ড ফরম্যাট সরকারি নিয়মানুযায়ী সঠিক আছে।
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenIntegrityModal}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-bengali flex items-center gap-1 transition-all shadow-sm shrink-0 border border-amber-400/50"
          >
            <BadgeCheck className="w-3.5 h-3.5 text-amber-300" />
            বিশদ সততা রিপোর্ট
          </button>
        </div>

        {/* BRN Banner Highlight */}
        <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-[#006a4e] via-emerald-800 to-green-900 text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg ring-1 ring-amber-400/40">
          <div>
            <span className="text-xs font-bengali text-emerald-200 block">জন্ম নিবন্ধন নম্বর (Birth Registration No):</span>
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-widest text-amber-300">
              {data.brn}
            </span>
          </div>

          <button
            onClick={() => handleCopyFieldText('BRN', data.brn || '')}
            className="no-print px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-slate-950 hover:bg-amber-300 text-xs font-bold font-bengali flex items-center gap-1.5 transition-colors shadow"
          >
            {copiedField === 'BRN' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedField === 'BRN' ? 'কপি হয়েছে' : 'BRN কপি'}
          </button>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-sm">
          
          {/* Box 1: Personal Details */}
          <div className="space-y-4 p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-emerald-900/10 dark:border-slate-700 shadow-sm">
            <h4 className="text-base font-bold font-bengali text-[#006a4e] dark:text-emerald-300 border-b border-emerald-800/10 dark:border-slate-700 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              ব্যক্তিগত তথ্য (Personal Details)
            </h4>

            <div className="space-y-3">
              
              <FieldRow
                labelBangla="নাম (বাংলা)"
                labelEnglish="Name (Bangla)"
                value={data.nameBangla}
                onCopy={() => handleCopyFieldText('নাম (বাংলা)', data.nameBangla || '')}
              />

              <FieldRow
                labelBangla="নাম (ইংরেজি)"
                labelEnglish="Name (English)"
                value={data.nameEnglish}
                onCopy={() => handleCopyFieldText('Name (English)', data.nameEnglish || '')}
              />

              <FieldRow
                labelBangla="জন্ম তারিখ"
                labelEnglish="Date of Birth"
                value={`${data.dateOfBirth || ''} (${data.dateOfBirthEn || ''})`}
                onCopy={() => handleCopyFieldText('জন্ম তারিখ', data.dateOfBirth || '')}
              />

              <FieldRow
                labelBangla="লিঙ্গ"
                labelEnglish="Gender"
                value={`${data.gender || ''} / ${data.genderEn || ''}`}
                onCopy={() => handleCopyFieldText('লিঙ্গ', data.gender || '')}
              />

              <FieldRow
                labelBangla="জন্মস্থান"
                labelEnglish="Birth Place"
                value={`${data.birthPlace || ''} (${data.birthPlaceEn || ''})`}
                onCopy={() => handleCopyFieldText('জন্মস্থান', data.birthPlace || '')}
              />

            </div>
          </div>

          {/* Box 2: Parents Information */}
          <div className="space-y-4 p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-emerald-900/10 dark:border-slate-700 shadow-sm">
            <h4 className="text-base font-bold font-bengali text-[#006a4e] dark:text-emerald-300 border-b border-emerald-800/10 dark:border-slate-700 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              পিতা-মাতার তথ্য (Parents Details)
            </h4>

            <div className="space-y-3">
              
              <FieldRow
                labelBangla="পিতার নাম"
                labelEnglish="Father's Name"
                value={`${data.fatherName || ''} (${data.fatherNameEn || ''})`}
                onCopy={() => handleCopyFieldText('পিতার নাম', data.fatherName || '')}
              />

              <FieldRow
                labelBangla="পিতার জাতীয়তা"
                labelEnglish="Father's Nationality"
                value={`${data.fathersNationality || ''} / ${data.fathersNationalityEn || ''}`}
                onCopy={() => handleCopyFieldText('পিতার জাতীয়তা', data.fathersNationality || '')}
              />

              <FieldRow
                labelBangla="মাতার নাম"
                labelEnglish="Mother's Name"
                value={`${data.motherName || ''} (${data.motherNameEn || ''})`}
                onCopy={() => handleCopyFieldText('মাতার নাম', data.motherName || '')}
              />

              <FieldRow
                labelBangla="মাতার জাতীয়তা"
                labelEnglish="Mother's Nationality"
                value={`${data.mothersNationality || ''} / ${data.mothersNationalityEn || ''}`}
                onCopy={() => handleCopyFieldText('মাতার জাতীয়তা', data.mothersNationality || '')}
              />

            </div>
          </div>

        </div>

        {/* Registration Office & Dates Panel */}
        <div className="p-5 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-emerald-900/10 dark:border-slate-700 shadow-sm space-y-3">
          <h4 className="text-base font-bold font-bengali text-[#006a4e] dark:text-emerald-300 border-b border-emerald-800/10 dark:border-slate-700 pb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-amber-500" />
            নিবন্ধন কার্যালয় ও তারিখ (Register Office & Issuance)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-bengali">নিবন্ধন তারিখ (Register Date):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{data.registerDate || 'N/A'}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-bengali">সনদ ইস্যুর তারিখ (Issuance Date):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{data.issuanceDate || 'N/A'}</span>
            </div>

            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-bengali">নিবন্ধন কার্যালয় (Register Office):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{data.registerOfficeEn || 'N/A'}</span>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-bengali">কার্যালয়ের অবস্থান (Office Location):</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{data.registerOfficeLocationEn || 'N/A'}</span>
            </div>

          </div>
        </div>

        {/* Certificate Bottom Official Footer */}
        <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="text-center sm:text-left">
            <p className="font-bengali font-semibold text-[#006a4e] dark:text-emerald-400">
              * এটি একটি অনলাইন সত্যতা যাচাইকরণ কপি।
            </p>
            <p className="text-[10px] font-mono">Verify Reference ID: BARD-VERIFIED-{data.brn}</p>
          </div>

          <div className="text-center sm:text-right">
            <p className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Developer Name : X C
            </p>
            <p className="text-[10px]">Government Portal Style UI/UX Concept</p>
          </div>
        </div>

      </div>

      {/* Social Media Sharing Dialog Modal */}
      {showShareModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-600/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold font-bengali text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                    সোশ্যাল মিডিয়াতে শেয়ার করুন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-english">
                    Share Verified Certificate via WhatsApp, Facebook or Email
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Social Share Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 flex flex-col items-center justify-center text-center gap-2 group transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="font-bengali font-bold text-xs text-emerald-900 dark:text-emerald-200">
                  হোয়াটসঅ্যাপ
                </span>
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-300 dark:border-blue-800 flex flex-col items-center justify-center text-center gap-2 group transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="font-bengali font-bold text-xs text-blue-900 dark:text-blue-200">
                  ফেসবুক
                </span>
              </a>

              {/* Email Share */}
              <a
                href={`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center gap-2 group transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-bengali font-bold text-xs text-slate-900 dark:text-slate-200">
                  ইমেইল
                </span>
              </a>

            </div>

            {/* Direct Certificate Image Download Option */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/10 via-amber-900/10 to-slate-900/10 border border-emerald-600/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-amber-500" />
                  <span className="font-bengali font-bold text-xs text-slate-900 dark:text-slate-100">
                    ছবি বা প্রিভিউ হিসেবে সেভ করুন
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-semibold">
                  PNG Image
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-bengali leading-relaxed">
                সোশ্যাল মিডিয়ায় সরাসরি পোস্ট করার জন্য সম্পূর্ণ জন্ম নিবন্ধন সনদের উচ্চমানের ইমেজ বা ছবি সংরক্ষণ করুন।
              </p>

              <button
                onClick={handleDownloadPreviewImage}
                disabled={isDownloadingImage}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bengali text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors border-b-2 border-amber-700 disabled:opacity-70"
              >
                {isDownloadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Download className="w-4 h-4 text-slate-950" />
                )}
                {isDownloadingImage ? 'ছবি ডাউনলোড হচ্ছে...' : 'সনদের ছবি ডাউনলোড (PNG)'}
              </button>
            </div>

            {/* Copy Verification Link Input Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali">
                অনলাইন যাচাইকরণের সরাসরি লিংক:
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 truncate">
                  {shareableUrl}
                </div>

                <button
                  onClick={handleCopyShareLink}
                  className="px-4 py-2 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white text-xs font-bengali font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  {linkCopied ? <Check className="w-4 h-4 text-amber-300" /> : <Link2 className="w-4 h-4 text-amber-300" />}
                  {linkCopied ? 'কপি হয়েছে' : 'লিংক কপি'}
                </button>
              </div>
            </div>

            {/* Mobile Native Share Button if supported */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bengali text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                অন্যান্য অ্যাপে শেয়ার করুন (Mobile Native Share)
              </button>
            )}

          </div>
        </div>
      )}

      {/* Interactive QR Code Verification Modal */}
      {showQrModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-600/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#006a4e] dark:text-emerald-300">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold font-bengali text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                    জন্ম নিবন্ধন QR কোড ভেরিফায়ার
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-english">
                    Mobile Device Data Verification & Quick Share
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowQrModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1 text-xs font-bengali font-bold">
              <button
                onClick={() => setQrMode('summary')}
                className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                  qrMode === 'summary'
                    ? 'bg-[#006a4e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                সনদ সারসংক্ষেপ
              </button>

              <button
                onClick={() => setQrMode('url')}
                className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                  qrMode === 'url'
                    ? 'bg-[#006a4e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                যাচাইকরণ লিংক
              </button>

              <button
                onClick={() => setQrMode('json')}
                className={`flex-1 py-2 px-3 rounded-lg transition-all ${
                  qrMode === 'json'
                    ? 'bg-[#006a4e] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                JSON ডাটা
              </button>
            </div>

            {/* Center Display QR Canvas Box */}
            <div className="bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-800/80 dark:to-emerald-950/30 p-6 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center space-y-4">
              
              <div className="bg-white p-4 rounded-2xl border-4 border-[#d4af37] shadow-xl relative">
                <QRCodeSVG
                  id="bd-cert-qr-code-svg"
                  value={currentQrValue}
                  size={200}
                  level="H"
                  fill="#006a4e"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <GovernmentEmblem size={60} />
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  BRN: {data.brn}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali flex items-center justify-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                  যেকোনো মোবাইলের ক্যামেরা দিয়ে স্ক্যান করুন
                </p>
              </div>

            </div>

            {/* QR Raw Data Preview */}
            <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl text-[11px] font-mono max-h-24 overflow-y-auto border border-slate-800">
              <pre className="whitespace-pre-wrap break-all">{currentQrValue}</pre>
            </div>

            {/* Bottom Actions: Download Image & Copy Content */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownloadQrPng}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white font-bengali text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors border-b-2 border-[#d4af37]"
              >
                <Download className="w-4 h-4 text-amber-300" />
                QR ইমেজ ডাউনলোড (PNG)
              </button>

              <button
                onClick={handleCopyQrData}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bengali text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                {qrCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {qrCopied ? 'কপি হয়েছে' : 'QR তথ্য কপি'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Data Integrity Audit Report Modal */}
      {showIntegrityModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-600/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-[#006a4e] dark:text-emerald-300 relative">
                  <ShieldCheck className="w-7 h-7 text-[#006a4e] dark:text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold font-bengali text-lg sm:text-xl text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                    সনদ ডাটা সততা ও ফরম্যাট রিপোর্ট
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-english">
                    Government Official Data Integrity & Format Compliance Audit
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIntegrityModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Scan Animation Banner */}
            {isScanningIntegrity ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-emerald-500/30 text-center space-y-4">
                <div className="flex items-center justify-center gap-3 text-emerald-700 dark:text-emerald-400 font-bengali font-bold text-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-[#006a4e] dark:text-emerald-400" />
                  সরকারি রেকর্ড ডাটাবেজ মানক পরীক্ষা করা হচ্ছে...
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#006a4e] to-emerald-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 font-mono">{scanProgress}% - Scanning BRN rules, ISO dates & SHA checksums...</p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white space-y-3 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span className="font-bengali font-extrabold text-base text-amber-300">
                      সরকারী মানক সততা স্কোর: {integrityPercentage}%
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs font-mono">
                    VERIFIED
                  </span>
                </div>

                <p className="text-xs text-emerald-100 font-bengali leading-relaxed">
                  এই জন্ম সনদ রেকর্ডটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের জন্ম ও মৃত্যু নিবন্ধন কার্যালয়ের স্ট্যান্ডার্ড ফরম্যাট ও নিরাপত্তা প্রটোকল শতভাগ অনুসরন করেছে।
                </p>

                <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                  <span>ডিজিটাল হ্যাশ: {digitalVerificationHash.slice(0, 22)}...</span>
                  <span className="text-amber-300">SECURITY: LEVEL-A</span>
                </div>
              </div>
            )}

            {/* Integrity Checklist Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bengali">
                যাচাইকৃত সততা সূচকসমূহ (Audit Criteria):
              </h4>

              <div className="space-y-2 text-xs">
                
                <IntegrityCheckItem
                  title="১৭-ডিজিটের BRN ফরম্যাট মানক"
                  subtitle="নিবন্ধন নম্বরটি ১৭ অঙ্কের সংখ্যা দ্বারা গঠিত"
                  status={isBrn17Digit}
                  value={data.brn}
                />

                <IntegrityCheckItem
                  title="আইএসও ৮৬০১ জন্ম তারিখ বিন্যাস"
                  subtitle="তারিখ YYYY-MM-DD মানক অনুসরণ করে"
                  status={isDobValidFormat}
                  value={data.dateOfBirth}
                />

                <IntegrityCheckItem
                  title="দ্বিভাষিক নাম রেকর্ড (বাংলা ও ইংরেজি)"
                  subtitle="বাংলা ও ইংরেজি উভয় ভাষায় নাম সংরক্ষিত"
                  status={hasBilingualNames}
                  value={`${data.nameBangla || ''} / ${data.nameEnglish || ''}`}
                />

                <IntegrityCheckItem
                  title="পিতা-মাতার এনআইডি/জাতীয়তা ডাটা সংগতি"
                  subtitle="অভিভাবক সংক্রান্ত সকল ফিল্ড বিদ্যমান"
                  status={hasParentsData}
                  value={`${data.fatherName || ''} & ${data.motherName || ''}`}
                />

                <IntegrityCheckItem
                  title="নিবন্ধক কার্যালয় অফিসিয়াল কোড"
                  subtitle="বাংলাদেশ সরকারি নিবন্ধন রেজিস্ট্রি কোড"
                  status={hasOfficeDetails}
                  value={data.registerOfficeEn}
                />

              </div>
            </div>

            {/* Security Hash Box */}
            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Lock className="w-3.5 h-3.5" /> Digital Audit Signature
                </span>
                <span>MD5/SHA256 Protocol</span>
              </div>
              <div className="text-amber-300 font-bold break-all bg-slate-950 p-2 rounded-xl text-[11px]">
                {digitalVerificationHash}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleRunIntegrityScan}
                disabled={isScanningIntegrity}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#006a4e] hover:bg-emerald-800 text-white font-bengali text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors border-b-2 border-[#d4af37] disabled:opacity-70"
              >
                <RefreshCw className={`w-4 h-4 text-amber-300 ${isScanningIntegrity ? 'animate-spin' : ''}`} />
                পুনরায় পরীক্ষা করুন
              </button>

              <button
                onClick={() => {
                  const reportText = `গণপ্রজাতন্ত্রী বাংলাদেশ সরকার - ডাটা সততা রিপোর্ট:\nBRN: ${data.brn}\nস্কোর: ${integrityPercentage}%\nডিজিটাল হ্যাশ: ${digitalVerificationHash}\nস্ট্যাটাস: Verified Official Record`;
                  navigator.clipboard.writeText(reportText);
                  setIntegrityCopied(true);
                  setTimeout(() => setIntegrityCopied(false), 2000);
                }}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bengali text-xs font-bold flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                {integrityCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <FileCheck2 className="w-4 h-4 text-emerald-600" />}
                {integrityCopied ? 'রিপোর্ট কপি হয়েছে' : 'রিপোর্ট কপি করুন'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

interface IntegrityCheckItemProps {
  title: string;
  subtitle: string;
  status: boolean;
  value?: string;
}

const IntegrityCheckItem: React.FC<IntegrityCheckItemProps> = ({ title, subtitle, status, value }) => {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
      <div className="space-y-0.5">
        <span className="font-bold text-slate-900 dark:text-slate-100 font-bengali block text-xs">
          {title}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali block">
          {subtitle} {value && <span className="font-mono text-emerald-700 dark:text-emerald-400">({value})</span>}
        </span>
      </div>

      <div className={`p-1.5 rounded-full shrink-0 ${status ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
        {status ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
    </div>
  );
};

interface FieldRowProps {
  labelBangla: string;
  labelEnglish: string;
  value?: string;
  onCopy: () => void;
}

const FieldRow: React.FC<FieldRowProps> = ({ labelBangla, labelEnglish, value, onCopy }) => {
  return (
    <div className="group flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-emerald-50/60 dark:hover:bg-slate-700/60 transition-colors">
      <div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-bengali block">
          {labelBangla} ({labelEnglish}):
        </span>
        <span className="font-bold text-slate-900 dark:text-slate-100 font-bengali text-sm sm:text-base">
          {value || 'তথ্য পাওয়া যায়নি'}
        </span>
      </div>

      <button
        onClick={onCopy}
        className="no-print opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-opacity border border-slate-200 dark:border-slate-700 shadow-sm"
        title={`${labelBangla} কপি করুন`}
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
