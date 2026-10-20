import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { BUYING_GUIDES } from '../data/buyingGuides';
import { BuyingGuide } from '../types';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface BuyingGuidesSectionProps {
  language?: Language;
}

export const BuyingGuidesSection: React.FC<BuyingGuidesSectionProps> = ({ language = 'bn' }) => {
  const [activeGuide, setActiveGuide] = useState<BuyingGuide | null>(null);
  const t = TRANSLATIONS[language];

  return (
    <section id="guides" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{language === 'bn' ? 'দরকারি তথ্য ও গাইডলাইন (Buying Guides)' : 'Useful Guides & Buying Tips'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.buyingGuidesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.buyingGuidesSubtitle}
          </p>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BUYING_GUIDES.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setActiveGuide(guide)}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{guide.category}</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{guide.read_time}</span>
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                {guide.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {guide.summary}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
              <span>{language === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read Full Guide'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setActiveGuide(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              <span>{activeGuide.category}</span>
              <span>•</span>
              <span>{activeGuide.read_time}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
              {activeGuide.title}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {activeGuide.content.map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveGuide(null)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
