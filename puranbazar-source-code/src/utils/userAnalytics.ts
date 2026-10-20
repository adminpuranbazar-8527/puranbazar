import { UserProfile } from '../types';

export interface UserActivityRecord {
  id: string;
  name: string;
  nameEn?: string;
  phone: string;
  email: string;
  district: string;
  division: string;
  avatar?: string;
  isRegistered: boolean;
  isVerified: boolean;
  registeredDate: string;
  registeredDateEn?: string;
  deviceType: 'Android' | 'iOS' | 'Windows PC' | 'Mac' | 'Tablet';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge';
  isOnlineNow: boolean;
  currentPath?: string;
  currentPathEn?: string;
  currentSessionDurationMinutes: number;
  timeSpentTodayMinutes: number;
  timeSpentWeekMinutes: number;
  timeSpentMonthMinutes: number;
  sessionsToday: number;
  sessionsWeek: number;
  sessionsMonth: number;
  adsViewedToday: number;
  adsViewedWeek: number;
  adsViewedMonth: number;
  favoriteCategory: string;
  favoriteCategoryEn?: string;
  lastActive: string;
  lastActiveEn?: string;
}

export interface LiveViewerSession {
  sessionId: string;
  visitorId: string;
  name: string;
  nameEn: string;
  isRegistered: boolean;
  phone?: string;
  location: string;
  locationEn: string;
  division: string;
  divisionEn: string;
  device: 'মোবাইল (Android)' | 'মোবাইল (iOS)' | 'কম্পিউটার (Windows)' | 'ম্যাক (macOS)' | 'ট্যাবলেট';
  deviceEn: string;
  currentPage: string;
  currentPageEn: string;
  activeMinutes: number;
  todayTotalMinutes: number;
  ipMasked: string;
}

export const SEEDED_USER_ANALYTICS: UserActivityRecord[] = [
  {
    id: 'user-1',
    name: 'শাহিদুল ইসলাম',
    nameEn: 'Shahidul Islam',
    email: 'shahidul@example.com',
    phone: '01712-345678',
    district: 'মানিকগঞ্জ (Manikganj)',
    division: 'ঢাকা (Dhaka)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: true,
    registeredDate: '১৫ জানুয়ারি ২০২৫',
    registeredDateEn: '15 Jan 2025',
    deviceType: 'Android',
    browser: 'Chrome',
    isOnlineNow: true,
    currentPath: 'iPhone 13 128GB Midnight Black বিজ্ঞাপন',
    currentPathEn: 'iPhone 13 128GB Midnight Black Ad',
    currentSessionDurationMinutes: 18,
    timeSpentTodayMinutes: 48,
    timeSpentWeekMinutes: 340, // 5h 40m
    timeSpentMonthMinutes: 1420, // 23h 40m
    sessionsToday: 3,
    sessionsWeek: 16,
    sessionsMonth: 62,
    adsViewedToday: 14,
    adsViewedWeek: 85,
    adsViewedMonth: 340,
    favoriteCategory: 'মোবাইল ও গ্যাজেট',
    favoriteCategoryEn: 'Mobiles & Gadgets',
    lastActive: 'বর্তমানে একটিভ (অনলাইন)',
    lastActiveEn: 'Active Now (Online)',
  },
  {
    id: 'user-2',
    name: 'তানভীর আহমেদ',
    nameEn: 'Tanvir Ahmed',
    email: 'tanvir@example.com',
    phone: '01819-987654',
    district: 'ঢাকা (Dhaka)',
    division: 'ঢাকা (Dhaka)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: true,
    registeredDate: '০২ মার্চ ২০২৫',
    registeredDateEn: '02 Mar 2025',
    deviceType: 'Windows PC',
    browser: 'Chrome',
    isOnlineNow: true,
    currentPath: 'হোমপেজ • ল্যাপটপ ফিল্টার',
    currentPathEn: 'Homepage • Laptop Filter',
    currentSessionDurationMinutes: 12,
    timeSpentTodayMinutes: 35,
    timeSpentWeekMinutes: 260, // 4h 20m
    timeSpentMonthMinutes: 1180, // 19h 40m
    sessionsToday: 2,
    sessionsWeek: 14,
    sessionsMonth: 54,
    adsViewedToday: 9,
    adsViewedWeek: 64,
    adsViewedMonth: 280,
    favoriteCategory: 'ইলেকট্রনিক্স ও ল্যাপটপ',
    favoriteCategoryEn: 'Electronics & Laptops',
    lastActive: 'বর্তমানে একটিভ (অনলাইন)',
    lastActiveEn: 'Active Now (Online)',
  },
  {
    id: 'user-3',
    name: 'মোছাঃ নুসরাত জাহান',
    nameEn: 'Mst. Nusrat Jahan',
    email: 'nusrat.jahan@gmail.com',
    phone: '01689-835975',
    district: 'চট্টগ্রাম (Chattogram)',
    division: 'চট্টগ্রাম (Chattogram)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: true,
    registeredDate: '১২ মে ২০২৫',
    registeredDateEn: '12 May 2025',
    deviceType: 'iOS',
    browser: 'Safari',
    isOnlineNow: true,
    currentPath: 'সোফা সেট ফার্নিচার ব্রাউজিং',
    currentPathEn: 'Sofa Set Furniture Browsing',
    currentSessionDurationMinutes: 24,
    timeSpentTodayMinutes: 52,
    timeSpentWeekMinutes: 380, // 6h 20m
    timeSpentMonthMinutes: 1650, // 27h 30m
    sessionsToday: 4,
    sessionsWeek: 21,
    sessionsMonth: 78,
    adsViewedToday: 18,
    adsViewedWeek: 110,
    adsViewedMonth: 420,
    favoriteCategory: 'ঘর ও ফার্নিচার',
    favoriteCategoryEn: 'Home & Furniture',
    lastActive: 'বর্তমানে একটিভ (অনলাইন)',
    lastActiveEn: 'Active Now (Online)',
  },
  {
    id: 'user-4',
    name: 'রাশেদুল করিম',
    nameEn: 'Rashedul Karim',
    email: 'rashedul.karim@yahoo.com',
    phone: '01911-554433',
    district: 'সিলেট (Sylhet)',
    division: 'সিলেট (Sylhet)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: false,
    registeredDate: '১৮ জুন ২০২৫',
    registeredDateEn: '18 Jun 2025',
    deviceType: 'Android',
    browser: 'Firefox',
    isOnlineNow: false,
    currentPath: 'Yamaha FZ-S V3 মটরসাইকেল',
    currentPathEn: 'Yamaha FZ-S V3 Motorbike',
    currentSessionDurationMinutes: 0,
    timeSpentTodayMinutes: 15,
    timeSpentWeekMinutes: 185, // 3h 5m
    timeSpentMonthMinutes: 890, // 14h 50m
    sessionsToday: 1,
    sessionsWeek: 9,
    sessionsMonth: 41,
    adsViewedToday: 5,
    adsViewedWeek: 42,
    adsViewedMonth: 195,
    favoriteCategory: 'মোটরবাইক ও স্কুটার',
    favoriteCategoryEn: 'Motorbikes & Scooters',
    lastActive: '২৫ মিনিট আগে',
    lastActiveEn: '25 mins ago',
  },
  {
    id: 'user-5',
    name: 'আরিফুল ইসলাম অপু',
    nameEn: 'Ariful Islam Opu',
    email: 'apu.islam@gmail.com',
    phone: '01722-667788',
    district: 'রাজশাহী (Rajshahi)',
    division: 'রাজশাহী (Rajshahi)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: true,
    registeredDate: '০৪ জুলাই ২০২৫',
    registeredDateEn: '04 Jul 2025',
    deviceType: 'Android',
    browser: 'Chrome',
    isOnlineNow: true,
    currentPath: 'বিজ্ঞাপন পোস্ট করার পেইজ',
    currentPathEn: 'Post Ad Page',
    currentSessionDurationMinutes: 9,
    timeSpentTodayMinutes: 42,
    timeSpentWeekMinutes: 295, // 4h 55m
    timeSpentMonthMinutes: 1320, // 22h
    sessionsToday: 3,
    sessionsWeek: 15,
    sessionsMonth: 58,
    adsViewedToday: 11,
    adsViewedWeek: 72,
    adsViewedMonth: 310,
    favoriteCategory: 'কৃষি ও পশুপালন',
    favoriteCategoryEn: 'Agro & Animals',
    lastActive: 'বর্তমানে একটিভ (অনলাইন)',
    lastActiveEn: 'Active Now (Online)',
  },
  {
    id: 'user-6',
    name: 'ফারহানা আহমেদ পিংকি',
    nameEn: 'Farhana Ahmed Pinky',
    email: 'pinky.farhana@hotmail.com',
    phone: '01518-990011',
    district: 'খুলনা (Khulna)',
    division: 'খুলনা (Khulna)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: true,
    registeredDate: '২৮ জুলাই ২০২৫',
    registeredDateEn: '28 Jul 2025',
    deviceType: 'Mac',
    browser: 'Safari',
    isOnlineNow: false,
    currentPath: 'সোনি ব্রাভিয়া ৪৩ ইঞ্চি ৪কে স্মার্ট টিভি',
    currentPathEn: 'Sony Bravia 43" 4K Smart TV',
    currentSessionDurationMinutes: 0,
    timeSpentTodayMinutes: 28,
    timeSpentWeekMinutes: 210, // 3h 30m
    timeSpentMonthMinutes: 980, // 16h 20m
    sessionsToday: 2,
    sessionsWeek: 11,
    sessionsMonth: 46,
    adsViewedToday: 8,
    adsViewedWeek: 55,
    adsViewedMonth: 230,
    favoriteCategory: 'ইলেকট্রনিক্স ও গ্যাজেট',
    favoriteCategoryEn: 'Electronics & Gadgets',
    lastActive: '১ ঘন্টা আগে',
    lastActiveEn: '1 hour ago',
  },
  {
    id: 'user-7',
    name: 'মাহমুদুল হাসান সৈকত',
    nameEn: 'Mahmudul Hasan Saikat',
    email: 'saikat.mahmud@gmail.com',
    phone: '01833-445566',
    district: 'বগুড়া (Bogura)',
    division: 'রাজশাহী (Rajshahi)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: false,
    registeredDate: '১৫ আগস্ট ২০২৫',
    registeredDateEn: '15 Aug 2025',
    deviceType: 'Android',
    browser: 'Chrome',
    isOnlineNow: true,
    currentPath: 'রিয়েলমি ৯ প্রো প্লাস স্মার্টফোন',
    currentPathEn: 'Realme 9 Pro+ Smartphone',
    currentSessionDurationMinutes: 14,
    timeSpentTodayMinutes: 38,
    timeSpentWeekMinutes: 240, // 4h
    timeSpentMonthMinutes: 1040, // 17h 20m
    sessionsToday: 2,
    sessionsWeek: 13,
    sessionsMonth: 51,
    adsViewedToday: 12,
    adsViewedWeek: 68,
    adsViewedMonth: 295,
    favoriteCategory: 'মোবাইল ফোন',
    favoriteCategoryEn: 'Mobile Phones',
    lastActive: 'বর্তমানে একটিভ (অনলাইন)',
    lastActiveEn: 'Active Now (Online)',
  },
  {
    id: 'user-8',
    name: 'নাসরিন সুলতানা নিপা',
    nameEn: 'Nasrin Sultana Nipa',
    email: 'nasrin.sultana@yahoo.com',
    phone: '01922-334455',
    district: 'কুমিল্লা (Cumilla)',
    division: 'চট্টগ্রাম (Chattogram)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: true,
    registeredDate: '০৫ সেপ্টেম্বর ২০২৫',
    registeredDateEn: '05 Sep 2025',
    deviceType: 'Tablet',
    browser: 'Chrome',
    isOnlineNow: false,
    currentPath: 'মহিলাদের ফ্যাশন ও ড্রেস কালেকশন',
    currentPathEn: "Women's Fashion & Dresses",
    currentSessionDurationMinutes: 0,
    timeSpentTodayMinutes: 20,
    timeSpentWeekMinutes: 170, // 2h 50m
    timeSpentMonthMinutes: 760, // 12h 40m
    sessionsToday: 1,
    sessionsWeek: 8,
    sessionsMonth: 36,
    adsViewedToday: 6,
    adsViewedWeek: 48,
    adsViewedMonth: 180,
    favoriteCategory: 'ফ্যাশন ও লাইফস্টাইল',
    favoriteCategoryEn: 'Fashion & Lifestyle',
    lastActive: '৩ ঘন্টা আগে',
    lastActiveEn: '3 hours ago',
  },
  {
    id: 'user-9',
    name: 'কাজী মিজানুর রহমান',
    nameEn: 'Kazi Mijanur Rahman',
    email: 'mizanur.kazi@gmail.com',
    phone: '01711-002233',
    district: 'বরিশাল (Barishal)',
    division: 'বরিশাল (Barishal)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: true,
    registeredDate: '২২ অক্টোবর ২০২৫',
    registeredDateEn: '22 Oct 2025',
    deviceType: 'Android',
    browser: 'Chrome',
    isOnlineNow: true,
    currentPath: 'টয়োটা করোলা এক্স কার বিক্রয়',
    currentPathEn: 'Toyota Corolla X Car Sale',
    currentSessionDurationMinutes: 21,
    timeSpentTodayMinutes: 65,
    timeSpentWeekMinutes: 420, // 7h
    timeSpentMonthMinutes: 1840, // 30h 40m
    sessionsToday: 4,
    sessionsWeek: 23,
    sessionsMonth: 88,
    adsViewedToday: 22,
    adsViewedWeek: 135,
    adsViewedMonth: 540,
    favoriteCategory: 'যানবাহন ও গাড়ি',
    favoriteCategoryEn: 'Vehicles & Cars',
    lastActive: 'বর্তমানে একটিভ (অনলাইন)',
    lastActiveEn: 'Active Now (Online)',
  },
  {
    id: 'user-10',
    name: 'সামিউল আলম শুভ',
    nameEn: 'Samiul Alam Shuvo',
    email: 'shuvor.alam@gmail.com',
    phone: '01844-556677',
    district: 'রংপুর (Rangpur)',
    division: 'রংপুর (Rangpur)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop',
    isRegistered: true,
    isVerified: false,
    registeredDate: '১০ নভেম্বর ২০২৫',
    registeredDateEn: '10 Nov 2025',
    deviceType: 'Android',
    browser: 'Chrome',
    isOnlineNow: true,
    currentPath: 'ক্যানন ইওএস ২০০ডি ডিএসএলআর ক্যামেরা',
    currentPathEn: 'Canon EOS 200D DSLR Camera',
    currentSessionDurationMinutes: 16,
    timeSpentTodayMinutes: 32,
    timeSpentWeekMinutes: 225, // 3h 45m
    timeSpentMonthMinutes: 940, // 15h 40m
    sessionsToday: 2,
    sessionsWeek: 12,
    sessionsMonth: 48,
    adsViewedToday: 7,
    adsViewedWeek: 58,
    adsViewedMonth: 215,
    favoriteCategory: 'ক্যামেরা ও অপটিক্স',
    favoriteCategoryEn: 'Cameras & Optics',
    lastActive: 'বর্তমানে একটিভ (অনলাইন)',
    lastActiveEn: 'Active Now (Online)',
  }
];

export const INITIAL_LIVE_VIEWERS: LiveViewerSession[] = [
  {
    sessionId: 'sess-101',
    visitorId: 'user-1',
    name: 'শাহিদুল ইসলাম (রেজিস্টার্ড বিক্রেতা)',
    nameEn: 'Shahidul Islam (Registered Seller)',
    isRegistered: true,
    phone: '01712-345678',
    location: 'মানিকগঞ্জ সদর, ঢাকা',
    locationEn: 'Manikganj Sadar, Dhaka',
    division: 'ঢাকা',
    divisionEn: 'Dhaka',
    device: 'মোবাইল (Android)',
    deviceEn: 'Mobile (Android)',
    currentPage: 'iPhone 13 128GB Midnight Black বিজ্ঞাপন',
    currentPageEn: 'iPhone 13 128GB Midnight Black Ad',
    activeMinutes: 18,
    todayTotalMinutes: 48,
    ipMasked: '103.145.***.89',
  },
  {
    sessionId: 'sess-102',
    visitorId: 'user-2',
    name: 'তানভীর আহমেদ (রেজিস্টার্ড সেলার)',
    nameEn: 'Tanvir Ahmed (Registered Seller)',
    isRegistered: true,
    phone: '01819-987654',
    location: 'মিরপুর ১০, ঢাকা',
    locationEn: 'Mirpur 10, Dhaka',
    division: 'ঢাকা',
    divisionEn: 'Dhaka',
    device: 'কম্পিউটার (Windows)',
    deviceEn: 'Computer (Windows)',
    currentPage: 'হোমপেজ • ল্যাপটপ ফিল্টার তালিকা',
    currentPageEn: 'Homepage • Laptop Filter List',
    activeMinutes: 12,
    todayTotalMinutes: 35,
    ipMasked: '103.111.***.45',
  },
  {
    sessionId: 'sess-103',
    visitorId: 'user-3',
    name: 'মোছাঃ নুসরাত জাহান (রেজিস্টার্ড ক্রেতা)',
    nameEn: 'Mst. Nusrat Jahan (Registered Buyer)',
    isRegistered: true,
    phone: '01689-835975',
    location: 'আগ্রাবাদ, চট্টগ্রাম',
    locationEn: 'Agrabad, Chattogram',
    division: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    device: 'মোবাইল (iOS)',
    deviceEn: 'Mobile (iOS)',
    currentPage: 'সোফা সেট ফার্নিচার বিস্তারিত পেজ',
    currentPageEn: 'Sofa Set Furniture Details',
    activeMinutes: 24,
    todayTotalMinutes: 52,
    ipMasked: '118.179.***.12',
  },
  {
    sessionId: 'sess-104',
    visitorId: 'gst-8891',
    name: 'গেস্ট ভিজিটর #৮৮৯১',
    nameEn: 'Guest Visitor #8891',
    isRegistered: false,
    location: 'ধানমন্ডি, ঢাকা',
    locationEn: 'Dhanmondi, Dhaka',
    division: 'ঢাকা',
    divisionEn: 'Dhaka',
    device: 'মোবাইল (Android)',
    deviceEn: 'Mobile (Android)',
    currentPage: 'হোন্ডা সিবিআর ১৫০আর বিজ্ঞাপন',
    currentPageEn: 'Honda CBR 150R Ad',
    activeMinutes: 6,
    todayTotalMinutes: 18,
    ipMasked: '103.230.***.21',
  },
  {
    sessionId: 'sess-105',
    visitorId: 'gst-4432',
    name: 'গেস্ট ভিজিটর #৪৪৩২',
    nameEn: 'Guest Visitor #4432',
    isRegistered: false,
    location: 'জিন্দাবাজার, সিলেট',
    locationEn: 'Zindabazar, Sylhet',
    division: 'সিলেট',
    divisionEn: 'Sylhet',
    device: 'মোবাইল (iOS)',
    deviceEn: 'Mobile (iOS)',
    currentPage: 'স্যামসাং গ্যালাক্সি এস২৩ আল্ট্রা',
    currentPageEn: 'Samsung Galaxy S23 Ultra',
    activeMinutes: 14,
    todayTotalMinutes: 22,
    ipMasked: '202.51.***.87',
  },
  {
    sessionId: 'sess-106',
    visitorId: 'user-5',
    name: 'আরিফুল ইসলাম অপু (রেজিস্টার্ড বিক্রেতা)',
    nameEn: 'Ariful Islam Opu (Registered Seller)',
    isRegistered: true,
    phone: '01722-667788',
    location: 'বোয়ালিয়া, রাজশাহী',
    locationEn: 'Boalia, Rajshahi',
    division: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    device: 'মোবাইল (Android)',
    deviceEn: 'Mobile (Android)',
    currentPage: 'নতুন ফ্রি বিজ্ঞাপন পোস্ট ফর্ম',
    currentPageEn: 'Post New Free Ad Form',
    activeMinutes: 9,
    todayTotalMinutes: 42,
    ipMasked: '103.102.***.63',
  },
  {
    sessionId: 'sess-107',
    visitorId: 'gst-9912',
    name: 'গেস্ট ভিজিটর #৯৯১২',
    nameEn: 'Guest Visitor #9912',
    isRegistered: false,
    location: 'শিববাড়ী মোড়, খুলনা',
    locationEn: 'Shibbari More, Khulna',
    division: 'খুলনা',
    divisionEn: 'Khulna',
    device: 'কম্পিউটার (Windows)',
    deviceEn: 'Computer (Windows)',
    currentPage: 'হোমপেজ • অল বাংলাদেশ ক্যাটাগরি',
    currentPageEn: 'Homepage • All Bangladesh Categories',
    activeMinutes: 4,
    todayTotalMinutes: 14,
    ipMasked: '119.30.***.109',
  },
  {
    sessionId: 'sess-108',
    visitorId: 'user-7',
    name: 'মাহমুদুল হাসান সৈকত (রেজিস্টার্ড)',
    nameEn: 'Mahmudul Hasan Saikat (Registered)',
    isRegistered: true,
    phone: '01833-445566',
    location: 'সাতমাথা, বগুড়া',
    locationEn: 'Satmatha, Bogura',
    division: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    device: 'মোবাইল (Android)',
    deviceEn: 'Mobile (Android)',
    currentPage: 'রিয়েলমি ৯ প্রো প্লাস স্মার্টফোন',
    currentPageEn: 'Realme 9 Pro+ Smartphone',
    activeMinutes: 14,
    todayTotalMinutes: 38,
    ipMasked: '103.134.***.72',
  },
  {
    sessionId: 'sess-109',
    visitorId: 'gst-3310',
    name: 'গেস্ট ভিজিটর #৩৩১০',
    nameEn: 'Guest Visitor #3310',
    isRegistered: false,
    location: 'চৌহাট্টা, সিলেট',
    locationEn: 'Chouhatta, Sylhet',
    division: 'সিলেট',
    divisionEn: 'Sylhet',
    device: 'মোবাইল (Android)',
    deviceEn: 'Mobile (Android)',
    currentPage: 'ল্যাপটপ ও কম্পিউটার ক্যাটাগরি',
    currentPageEn: 'Laptops & Computers Category',
    activeMinutes: 11,
    todayTotalMinutes: 26,
    ipMasked: '103.205.***.14',
  },
  {
    sessionId: 'sess-110',
    visitorId: 'user-9',
    name: 'কাজী মিজানুর রহমান (রেজিস্টার্ড)',
    nameEn: 'Kazi Mijanur Rahman (Registered)',
    isRegistered: true,
    phone: '01711-002233',
    location: 'সদর রোড, বরিশাল',
    locationEn: 'Sadar Road, Barishal',
    division: 'বরিশাল',
    divisionEn: 'Barishal',
    device: 'মোবাইল (Android)',
    deviceEn: 'Mobile (Android)',
    currentPage: 'টয়োটা করোলা কার ও যানবাহন পেজ',
    currentPageEn: 'Toyota Corolla Cars & Vehicles',
    activeMinutes: 21,
    todayTotalMinutes: 65,
    ipMasked: '103.149.***.38',
  },
  {
    sessionId: 'sess-111',
    visitorId: 'gst-6621',
    name: 'গেস্ট ভিজিটর #৬৬২১',
    nameEn: 'Guest Visitor #6621',
    isRegistered: false,
    location: 'উত্তরা, ঢাকা',
    locationEn: 'Uttara, Dhaka',
    division: 'ঢাকা',
    divisionEn: 'Dhaka',
    device: 'মোবাইল (iOS)',
    deviceEn: 'Mobile (iOS)',
    currentPage: 'হোমপেজ অনুসন্ধান ও সার্চ রেজাল্ট',
    currentPageEn: 'Homepage Search & Results',
    activeMinutes: 3,
    todayTotalMinutes: 8,
    ipMasked: '103.242.***.90',
  },
  {
    sessionId: 'sess-112',
    visitorId: 'user-10',
    name: 'সামিউল আলম শুভ (রেজিস্টার্ড)',
    nameEn: 'Samiul Alam Shuvo (Registered)',
    isRegistered: true,
    phone: '01844-556677',
    location: 'জাহাজ কোম্পানি মোড়, রংপুর',
    locationEn: 'Jahaj Company More, Rangpur',
    division: 'রংপুর',
    divisionEn: 'Rangpur',
    device: 'মোবাইল (Android)',
    deviceEn: 'Mobile (Android)',
    currentPage: 'ক্যানন ইওএস ক্যামেরা বিজ্ঞাপন',
    currentPageEn: 'Canon EOS Camera Ad',
    activeMinutes: 16,
    todayTotalMinutes: 32,
    ipMasked: '103.118.***.55',
  }
];

/**
 * Format minutes into readable Bengali duration: e.g. "১ ঘন্টা ২০ মিনিট" or "৩৫ মিনিট"
 */
export function formatMinutesToBangla(minutes: number): string {
  if (!minutes || minutes <= 0) return '০ মিনিট';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    if (remainingMinutes > 0) {
      return `${hours.toLocaleString('bn-BD')} ঘন্টা ${remainingMinutes.toLocaleString('bn-BD')} মিনিট`;
    }
    return `${hours.toLocaleString('bn-BD')} ঘন্টা`;
  }
  return `${minutes.toLocaleString('bn-BD')} মিনিট`;
}

/**
 * Merge registered users from app state with seeded analytics
 */
export function syncUsersWithAnalytics(registeredUsers: UserProfile[]): UserActivityRecord[] {
  const merged: UserActivityRecord[] = [...SEEDED_USER_ANALYTICS];

  // If there are real users registered in localStorage not in seeded list, add them!
  registeredUsers.forEach((user, index) => {
    const exists = merged.some(
      (m) => m.id === user.id || m.email.toLowerCase() === user.email.toLowerCase()
    );
    if (!exists) {
      // Deterministic realistic activity metrics
      const randSeed = (user.name.length * 7 + index * 13) % 40;
      const todayMins = 25 + randSeed;
      const weekMins = todayMins * 5 + 40;
      const monthMins = weekMins * 4 + 180;

      merged.unshift({
        id: user.id,
        name: user.name,
        nameEn: user.name,
        email: user.email,
        phone: user.phone,
        district: user.district || 'ঢাকা (Dhaka)',
        division: user.division || 'ঢাকা (Dhaka)',
        avatar: user.avatar,
        isRegistered: true,
        isVerified: user.isVerified || false,
        registeredDate: user.joinedAt || 'সেপ্টেম্বর ২০২৬',
        registeredDateEn: 'Sep 2026',
        deviceType: index % 2 === 0 ? 'Android' : 'Windows PC',
        browser: 'Chrome',
        isOnlineNow: index % 3 === 0,
        currentPath: index % 3 === 0 ? 'হোমপেজ ও ক্যাটাগরি ব্রাউজিং' : undefined,
        currentPathEn: index % 3 === 0 ? 'Homepage & Category Browsing' : undefined,
        currentSessionDurationMinutes: index % 3 === 0 ? 11 : 0,
        timeSpentTodayMinutes: todayMins,
        timeSpentWeekMinutes: weekMins,
        timeSpentMonthMinutes: monthMins,
        sessionsToday: 2,
        sessionsWeek: 10,
        sessionsMonth: 38,
        adsViewedToday: 8,
        adsViewedWeek: 45,
        adsViewedMonth: 175,
        favoriteCategory: 'মোবাইল ও গ্যাজেট',
        favoriteCategoryEn: 'Mobiles & Gadgets',
        lastActive: index % 3 === 0 ? 'বর্তমানে একটিভ (অনলাইন)' : 'আজ সকালে',
        lastActiveEn: index % 3 === 0 ? 'Active Now (Online)' : 'This morning',
      });
    }
  });

  return merged;
}

/**
 * 24-hour activity distribution for peak hours chart
 */
export const HOURLY_VIEWER_DISTRIBUTION = [
  { hour: '১২ AM', timeBn: 'রাত ১২টা', timeEn: '12:00 AM', viewers: 18, avgMins: 14 },
  { hour: '০২ AM', timeBn: 'রাত ২টা', timeEn: '02:00 AM', viewers: 7, avgMins: 8 },
  { hour: '০৪ AM', timeBn: 'ভোর ৪টা', timeEn: '04:00 AM', viewers: 4, avgMins: 6 },
  { hour: '০৬ AM', timeBn: 'সকাল ৬টা', timeEn: '06:00 AM', viewers: 12, avgMins: 11 },
  { hour: '০৮ AM', timeBn: 'সকাল ৮টা', timeEn: '08:00 AM', viewers: 26, avgMins: 19 },
  { hour: '১০ AM', timeBn: 'সকাল ১০টা', timeEn: '10:00 AM', viewers: 42, avgMins: 28 }, // Peak
  { hour: '১২ PM', timeBn: 'দুপুর ১২টা', timeEn: '12:00 PM', viewers: 38, avgMins: 24 },
  { hour: '০২ PM', timeBn: 'দুপুর ২টা', timeEn: '02:00 PM', viewers: 34, avgMins: 22 },
  { hour: '০৪ PM', timeBn: 'বিকাল ৪টা', timeEn: '04:00 PM', viewers: 36, avgMins: 25 },
  { hour: '০৬ PM', timeBn: 'সন্ধ্যা ৬টা', timeEn: '06:00 PM', viewers: 45, avgMins: 31 }, // Peak
  { hour: '০৮ PM', timeBn: 'রাত ৮টা', timeEn: '08:00 PM', viewers: 58, avgMins: 38 }, // Highest Peak
  { hour: '১০ PM', timeBn: 'রাত ১০টা', timeEn: '10:00 PM', viewers: 49, avgMins: 32 },
];

/**
 * 7-Day Daily Active Sessions Trend
 */
export const DAILY_SESSIONS_TREND = [
  { day: 'শনিবার', dayEn: 'Saturday', date: '২০ সেপ্টে', dateEn: '20 Sep', sessions: 480, uniqueUsers: 340, pageViews: 2150, avgDuration: 13.5 },
  { day: 'রবিবার', dayEn: 'Sunday', date: '২১ সেপ্টে', dateEn: '21 Sep', sessions: 540, uniqueUsers: 390, pageViews: 2480, avgDuration: 14.2 },
  { day: 'সোমবার', dayEn: 'Monday', date: '২২ সেপ্টে', dateEn: '22 Sep', sessions: 670, uniqueUsers: 480, pageViews: 3120, avgDuration: 15.0 },
  { day: 'মঙ্গলবার', dayEn: 'Tuesday', date: '২৩ সেপ্টে', dateEn: '23 Sep', sessions: 710, uniqueUsers: 510, pageViews: 3340, avgDuration: 14.8 },
  { day: 'বুধবার', dayEn: 'Wednesday', date: '২৪ সেপ্টে', dateEn: '24 Sep', sessions: 790, uniqueUsers: 560, pageViews: 3750, avgDuration: 15.6 },
  { day: 'বৃহস্পতিবার', dayEn: 'Thursday', date: '২৫ সেপ্টে', dateEn: '25 Sep', sessions: 920, uniqueUsers: 650, pageViews: 4380, avgDuration: 16.4 },
  { day: 'আজ (শুক্রবার)', dayEn: 'Today (Fri)', date: '২৬ সেপ্টে', dateEn: '26 Sep', sessions: 1140, uniqueUsers: 810, pageViews: 5420, avgDuration: 18.2 },
];

/**
 * Weekly Active Sessions Trend (Last 5 Weeks)
 */
export const WEEKLY_SESSIONS_TREND = [
  { week: 'সপ্তাহ ১', weekEn: 'Week 1', period: '২৪-৩০ আগস্ট', periodEn: '24-30 Aug', sessions: 3850, activeUsers: 1180, pageViews: 17800, avgHoursPerUser: 3.2 },
  { week: 'সপ্তাহ ২', weekEn: 'Week 2', period: '৩১ আগস্ট-০৬ সেপ্টে', periodEn: '31 Aug-06 Sep', sessions: 4420, activeUsers: 1340, pageViews: 20600, avgHoursPerUser: 3.8 },
  { week: 'সপ্তাহ ৩', weekEn: 'Week 3', period: '০৭-১৩ সেপ্টে', periodEn: '07-13 Sep', sessions: 5180, activeUsers: 1560, pageViews: 24200, avgHoursPerUser: 4.2 },
  { week: 'সপ্তাহ ৪', weekEn: 'Week 4', period: '১৪-২০ সেপ্টে', periodEn: '14-20 Sep', sessions: 6100, activeUsers: 1790, pageViews: 28900, avgHoursPerUser: 4.7 },
  { week: 'বর্তমান সপ্তাহ', weekEn: 'This Week', period: '২১-২৭ সেপ্টে', periodEn: '21-27 Sep', sessions: 7250, activeUsers: 2120, pageViews: 34500, avgHoursPerUser: 5.4 },
];

/**
 * Monthly Active Sessions Trend (12 Months)
 */
export const MONTHLY_SESSIONS_TREND = [
  { month: 'অক্টোবর', monthEn: 'Oct', sessions: 11200, users: 2900, pageViews: 52000, avgHoursPerUser: 12.5 },
  { month: 'নভেম্বর', monthEn: 'Nov', sessions: 13500, users: 3400, pageViews: 64000, avgHoursPerUser: 13.8 },
  { month: 'ডিসেম্বর', monthEn: 'Dec', sessions: 16800, users: 4100, pageViews: 79000, avgHoursPerUser: 15.2 },
  { month: 'জানুয়ারি', monthEn: 'Jan', sessions: 20400, users: 4900, pageViews: 96000, avgHoursPerUser: 16.5 },
  { month: 'ফেব্রুয়ারি', monthEn: 'Feb', sessions: 23100, users: 5500, pageViews: 108000, avgHoursPerUser: 17.0 },
  { month: 'মার্চ', monthEn: 'Mar', sessions: 27800, users: 6400, pageViews: 131000, avgHoursPerUser: 18.4 },
  { month: 'এপ্রিল', monthEn: 'Apr', sessions: 31200, users: 7200, pageViews: 148000, avgHoursPerUser: 19.1 },
  { month: 'মে', monthEn: 'May', sessions: 35600, users: 8100, pageViews: 169000, avgHoursPerUser: 20.3 },
  { month: 'জুন', monthEn: 'Jun', sessions: 39800, users: 9000, pageViews: 189000, avgHoursPerUser: 21.0 },
  { month: 'জুলাই', monthEn: 'Jul', sessions: 44200, users: 9900, pageViews: 210000, avgHoursPerUser: 22.2 },
  { month: 'আগস্ট', monthEn: 'Aug', sessions: 49600, users: 11200, pageViews: 238000, avgHoursPerUser: 23.5 },
  { month: 'চলতি মাস (সেপ্টে)', monthEn: 'This Month (Sep)', sessions: 54800, users: 12400, pageViews: 265000, avgHoursPerUser: 25.1 },
];

/**
 * Comparative Time Spent by Marketplace Categories (Daily, Weekly, Monthly)
 */
export const CATEGORY_TIME_SPENT_COMPARISON = [
  { category: 'মোবাইল ও গ্যাজেট', categoryEn: 'Mobiles & Gadgets', dailyMins: 48, weeklyHours: 5.8, monthlyHours: 24.2, activeSessions: 1420 },
  { category: 'মোটরবাইক ও কার', categoryEn: 'Motorbikes & Cars', dailyMins: 42, weeklyHours: 5.1, monthlyHours: 21.5, activeSessions: 1180 },
  { category: 'ইলেকট্রনিক্স ও টিভি', categoryEn: 'Electronics & TVs', dailyMins: 36, weeklyHours: 4.4, monthlyHours: 18.2, activeSessions: 940 },
  { category: 'ঘর ও ফার্নিচার', categoryEn: 'Home & Furniture', dailyMins: 32, weeklyHours: 3.9, monthlyHours: 16.0, activeSessions: 780 },
  { category: 'ফ্যাশন ও লাইফস্টাইল', categoryEn: 'Fashion & Lifestyle', dailyMins: 28, weeklyHours: 3.4, monthlyHours: 14.5, activeSessions: 890 },
  { category: 'কৃষি ও পশুপালন', categoryEn: 'Agro & Animals', dailyMins: 25, weeklyHours: 3.0, monthlyHours: 12.8, activeSessions: 620 },
  { category: 'চাকরি ও সেবা', categoryEn: 'Jobs & Services', dailyMins: 22, weeklyHours: 2.7, monthlyHours: 11.2, activeSessions: 510 },
];
