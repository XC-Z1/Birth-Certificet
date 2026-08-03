import React from 'react';
import { BirthRegistrationRecord } from '../types';
import { GovernmentEmblem } from './GovernmentEmblem';
import { Printer, Download, ArrowLeft, Share2, Bookmark, Check, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ResultCertificateViewProps {
  record: BirthRegistrationRecord;
  onBackToCard: () => void;
  onPrint: () => void;
  onShare: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ResultCertificateView: React.FC<ResultCertificateViewProps> = ({
  record,
  onBackToCard,
  onPrint,
  onShare,
  isFavorite,
  onToggleFavorite
}) => {
  const qrHash = `https://bd-birth-reg.gov.bd/verify?brn=${record.brn}`;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 space-y-4">
      
      {/* Certificate Controls Header (No-Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 text-white shadow-md">
        <button
          onClick={onBackToCard}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5 font-bengali"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কার্ড ভিউতে ফিরুন</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg border text-xs transition-all flex items-center gap-1 font-bengali ${
              isFavorite
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isFavorite ? 'সংরক্ষিত' : 'সেভ করুন'}</span>
          </button>

          <button
            onClick={onShare}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all text-xs flex items-center gap-1 font-bengali"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>শেয়ার</span>
          </button>

          <button
            onClick={onPrint}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 font-bengali"
          >
            <Printer className="w-4 h-4" />
            <span>সনদ প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Official Government Certificate Container */}
      <div className="certificate-print-area relative rounded-2xl bg-white text-slate-900 p-6 md:p-10 gov-certificate-border shadow-2xl overflow-hidden font-bengali select-text">
        
        {/* Background Watermark Seal */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <GovernmentEmblem size={420} />
        </div>

        {/* Certificate Header Emblem & Titles */}
        <div className="text-center space-y-2 border-b-2 border-emerald-900/30 pb-6 relative z-10">
          <div className="flex justify-center mb-1">
            <GovernmentEmblem size={70} />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-emerald-900 font-bengali tracking-tight">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
          </h2>
          <p className="text-xs md:text-sm font-semibold text-slate-700 font-bengali">
            জন্ম ও মৃত্যু নিবন্ধকের কার্যালয়
          </p>

          <p className="text-xs font-english text-slate-600">
            Office of the Registrar General, Birth and Death Registration
          </p>

          <p className="text-xs text-emerald-800 font-mono italic">
            [জন্ম ও মৃত্যু নিবন্ধন (ইউনিয়ন পরিষদ) বিধিমালা, ২০০৬ এর বিধি ৯ দ্রষ্টব্য]
          </p>

          <div className="pt-2">
            <span className="inline-block px-6 py-1.5 rounded-md bg-emerald-900 text-amber-300 text-lg md:text-xl font-bold tracking-wide border-2 border-amber-400 shadow-sm">
              জন্ম সনদ / BIRTH CERTIFICATE
            </span>
          </div>
        </div>

        {/* Metadata Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-xs border border-emerald-900/20 p-3.5 bg-emerald-50/40 rounded-lg relative z-10">
          <div>
            <span className="text-slate-500 block">নিবন্ধন তারিখ (Register Date):</span>
            <strong className="font-mono text-sm text-slate-900">{record.registerDate}</strong>
          </div>

          <div className="text-center sm:border-x sm:border-emerald-900/20 px-2">
            <span className="text-slate-500 block">জন্ম নিবন্ধন নম্বর (BRN):</span>
            <strong className="font-mono text-base text-emerald-900 font-bold tracking-widest">
              {record.brn}
            </strong>
          </div>

          <div className="text-right">
            <span className="text-slate-500 block">সনদ ইস্যুর তারিখ (Issuance Date):</span>
            <strong className="font-mono text-sm text-slate-900">{record.issuanceDate}</strong>
          </div>
        </div>

        {/* Certificate Information Main Grid Table */}
        <div className="space-y-4 relative z-10 text-xs md:text-sm border border-emerald-900/30 rounded-lg overflow-hidden">
          
          {/* Row 1: Name */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-900/20 bg-slate-50/60 p-3">
            <div className="font-bold text-emerald-950 md:col-span-1">
              নাম (Name):
            </div>
            <div className="md:col-span-3 space-y-1">
              <div className="text-base font-bold text-slate-900">{record.nameBangla}</div>
              <div className="font-english text-slate-700 font-semibold">{record.nameEnglish}</div>
            </div>
          </div>

          {/* Row 2: DOB & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-900/20 p-3">
            <div className="font-bold text-emerald-950 md:col-span-1">
              জন্ম তারিখ (Date of Birth):
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[11px]">সংখ্যায় (Numeric):</span>
                <strong className="font-mono text-sm text-emerald-900">{record.dateOfBirth}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">কথায় (In Words):</span>
                <span className="font-english font-medium text-slate-800">{record.dateOfBirthEn}</span>
              </div>
            </div>
          </div>

          {/* Row 3: Gender */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-900/20 bg-slate-50/60 p-3">
            <div className="font-bold text-emerald-950 md:col-span-1">
              লিঙ্গ (Gender):
            </div>
            <div className="md:col-span-3 font-semibold text-slate-900">
              {record.gender} / <span className="font-english">{record.genderEn}</span>
            </div>
          </div>

          {/* Row 4: Birth Place */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-900/20 p-3">
            <div className="font-bold text-emerald-950 md:col-span-1">
              জন্ম স্থান (Place of Birth):
            </div>
            <div className="md:col-span-3 space-y-1">
              <div>{record.birthPlace}</div>
              <div className="font-english text-slate-700">{record.birthPlaceEn}</div>
            </div>
          </div>

          {/* Row 5: Father's Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-900/20 bg-slate-50/60 p-3">
            <div className="font-bold text-emerald-950 md:col-span-1">
              পিতার তথ্য (Father's Details):
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[11px]">পিতার নাম:</span>
                <strong>{record.fatherName}</strong>
                <div className="font-english text-slate-700">{record.fatherNameEn}</div>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">পিতার জাতীয়তা:</span>
                <span>{record.fathersNationality}</span>
                <div className="font-english text-slate-700">{record.fathersNationalityEn}</div>
              </div>
            </div>
          </div>

          {/* Row 6: Mother's Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-emerald-900/20 p-3">
            <div className="font-bold text-emerald-950 md:col-span-1">
              মাতার তথ্য (Mother's Details):
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 block text-[11px]">মাতার নাম:</span>
                <strong>{record.motherName}</strong>
                <div className="font-english text-slate-700">{record.motherNameEn}</div>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">মাতার জাতীয়তা:</span>
                <span>{record.mothersNationality}</span>
                <div className="font-english text-slate-700">{record.mothersNationalityEn}</div>
              </div>
            </div>
          </div>

          {/* Row 7: Register Office Location */}
          <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-50/60 p-3">
            <div className="font-bold text-emerald-950 md:col-span-1">
              নিবন্ধক কার্যালয় (Register Office):
            </div>
            <div className="md:col-span-3 font-english text-slate-800">
              <div className="font-semibold">{record.registerOfficeEn}</div>
              <div className="text-xs text-slate-600">{record.registerOfficeLocationEn}</div>
            </div>
          </div>

        </div>

        {/* Certificate Bottom Verification Footer */}
        <div className="mt-8 pt-6 border-t-2 border-emerald-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* QR Code Section */}
          <div className="flex items-center gap-3 text-xs">
            <div className="p-2 bg-white border border-slate-300 rounded-lg shadow-sm">
              <QRCodeSVG value={qrHash} size={72} level="M" />
            </div>
            <div>
              <span className="font-bold text-emerald-900 block">ডিজিটাল অনলাইন যাচাই</span>
              <span className="text-[10px] text-slate-500 font-mono block">REF: {record.brn}</span>
              <span className="text-[10px] text-slate-400">bd-birth-reg.gov.bd</span>
            </div>
          </div>

          {/* Seal / Signature Stamp Mock */}
          <div className="text-center sm:text-right space-y-1">
            <div className="w-32 h-12 mx-auto sm:ml-auto border-b border-slate-400 flex items-end justify-center pb-1">
              <span className="font-serif italic text-emerald-800 text-sm opacity-80">Registrar Seal</span>
            </div>
            <p className="text-xs font-bold text-slate-800">নিবন্ধকের স্বাক্ষর ও সীলা মোহর</p>
            <p className="text-[10px] text-slate-500">Signature and Seal of Registrar</p>
          </div>

        </div>

        {/* Bottom Security Notice Bar */}
        <div className="mt-6 text-center text-[10px] text-slate-500 border-t border-slate-200 pt-3 font-mono">
          এটি একটি কম্পিউটার প্রস্তুতকৃত অনলাইন জন্ম নিবন্ধন বিবরণী। কোনো প্রকার ঘষামাজা গ্রহণযোগ্য নয়।
        </div>

      </div>

    </div>
  );
};
