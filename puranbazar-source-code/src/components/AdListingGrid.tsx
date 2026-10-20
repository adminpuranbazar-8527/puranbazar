import React, { useState } from 'react';
import { 
  Filter, SlidersHorizontal, MapPin, Eye, X, ArrowUpDown, 
  ShieldCheck
} from 'lucide-react';
import { Ad, Condition } from '../types';
import { CATEGORIES, CONDITION_LABELS } from '../data/categories';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { Language, TRANSLATIONS, formatPrice, formatNumber } from '../utils/i18n';

interface AdListingGridProps {
  ads: Ad[];
  searchTerm: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  selectedCondition: Condition | '';
  minPrice: string;
  maxPrice: string;
  sortBy: 'newest' | 'price_low' | 'price_high' | 'views';
  onSearchChange: (val: string) => void;
  onCategoryChange: (cat: string) => void;
  onSubcategoryChange: (subcat: string) => void;
  onDivisionChange: (div: string) => void;
  onDistrictChange: (dist: string) => void;
  onUpazilaChange: (upz: string) => void;
  onConditionChange: (cond: Condition | '') => void;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onSortByChange: (sort: 'newest' | 'price_low' | 'price_high' | 'views') => void;
  onResetFilters: () => void;
  onSelectAd: (ad: Ad) => void;
  language?: Language;
}

export const AdListingGrid: React.FC<AdListingGridProps> = ({
  ads,
  searchTerm,
  selectedCategory,
  selectedSubcategory,
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  selectedCondition,
  minPrice,
  maxPrice,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSubcategoryChange,
  onDivisionChange,
  onDistrictChange,
  onUpazilaChange,
  onConditionChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortByChange,
  onResetFilters,
  onSelectAd,
  language = 'bn'
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const t = TRANSLATIONS[language];

  // Available districts based on division
  const activeDivisionObj = BANGLADESH_LOCATIONS.find((d) => d.name === selectedDivision);
  const activeDistrictObj = activeDivisionObj?.districts.find((d) => d.name === selectedDistrict);
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  const conditionTranslations: Record<string, string> = {
    like_new: t.condLikeNew,
    good: t.condGood,
    fair: t.condFair,
    refurbished: t.condRefurbished
  };

  // Filter ads
  const filteredAds = ads.filter((ad) => {
    if (ad.status !== 'approved') return false;

    // Search term matching
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = ad.title.toLowerCase().includes(q);
      const matchDesc = ad.description.toLowerCase().includes(q);
      const matchSub = ad.subcategory.toLowerCase().includes(q);
      const matchDist = ad.district.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub && !matchDist) return false;
    }

    // Category
    if (selectedCategory && ad.category_id !== selectedCategory) return false;

    // Subcategory
    if (selectedSubcategory && ad.subcategory !== selectedSubcategory) return false;

    // Location
    if (selectedDivision && !ad.division.includes(selectedDivision.split(' ')[0])) return false;
    if (selectedDistrict && !ad.district.includes(selectedDistrict.split(' ')[0])) return false;
    if (selectedUpazila && !ad.upazila.includes(selectedUpazila.split(' ')[0])) return false;

    // Condition
    if (selectedCondition && ad.condition !== selectedCondition) return false;

    // Price range
    const min = minPrice ? parseInt(minPrice, 10) : 0;
    const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
    if (ad.price < min || ad.price > max) return false;

    return true;
  });

  // Sort ads
  const sortedAds = [...filteredAds].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'views') return b.views - a.views;
    // newest default
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const activeFiltersCount = [
    selectedCategory,
    selectedSubcategory,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedCondition,
    minPrice,
    maxPrice
  ].filter(Boolean).length;

  return (
    <section id="ads-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {selectedCategory
              ? `${language === 'bn' ? activeCategoryObj?.name : activeCategoryObj?.englishName} ${language === 'bn' ? 'বিজ্ঞাপন' : 'Ads'}`
              : (language === 'bn' ? 'নতুন ও সকল বিজ্ঞাপন' : 'All Recent Ads')}
          </h2>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            <span>
              {language === 'bn'
                ? `মোট ${formatNumber(sortedAds.length, language)} টি পণ্য পাওয়া গেছে`
                : `Total ${formatNumber(sortedAds.length, language)} items found`}
            </span>
            {selectedDistrict && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">{selectedDistrict}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.filtersTitle} ({formatNumber(activeFiltersCount, language)})</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="newest" className="dark:bg-slate-900">{t.sortNewest}</option>
              <option value="price_low" className="dark:bg-slate-900">{t.sortPriceLow}</option>
              <option value="price_high" className="dark:bg-slate-900">{t.sortPriceHigh}</option>
              <option value="views" className="dark:bg-slate-900">{t.sortPopular}</option>
            </select>
          </div>
        </div>
      </div>



      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t.filtersTitle}</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={onResetFilters}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                {t.resetFilters}
              </button>
            )}
          </div>

          {/* Location Hierarchical Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              📍 {t.filterByLocation}
            </label>
            <div className="space-y-2">
              {/* Division */}
              <select
                value={selectedDivision}
                onChange={(e) => {
                  onDivisionChange(e.target.value);
                  onDistrictChange('');
                  onUpazilaChange('');
                }}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="" className="dark:bg-slate-800">{t.allDivisions}</option>
                {BANGLADESH_LOCATIONS.map((div) => (
                  <option key={div.name} value={div.name} className="dark:bg-slate-800">
                    {div.name}
                  </option>
                ))}
              </select>

              {/* District */}
              {selectedDivision && activeDivisionObj && (
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    onDistrictChange(e.target.value);
                    onUpazilaChange('');
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="" className="dark:bg-slate-800">{t.allDistrictsOption}</option>
                  {activeDivisionObj.districts.map((d) => (
                    <option key={d.name} value={d.name} className="dark:bg-slate-800">
                      {d.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Upazila */}
              {selectedDistrict && activeDistrictObj && (
                <select
                  value={selectedUpazila}
                  onChange={(e) => onUpazilaChange(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="" className="dark:bg-slate-800">{t.allUpazilas}</option>
                  {activeDistrictObj.upazilas.map((u) => (
                    <option key={u} value={u} className="dark:bg-slate-800">
                      {u}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {t.condition}
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onConditionChange('')}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors font-medium cursor-pointer ${
                  selectedCondition === ''
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {t.allConditions}
              </button>
              {(Object.keys(CONDITION_LABELS) as Condition[]).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => onConditionChange(cond === selectedCondition ? '' : cond)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors font-medium cursor-pointer ${
                    selectedCondition === cond
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {conditionTranslations[cond] || CONDITION_LABELS[cond]}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              {t.priceRange}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={t.minPrice}
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <input
                type="number"
                placeholder={t.maxPrice}
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        </aside>

        {/* Ads Cards Listing */}
        <main className="lg:col-span-3">
          {sortedAds.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                🔍
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {t.noAdsFound}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {t.noAdsSubtitle}
              </p>
              <button
                onClick={onResetFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedAds.map((ad) => (
                <article
                  key={ad.id}
                  onClick={() => onSelectAd(ad)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* 4:3 Image */}
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={ad.images[0]}
                        alt={ad.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badges on Image */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {ad.featured_tier !== 'none' && (
                          <div className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                            {t.featuredBadge}
                          </div>
                        )}
                      </div>

                      {ad.seller_verified && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1 z-10">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{t.verifiedSeller}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata text */}
                    <div className="p-3.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{ad.subcategory}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {conditionTranslations[ad.condition] || CONDITION_LABELS[ad.condition]}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mt-1.5 line-clamp-2 leading-snug">
                        {ad.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ad.upazila ? `${ad.upazila}, ` : ''}{ad.district}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Date Bottom Bar */}
                  <div className="p-3.5 pt-0 mt-auto">
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          {ad.originalPrice && ad.originalPrice > ad.price && (
                            <span className="text-xs text-slate-400 line-through tabular-nums">
                              {formatPrice(ad.originalPrice, language)}
                            </span>
                          )}
                          <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {formatPrice(ad.price, language)}
                          </span>
                        </div>
                        {ad.negotiable && (
                          <span className="text-[10px] text-slate-400">{t.negotiableText}</span>
                        )}
                      </div>

                      <div className="text-right text-[11px] text-slate-400 dark:text-slate-500">
                        <div>{ad.created_at}</div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto space-y-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">{t.filtersTitle}</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Location Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                📍 {t.filterByLocation}
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => {
                  onDivisionChange(e.target.value);
                  onDistrictChange('');
                }}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mb-2"
              >
                <option value="">{t.allDivisions}</option>
                {BANGLADESH_LOCATIONS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              {selectedDivision && activeDivisionObj && (
                <select
                  value={selectedDistrict}
                  onChange={(e) => onDistrictChange(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  <option value="">{t.allDistrictsOption}</option>
                  {activeDivisionObj.districts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Mobile Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                {t.condition}
              </label>
              <div className="space-y-1">
                {(Object.keys(CONDITION_LABELS) as Condition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => onConditionChange(cond === selectedCondition ? '' : cond)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors font-medium cursor-pointer ${
                      selectedCondition === cond
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {conditionTranslations[cond] || CONDITION_LABELS[cond]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              {language === 'bn' ? `ফলাফল দেখুন (${formatNumber(sortedAds.length, language)})` : `View Results (${formatNumber(sortedAds.length, language)})`}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
