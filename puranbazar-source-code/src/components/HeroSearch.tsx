import React, { useState } from 'react';
import { Search, MapPin, Sparkles, PlusCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface HeroSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDistrict: string;
  onDistrictSelect: (district: string) => void;
  onPostAdClick: () => void;
  onSearchSubmit: () => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
  language?: Language;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchTerm,
  onSearchChange,
  selectedDistrict,
  onDistrictSelect,
  onPostAdClick,
  onSearchSubmit,
  searchRef,
  language = 'bn'
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const t = TRANSLATIONS[language];

  const popularSearches = language === 'bn' 
    ? ['iPhone 13', 'ল্যাপটপ', 'Yamaha FZ', 'সোফা সেট', 'স্মার্ট টিভি', 'ফ্রিজ']
    : ['iPhone 13', 'Laptop', 'Yamaha FZ', 'Sofa Set', 'Smart TV', 'Fridge'];

  return (
    <section className="relative bg-gradient-to-b from-emerald-800 to-emerald-900 dark:from-emerald-950 dark:to-slate-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-200">
      {/* Decorative background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-700/20 dark:bg-emerald-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        
        {/* Tagline */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 dark:bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-medium mb-3 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>বাংলাদেশের সবচেয়ে সহজ ও নির্ভরযোগ্য কেনাবেচার মার্কেটপ্লেস</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 text-balance leading-tight">
          {t.heroTitlePrefix}<span className="text-amber-400">{t.heroTitleHighlight}</span>
        </h1>
        <p className="text-sm sm:text-base text-emerald-100/90 dark:text-emerald-200/80 max-w-2xl mx-auto mb-6">
          {t.heroSubtitle}
        </p>

        {/* Search Bar Container */}
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-emerald-950/20 dark:border-slate-800 max-w-3xl mx-auto text-slate-800 dark:text-slate-100 transition-colors">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="flex flex-col sm:flex-row items-stretch gap-2"
          >
            {/* Location selector dropdown button */}
            <div className="relative shrink-0 sm:w-56">
              <button
                type="button"
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="w-full flex items-center justify-between px-3.5 py-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">{selectedDistrict || 'জেলা নির্বাচন করুন'}</span>
                </div>
                <span className="text-[10px] text-slate-400 ml-1">▼</span>
              </button>

              {/* Location Popup Menu */}
              {showLocationMenu && (
                <div className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-left">
                  <div className="flex items-center justify-between p-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">লোকেশন ফিল্টার</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDistrictSelect('');
                        setShowLocationMenu(false);
                      }}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      সারা বাংলাদেশ
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
                    {BANGLADESH_LOCATIONS.map((div) => (
                      <div key={div.name} className="py-1.5">
                        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2 py-0.5 uppercase tracking-wide">
                          {div.name}
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          {div.districts.map((dist) => (
                            <button
                              key={dist.name}
                              type="button"
                              onClick={() => {
                                onDistrictSelect(dist.name);
                                setShowLocationMenu(false);
                              }}
                              className={`px-2 py-1.5 text-xs text-left rounded-lg truncate transition-colors cursor-pointer ${
                                selectedDistrict === dist.name
                                  ? 'bg-emerald-600 text-white font-medium'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              {dist.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Keyword Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-3 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Search Submit CTA */}
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{t.searchButton}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Popular Searches */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-xs">
          <span className="text-emerald-200/80 dark:text-emerald-300/70">{t.popularSearches}</span>
          {popularSearches.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                onSearchChange(keyword);
                onSearchSubmit();
              }}
              className="px-2.5 py-1 bg-emerald-800/80 dark:bg-slate-800/80 hover:bg-emerald-700/80 dark:hover:bg-slate-700/80 text-emerald-100 dark:text-slate-200 rounded-lg border border-emerald-700 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {keyword}
            </button>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 max-w-xl mx-auto mt-6 pt-6 border-t border-emerald-800/60 dark:border-slate-800 text-xs sm:text-sm text-emerald-100 dark:text-slate-300">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>সরাসরি কল ও চ্যাট</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>অ্যাডমিন ভেরিফাইড</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>০% হিডেন চার্জ</span>
          </div>
        </div>

      </div>
    </section>
  );
};
