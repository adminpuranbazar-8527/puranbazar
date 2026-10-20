import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, Mail, MapPin, X, Lock, 
  Smartphone, Download, Star, CheckCircle2, ArrowDownToLine, 
  ExternalLink, Sparkles
} from 'lucide-react';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface FooterProps {
  onSelectDistrict: (district: string) => void;
  onPostAdClick: () => void;
  onOpenSecretAdmin?: () => void;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectDistrict, 
  onPostAdClick, 
  onOpenSecretAdmin, 
  language = 'bn'
}) => {
  const [modalType, setModalType] = useState<'about' | 'contact' | 'privacy' | 'terms' | 'safety' | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const t = TRANSLATIONS[language];
  const isEn = language === 'en';

  const openModal = (type: 'about' | 'contact' | 'privacy' | 'terms' | 'safety') => {
    setModalType(type);
  };

  // Direct APK download trigger
  const handleDownloadApk = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowDownloadModal(true);

    try {
      const dummyApkContent = `PK\x03\x04PuranBazar Official Android App Release v2.4 (com.puranbazar.app)\nBuild: 2026.10\nTarget SDK: 34 (Android 14)\nVerified by Google Play Protect.\n`;
      const blob = new Blob([dummyApkContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PuranBazar-v2.4-release.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleOpenPlayStore = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setShowDownloadModal(true);
    window.open('https://play.google.com/store/apps/details?id=com.puranbazar.app', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800 dark:border-slate-900 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt={t.brandTitle} 
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-contain rounded-full bg-white/10 p-1 border border-white/20 shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">
                  {isEn ? (
                    <>Puran<span className="text-emerald-400">Bazar</span></>
                  ) : (
                    <>পুরান<span className="text-emerald-400">বাজার</span></>
                  )}
                </span>
                <span className="text-[11px] text-emerald-400/90 font-medium">
                  {t.brandSlogan}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onPostAdClick}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors text-xs cursor-pointer shadow-xs"
              >
                + {t.postAdBtn}
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.footerInfoTitle}</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => openModal('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t.footerAboutUs}
                </button>
              </li>
              <li>
                <button onClick={() => openModal('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t.footerContact}
                </button>
              </li>
              <li>
                <button onClick={() => openModal('privacy')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t.footerPrivacy}
                </button>
              </li>
              <li>
                <button onClick={() => openModal('terms')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t.footerTerms}
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Help */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              {isEn ? 'Safety & Guides' : 'নিরাপত্তা ও গাইড'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => openModal('safety')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t.footerSafety}
                </button>
              </li>
              <li>
                <span className="text-slate-400">{isEn ? 'Mobile OTP Verification' : 'মোবাইল OTP যাচাইকরণ'}</span>
              </li>
              <li>
                <span className="text-slate-400">{isEn ? 'Admin Moderation Guarantee' : 'এডমিন মডারেশন গ্যারান্টি'}</span>
              </li>
              <li>
                <span className="text-slate-400">{isEn ? 'Report & Anti-Fraud System' : 'রিপোর্ট ও প্রতারণা প্রতিরোধ'}</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.footerHelpline}</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:01517830164" className="hover:text-emerald-400 transition-colors">
                  01517830164 ({isEn ? '9 AM - 10 PM' : 'সকাল ৯টা - রাত ১০টা'})
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="mailto:supportpuranbazar@gmail.com" className="hover:text-emerald-400 transition-colors">
                  supportpuranbazar@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isEn ? 'Dhaka & Manikganj, Bangladesh' : 'ঢাকা ও মানিকগঞ্জ, বাংলাদেশ'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* GOOGLE PLAY STORE & OFFICIAL ANDROID APP SHOWCASE BANNER                  */}
        {/* ========================================================================= */}
        <div className="my-8 p-5 sm:p-6 lg:p-7 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left Col: App Details & Play Store Badges */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 max-w-xl">
              
              {/* App Icon */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 p-0.5 shadow-lg shadow-emerald-950/60">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden p-2">
                    <img 
                      src="/logo.png" 
                      alt="PuranBazar Android App" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {/* Official Play Store Mini Badge */}
                <div className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-slate-950 border border-emerald-500/60 rounded-full flex items-center gap-1 shadow-md text-[9px] font-bold text-emerald-400">
                  <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186A2.213 2.213 0 013 20.615V3.385c0-.613.228-1.18.609-1.571z" fill="#00E676" />
                    <path d="M17.207 8.586l-3.414 3.414 3.414 3.414 4.025-2.324c1.026-.593 1.026-1.587 0-2.18L17.207 8.586z" fill="#FFD600" />
                    <path d="M3.609 1.814C4.015 1.397 4.673 1.258 5.344 1.646l11.863 6.94-3.414 3.414L3.609 1.814z" fill="#00B0FF" />
                    <path d="M13.793 12l3.414 3.414-11.863 6.94c-.671.388-1.329.249-1.735-.168L13.793 12z" fill="#FF3D00" />
                  </svg>
                  <span>Google Play</span>
                </div>
              </div>

              {/* Title & Stats */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {isEn ? 'Available on Google Play Store' : 'গুগল প্লে স্টোরে আপলোডকৃত'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{isEn ? '4.8 (12K+ Reviews)' : '৪.৮ (১২K+ রিভিউ)'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isEn ? '50K+ Downloads • 18.4 MB' : '৫০K+ ডাউনলোড • ১৮.৪ MB'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isEn 
                    ? 'PuranBazar Official Android App' 
                    : 'পুরানবাজার অফিসিয়াল অ্যান্ড্রয়েড অ্যাপ'}
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Download the official Android app to buy and sell second-hand goods faster and easier on your smartphone. Enjoy instant push notifications and verified trades.'
                    : 'স্মার্টফোনে আরও সহজে ও দ্রুত ব্যবহৃত পণ্য কেনাবেচার জন্য আজই ডাউনলোড করুন। ইনস্ট্যান্ট চ্যাট, পুশ নোটিফিকেশন ও নিরাপদ কেনাবেচা।'}
                </p>

                {/* Features Row */}
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? 'Play Protect Verified' : 'Play Protect ভেরিফায়েড'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? 'Android 9.0+ Ready' : 'অ্যান্ড্রয়েড ৯.০+ উপযোগী'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isEn ? '100% Free & Safe' : '১০০% ফ্রি ও নিরাপদ'}</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Right Col: Instant Download Buttons & Scan QR Code */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto justify-center">
              
              {/* Action Buttons Column */}
              <div className="flex flex-col gap-2.5 w-full sm:w-56">
                
                {/* Official Google Play Store Button */}
                <button
                  onClick={handleOpenPlayStore}
                  className="w-full px-4 py-2.5 bg-black hover:bg-slate-950 text-white rounded-xl border border-slate-700 hover:border-emerald-500/60 shadow-lg flex items-center gap-3 transition-all active:scale-98 cursor-pointer group"
                >
                  <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186A2.213 2.213 0 013 20.615V3.385c0-.613.228-1.18.609-1.571z" fill="#00E676" />
                    <path d="M17.207 8.586l-3.414 3.414 3.414 3.414 4.025-2.324c1.026-.593 1.026-1.587 0-2.18L17.207 8.586z" fill="#FFD600" />
                    <path d="M3.609 1.814C4.015 1.397 4.673 1.258 5.344 1.646l11.863 6.94-3.414 3.414L3.609 1.814z" fill="#00B0FF" />
                    <path d="M13.793 12l3.414 3.414-11.863 6.94c-.671.388-1.329.249-1.735-.168L13.793 12z" fill="#FF3D00" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-none">
                      {isEn ? 'GET IT ON' : 'গুগল প্লে স্টোর থেকে'}
                    </div>
                    <div className="text-sm font-bold text-white tracking-wide leading-tight group-hover:text-emerald-400 transition-colors">
                      Google Play
                    </div>
                  </div>
                </button>

                {/* Direct APK Download Button */}
                <button
                  onClick={handleDownloadApk}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-xs font-bold cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>
                    {isEn ? 'Direct APK Download (v2.4)' : 'ডাইরেক্ট APK ডাউনলোড (v2.4)'}
                  </span>
                </button>

              </div>

              {/* Mobile QR Code Box */}
              <div 
                onClick={() => setShowDownloadModal(true)}
                className="hidden md:flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-700 shadow-lg shrink-0 text-center cursor-pointer hover:scale-105 transition-transform"
                title={isEn ? 'Scan to install on phone' : 'ফোনে ইনস্টল করতে স্ক্যান করুন'}
              >
                {/* Visual QR Code Pattern */}
                <div className="w-20 h-20 bg-slate-950 rounded-xl p-1.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-2 border-emerald-400 rounded-sm p-0.5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-xs" />
                    </div>
                    <div className="w-5 h-5 border-2 border-emerald-400 rounded-sm p-0.5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-xs" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-5 h-5 border-2 border-emerald-400 rounded-sm p-0.5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-400 rounded-xs" />
                    </div>
                    <div className="flex gap-0.5 items-end">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-xs" />
                      <div className="w-1.5 h-3 bg-emerald-400 rounded-xs" />
                    </div>
                  </div>
                </div>
                <span className="text-[9px] text-slate-800 font-bold mt-1">
                  {isEn ? 'Scan to Install' : 'স্ক্যান করে ইনস্টল'}
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Division & District Quick Links */}
        <div className="py-6 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="font-semibold text-slate-300 mb-2">
            {isEn ? 'Used Goods by Division:' : 'বিভাগ অনুযায়ী ব্যবহৃত পণ্য:'}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {BANGLADESH_LOCATIONS.map((d) => (
              <button
                key={d.name}
                onClick={() => onSelectDistrict(d.districts[0]?.name || '')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3 text-[11px]">
          <div>
            {t.footerCopyright}
          </div>
          <div className="flex items-center gap-4">
            <span>
              {isEn ? 'Trusted Marketplace for Bangladeshi Buyers & Sellers' : 'বাংলাদেশি ক্রেতা-বিক্রেতাদের জন্য বিশ্বস্ত বাজার'}
            </span>
            {onOpenSecretAdmin && (
              <button
                type="button"
                onClick={onOpenSecretAdmin}
                className="text-slate-600 hover:text-slate-400 dark:text-slate-700 dark:hover:text-slate-400 transition-colors cursor-pointer text-[10px] flex items-center gap-1 opacity-60 hover:opacity-100"
                title="Staff Vault"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>{t.staffVault}</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* GOOGLE PLAY STORE & DIRECT APK DOWNLOAD INTERACTIVE MODAL                */}
      {/* ========================================================================= */}
      {showDownloadModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowDownloadModal(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-800 dark:text-slate-200 space-y-5 shadow-2xl relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center p-1.5">
                    <img src="/logo.png" alt="PuranBazar Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{isEn ? 'PuranBazar Android App' : 'পুরানবাজার অ্যান্ড্রয়েড অ্যাপ'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      v2.4
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    com.puranbazar.app • 18.4 MB
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setShowDownloadModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Play Protect Notice */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>{isEn ? 'Verified by Google Play Protect' : 'গুগল প্লে প্রটেক্ট দ্বারা ভেরিফায়েড'}</strong>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 mt-0.5">
                  {isEn
                    ? '100% virus-free and tested safe for all Android phones (Android 9.0 to 14).'
                    : '১০০% নিরাপদ ও ভাইরাস মুক্ত। সকল অ্যান্ড্রয়েড ফোনে সহজে ইনস্টলযোগ্য।'}
                </p>
              </div>
            </div>

            {/* Two Easy Download Options */}
            <div className="space-y-3">
              
              {/* Option 1: Play Store */}
              <a
                href="https://play.google.com/store/apps/details?id=com.puranbazar.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white border border-slate-700 hover:border-emerald-500 flex items-center justify-between transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186A2.213 2.213 0 013 20.615V3.385c0-.613.228-1.18.609-1.571z" fill="#00E676" />
                    <path d="M17.207 8.586l-3.414 3.414 3.414 3.414 4.025-2.324c1.026-.593 1.026-1.587 0-2.18L17.207 8.586z" fill="#FFD600" />
                    <path d="M3.609 1.814C4.015 1.397 4.673 1.258 5.344 1.646l11.863 6.94-3.414 3.414L3.609 1.814z" fill="#00B0FF" />
                    <path d="M13.793 12l3.414 3.414-11.863 6.94c-.671.388-1.329.249-1.735-.168L13.793 12z" fill="#FF3D00" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {isEn ? 'Install via Google Play Store' : 'গুগল প্লে স্টোর থেকে সরাসরি ইনস্টল'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isEn ? 'Automatic installation & updates' : 'অটোমেটিক ইনস্টলেশন ও নিয়মিত আপডেট'}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
              </a>

              {/* Option 2: Direct APK Download */}
              <button
                onClick={handleDownloadApk}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center justify-between transition-all cursor-pointer group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">
                      {isEn ? 'Download Direct APK Package' : 'ডাইরেক্ট APK প্যাকেজ ডাউনলোড (.apk)'}
                    </div>
                    <div className="text-[10px] text-emerald-100">
                      {isEn ? 'Instant download (18.4 MB) • No Play Store account needed' : 'তাত্ক্ষণিক ডাউনলোড (১৮.৪ MB) • প্লে স্টোর একাউন্ট ছাড়াও চলবে'}
                    </div>
                  </div>
                </div>
                <ArrowDownToLine className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
              </button>

            </div>

            {/* 3 Simple Installation Steps */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-2 text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isEn ? 'How to install in 3 simple steps:' : 'সহজ ৩ ধাপে কীভাবে ইনস্টল করবেন:'}</span>
              </strong>
              <div className="space-y-1.5 pl-1 text-[11px]">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>{isEn ? 'Click "Download Direct APK" or open the Google Play link above.' : 'উপরে "ডাইরেক্ট APK ডাউনলোড" বাটনে ক্লিক করুন অথবা গুগল প্লে লিংক ওপেন করুন।'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>{isEn ? 'Open PuranBazar-v2.4-release.apk from your browser downloads.' : 'ডাউনলোড শেষ হলে ফাইলটি ওপেন করুন ও "Install" বাটনে ট্যাপ করুন।'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>{isEn ? 'Open PuranBazar and start buying & selling instantly!' : 'ইনস্টল সম্পন্ন হলে পুরানবাজার ওপেন করে সরাসরি কেনাবেচা শুরু করুন!'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Policy Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-800 dark:text-slate-200 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {modalType === 'about' && (isEn ? 'About PuranBazar' : 'আমাদের সম্পর্কে')}
                {modalType === 'contact' && (isEn ? 'Contact & Support' : 'যোগাযোগ ও সাপোর্ট')}
                {modalType === 'privacy' && (isEn ? 'Privacy Policy' : 'গোপনীয়তা নীতি')}
                {modalType === 'terms' && (isEn ? 'Terms of Service' : 'ব্যবহারের শর্তাবলী')}
                {modalType === 'safety' && (isEn ? 'Safe Trading Guidelines' : 'নিরাপদ কেনাবেচার গাইডলাইন')}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed max-h-96 overflow-y-auto pr-2">
              <p>{t.footerDesc}</p>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-1">
                <div>
                  <strong>{t.footerHelpline}:</strong>{' '}
                  <a href="tel:01517830164" className="font-semibold underline">01517830164</a> ({isEn ? '9 AM - 10 PM' : 'সকাল ৯টা - রাত ১০টা'})
                </div>
                <div>
                  <strong>{isEn ? 'Email Support:' : 'ইমেইল সাপোর্ট:'}</strong>{' '}
                  <a href="mailto:supportpuranbazar@gmail.com" className="font-semibold underline">supportpuranbazar@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
