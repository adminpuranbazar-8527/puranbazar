import React, { useState } from 'react';
import { 
  X, MapPin, Phone, MessageSquare, AlertTriangle, ShieldCheck, 
  Calendar, Eye, CheckCircle2, ChevronRight, Copy, Check, ArrowLeft,
  Zap, Sparkles, Crown
} from 'lucide-react';
import { Ad, UserProfile } from '../types';
import { CONDITION_LABELS } from '../data/categories';
import { Language, formatPrice, formatNumber } from '../utils/i18n';
import { handleImageError, getAdImageWithFallback } from '../utils/imageFallback';

interface ProductDetailModalProps {
  ad: Ad | null;
  onClose: () => void;
  onOpenChat: (ad: Ad) => void;
  onOpenReport: (ad: Ad) => void;
  onSelectRelatedAd: (ad: Ad) => void;
  allAds: Ad[];
  currentUser?: UserProfile | null;
  onBoostAdClick?: (ad: Ad) => void;
  language?: Language;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  ad,
  onClose,
  onOpenChat,
  onOpenReport,
  onSelectRelatedAd,
  allAds,
  currentUser,
  onBoostAdClick,
  language = 'bn'
}) => {
  const [showPhone, setShowPhone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!ad) return null;

  const relatedAds = allAds
    .filter((a) => a.id !== ad.id && a.category_id === ad.category_id && a.status === 'approved')
    .slice(0, 3);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(ad.seller_phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 relative my-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Close Header on Mobile */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
            <span>হোম</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>{ad.subcategory}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate font-medium text-slate-800 dark:text-slate-200">{ad.title}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content: Split 2 columns on desktop */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Image Gallery & Description (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            
            {/* Primary Large Image */}
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={getAdImageWithFallback(ad.images, ad.category_id)}
                alt={ad.title}
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, ad.category_id)}
                className="w-full h-full object-cover"
              />
              {ad.featured_tier !== 'none' && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-500 text-white text-xs font-bold shadow-md">
                  ⭐ ফিচার্ড বিজ্ঞাপন
                </div>
              )}
            </div>

            {/* Thumbnails if multiple */}
            {ad.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {ad.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx ? 'border-emerald-600 scale-105' : 'border-slate-200 dark:border-slate-700 opacity-70'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">পণ্যের বিবরণ</h4>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-slate-50/70 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {ad.description}
              </p>
            </div>

            {/* Safety Notice Box */}
            <div className="p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-900 dark:text-amber-200 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>নিরাপদ লেনদেনের জন্য সতর্কতা:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300/90 text-xs pl-1">
                <li>পণ্য সরাসরি হাতে পাওয়ার আগে কোনো অগ্রিম টাকা বা কুরিয়ার চার্জ বিকাশ/নগদে পাঠাবেন না।</li>
                <li>নিরাপদ ও জনবহুল স্থানে (শপিং মল, থানা বা বাজারের কাছে) দেখা করে লেনদেন করুন।</li>
                <li>ইলেকট্রনিক্স ও দামি জিনিসপত্র নেওয়ার আগে ভালোভাবে চালিয়ে পরীক্ষা করে নিন।</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Title, Price, Seller Card, CTA Actions (5 cols) */}
          <div className="md:col-span-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>{ad.subcategory}</span>
                <span aria-hidden="true">·</span>
                <span>{CONDITION_LABELS[ad.condition]}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {ad.title}
              </h2>

              {/* Location and Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {ad.upazila ? `${ad.upazila}, ` : ''}{ad.district} ({ad.division})
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>পোস্ট করা হয়েছে: {ad.created_at}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{formatNumber(ad.views, language)} {language === 'bn' ? 'ভিউ' : 'views'}</span>
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {language === 'bn' ? 'নির্ধারিত মূল্য' : 'Asking Price'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
                {formatPrice(ad.price, language)}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {ad.negotiable 
                    ? (language === 'bn' ? 'দাম আলোচনা সাপেক্ষে দেওয়া যাবে' : 'Price negotiable with seller') 
                    : (language === 'bn' ? 'ফিক্সড রেট (একদাম)' : 'Fixed Price')}
                </span>
              </div>
            </div>

            {/* Seller Info Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                বিক্রেতার তথ্য
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {ad.seller_name ? ad.seller_name[0] : 'ব'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      <span>{ad.seller_name}</span>
                      {ad.seller_verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded font-semibold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          ভেরিফাইড
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      সদস্য হয়েছেন: {ad.seller_joined}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Promotion & Boost Callout */}
            {currentUser && onBoostAdClick && (currentUser.id === ad.seller_id || currentUser.phone === ad.seller_phone) && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-emerald-500/15 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">আপনার এই বিজ্ঞাপনটি বুস্ট করুন</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    স্ট্যাটাস: <strong className="text-emerald-700 dark:text-emerald-400 uppercase">{ad.featured_tier === 'none' ? 'ফ্রি' : ad.featured_tier}</strong> • বিকাশ/নগদে মুহূর্তেই ৩-১০ গুণ বেশি ক্রেতা পান
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBoostAdClick(ad);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 hover:opacity-90 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>বুস্ট করুন</span>
                </button>
              </div>
            )}

            {/* Interactive Contact Actions */}
            <div className="space-y-2.5">
              
              {/* Call Seller Button */}
              {showPhone ? (
                <div className="p-3 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl flex items-center justify-between shadow-sm">
                  <a 
                    href={`tel:${ad.seller_phone}`}
                    className="flex items-center gap-2 font-bold text-base hover:underline"
                  >
                    <Phone className="w-5 h-5 fill-white" />
                    <span>{ad.seller_phone}</span>
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="px-2.5 py-1 bg-emerald-700 dark:bg-emerald-800 hover:bg-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি করুন' : 'Copy')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPhone(true)}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 dark:shadow-none cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  <span>{language === 'bn' ? 'ফোন নাম্বার দেখুন (Call Seller)' : 'Show Phone Number (Call Seller)'}</span>
                </button>
              )}

              {/* Message / Chat Button */}
              <button
                onClick={() => onOpenChat(ad)}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'bn' ? 'বিক্রেতাকে মেসেজ দিন (Chat Seller)' : 'Chat with Seller (Message)'}</span>
              </button>

              {/* Report Ad Button */}
              <button
                onClick={() => onOpenReport(ad)}
                className="w-full py-2 px-3 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'এই বিজ্ঞাপনটির বিরুদ্ধে অভিযোগ জানান (Report Ad)' : 'Report This Advertisement'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Related Ads Section */}
        {relatedAds.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 rounded-b-2xl">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">একই ক্যাটাগরির অন্যান্য বিজ্ঞাপন</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedAds.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectRelatedAd(item);
                    setSelectedImageIndex(0);
                    setShowPhone(false);
                  }}
                  className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition-all flex gap-3 items-center group"
                >
                  <img
                    src={getAdImageWithFallback(item.images, item.category_id)}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, item.category_id)}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                      {item.title}
                    </h5>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
                      ৳{item.price.toLocaleString('bn-BD')}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {item.district}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
