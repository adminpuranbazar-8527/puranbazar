import React, { useState, useRef } from 'react';
import { 
  Database, Download, Upload, FileSpreadsheet, CheckCircle2, 
  AlertTriangle, RefreshCw, FileText, Image as ImageIcon, ShieldCheck,
  Server, Cloud, Sparkles, Copy, Check, ArrowRight, Eye, Trash2
} from 'lucide-react';
import { 
  Ad, UserProfile, FeaturedPayment, AdReport, GoogleAdSenseConfig, 
  SecuritySettings, StaffMember, PayoutAccount, PayoutPolicySettings 
} from '../types';
import { saveAdToCloud, saveStaffToCloud } from '../services/firebase';
import { Language, formatNumber } from '../utils/i18n';

interface DataBackupVaultSectionProps {
  ads: Ad[];
  registeredUsers?: UserProfile[];
  payments: FeaturedPayment[];
  reports: AdReport[];
  adSenseConfig?: GoogleAdSenseConfig;
  securitySettings?: SecuritySettings;
  staffMembers?: StaffMember[];
  payoutAccounts?: PayoutAccount[];
  payoutPolicy?: PayoutPolicySettings;
  onRestoreBackup?: (data: {
    ads?: Ad[];
    users?: UserProfile[];
    payments?: FeaturedPayment[];
    reports?: AdReport[];
    adSenseConfig?: GoogleAdSenseConfig;
    securitySettings?: SecuritySettings;
    staffMembers?: StaffMember[];
  }) => void;
  onClearSampleAds?: () => void;
  language?: Language;
}

export const DataBackupVaultSection: React.FC<DataBackupVaultSectionProps> = ({
  ads,
  registeredUsers = [],
  payments,
  reports,
  adSenseConfig,
  securitySettings,
  staffMembers = [],
  payoutAccounts = [],
  payoutPolicy,
  onRestoreBackup,
  onClearSampleAds,
  language = 'bn',
}) => {
  const isEn = language === 'en';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [restorePreview, setRestorePreview] = useState<{
    rawJson: any;
    adsCount: number;
    usersCount: number;
    paymentsCount: number;
    reportsCount: number;
    timestamp: string;
    version: string;
  } | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Sync all current advertisements to the centralized Google Cloud Firestore database
  const handleSyncAllAdsToCloud = async () => {
    setIsCloudSyncing(true);
    try {
      for (const ad of ads) {
        await saveAdToCloud(ad);
      }
      if (staffMembers && staffMembers.length > 0) {
        for (const staff of staffMembers) {
          await saveStaffToCloud(staff);
        }
      }
      setDownloadSuccess(
        isEn
          ? 'All ads and staff members successfully synced to Firebase Cloud Firestore! Now visible and functional across all devices.'
          : 'সকল বিজ্ঞাপন এবং কর্মকর্তা সফলভাবে গুগল ক্লাউড ডাটাবেজে সিঙ্ক হয়েছে! এখন মোবাইল, কম্পিউটার বা যেকোনো ডিভাইসে সরাসরি কাজ করবে।'
      );
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err: any) {
      setRestoreError(isEn ? 'Cloud sync failed.' : 'ক্লাউড সিঙ্ক করতে সমস্যা হয়েছে।');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Calculate ad media statistics
  const totalImages = ads.reduce((acc, ad) => acc + (ad.images?.length || 0), 0);
  const approvedAds = ads.filter(a => a.status === 'approved');
  const pendingAds = ads.filter(a => a.status === 'pending');

  // 1. One-Click Full Database Backup (.JSON)
  const handleDownloadFullBackup = () => {
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupData = {
      backupVersion: '2.0.0',
      appName: 'Puranbazar Classifieds',
      exportedAt: new Date().toISOString(),
      exportedAtFormatted: new Date().toLocaleString(isEn ? 'en-US' : 'bn-BD'),
      statistics: {
        totalAds: ads.length,
        approvedAds: approvedAds.length,
        pendingAds: pendingAds.length,
        totalUsers: registeredUsers.length,
        totalPayments: payments.length,
        totalReports: reports.length,
        totalImages,
      },
      data: {
        ads,
        registeredUsers,
        payments,
        reports,
        adSenseConfig,
        securitySettings,
        payoutAccounts,
        payoutPolicy,
        // sanitize staff passwords for safety
        staffMembers: staffMembers.map(s => ({
          ...s,
          password: s.password ? '***PROTECTED***' : undefined,
        })),
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `puranbazar_database_backup_${timestampStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(isEn ? 'Full database backup downloaded successfully!' : 'সম্পূর্ণ ডাটাবেজ ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // 2. Export Ads to Excel / CSV (.CSV with UTF-8 BOM)
  const handleDownloadAdsCsv = () => {
    const headers = [
      'Ad ID',
      'Title (বিজ্ঞাপনের শিরোনাম)',
      'Category (ক্যাটাগরি)',
      'Subcategory (উপ-ক্যাটাগরি)',
      'Price BDT (মূল্য ৳)',
      'Negotiable (আলোচনা সাপেক্ষ)',
      'Condition (পণ্যের অবস্থা)',
      'Division (বিভাগ)',
      'District (জেলা)',
      'Upazila (উপজেলা)',
      'Seller Name (বিক্রেতার নাম)',
      'Seller Phone (মোবাইল নম্বর)',
      'Seller Email (ইমেইল)',
      'Status (স্ট্যাটাস)',
      'Featured Tier (বুস্টিং স্তর)',
      'Views (ভিউ সংখ্যা)',
      'Created Date (পোস্টের তারিখ)',
      'Primary Image URL (ছবির লিংক)'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = ads.map(ad => [
      escapeCsv(ad.id),
      escapeCsv(ad.title),
      escapeCsv(ad.category_id),
      escapeCsv(ad.subcategory),
      escapeCsv(ad.price),
      escapeCsv(ad.negotiable ? (isEn ? 'Yes' : 'হ্যাঁ') : (isEn ? 'Fixed' : 'স্থির')),
      escapeCsv(ad.condition),
      escapeCsv(ad.division),
      escapeCsv(ad.district),
      escapeCsv(ad.upazila || ''),
      escapeCsv(ad.seller_name),
      escapeCsv(ad.seller_phone),
      escapeCsv(ad.seller_email || ''),
      escapeCsv(ad.status === 'approved' ? (isEn ? 'Approved' : 'অনুমোদিত') : (isEn ? 'Pending' : 'পেন্ডিং')),
      escapeCsv(ad.featured_tier || 'none'),
      escapeCsv(ad.views || 0),
      escapeCsv(ad.created_at),
      escapeCsv(ad.images?.[0] || '')
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Excel renders Bangla characters correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `puranbazar_ads_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(isEn ? 'Ads exported to Excel/CSV successfully!' : 'সকল বিজ্ঞাপন এক্সেল/সিএসভি শিটে সফলভাবে ডাউনলোড হয়েছে!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // 3. Handle File Upload for Restore
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreError(null);
    setRestorePreview(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Support both direct object format or wrapped backup format
        const adsArr = parsed.data?.ads || (Array.isArray(parsed.ads) ? parsed.ads : null);
        const usersArr = parsed.data?.registeredUsers || parsed.registeredUsers || [];
        const paymentsArr = parsed.data?.payments || parsed.payments || [];
        const reportsArr = parsed.data?.reports || parsed.reports || [];

        if (!adsArr || !Array.isArray(adsArr)) {
          throw new Error(isEn ? 'Invalid backup file: no advertisements array found.' : 'অকার্যকর ব্যাকআপ ফাইল: বিজ্ঞাপনের সঠিক তালিকা পাওয়া যায়নি।');
        }

        setRestorePreview({
          rawJson: parsed,
          adsCount: adsArr.length,
          usersCount: Array.isArray(usersArr) ? usersArr.length : 0,
          paymentsCount: Array.isArray(paymentsArr) ? paymentsArr.length : 0,
          reportsCount: Array.isArray(reportsArr) ? reportsArr.length : 0,
          timestamp: parsed.exportedAtFormatted || parsed.exportedAt || (isEn ? 'Unknown date' : 'তারিখ উল্লেখিত নেই'),
          version: parsed.backupVersion || '1.0'
        });
      } catch (err: any) {
        setRestoreError(err.message || (isEn ? 'Failed to parse JSON backup file.' : 'ব্যাকআপ ফাইলটি পড়া সম্ভব হয়নি। সঠিক .json ফাইল নিশ্চিত করুন।'));
      }
    };
    reader.readAsText(file);
    // Reset file input value so user can re-upload if needed
    e.target.value = '';
  };

  // Execute Restore
  const executeRestore = () => {
    if (!restorePreview || !onRestoreBackup) return;
    setIsRestoring(true);

    try {
      const parsed = restorePreview.rawJson;
      const targetData = parsed.data || parsed;

      onRestoreBackup({
        ads: targetData.ads,
        users: targetData.registeredUsers,
        payments: targetData.payments,
        reports: targetData.reports,
        adSenseConfig: targetData.adSenseConfig,
        securitySettings: targetData.securitySettings,
      });

      setRestoreSuccess(true);
      setRestorePreview(null);
      setTimeout(() => setRestoreSuccess(false), 5000);
    } catch (err: any) {
      setRestoreError(err.message || (isEn ? 'Restore failed.' : 'রিস্টোর করতে সমস্যা হয়েছে।'));
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/60 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  {isEn ? 'Super Admin Data & File Backup Vault' : 'সুপার এডমিন ডাটা ও ফাইল ব্যাকআপ ভল্ট'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {isEn ? 'Production Safe' : 'লাইভ রেডি'}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                {isEn
                  ? 'All visitor advertisements, photos, user accounts, and financial boost logs can be exported in one click. When you deploy the website live, easily restore this data so visitors immediately see everything.'
                  : 'ভিজিটররা বিভিন্ন বিজ্ঞাপন দেওয়ার পর আপনি যেকোনো মুহূর্তে সম্পূর্ণ ডাটাবেজ, বিজ্ঞাপন, ছবি ও ব্যবহারকারীদের তথ্য ১-ক্লিকে ব্যাকআপ রাখতে পারবেন। ওয়েবসাইট লাইভ করার পর এই ফাইল ১-ক্লিকে রিস্টোর করলেই সব বিজ্ঞাপন সাইটে লাইভ প্রদর্শিত হবে।'}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadFullBackup}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isEn ? 'Download Full Backup (.json)' : 'সম্পূর্ণ ব্যাকআপ ডাউনলোড (.json)'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {restoreSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs space-y-1 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{isEn ? 'Database Restored Successfully!' : 'ডাটাবেজ সফলভাবে রিস্টোর হয়েছে!'}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            {isEn
              ? 'All advertisements, users, images, and settings have been updated and are now visible live on the website.'
              : 'সকল বিজ্ঞাপন, ব্যবহারকারী প্রোফাইল, ছবি এবং সেটিংস সফলভাবে আপডেট হয়েছে এবং হোমপেজে লাইভ দৃশ্যমান।'}
          </p>
        </div>
      )}

      {restoreError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{restoreError}</span>
        </div>
      )}

      {/* Live Metrics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{isEn ? 'Total Ads' : 'মোট বিজ্ঞাপন'}</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatNumber(ads.length, language)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatNumber(approvedAds.length, language)} অনুমোদিত</span>
            <span>·</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{formatNumber(pendingAds.length, language)} পেন্ডিং</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{isEn ? 'Registered Users' : 'নিবন্ধিত ইউজার'}</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatNumber(registeredUsers.length, language)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {isEn ? 'Active seller profiles' : 'সক্রিয় বিক্রেতা আইডি'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{isEn ? 'Total Photos/Media' : 'মোট ছবি ও মিডিয়া'}</span>
            <ImageIcon className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatNumber(totalImages, language)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {isEn ? 'Base64 & URL Photos' : 'সংযুক্ত ছবি ও ফাইল'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>{isEn ? 'Boost Transactions' : 'পেমেন্ট ও বুস্টিং'}</span>
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatNumber(payments.length, language)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {isEn ? 'Financial transactions' : 'ভেরিফাইড লেনদেন রেকর্ড'}
          </div>
        </div>
      </div>

      {/* Main Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Operation 1: One-Click Full Database Backup */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isEn ? '1. One-Click Full Database Backup (.JSON)' : '১. সম্পূর্ণ ডাটাবেজ ব্যাকআপ (.JSON)'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Exports every ad, uploaded photo, user account, boost payment, and setting into a single file.'
                  : 'সকল বিজ্ঞাপন, ছবি, বিক্রেতার নাম ও নম্বর, বুস্টিং ও সেটিংস সহ একটি স্বয়ংসম্পূর্ণ ফাইল ডাউনলোড হবে।'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{isEn ? 'Backup Format:' : 'ফাইল ফরম্যাট:'}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">JSON (Schema v2.0)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{isEn ? 'Included Ads:' : 'সংযুক্ত বিজ্ঞাপনের সংখ্যা:'}</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatNumber(ads.length, language)} টি</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{isEn ? 'Included Users:' : 'সংযুক্ত ব্যবহারকারী:'}</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatNumber(registeredUsers.length, language)} জন</span>
            </div>
          </div>

          <button
            onClick={handleDownloadFullBackup}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isEn ? 'Download Full JSON Backup' : 'সম্পূর্ণ ব্যাকআপ ফাইল ডাউনলোড করুন'}</span>
          </button>
        </div>

        {/* Operation 2: One-Click Restore / Live Import */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isEn ? '2. Restore / Import to Live Website (.JSON)' : '২. লাইভ ওয়েবসাইটে ব্যাকআপ রিস্টোর / ইমপোর্ট'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Upload any previously saved backup file to restore all visitor ads and data immediately.'
                  : 'পূর্বে সেভ করা যেকোনো ব্যাকআপ ফাইল আপলোড করলেই সাথে সাথে সমস্ত বিজ্ঞাপন লাইভ হয়ে যাবে।'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Select your .json backup file. A preview confirmation dialog will show the number of ads before applying.'
              : 'আপনার .json ফাইলটি নির্বাচন করুন। ডাটাবেজে রিস্টোর করার আগে আপনাকে বিজ্ঞাপন ও ইউজারের সংখ্যা কনফার্ম করতে বলবে।'}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{isEn ? 'Select Backup File & Restore' : 'ব্যাকআপ ফাইল নির্বাচন করুন (.json)'}</span>
          </button>
        </div>

        {/* Operation 3: Export to Excel / CSV */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isEn ? '3. Export Ads to Microsoft Excel / CSV' : '৩. এক্সেল ও সিএসভি শিটে বিজ্ঞাপন এক্সপোর্ট'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Download all ads as a spreadsheet. Perfect for offline records, phonebook, or importing into MySQL.'
                  : 'বিজ্ঞাপনের শিরোনাম, মোবাইল নম্বর, মূল্য, জেলা ও ছবিসহ সুন্দর এক্সেল শিট ডাউনলোড করুন।'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Includes UTF-8 BOM encoding so Bangla texts open properly in Excel, Google Sheets, or LibreOffice.'
              : 'UTF-8 সাপোর্ট সহ তৈরি, ফলে বাংলা লেখাগুলো মাইক্রোসফট এক্সেল বা গুগল শিটে একদম পরিষ্কার ও নিখুঁত দেখাবে।'}
          </div>

          <button
            onClick={handleDownloadAdsCsv}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isEn ? 'Download Excel / CSV Sheet (.csv)' : 'এক্সেল / সিএসভি শিট ডাউনলোড (.csv)'}</span>
          </button>
        </div>

        {/* Operation 4: Maintenance & Sample Ads Control */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isEn ? '4. Live Launch Cleanup (Clear Sample Ads)' : '৪. লাইভ লঞ্চ ক্লিনআপ (ডেমো বিজ্ঞাপন অপশন)'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEn
                  ? 'Keep only authentic visitor ads when you launch live, or restore initial demo sets if needed.'
                  : 'ওয়েবসাইট আসল ইউজারদের জন্য লাইভ করার আগে ডেমো বিজ্ঞাপন পরিষ্কার রাখা বা পরিচালনা করা।'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
            {isEn
              ? 'Always take a backup before clearing. Your download backup button will ensure you never lose anything.'
              : 'ক্লিন করার পূর্বে অবশ্যই উপরের ১ নং বাটন থেকে ১-ক্লিক ব্যাকআপ ডাউনলোড করে রাখবেন।'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const sampleIds = ['ad-1', 'ad-2', 'ad-3', 'ad-4', 'ad-5', 'ad-6', 'ad-7', 'ad-8', 'ad-9', 'ad-10', 'ad-11', 'ad-12', 'ad-13', 'ad-14', 'ad-15', 'ad-16', 'ad-17', 'ad-18', 'ad-19', 'ad-20', 'ad-21', 'ad-22', 'ad-23', 'ad-24', 'ad-25', 'ad-26', 'ad-27', 'ad-28', 'ad-29', 'ad-30', 'ad-31', 'ad-32', 'ad-33'];
                const realVisitorAds = ads.filter(a => !sampleIds.includes(a.id));
                if (onRestoreBackup) {
                  onRestoreBackup({ ads: realVisitorAds });
                  setDownloadSuccess(isEn ? 'Sample mock ads cleaned! Only real visitor ads remain.' : 'ডেমো বিজ্ঞাপন সরানো হয়েছে! শুধুমাত্র আসল ভিজিটরদের বিজ্ঞাপন রয়েছে।');
                  setTimeout(() => setDownloadSuccess(null), 4000);
                }
              }}
              className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>{isEn ? 'Filter Demo Mock Ads' : 'ডেমো বিজ্ঞাপন ফিল্টার করুন'}</span>
            </button>

            <button
              onClick={handleDownloadFullBackup}
              className="py-2.5 px-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {isEn ? 'Quick Save' : 'কুইক সেভ'}
            </button>
          </div>
        </div>

        {/* Operation 5: Direct Google Cloud Firestore Live Sync */}
        <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/40 dark:from-indigo-950/40 dark:via-slate-800 dark:to-slate-800 space-y-4 shadow-xs md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {isEn ? 'Google Firebase Firestore Multi-Device Sync' : 'গুগল ক্লাউড ডাটাবেজ (Firestore) মাল্টি-ডিভাইস সিঙ্ক'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-xs">
                    {isEn ? 'Realtime Sync Active' : 'রিয়েলটাইম সিঙ্ক সক্রিয়'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEn
                    ? 'Synchronizes all ads to Google Firestore so that ads posted from PC, Mobile, or any browser load automatically on all other devices in real-time.'
                    : 'কম্পিউটার বা মোবাইল থেকে যেকোনো ভিজিটর বিজ্ঞাপন দিলে তা সাথে সাথে গুগলের কেন্দ্রীয় ক্লাউড ডাটাবেজে জমা হবে এবং অন্য সকল ডিভাইসে স্বয়ংক্রিয়ভাবে লোড হবে।'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncAllAdsToCloud}
              disabled={isCloudSyncing}
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isCloudSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'Syncing to Cloud...' : 'ক্লাউডে সিঙ্ক হচ্ছে...'}</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  <span>{isEn ? 'Sync All Ads to Cloud' : 'সকল বিজ্ঞাপন ক্লাউডে সিঙ্ক করুন'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Restore Preview Confirmation Modal */}
      {restorePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isEn ? 'Confirm Database Restore' : 'ডাটাবেজ রিস্টোর নিশ্চিতকরণ'}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn ? 'Backup Date:' : 'ব্যাকআপ তৈরির তারিখ:'} {restorePreview.timestamp}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{isEn ? 'Preview of Backup Data:' : 'ব্যাকআপ ফাইলের তথ্যের বিবরণ:'}</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 pt-1">
                <li><strong>{formatNumber(restorePreview.adsCount, language)} টি</strong> বিজ্ঞাপন সম্পূর্ণভাবে রিস্টোর হবে।</li>
                <li><strong>{formatNumber(restorePreview.usersCount, language)} জন</strong> রেজিস্টার্ড ইউজারের প্রোফাইল অন্তর্ভুক্ত।</li>
                <li><strong>{formatNumber(restorePreview.paymentsCount, language)} টি</strong> পেমেন্ট ও লেনদেন হিস্ট্রি।</li>
                <li><strong>{formatNumber(restorePreview.reportsCount, language)} টি</strong> রিপোর্ট রেকর্ড।</li>
              </ul>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Applying this backup will update current ads and data on the website with the backup contents. Are you sure you want to proceed?'
                : 'এই ব্যাকআপ ফাইলটি রিস্টোর করলে বর্তমান ওয়েবসাইটের ডাটাবেজে ফাইলটির সব বিজ্ঞাপন ও ব্যবহারকারী যুক্ত হবে। আপনি কি নিশ্চিত?'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRestorePreview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                {isEn ? 'Cancel' : 'বাতিল'}
              </button>

              <button
                type="button"
                onClick={executeRestore}
                disabled={isRestoring}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isEn ? 'Restoring...' : 'রিস্টোর হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEn ? 'Confirm & Restore Now' : 'হ্যাঁ, এখন রিস্টোর করুন'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Architectural Guide: How Live Deployment & Ad Persistence Works */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {isEn ? 'Website Live Guide: How Visitors & Ads Stay Saved Live in Production' : 'ওয়েবসাইট লাইভ গাইড: ভিজিটরদের বিজ্ঞাপন লাইভ অবস্থায় কিভাবে সংরক্ষিত ও দৃশ্যমান থাকবে?'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Three clear ways ads are stored and viewed by everyone when your website is live'
                : 'আপনার ওয়েবসাইট যখন ইন্টারনেটে লাইভ করবেন, তখন বিজ্ঞাপনগুলো সবার জন্য যেভাবে কাজ করবে'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Way 1: The Backup & Restore Vault */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">১</span>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                {isEn ? 'Backup & Migrate to Live Site' : 'ব্যাকআপ ফাইল দিয়ে লাইভ সাইটে আনা'}
              </h5>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ডেভেলপমেন্টে বা বর্তমান সাইটে ভিজিটররা যত বিজ্ঞাপন দিয়েছে, তা উপরের <strong>"সম্পূর্ণ ব্যাকআপ ডাউনলোড (.json)"</strong> বাটনে চাপ দিয়ে সংরক্ষণ করুন। ওয়েবসাইট লাইভ করার পর এডমিন প্যানেলে এই ফাইল আপলোড করলেই সাথে সাথে সব বিজ্ঞাপন লাইভ ওয়েবসাইটে চলে আসবে।
            </p>
          </div>

          {/* Way 2: Real-time Cloud Database Sync */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">২</span>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                {isEn ? 'Central Cloud Database (Firebase / SQL)' : 'সেন্ট্রাল ক্লাউড ডাটাবেজ (Firebase / SQL)'}
              </h5>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              লাইভ প্রোডাকশনে যখন হাজার হাজার ভিজিটর বিভিন্ন জেলা থেকে বিজ্ঞাপন দেয়, তখন সেগুলো একটি কেন্দ্রীয় ক্লাউড ডাটাবেজে (যেমন Google Firebase Firestore বা MySQL/PostgreSQL) তাৎক্ষণিকভাবে জমা হয়। একজন ভিজিটর পোস্ট করার ১ সেকেন্ডের মধ্যেই অন্য ভিজিটর তা দেখতে পায়।
            </p>
          </div>

          {/* Way 3: Android App & Web Unified Sync */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">৩</span>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                {isEn ? 'Android App & Web Unified Sync' : 'অ্যান্ড্রয়েড অ্যাপ ও ওয়েব একসাথে সিঙ্ক'}
              </h5>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              আমাদের সিস্টেমে অ্যান্ড্রয়েড অ্যাপ ও ওয়েবসাইট একই সেন্ট্রাল এপিআই ও স্টোরেজ ব্যবহার করে। ফলে কেউ মোবাইল অ্যাপ থেকে বিজ্ঞাপন দিলে তা সরাসরি ওয়েবসাইটে দেখাবে এবং ওয়েবসাইট থেকে দিলে অ্যাপে দেখাবে।
            </p>
          </div>

        </div>

        {/* Quick Instructions box */}
        <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-indigo-700 dark:text-indigo-400">সুপার এডমিন টিপস: </span>
            প্রতি সপ্তাহে বা যেকোনো গুরুত্বপূর্ণ আপডেটের পূর্বে একবার <strong>"সম্পূর্ণ ব্যাকআপ ডাউনলোড"</strong> করে আপনার গুগল ড্রাইভ বা পিসিতে সেভ রাখুন। এছাড়া <strong>"ডোমেন ও সোর্স কোড ডাউনলোড"</strong> ট্যাব থেকে প্রোডাকশন বিল্ড জিপ (`puranbazar-production-dist.zip`) ডাউনলোড করে সরাসরি যেকোনো হোস্টিংয়ের `public_html`-এ আপলোড করে সাইট লাইভ করতে পারবেন।
          </div>
        </div>
      </div>
    </div>
  );
};
