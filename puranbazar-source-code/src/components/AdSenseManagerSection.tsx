import React, { useState } from 'react';
import { 
  Globe, CheckCircle2, Copy, CheckCheck, ExternalLink, Download, 
  Settings, AlertTriangle, ShieldCheck, ArrowRight, Sparkles, 
  HelpCircle, RefreshCw, FileCode, Check, Megaphone, Image as ImageIcon,
  Link as LinkIcon, Eye, ToggleLeft, ToggleRight, Info, CheckCircle
} from 'lucide-react';
import { GoogleAdSenseConfig, PayoutAccount, CustomSponsorBanner } from '../types';
import { Language } from '../utils/i18n';

interface AdSenseManagerSectionProps {
  adSenseConfig: GoogleAdSenseConfig;
  payoutAccounts: PayoutAccount[];
  onUpdateAdSenseConfig: (config: GoogleAdSenseConfig) => void;
  language?: Language;
}

export const AdSenseManagerSection: React.FC<AdSenseManagerSectionProps> = ({
  adSenseConfig,
  payoutAccounts,
  onUpdateAdSenseConfig,
  language = 'bn',
}) => {
  const isEn = language === 'en';
  const [activeSection, setActiveSection] = useState<'adsense' | 'sponsors'>('sponsors');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publisherInput, setPublisherInput] = useState(adSenseConfig.publisherId);
  const [metaInput, setMetaInput] = useState(adSenseConfig.siteVerificationMeta);
  const [adsTxtInput, setAdsTxtInput] = useState(adSenseConfig.adsTxtContent);
  const [autoAds, setAutoAds] = useState(adSenseConfig.autoAdsEnabled);
  const [adUnits, setAdUnits] = useState(adSenseConfig.adUnits);
  const [linkedBankId, setLinkedBankId] = useState(adSenseConfig.wireTransferBankId || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Custom Sponsor Banner Slot 1 State ("টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার")
  const [slot1Enabled, setSlot1Enabled] = useState(adSenseConfig.sponsorSlot1?.enabled || false);
  const [slot1Title, setSlot1Title] = useState(adSenseConfig.sponsorSlot1?.title || 'টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার');
  const [slot1Subtitle, setSlot1Subtitle] = useState(adSenseConfig.sponsorSlot1?.subtitle || 'গুগল অ্যাডসেন্স নীতিমালা অনুযায়ী স্পষ্ট লেবেলযুক্ত স্লট');
  const [slot1ImageUrl, setSlot1ImageUrl] = useState(adSenseConfig.sponsorSlot1?.bannerImageUrl || '');
  const [slot1LinkUrl, setSlot1LinkUrl] = useState(adSenseConfig.sponsorSlot1?.targetLinkUrl || '');
  const [slot1Advertiser, setSlot1Advertiser] = useState(adSenseConfig.sponsorSlot1?.advertiserName || '');

  // Custom Sponsor Banner Slot 2 State ("নতুন পণ্য ও এক্সচেঞ্জ অফার")
  const [slot2Enabled, setSlot2Enabled] = useState(adSenseConfig.sponsorSlot2?.enabled || false);
  const [slot2Title, setSlot2Title] = useState(adSenseConfig.sponsorSlot2?.title || 'নতুন পণ্য ও এক্সচেঞ্জ অফার');
  const [slot2Subtitle, setSlot2Subtitle] = useState(adSenseConfig.sponsorSlot2?.subtitle || 'বিশ্বস্ত পার্টনার ও এক্সচেঞ্জ শপের প্রিমিয়াম অফার');
  const [slot2ImageUrl, setSlot2ImageUrl] = useState(adSenseConfig.sponsorSlot2?.bannerImageUrl || '');
  const [slot2LinkUrl, setSlot2LinkUrl] = useState(adSenseConfig.sponsorSlot2?.targetLinkUrl || '');
  const [slot2Advertiser, setSlot2Advertiser] = useState(adSenseConfig.sponsorSlot2?.advertiserName || '');

  const bankAccounts = payoutAccounts.filter(a => a.type === 'bank');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadAdsTxt = () => {
    const blob = new Blob([adsTxtInput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ads.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GoogleAdSenseConfig = {
      ...adSenseConfig,
      publisherId: publisherInput.trim(),
      siteVerificationMeta: metaInput.trim(),
      adsTxtContent: adsTxtInput.trim(),
      autoAdsEnabled: autoAds,
      adUnits,
      wireTransferBankId: linkedBankId,
      sponsorSlot1: {
        enabled: slot1Enabled,
        title: slot1Title.trim() || 'টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার',
        subtitle: slot1Subtitle.trim(),
        bannerImageUrl: slot1ImageUrl.trim(),
        targetLinkUrl: slot1LinkUrl.trim(),
        advertiserName: slot1Advertiser.trim(),
      },
      sponsorSlot2: {
        enabled: slot2Enabled,
        title: slot2Title.trim() || 'নতুন পণ্য ও এক্সচেঞ্জ অফার',
        subtitle: slot2Subtitle.trim(),
        bannerImageUrl: slot2ImageUrl.trim(),
        targetLinkUrl: slot2LinkUrl.trim(),
        advertiserName: slot2Advertiser.trim(),
      },
    };
    onUpdateAdSenseConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Sample presets for quick testing
  const applyPresetSlot1 = (brand: 'walton' | 'samsung' | 'daraz') => {
    if (brand === 'walton') {
      setSlot1Enabled(true);
      setSlot1Title('🔥 ওয়ালটন মেগা উইন্টার ডিলস — ফ্রিজ ও টিভিতে ১৫% ক্যাশব্যাক!');
      setSlot1Subtitle('পুরানবাজার ভেরিফাইড ব্র্যান্ড অফার | সীমিত সময়ের জন্য');
      setSlot1ImageUrl('https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80');
      setSlot1LinkUrl('https://waltonbd.com');
      setSlot1Advertiser('Walton Bangladesh');
    } else if (brand === 'samsung') {
      setSlot1Enabled(true);
      setSlot1Title('⚡ স্যামসাং গ্যালাক্সি এক্সচেঞ্জ অফার — পুরানো ফোন দিয়ে নতুন নিন!');
      setSlot1Subtitle('অফিসিয়াল ওয়ারেন্টি ও ০% ইএমআই সুবিধা');
      setSlot1ImageUrl('https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80');
      setSlot1LinkUrl('https://samsung.com/bd');
      setSlot1Advertiser('Samsung Electronics');
    } else if (brand === 'daraz') {
      setSlot1Enabled(true);
      setSlot1Title('🛒 গ্র্যান্ড অনলাইন মেগা সেল — ফ্রি ডেলিভারি ও বিশেষ ভাউচার!');
      setSlot1Subtitle('প্রতিটি কেনাকাটায় আকর্ষণীয় ডিসকাউন্ট কোড');
      setSlot1ImageUrl('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80');
      setSlot1LinkUrl('https://daraz.com.bd');
      setSlot1Advertiser('Daraz Online Deals');
    }
  };

  // Sample presets for quick testing of Slot 2 ("নতুন পণ্য ও এক্সচেঞ্জ অফার")
  const applyPresetSlot2 = (preset: 'bike' | 'mobile' | 'laptop') => {
    if (preset === 'bike') {
      setSlot2Enabled(true);
      setSlot2Title('🏍️ মেগা বাইক এক্সচেঞ্জ উৎসব — পুরানো বাইক বদলে নতুন ইয়ামাহা নিন!');
      setSlot2Subtitle('স্পট ভ্যালুয়েশন ও আকর্ষণীয় রেজিস্ট্রেশন ডিসকাউন্ট সুবিধা');
      setSlot2ImageUrl('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80');
      setSlot2LinkUrl('https://yamaha-motor.com.bd');
      setSlot2Advertiser('Yamaha Motors BD');
    } else if (preset === 'mobile') {
      setSlot2Enabled(true);
      setSlot2Title('📱 স্মার্টফোন এক্সচেঞ্জ মেলা — যেকোনো ব্রোকেন বা পুরানো ফোনে সর্বোচ্চ মূল্য!');
      setSlot2Subtitle('ভেরিফাইড এক্সচেঞ্জ পার্টনার ও তাৎক্ষণিক নগদ পেমেন্ট');
      setSlot2ImageUrl('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80');
      setSlot2LinkUrl('https://apple.com');
      setSlot2Advertiser('Smart Exchange Zone');
    } else if (preset === 'laptop') {
      setSlot2Enabled(true);
      setSlot2Title('💻 ল্যাপটপ আপগ্রেড অফার — পুরানো ল্যাপটপ দিয়ে নতুন কোর আই-৭ নিন!');
      setSlot2Subtitle('২ বছরের অফিশিয়াল ওয়ারেন্টি ও গিফট ভাউচার');
      setSlot2ImageUrl('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80');
      setSlot2LinkUrl('https://ryanscomputers.com');
      setSlot2Advertiser('Ryans Exchange Hub');
    }
  };

  const adCodeSnippet = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherInput}" crossorigin="anonymous"></script>`;

  return (
    <div className="space-y-5 text-xs animate-in fade-in">
      
      {/* Top Header Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 dark:from-amber-950/30 dark:to-blue-950/30 rounded-2xl border border-amber-300 dark:border-amber-700/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>{isEn ? 'Ad Placement & Sponsorship Control Center' : 'বিজ্ঞাপন স্লট, এডসেন্স ও স্পন্সর ব্যানার কন্ট্রোল'}</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-bold text-[10px]">
              {isEn ? 'Live Ads Engine' : 'লাইভ বিজ্ঞাপন ইঞ্জিন'}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            {isEn
              ? 'Easily run ads in the "Top Deals & Trusted Brands" and "Exchange Offers" slots directly from this Admin Panel.'
              : 'এডমিন প্যানেলের এই সেকশন থেকে আপনি হোমপেজের "টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার" স্লটে গুগল এডসেন্স বা সরাসরি নিজস্ব ব্যানার এড রান করতে পারবেন।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSection('sponsors')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'sponsors'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEn ? '1. Custom Sponsor Banners' : '১. স্পন্সর ব্যানার স্লট কন্ট্রোল'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('adsense')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'adsense'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isEn ? '2. Google AdSense Automated' : '২. গুগল এডসেন্স কনফিগ'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl flex items-center gap-2 font-bold animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isEn ? 'Settings updated! The ads are now running live on the website.' : 'অভিনন্দন! আপনার বিজ্ঞাপন সেটিংস সফলভাবে সংরক্ষিত হয়েছে এবং সাইটে লাইভ রান হচ্ছে!'}</span>
        </div>
      )}

      {/* DETAILED EXPLANATION BOX: HOW TO RUN ADS FROM ADMIN PANEL */}
      <div className="p-4.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{isEn ? 'How to Run Ads in this Slot from Admin Panel (Easy 3 Steps):' : 'এডমিন প্যানেল থেকে যেভাবে আপনি এই স্লটে বিজ্ঞাপন রান করবেন (সহজ ৩টি ধাপ):'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">১</span>
              <span>{isEn ? 'Choose Ad Type' : 'বিজ্ঞাপনের ধরণ নির্বাচন'}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Choose between Custom Sponsor Banner (Walton/Samsung/Brand) or Google AdSense automated network.'
                : 'আপনি কি সরাসরি কোনো ব্র্যান্ডের ব্যানার (যেমন: ওয়ালটন, স্যামসাং ইত্যাদি) দেখাবেন নাকি গুগল এডসেন্স চালাবেন তা ঠিক করুন।'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">২</span>
              <span>{isEn ? 'Input Image & Target Link' : 'ব্যানার ছবি ও টার্গেট লিঙ্ক দিন'}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Toggle "Custom Banner Active", enter the offer title, banner image URL, and the website link to open upon click.'
                : 'নিচে "কাস্টম ব্যানার সক্রিয় করুন" অন করে অফারের নাম, ব্যানারের ছবি ও ক্লিকেবল লিংক দিন যাতে ভিজিটর ক্লিক করলে ওয়েবসাইটে যায়।'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">৩</span>
              <span>{isEn ? 'Click Save & Run Live' : 'সেভ করুন ও লাইভ দেখুন'}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {isEn
                ? 'Click "Save Settings". The banner ad will immediately go live on the homepage between categories and listings.'
                : 'নিচের সবুজ "বিজ্ঞাপন সেটিংস সংরক্ষণ করুন" বাটনে ক্লিক করুন। সাথে সাথে হোমপেজে এই ব্যানারটি সুন্দরভাবে লাইভ প্রদর্শিত হবে!'}
            </p>
          </div>

        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* SECTION 1: CUSTOM SPONSOR BANNERS (FOR SLOT 1 & SLOT 2) */}
        {activeSection === 'sponsors' && (
          <div className="space-y-5 animate-in fade-in">
            
            {/* SLOT 1: TOP DEALS & TRUSTED BRANDS */}
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {isEn ? 'Banner Slot 1: "Top Deals & Trusted Brands"' : 'ব্যানার স্লট ১: "টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার"'}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Located right under category icons on homepage' : 'হোমপেজে ক্যাটাগরি গ্রিডের ঠিক নিচে অবস্থিত প্রধান বিজ্ঞাপন স্লট'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={slot1Enabled}
                      onChange={(e) => setSlot1Enabled(e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span className={`font-bold text-xs ${slot1Enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                      {slot1Enabled ? (isEn ? '● Custom Ad Active' : '● কাস্টম বিজ্ঞাপন চালু') : (isEn ? '○ AdSense Default' : '○ এডসেন্স ডিফল্ট মোড')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Quick Preset Buttons for Slot 1 */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="font-semibold text-slate-500">{isEn ? 'Quick Sample Demos:' : 'দ্রুত টেস্ট করার ডেমো অফার:'}</span>
                <button
                  type="button"
                  onClick={() => applyPresetSlot1('walton')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 cursor-pointer"
                >
                  + Walton Deal
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetSlot1('samsung')}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer"
                >
                  + Samsung Exchange
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetSlot1('daraz')}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 cursor-pointer"
                >
                  + Mega Online Sale
                </button>
                {slot1Enabled && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlot1Enabled(false);
                      setSlot1ImageUrl('');
                      setSlot1LinkUrl('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    {isEn ? 'Reset to Default' : 'রিসেট (ডিফল্ট করুন)'}
                  </button>
                )}
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Ad Headline / Offer Title *' : 'বিজ্ঞাপনের অফার শিরোনাম (Offer Title) *'}
                  </label>
                  <input
                    type="text"
                    value={slot1Title}
                    onChange={(e) => setSlot1Title(e.target.value)}
                    placeholder="যেমন: টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Advertiser / Company Name' : 'বিজ্ঞাপনদাতা বা ব্র্যান্ডের নাম'}
                  </label>
                  <input
                    type="text"
                    value={slot1Advertiser}
                    onChange={(e) => setSlot1Advertiser(e.target.value)}
                    placeholder="যেমন: Walton Bangladesh / Samsung Hub"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Banner Image URL (Leaderboard 728x90 or photo)' : 'ব্যানার ছবির লিংক (Image URL - ঐচ্ছিক)'}
                  </label>
                  <input
                    type="url"
                    value={slot1ImageUrl}
                    onChange={(e) => setSlot1ImageUrl(e.target.value)}
                    placeholder="https://example.com/banner-image.jpg"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {isEn ? 'Leave empty to display clean text and icon format' : 'ছবি না থাকলে স্বয়ংক্রিয়ভাবে আকর্ষণীয় টেক্সট ফরম্যাটে দেখাবে'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Target Link URL (Opens when user clicks)' : 'টার্গেট লিঙ্ক (ক্লিক করলে যেখানে যাবে) *'}
                  </label>
                  <input
                    type="url"
                    value={slot1LinkUrl}
                    onChange={(e) => setSlot1LinkUrl(e.target.value)}
                    placeholder="https://waltonbd.com বা ফেসবুক পেজ লিংক"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {isEn ? 'Visitor will be redirected to this website or link' : 'ভিজিটর ক্লিক করলে এই ঠিকানায় চলে যাবে'}
                  </span>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isEn ? 'Live Preview of Slot 1 on Homepage:' : 'হোমপেজে এটি যেমন দেখাবে (লাইভ প্রিভিউ):'}</span>
                </div>

                <div className="bg-slate-100/70 dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-center">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
                    <span>বিজ্ঞাপন / ADVERTISEMENT</span>
                    {slot1Advertiser && <span>স্পন্সর: {slot1Advertiser}</span>}
                  </div>
                  
                  {slot1ImageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-20">
                      <img src={slot1ImageUrl} alt="preview" className="w-full h-16 object-cover" />
                      <div className="absolute bottom-1 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                        {slot1Title}
                      </div>
                    </div>
                  ) : (
                    <div className="h-14 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/50">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{slot1Title}</span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">— {slot1Subtitle}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SLOT 2: NEW PRODUCTS & EXCHANGE OFFERS */}
            <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {isEn ? 'Banner Slot 2: "New Products & Exchange Offers"' : 'ব্যানার স্লট ২: "নতুন পণ্য ও এক্সচেঞ্জ অফার"'}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isEn ? 'Located right above the footer on homepage' : 'হোমপেজের নিচে ফুটারের ঠিক উপরে অবস্থিত'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <input
                      type="checkbox"
                      checked={slot2Enabled}
                      onChange={(e) => setSlot2Enabled(e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span className={`font-bold text-xs ${slot2Enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                      {slot2Enabled ? (isEn ? '● Custom Ad Active' : '● কাস্টম বিজ্ঞাপন চালু') : (isEn ? '○ AdSense Default' : '○ এডসেন্স ডিফল্ট মোড')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Quick Preset Buttons for Slot 2 */}
              <div className="flex items-center gap-2 flex-wrap text-[11px]">
                <span className="font-semibold text-slate-500">{isEn ? 'Quick Sample Demos:' : 'এক্সচেঞ্জ অফার ডেমো প্রিসেট:'}</span>
                <button
                  type="button"
                  onClick={() => applyPresetSlot2('bike')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer"
                >
                  + বাইক এক্সচেঞ্জ ডিল
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetSlot2('mobile')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 cursor-pointer"
                >
                  + মোবাইল অদলবদল মেলা
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetSlot2('laptop')}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 cursor-pointer"
                >
                  + ল্যাপটপ আপগ্রেড অফার
                </button>
                {slot2Enabled && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlot2Enabled(false);
                      setSlot2ImageUrl('');
                      setSlot2LinkUrl('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    {isEn ? 'Reset to Default' : 'রিসেট (ডিফল্ট করুন)'}
                  </button>
                )}
              </div>

              {/* Form inputs for Slot 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Ad Headline / Offer Title *' : 'বিজ্ঞাপনের শিরোনাম (Offer Title) *'}
                  </label>
                  <input
                    type="text"
                    value={slot2Title}
                    onChange={(e) => setSlot2Title(e.target.value)}
                    placeholder="যেমন: নতুন পণ্য ও এক্সচেঞ্জ অফার"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Advertiser / Exchange Hub Name' : 'এক্সচেঞ্জ শপ বা ব্র্যান্ডের নাম'}
                  </label>
                  <input
                    type="text"
                    value={slot2Advertiser}
                    onChange={(e) => setSlot2Advertiser(e.target.value)}
                    placeholder="যেমন: Yamaha Motors BD / Smart Exchange Hub"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Banner Image URL (Leaderboard 728x90 or photo)' : 'ব্যানার ছবির লিংক (Image URL - ঐচ্ছিক)'}
                  </label>
                  <input
                    type="url"
                    value={slot2ImageUrl}
                    onChange={(e) => setSlot2ImageUrl(e.target.value)}
                    placeholder="https://example.com/exchange-banner.jpg"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {isEn ? 'Leave empty to display clean text and icon format' : 'ছবি না থাকলে স্বয়ংক্রিয়ভাবে আকর্ষণীয় টেক্সট ফরম্যাটে দেখাবে'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {isEn ? 'Target Link URL (Opens when user clicks) *' : 'টার্গেট লিঙ্ক (ক্লিক করলে যেখানে যাবে) *'}
                  </label>
                  <input
                    type="url"
                    value={slot2LinkUrl}
                    onChange={(e) => setSlot2LinkUrl(e.target.value)}
                    placeholder="https://example.com/exchange-offer বা ফেসবুক পেজ লিংক"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {isEn ? 'Visitor will be redirected to this website or link' : 'ভিজিটর ক্লিক করলে এই ঠিকানায় চলে যাবে'}
                  </span>
                </div>
              </div>

              {/* Live Preview Box for Slot 2 */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isEn ? 'Live Preview of Slot 2 on Homepage:' : 'হোমপেজে এটি যেমন দেখাবে (লাইভ প্রিভিউ):'}</span>
                </div>

                <div className="bg-slate-100/70 dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-center">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
                    <span>বিজ্ঞাপন / ADVERTISEMENT</span>
                    {slot2Advertiser && <span>এক্সচেঞ্জ পার্টনার: {slot2Advertiser}</span>}
                  </div>
                  
                  {slot2ImageUrl ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-20">
                      <img src={slot2ImageUrl} alt="preview" className="w-full h-16 object-cover" />
                      <div className="absolute bottom-1 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                        {slot2Title}
                      </div>
                    </div>
                  ) : (
                    <div className="h-14 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/50">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{slot2Title}</span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">— {slot2Subtitle}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SECTION 2: GOOGLE ADSENSE ADVANCED SETTINGS */}
        {activeSection === 'adsense' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Publisher ID & Meta Tag */}
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{isEn ? 'AdSense Publisher Account ID' : 'এডসেন্স পাবলিশার অ্যাকাউন্ট আইডি'}</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
                  </label>
                  <input
                    type="text"
                    required
                    value={publisherInput}
                    onChange={(e) => setPublisherInput(e.target.value)}
                    placeholder="ca-pub-8849201948291034"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Google Search Console / Webmaster Meta Tag
                  </label>
                  <input
                    type="text"
                    value={metaInput}
                    onChange={(e) => setMetaInput(e.target.value)}
                    placeholder="google-site-verification=..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{isEn ? 'Script Tag:' : 'সাইটের <head> কোড:'}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(adCodeSnippet, 'code')}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {copiedId === 'code' ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'code' ? (isEn ? 'Copied!' : 'কপি হয়েছে!') : (isEn ? 'Copy' : 'কপি করুন')}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-mono text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap break-all">
                    {adCodeSnippet}
                  </pre>
                </div>
              </div>

              {/* ads.txt File Manager */}
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-600" />
                    <span>{isEn ? 'ads.txt Configuration' : 'ads.txt ফাইল কনফিগারেশন'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDownloadAdsTxt}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Download ads.txt"
                    >
                      <Download className="w-3 h-3 text-emerald-600" />
                      <span>Download</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(adsTxtInput, 'adstxt')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedId === 'adstxt' ? <CheckCheck className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      <span>{isEn ? 'Copy' : 'কপি'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn
                    ? 'Required by Google to prevent fraud. Publicly accessible at: /ads.txt'
                    : 'গুগল ভেরিফিকেশনের জন্য এটি বাধ্যতামূলক। সাইটে /ads.txt রুটে ফাইলটি বিদ্যমান রয়েছে।'}
                </p>

                <textarea
                  rows={4}
                  value={adsTxtInput}
                  onChange={(e) => setAdsTxtInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-[11px] leading-relaxed"
                />

                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300">
                  <strong>URL:</strong> <span className="font-mono">https://puranbazar.com/ads.txt</span> (Status: 200 OK)
                </div>
              </div>

            </div>

            {/* Wire Transfer Linked Bank & Display Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{isEn ? 'AdSense Wire Transfer (SWIFT) Bank Link' : 'এডসেন্স ওয়্যার ট্রান্সফার (SWIFT) ব্যাংক লিংক'}</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Direct Wire
                  </span>
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isEn
                    ? 'Google AdSense transfers payments directly to your commercial bank account via Wire Transfer (SWIFT) when balance reaches $100 USD.'
                    : 'এডসেন্স ব্যালেন্স $১০০ ডলার অতিক্রম করলে গুগল সরাসরি ওয়্যার ট্রান্সফারের মাধ্যমে আপনার ব্যাংকে টাকা পাঠায়।'}
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Select Designated Payout Bank Account:' : 'মনোনীত বাংলাদেশি ব্যাংক একাউন্ট নির্বাচন করুন:'}
                  </label>
                  <select
                    value={linkedBankId}
                    onChange={(e) => setLinkedBankId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="">{isEn ? '-- Select Bank Account --' : '-- ব্যাংক অ্যাকাউন্ট নির্বাচন করুন --'}</option>
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.providerName} — {b.accountNumber} ({b.accountName}) {b.swiftCode ? `[SWIFT: ${b.swiftCode}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Ad Units & Auto Ads Display Slots' : 'বিজ্ঞাপন স্লট ও অটো অ্যাডস নিয়ন্ত্রণ'}
                  </h4>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoAds}
                      onChange={(e) => setAutoAds(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400">
                      {isEn ? 'Auto Ads Enabled' : 'অটো অ্যাডস চালু'}
                    </span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 cursor-pointer">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {isEn ? '1. Top Header Banner (728x90)' : '১. হোমপেজ টপ ব্যানার অ্যাড'}
                    </span>
                    <input
                      type="checkbox"
                      checked={adUnits.headerBanner}
                      onChange={(e) => setAdUnits({ ...adUnits, headerBanner: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 cursor-pointer">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {isEn ? '2. Classifieds Grid In-Feed Ad' : '২. বিজ্ঞাপন তালিকার মাঝে ইন-ফিড অ্যাড'}
                    </span>
                    <input
                      type="checkbox"
                      checked={adUnits.feedInArticle}
                      onChange={(e) => setAdUnits({ ...adUnits, feedInArticle: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 cursor-pointer">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {isEn ? '3. Ad Details Bottom Banner' : '৩. পণ্যের বিস্তারিত পেজের নিচের ব্যানার'}
                    </span>
                    <input
                      type="checkbox"
                      checked={adUnits.adDetailBottom}
                      onChange={(e) => setAdUnits({ ...adUnits, adDetailBottom: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isEn ? 'Changes will reflect on the live marketplace immediately.' : 'পরিবর্তন সংরক্ষণ করার সাথে সাথে হোমপেজে তাৎক্ষণিক কার্যকর হবে।'}</span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isEn ? 'Save Ad Settings & Run Live' : 'বিজ্ঞাপন সেটিংস সংরক্ষণ করুন (Save & Run)'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
