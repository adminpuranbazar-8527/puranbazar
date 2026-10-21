import React from 'react';
import { Sparkles, MapPin, Eye, ShieldCheck, ArrowRight } from 'lucide-react';
import { Ad } from '../types';
import { CONDITION_LABELS } from '../data/categories';
import { Language, TRANSLATIONS, formatPrice, formatNumber } from '../utils/i18n';
import { handleImageError, getAdImageWithFallback } from '../utils/imageFallback';

interface FeaturedAdsSectionProps {
  ads: Ad[];
  onSelectAd: (ad: Ad) => void;
  onViewAllFeatured: () => void;
  language?: Language;
}

export const FeaturedAdsSection: React.FC<FeaturedAdsSectionProps> = ({
  ads,
  onSelectAd,
  onViewAllFeatured,
  language = 'bn'
}) => {
  const t = TRANSLATIONS[language];

  const featuredAds = ads
    .filter((a) => a.status === 'approved' && a.featured_tier !== 'none')
    .slice(0, 4);

  if (featuredAds.length === 0) return null;

  const conditionTranslations: Record<string, string> = {
    like_new: language === 'bn' ? 'একদম নতুনের মতো' : 'Like New',
    good: language === 'bn' ? 'ভালো অবস্থা' : 'Good',
    fair: language === 'bn' ? 'চলনসই / ব্যবহৃত' : 'Fair',
    refurbished: language === 'bn' ? 'সার্ভিসড / রিফার্বিশড' : 'Refurbished'
  };

  return (
    <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {t.featuredTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.featuredSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllFeatured}
          className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 group cursor-pointer"
        >
          <span>{t.viewAll}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredAds.map((ad) => (
          <div
            key={ad.id}
            onClick={() => onSelectAd(ad)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all overflow-hidden flex flex-col"
          >
            {/* Image Container with 4:3 Aspect Ratio */}
            <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={getAdImageWithFallback(ad.images, ad.category_id)}
                alt={ad.title}
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, ad.category_id)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Feature Ribbon */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[11px] font-bold shadow-xs">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>{t.featuredBadge}</span>
              </div>

              {ad.seller_verified && (
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-semibold backdrop-blur-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{t.verifiedSeller}</span>
                </div>
              )}

              {/* View count overlay */}
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium flex items-center gap-1 backdrop-blur-xs">
                <Eye className="w-3 h-3" />
                <span className="tabular-nums">{formatNumber(ad.views, language)}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {ad.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ad.upazila ? `${ad.upazila}, ` : ''}{ad.district}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPrice(ad.price, language)}
                  </div>
                  {ad.negotiable && (
                    <span className="text-[10px] text-slate-400">{t.negotiableText}</span>
                  )}
                </div>

                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {conditionTranslations[ad.condition] || CONDITION_LABELS[ad.condition]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
