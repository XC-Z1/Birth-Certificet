import React, { useState } from 'react';
import { BirthRegistrationRecord } from '../types';
import {
  Copy,
  Check,
  Printer,
  Share2,
  Bookmark,
  FileText,
  User,
  Users,
  MapPin,
  Calendar,
  Building2,
  Clock,
  Sparkles,
  QrCode,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ResultCardViewProps {
  record: BirthRegistrationRecord;
  onCopyAll: () => void;
  onPrint: () => void;
  onShare: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSwitchToCertificate: () => void;
}

export const ResultCardView: React.FC<ResultCardViewProps> = ({
  record,
  onCopyAll,
  onPrint,
  onShare,
  isFavorite,
  onToggleFavorite,
  onSwitchToCertificate
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const copyField = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const verificationHash = `BRN:${record.brn}|DOB:${record.dateOfBirth}|GOV.BD.VERIFIED`;

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-4 space-y-6">
      
      {/* Action Bar Header with Geometric Balance Gradient Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 shadow-xl overflow-hidden">
        
        {/* Top Pattern Bar */}
        <div className="h-2 bg-gradient-to-r from-[#006a4e] via-[#d4af37] to-[#006a4e] w-full"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#006a4e] text-white shadow-sm border border-[#d4af37]">
              <ShieldCheck className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-[#006a4e] dark:text-emerald-300 text-xs font-bold font-bengali border border-emerald-200 dark:border-emerald-800">
                  সক্রিয় সরকারি সংযোগ
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">BRN: {record.brn}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-bengali text-[#006a4e] dark:text-emerald-100 mt-0.5">
                {record.nameBangla} ({record.nameEnglish})
              </h3>
            </div>
          </div>

          {/* Primary Control Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            
            <button
              onClick={onSwitchToCertificate}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006a4e] hover:bg-emerald-800 text-white shadow-sm transition-all flex items-center gap-1.5 font-bengali border-b-2 border-[#d4af37]"
              title="অফিসিয়াল সনদ ভিউ দেখুন"
            >
              <Eye className="w-4 h-4 text-[#d4af37]" />
              <span>সনদ ভিউ</span>
            </button>

            <button
              onClick={onToggleFavorite}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-amber-100 text-amber-900 border-[#d4af37] dark:bg-amber-950/80 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title={isFavorite ? 'সংরক্ষিত তালিকা থেকে সরান' : 'পছন্দের তালিকায় সংরক্ষণ করুন'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-[#d4af37] text-[#d4af37]' : ''}`} />
            </button>

            <button
              onClick={onCopyAll}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 font-bengali"
              title="সকল তথ্য কপি করুন"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">কপি অল</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 font-bengali"
              title="প্রিন্ট করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">প্রিন্ট</span>
            </button>

            <button
              onClick={onShare}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 font-bengali"
              title="শেয়ার করুন"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-[#006a4e] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-all flex items-center gap-1.5"
              title="QR কোড দেখুন"
            >
              <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline font-bengali">QR কোড</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Grid Card Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Section 1: Personal Information */}
        <div className="md:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-600/20 p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600"></div>
          
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-base font-bold font-bengali text-slate-800 dark:text-slate-100">
              ব্যক্তিগত তথ্য (Personal Details)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <FieldBox
              label="বাংলা নাম"
              value={record.nameBangla}
              onCopy={() => copyField('nameBangla', record.nameBangla)}
              isCopied={copiedField === 'nameBangla'}
              highlight
            />

            <FieldBox
              label="English Name"
              value={record.nameEnglish}
              onCopy={() => copyField('nameEnglish', record.nameEnglish)}
              isCopied={copiedField === 'nameEnglish'}
              isEnglish
            />

            <FieldBox
              label="জন্ম নিবন্ধন নম্বর (BRN)"
              value={record.brn}
              onCopy={() => copyField('brn', record.brn)}
              isCopied={copiedField === 'brn'}
              isMono
              gold
            />

            <FieldBox
              label="জন্ম তারিখ (Bangla)"
              value={record.dateOfBirth}
              onCopy={() => copyField('dateOfBirth', record.dateOfBirth)}
              isCopied={copiedField === 'dateOfBirth'}
            />

            <FieldBox
              label="Date of Birth (English)"
              value={record.dateOfBirthEn || record.dateOfBirth}
              onCopy={() => copyField('dateOfBirthEn', record.dateOfBirthEn || record.dateOfBirth)}
              isCopied={copiedField === 'dateOfBirthEn'}
              isEnglish
            />

            <FieldBox
              label="লিঙ্গ (Gender)"
              value={`${record.gender} / ${record.genderEn}`}
              onCopy={() => copyField('gender', `${record.gender} / ${record.genderEn}`)}
              isCopied={copiedField === 'gender'}
            />

          </div>
        </div>

        {/* Section 2: Parents Information */}
        <div className="md:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-600/20 p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>

          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 className="text-base font-bold font-bengali text-slate-800 dark:text-slate-100">
              পিতা ও মাতার তথ্য (Parents Information)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <FieldBox
              label="পিতার নাম"
              value={record.fatherName}
              onCopy={() => copyField('fatherName', record.fatherName)}
              isCopied={copiedField === 'fatherName'}
            />

            <FieldBox
              label="Father's Name (English)"
              value={record.fatherNameEn}
              onCopy={() => copyField('fatherNameEn', record.fatherNameEn)}
              isCopied={copiedField === 'fatherNameEn'}
              isEnglish
            />

            <FieldBox
              label="পিতার জাতীয়তা"
              value={record.fathersNationality}
              onCopy={() => copyField('fathersNationality', record.fathersNationality)}
              isCopied={copiedField === 'fathersNationality'}
            />

            <FieldBox
              label="Father's Nationality (En)"
              value={record.fathersNationalityEn}
              onCopy={() => copyField('fathersNationalityEn', record.fathersNationalityEn)}
              isCopied={copiedField === 'fathersNationalityEn'}
              isEnglish
            />

            <FieldBox
              label="মাতার নাম"
              value={record.motherName}
              onCopy={() => copyField('motherName', record.motherName)}
              isCopied={copiedField === 'motherName'}
            />

            <FieldBox
              label="Mother's Name (English)"
              value={record.motherNameEn}
              onCopy={() => copyField('motherNameEn', record.motherNameEn)}
              isCopied={copiedField === 'motherNameEn'}
              isEnglish
            />

            <FieldBox
              label="মাতার জাতীয়তা"
              value={record.mothersNationality}
              onCopy={() => copyField('mothersNationality', record.mothersNationality)}
              isCopied={copiedField === 'mothersNationality'}
            />

            <FieldBox
              label="Mother's Nationality (En)"
              value={record.mothersNationalityEn}
              onCopy={() => copyField('mothersNationalityEn', record.mothersNationalityEn)}
              isCopied={copiedField === 'mothersNationalityEn'}
              isEnglish
            />

          </div>
        </div>

        {/* Section 3: Registration & Location Details */}
        <div className="md:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-600/20 p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-800"></div>

          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <Building2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h4 className="text-base font-bold font-bengali text-slate-800 dark:text-slate-100">
              নিবন্ধন কার্যালয় ও স্থানের তথ্য (Registration Details)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <FieldBox
              label="জন্ম স্থান (Birth Place)"
              value={record.birthPlace}
              onCopy={() => copyField('birthPlace', record.birthPlace)}
              isCopied={copiedField === 'birthPlace'}
            />

            <FieldBox
              label="Birth Place (English)"
              value={record.birthPlaceEn}
              onCopy={() => copyField('birthPlaceEn', record.birthPlaceEn)}
              isCopied={copiedField === 'birthPlaceEn'}
              isEnglish
            />

            <FieldBox
              label="নিবন্ধন তারিখ (Register Date)"
              value={record.registerDate}
              onCopy={() => copyField('registerDate', record.registerDate)}
              isCopied={copiedField === 'registerDate'}
            />

            <FieldBox
              label="সনদ ইস্যুর তারিখ (Issuance Date)"
              value={record.issuanceDate}
              onCopy={() => copyField('issuanceDate', record.issuanceDate)}
              isCopied={copiedField === 'issuanceDate'}
            />

            <FieldBox
              label="নিবন্ধক কার্যালয় (Register Office)"
              value={record.registerOfficeEn}
              onCopy={() => copyField('registerOfficeEn', record.registerOfficeEn)}
              isCopied={copiedField === 'registerOfficeEn'}
              isEnglish
            />

            <FieldBox
              label="কার্যালয়ের স্থান (Office Location)"
              value={record.registerOfficeLocationEn}
              onCopy={() => copyField('registerOfficeLocationEn', record.registerOfficeLocationEn)}
              isCopied={copiedField === 'registerOfficeLocationEn'}
              isEnglish
            />

          </div>
        </div>

      </div>

      {/* QR Code Modal Popup */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-emerald-500/30 shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-bold font-bengali text-slate-800 dark:text-slate-100">
              ডিজিটাল ভেরিফিকেশন QR কোড
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
              প্রমাণীকরণের জন্য QR কোডটি স্ক্যান করুন
            </p>

            <div className="p-4 bg-white rounded-xl inline-block border border-slate-200 shadow-inner">
              <QRCodeSVG value={verificationHash} size={180} level="H" />
            </div>

            <p className="text-[11px] font-mono text-slate-400">
              BRN: {record.brn}
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm font-bengali"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

interface FieldBoxProps {
  label: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
  isEnglish?: boolean;
  isMono?: boolean;
  highlight?: boolean;
  gold?: boolean;
}

const FieldBox: React.FC<FieldBoxProps> = ({
  label,
  value,
  onCopy,
  isCopied,
  isEnglish = false,
  isMono = false,
  highlight = false,
  gold = false
}) => {
  return (
    <div
      onClick={onCopy}
      className={`group relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        gold
          ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 hover:border-amber-500'
          : highlight
          ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 hover:border-emerald-500'
          : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-emerald-400'
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-bengali">
          {label}
        </span>
        
        <button
          type="button"
          className="p-1 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity"
          title="কপি করুন"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div
        className={`text-sm font-semibold truncate ${
          isEnglish ? 'font-english' : 'font-bengali'
        } ${isMono ? 'font-mono tracking-wider' : ''} ${
          gold
            ? 'text-amber-900 dark:text-amber-300'
            : highlight
            ? 'text-emerald-950 dark:text-emerald-200'
            : 'text-slate-800 dark:text-slate-100'
        }`}
      >
        {value || 'N/A'}
      </div>

      {isCopied && (
        <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bengali shadow-sm animate-bounce">
          কপি হয়েছে!
        </span>
      )}
    </div>
  );
};
