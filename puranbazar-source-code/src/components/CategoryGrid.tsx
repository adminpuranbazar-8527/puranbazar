import React from 'react';
import { Smartphone, Laptop, Tv, Bike, Armchair, Shirt, Wrench } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { Ad } from '../types';
import { Language, TRANSLATIONS, formatNumber } from '../utils/i18n';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedSubcategory: string;
  onSelectSubcategory: (subcat: string) => void;
  ads: Ad[];
  language?: Language;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  ads,
  language = 'bn'
}) => {
  const t = TRANSLATIONS[language];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'Tv':
        return <Tv className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Bike':
        return <Bike className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'Armchair':
        return <Armchair className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'Wrench':
      default:
        return <Wrench className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
    }
  };

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.popularCategoriesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.popularCategoriesSubtitle}
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => {
              onSelectCategory('');
              onSelectSubcategory('');
            }}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {t.viewAllCategories}
          </button>
        )}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = ads.filter((a) => a.category_id === cat.id && a.status === 'approved').length;
          const categoryDisplayName = language === 'bn' ? cat.name : (cat.englishName || cat.name);

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (isSelected) {
                  onSelectCategory('');
                  onSelectSubcategory('');
                } else {
                  onSelectCategory(cat.id);
                  onSelectSubcategory('');
                }
              }}
              className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                isSelected ? 'bg-white dark:bg-slate-800 shadow-xs' : 'bg-slate-50 dark:bg-slate-800'
              }`}>
                {getIcon(cat.icon)}
              </div>
              <div className="w-full">
                <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {categoryDisplayName}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">
                  {formatNumber(count, language)} {t.adsCountSuffix}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Subcategories selector if category is active */}
      {currentCategoryObj && (
        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
            {language === 'bn' ? currentCategoryObj.name : currentCategoryObj.englishName} {language === 'bn' ? 'সাব-ক্যাটাগরি:' : 'Subcategories:'}
          </span>
          <button
            onClick={() => onSelectSubcategory('')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium cursor-pointer ${
              selectedSubcategory === ''
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {language === 'bn' ? 'সব' : 'All'}
          </button>
          {currentCategoryObj.subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => onSelectSubcategory(sub)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium cursor-pointer ${
                selectedSubcategory === sub
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
