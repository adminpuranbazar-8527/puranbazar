import React from 'react';
import { PlusCircle, ShieldCheck, MapPin, Search, Lock, User, LogOut, Globe } from 'lucide-react';
import { StaffMember, UserProfile } from '../types';
import { ROLE_DETAILS } from '../utils/security';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface HeaderProps {
  onPostAdClick: () => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  selectedDistrict: string;
  onLocationClick: () => void;
  onSearchFocus: () => void;
  onNavigateSection: (sectionId: string) => void;
  pendingCount: number;
  isDark?: boolean;
  onToggleTheme?: () => void;
  currentStaff: StaffMember | null;
  onLogout: () => void;
  currentUser: UserProfile | null;
  onOpenUserAuth: () => void;
  onOpenUserProfile: () => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onPostAdClick,
  onOpenAdmin,
  isAdminOpen,
  selectedDistrict,
  onLocationClick,
  onSearchFocus,
  onNavigateSection,
  pendingCount,
  isDark,
  onToggleTheme,
  currentStaff,
  onLogout,
  currentUser,
  onOpenUserAuth,
  onOpenUserProfile,
  language = 'bn',
  onToggleLanguage
}) => {
  const staffRole = currentStaff ? ROLE_DETAILS[currentStaff.role] : null;
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigateSection('home'); }} 
              className="flex items-center gap-2.5 group"
            >
              <img 
                src="/logo.png" 
                alt={t.brandTitle} 
                referrerPolicy="no-referrer"
                className="w-11 h-11 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform border border-emerald-600/30 dark:border-emerald-500/40 p-0.5 bg-white dark:bg-slate-800"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  {language === 'bn' ? (
                    <>পুরান<span className="text-emerald-600 dark:text-emerald-400">বাজার</span></>
                  ) : (
                    <>Puran<span className="text-emerald-600 dark:text-emerald-400">Bazar</span></>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline -mt-0.5 tracking-wider uppercase font-medium">
                  {t.brandSlogan}
                </span>
              </div>
            </a>

            {/* Quick District Selector Button */}
            <button
              onClick={onLocationClick}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title={language === 'bn' ? 'লোকেশন পরিবর্তন করুন' : 'Change Location'}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{selectedDistrict || t.allDistricts}</span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => onNavigateSection('ads-grid')} 
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navAllAds}
            </button>
            <button 
              onClick={() => onNavigateSection('categories')} 
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navCategories}
            </button>
            <button 
              onClick={() => onNavigateSection('featured')} 
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navFeatured}
            </button>
            <button 
              onClick={() => onNavigateSection('guides')} 
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navGuides}
            </button>
            <button 
              onClick={() => onNavigateSection('safety')} 
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.navSafety}
            </button>
          </nav>

          {/* Zone 3: Primary Actions, Language & Theme Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Search on mobile */}
            <button
              onClick={onSearchFocus}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={language === 'en' ? 'Search' : 'খুঁজুন'}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Switcher Toggle (BN / EN) */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
                aria-label="Language Toggle"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <div className="flex items-center text-[11px] font-black tracking-wider">
                  <span className={language === 'bn' ? 'text-emerald-600 dark:text-emerald-400 font-extrabold border-b-2 border-emerald-500 pb-0.5' : 'text-slate-400 font-medium'}>
                    BN
                  </span>
                  <span className="text-slate-300 dark:text-slate-600 mx-1 font-normal">/</span>
                  <span className={language === 'en' ? 'text-emerald-600 dark:text-emerald-400 font-extrabold border-b-2 border-emerald-500 pb-0.5' : 'text-slate-400 font-medium'}>
                    EN
                  </span>
                </div>
              </button>
            )}

            {/* Authenticated Staff Badge (Only visible when staff has logged in via Secret Vault) */}
            {currentStaff && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAdmin}
                  className={`relative px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer border ${
                    isAdminOpen 
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white border-transparent' 
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  }`}
                  title={language === 'en' ? 'Open Admin Panel' : 'এডমিন প্যানেলে প্রবেশ করুন'}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline font-bold">{currentStaff.name.split(' ')[0]}</span>
                  <span className="text-[10px] hidden md:inline px-1.5 py-0.2 bg-white/70 dark:bg-slate-900/70 rounded">
                    {language === 'en' ? staffRole?.title?.split(' ')[0] : staffRole?.nameBn.split(' ')[0]}
                  </span>
                  {pendingCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Visitor User Profile or Login Button */}
            {currentUser ? (
              <button
                onClick={onOpenUserProfile}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                title={language === 'en' ? 'My Account & Ads' : 'আমার একাউন্ট ও বিজ্ঞাপনসমূহ'}
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                    {currentUser.name[0]}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold leading-tight truncate max-w-[85px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {t.myAccount}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={onOpenUserAuth}
                className="px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                title={t.login}
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{t.login}</span>
                <span className="sm:hidden">{language === 'bn' ? 'লগইন' : 'Login'}</span>
              </button>
            )}

            {/* Post Ad CTA */}
            <button
              onClick={onPostAdClick}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 rounded-lg shadow-sm shadow-amber-200 dark:shadow-none transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.postAdBtn}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
