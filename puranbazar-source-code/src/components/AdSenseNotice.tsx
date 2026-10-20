import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { CustomSponsorBanner } from '../types';

interface AdSenseNoticeProps {
  slotTitle?: string;
  format?: 'banner' | 'leaderboard';
  sponsorBanner?: CustomSponsorBanner;
}

export const AdSenseNotice: React.FC<AdSenseNoticeProps> = ({
  slotTitle = 'টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার',
  format = 'banner',
  sponsorBanner,
}) => {
  // If Admin has enabled and configured a custom sponsor banner
  if (sponsorBanner && sponsorBanner.enabled && (sponsorBanner.bannerImageUrl || sponsorBanner.targetLinkUrl)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="bg-slate-100/70 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-3 text-center transition-colors">
          {/* Policy compliant clear label */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase mb-1 px-1">
            <div className="flex items-center gap-1.5">
              <Info className="w-3 h-3" />
              <span>বিজ্ঞাপন / ADVERTISEMENT</span>
            </div>
            {sponsorBanner.advertiserName && (
              <span className="font-normal text-slate-400">স্পন্সর: {sponsorBanner.advertiserName}</span>
            )}
          </div>

          <a
            href={sponsorBanner.targetLinkUrl || '#'}
            target={sponsorBanner.targetLinkUrl ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg border border-slate-200/60 dark:border-slate-700/60 hover:opacity-95 transition-all group"
          >
            {sponsorBanner.bannerImageUrl ? (
              <div className="relative">
                <img
                  src={sponsorBanner.bannerImageUrl}
                  alt={sponsorBanner.title}
                  className="w-full max-h-24 sm:max-h-28 object-cover object-center"
                />
                <div className="absolute bottom-1 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                  {sponsorBanner.title}
                </div>
              </div>
            ) : (
              <div className="h-16 sm:h-20 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {sponsorBanner.title}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                    — {sponsorBanner.subtitle || 'অফারটি দেখতে ক্লিক করুন'}
                  </span>
                </div>
              </div>
            )}
          </a>
        </div>
      </div>
    );
  }

  // Exact original design (as shown in user's screenshot)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="bg-slate-100/70 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-3 text-center transition-colors">
        {/* Policy compliant clear label */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase mb-1">
          <Info className="w-3 h-3" />
          <span>বিজ্ঞাপন / ADVERTISEMENT</span>
        </div>

        <div className="h-16 sm:h-20 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {slotTitle}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
              — গুগল অ্যাডসেন্স নীতিমালা অনুযায়ী স্পষ্ট লেবেলযুক্ত স্লট
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
