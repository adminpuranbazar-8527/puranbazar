export type Language = 'bn' | 'en';

export const STORAGE_KEY_LANG = 'puranbazar_language';

export const toBengaliDigits = (num: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
};

export const formatNumber = (num: number | string, lang: Language): string => {
  if (lang === 'bn') {
    return toBengaliDigits(num);
  }
  return String(num);
};

export const formatPrice = (price: number, lang: Language): string => {
  if (lang === 'bn') {
    return `৳${toBengaliDigits(price.toLocaleString('en-IN'))}`;
  }
  return `৳${price.toLocaleString('en-US')}`;
};

export const TRANSLATIONS = {
  bn: {
    // Header
    brandTitle: 'পুরানবাজার',
    brandSlogan: 'পুরান জিনিস, নতুন অনুভূতি',
    searchPlaceholder: 'মোবাইল, ল্যাপটপ, বাইক বা পণ্য খুঁজুন...',
    allDistricts: 'সমগ্র বাংলাদেশ',
    postAdBtn: 'বিজ্ঞাপন দিন',
    myAccount: 'আমার প্রোফাইল',
    login: 'লগইন / রেজিস্টার',
    staffVault: 'ভল্ট',
    androidAppBtn: 'অ্যান্ড্রয়েড অ্যাপ',
    themeLight: 'লাইট মোড',
    themeDark: 'ডার্ক মোড',
    langToggle: 'BN',
    langToggleFull: 'বাংলা / English',
    navAllAds: 'সকল বিজ্ঞাপন',
    navCategories: 'ক্যাটাগরি',
    navFeatured: 'ফিচার্ড বিজ্ঞাপন',
    navGuides: 'কেনার গাইড',
    navSafety: 'নিরাপত্তা টিপস',

    // Hero Search
    heroBadge: '🇧🇩 বাংলাদেশের বিশ্বস্ত সেকেন্ডহ্যান্ড মার্কেটপ্লেস',
    heroTitlePrefix: 'ব্যবহৃত পণ্য কিনুন, বিক্রি করুন ',
    heroTitleHighlight: 'সহজে ও নিরাপদে',
    heroSubtitle: 'সরাসরি বিক্রেতার সাথে যোগাযোগ করুন, দেখে-শুনে যাচাই করে নিরাপদ মূল্যে ক্রয় করুন।',
    searchButton: 'অনুসন্ধান',
    selectLocation: 'লোকেশন নির্বাচন',
    popularSearches: 'জনপ্রিয় সার্চ:',

    // Categories
    popularCategoriesTitle: 'জনপ্রিয় ক্যাটাগরি',
    popularCategoriesSubtitle: 'পণ্য খুঁজে পেতে আপনার পছন্দের ক্যাটাগরি বেছে নিন',
    allCategories: 'সকল পণ্য',
    viewAllCategories: 'সব ক্যাটাগরি দেখুন',
    adsCountSuffix: 'টি বিজ্ঞাপন',

    // Featured Ads Section
    featuredTitle: 'ফিচার্ড বিজ্ঞাপন (Featured Ads)',
    featuredSubtitle: 'যাচাইকৃত এবং সেরা মূল্যের স্পেশাল বিজ্ঞাপনসমূহ',
    viewAll: 'সব দেখুন',

    // Filter & Sort
    filtersTitle: 'ফিল্টারসমূহ',
    filterByLocation: 'লোকেশন ফিল্টার',
    filterDivision: 'বিভাগ',
    filterDistrict: 'জেলা',
    filterUpazila: 'উপজেলা / থানা',
    allDivisions: 'সকল বিভাগ',
    allDistrictsOption: 'সকল জেলা',
    allUpazilas: 'সকল উপজেলা / থানা',
    condition: 'কন্ডিশন / অবস্থা',
    allConditions: 'সকল অবস্থা',
    condBrandNew: 'একদম নতুন (Brand New / Intact)',
    condLikeNew: 'একদম নতুনের মতো (Like New)',
    condGood: 'ভালো অবস্থা (Good)',
    condFair: 'চলনসই / ব্যবহৃত (Fair)',
    condRefurbished: 'সার্ভিসড / রিফার্বিশড (Refurbished)',
    priceRange: 'বাজেট / মূল্য (৳)',
    minPrice: 'সর্বনিম্ন',
    maxPrice: 'সর্বোচ্চ',
    sortBy: 'সাজানোর ক্রম',
    sortNewest: 'সর্বশেষ প্রকাশিত (Newest)',
    sortPriceLow: 'মূল্য: কম থেকে বেশি',
    sortPriceHigh: 'মূল্য: বেশি থেকে কম',
    sortPopular: 'সবচেয়ে জনপ্রিয় (Most Viewed)',
    resetFilters: 'সব ফিল্টার মুছুন',
    totalAdsFound: 'টি বিজ্ঞাপন পাওয়া গেছে',
    noAdsFound: 'কোনো বিজ্ঞাপন পাওয়া যায়নি',
    noAdsSubtitle: 'অনুগ্রহ করে ভিন্ন কোনো শব্দ বা ফিল্টার দিয়ে চেষ্টা করুন।',

    // Ad Cards
    featuredBadge: 'ফিচার্ড',
    verifiedSeller: 'ভেরিফাইড',
    negotiableText: 'দাম আলোচনা সাপেক্ষে',
    fixedPriceText: 'নির্দিষ্ট মূল্য',
    viewDetails: 'বিস্তারিত দেখুন',
    daysAgo: 'দিন আগে',
    hoursAgo: 'ঘন্টা আগে',
    justNow: 'এইমাত্র',

    // Guides Section
    buyingGuidesTitle: 'নিরাপদ কেনাকাটার গাইড ও টিপস',
    buyingGuidesSubtitle: 'সেকেন্ডহ্যান্ড পণ্য কেনার আগে জেনে নিন জরুরি কিছু সতর্কতা',

    // Android App Modal & Simulator
    androidModalTitle: 'পুরানবাজার অ্যান্ড্রয়েড অ্যাপ (Play Store Ready)',
    androidModalBadge: 'Android 9.0+ (API 28-34)',
    androidModalSubtitle: 'গুগল প্লে স্টোর উপযোগী নেটিভ অ্যান্ড্রয়েড সোর্স প্রজেক্ট, লাইভ সিমুলেটর ও আপলোড সিস্টেম',
    tabSimulator: '📱 লাইভ অ্যান্ড্রয়েড ডেমো সিমুলেটর',
    tabPlayStore: '🏪 গুগল প্লে স্টোর প্রিভিউ',
    tabGuide: '🚀 প্লে স্টোর আপলোড গাইড',
    tabDownload: '📥 সোর্স কোড (.zip) ও বিল্ড প্যাকেজ',
    simExitTitle: 'অ্যাপ বন্ধ করবেন?',
    simExitDesc: 'আপনি কি পুরানবাজার অ্যান্ড্রয়েড অ্যাপ থেকে বের হতে চান?',
    simExitYes: 'হ্যাঁ (Exit)',
    simExitNo: 'না',
    simRefreshing: 'রিফ্রেশ হচ্ছে...',
    simDistrictTitle: 'জনপ্রিয় ক্যাটাগরি',
    simInstallBtn: 'ইন্সটল করুন (Install)',
    simVerifiedBadge: 'Verified by Play Protect • ১০০% নিরাপদ',
    downloadProjectZip: 'Android Studio প্রজেক্ট ডাউনলোড (.zip)',

    // Footer
    footerDesc: '“ব্যবহৃত পণ্য কিনুন, বিক্রি করুন সহজে” — বাংলাদেশের যেকোনো জেলা থেকে পুরনো মোবাইল, কম্পিউটার, মোটরসাইকেল ও আসবাবপত্র নিরাপদে কেনাবেচার নির্ভরযোগ্য প্ল্যাটফর্ম।',
    footerInfoTitle: 'তথ্য ও পলিসি',
    footerAboutUs: 'আমাদের সম্পর্কে (About Us)',
    footerContact: 'যোগাযোগ (Contact)',
    footerPrivacy: 'গোপনীয়তা নীতি (Privacy Policy)',
    footerTerms: 'ব্যবহারের শর্তাবলি (Terms)',
    footerSafety: 'নিরাপত্তা নির্দেশিকা (Safety Tips)',
    footerAndroidGuide: 'অ্যান্ড্রয়েড অ্যাপ ও প্লে স্টোর গাইড',
    footerDistrictsTitle: 'বাংলাদেশের ৬৪ জেলার ব্যবহৃত পণ্যের বাজার',
    footerHelpline: 'হেল্পলাইন',
    footerCopyright: '© ২০২৬ পুরানবাজার (PuranBazar.com) · সর্বস্বত্ব সংরক্ষিত',
  },
  en: {
    // Header
    brandTitle: 'PuranBazar',
    brandSlogan: 'Used Goods, Fresh Feelings',
    searchPlaceholder: 'Search mobile, laptop, bike or products...',
    allDistricts: 'All Bangladesh',
    postAdBtn: 'Post Free Ad',
    myAccount: 'My Profile',
    login: 'Login / Register',
    staffVault: 'Vault',
    androidAppBtn: 'Android App',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    langToggle: 'EN',
    langToggleFull: 'English / বাংলা',
    navAllAds: 'All Ads',
    navCategories: 'Categories',
    navFeatured: 'Featured Ads',
    navGuides: 'Buying Guides',
    navSafety: 'Safety Tips',

    // Hero Search
    heroBadge: '🇧🇩 Bangladesh’s Trusted Second-Hand Marketplace',
    heroTitlePrefix: 'Buy and Sell Used Goods ',
    heroTitleHighlight: 'Easily & Securely',
    heroSubtitle: 'Connect directly with verified sellers, inspect items in person, and buy with total peace of mind.',
    searchButton: 'Search',
    selectLocation: 'Select Location',
    popularSearches: 'Popular Searches:',

    // Categories
    popularCategoriesTitle: 'Popular Categories',
    popularCategoriesSubtitle: 'Select a category to quickly find what you are looking for',
    allCategories: 'All Categories',
    viewAllCategories: 'View All Categories',
    adsCountSuffix: 'ads',

    // Featured Ads Section
    featuredTitle: 'Featured Ads',
    featuredSubtitle: 'Verified and top handpicked deals at the best prices',
    viewAll: 'View All',

    // Filter & Sort
    filtersTitle: 'Filters',
    filterByLocation: 'Filter by Location',
    filterDivision: 'Division',
    filterDistrict: 'District',
    filterUpazila: 'Upazila / Area',
    allDivisions: 'All Divisions',
    allDistrictsOption: 'All Districts',
    allUpazilas: 'All Upazilas / Areas',
    condition: 'Condition',
    allConditions: 'All Conditions',
    condBrandNew: 'Brand New (Intact Box)',
    condLikeNew: 'Like New',
    condGood: 'Good Condition',
    condFair: 'Fair / Used',
    condRefurbished: 'Serviced / Refurbished',
    priceRange: 'Budget / Price (৳)',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    sortBy: 'Sort By',
    sortNewest: 'Newly Added (Newest)',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortPopular: 'Most Popular (Views)',
    resetFilters: 'Clear All Filters',
    totalAdsFound: 'ads found',
    noAdsFound: 'No ads found',
    noAdsSubtitle: 'Please try changing your keywords or filter parameters.',

    // Ad Cards
    featuredBadge: 'Featured',
    verifiedSeller: 'Verified',
    negotiableText: 'Price Negotiable',
    fixedPriceText: 'Fixed Price',
    viewDetails: 'View Details',
    daysAgo: 'days ago',
    hoursAgo: 'hours ago',
    justNow: 'just now',

    // Guides Section
    buyingGuidesTitle: 'Safe Buying Guides & Useful Tips',
    buyingGuidesSubtitle: 'Important safety precautions and tips before buying second-hand goods',

    // Android App Modal & Simulator
    androidModalTitle: 'PuranBazar Android App (Play Store Ready)',
    androidModalBadge: 'Android 9.0+ (API 28-34)',
    androidModalSubtitle: 'Google Play Store compliant native Android source project, live simulator & release system',
    tabSimulator: '📱 Live Android Demo Simulator',
    tabPlayStore: '🏪 Google Play Store Preview',
    tabGuide: '🚀 Play Store Upload Guide',
    tabDownload: '📥 Source Code (.zip) & Build Package',
    simExitTitle: 'Close application?',
    simExitDesc: 'Do you want to exit the PuranBazar Android app?',
    simExitYes: 'Yes (Exit)',
    simExitNo: 'No',
    simRefreshing: 'Refreshing...',
    simDistrictTitle: 'Popular Categories',
    simInstallBtn: 'Install Now',
    simVerifiedBadge: 'Verified by Play Protect • 100% Safe',
    downloadProjectZip: 'Download Android Studio Project (.zip)',

    // Footer
    footerDesc: '“Buy and Sell Used Goods with Ease” — Bangladesh’s most reliable platform to trade used phones, laptops, motorcycles and furniture across all 64 districts.',
    footerInfoTitle: 'Information & Policies',
    footerAboutUs: 'About Us',
    footerContact: 'Contact Us',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    footerSafety: 'Safety Tips',
    footerAndroidGuide: 'Android App & Play Store Guide',
    footerDistrictsTitle: 'Used Goods Market Across 64 Districts of Bangladesh',
    footerHelpline: 'Helpline',
    footerCopyright: '© 2026 PuranBazar (PuranBazar.com) · All rights reserved',
  }
};
