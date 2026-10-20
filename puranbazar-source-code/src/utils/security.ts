import { 
  StaffMember, StaffRole, StaffPermissions, SecurityAuditLog, SecuritySettings,
  RevenueItem, AdSenseStats, PayoutAccount, WithdrawalRequest, GoogleAdSenseConfig, PayoutPolicySettings
} from '../types';

export const STORAGE_KEY_STAFF = 'puranbazar_staff_v1';
export const STORAGE_KEY_AUDIT_LOGS = 'puranbazar_audit_logs_v1';
export const STORAGE_KEY_SECURITY_SETTINGS = 'puranbazar_security_settings_v1';
export const STORAGE_KEY_CURRENT_STAFF = 'puranbazar_current_staff_session_v1';
export const STORAGE_KEY_REVENUE_ITEMS = 'puranbazar_revenue_items_v1';
export const STORAGE_KEY_ADSENSE_STATS = 'puranbazar_adsense_stats_v1';
export const STORAGE_KEY_ADSENSE_CONFIG = 'puranbazar_adsense_config_v1';
export const STORAGE_KEY_PAYOUT_ACCOUNTS = 'puranbazar_payout_accounts_v1';
export const STORAGE_KEY_PAYOUT_POLICY = 'puranbazar_payout_policy_v1';
export const STORAGE_KEY_WITHDRAWALS = 'puranbazar_withdrawals_v1';

export const ROLE_DEFAULT_PERMISSIONS: Record<StaffRole, StaffPermissions> = {
  super_admin: {
    canApproveAds: true,
    canRejectAds: true,
    canDeleteAds: true,
    canFeatureAds: true,
    canResolveReports: true,
    canViewRevenue: true,
    canManageStaff: true,
    canConfigureSecurity: true,
    canViewAuditLogs: true,
    canManagePayouts: true, // Only Super Admin
    canManageUsers: true,   // User Moderation (Ban/Suspend/Reactivate)
  },
  admin: {
    canApproveAds: true,
    canRejectAds: true,
    canDeleteAds: true,
    canFeatureAds: true,
    canResolveReports: true,
    canViewRevenue: true,
    canManageStaff: false,
    canConfigureSecurity: false,
    canViewAuditLogs: true,
    canManagePayouts: false, // Disallowed
    canManageUsers: true,   // User Moderation (Ban/Suspend/Reactivate)
  },
  content_moderator: {
    canApproveAds: true,
    canRejectAds: true,
    canDeleteAds: false,
    canFeatureAds: false,
    canResolveReports: false,
    canViewRevenue: false,
    canManageStaff: false,
    canConfigureSecurity: false,
    canViewAuditLogs: false,
    canManagePayouts: false, // Disallowed
    canManageUsers: true,   // User Moderation (Ban/Suspend/Reactivate)
  },
  support_moderator: {
    canApproveAds: false,
    canRejectAds: false,
    canDeleteAds: false,
    canFeatureAds: false,
    canResolveReports: true,
    canViewRevenue: false,
    canManageStaff: false,
    canConfigureSecurity: false,
    canViewAuditLogs: false,
    canManagePayouts: false, // Disallowed
    canManageUsers: true,   // User Moderation (Ban/Suspend/Reactivate)
  },
};

export const STAFF_PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
];

export const ROLE_DETAILS: Record<StaffRole, { nameBn: string; title: string; badgeColor: string; description: string }> = {
  super_admin: {
    nameBn: 'সুপার এডমিন (Super Admin)',
    title: 'চিফ সিস্টেম এডমিনিস্ট্রেটর',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
    description: 'সর্বোচ্চ ক্ষমতা সম্পন্ন। এডমিন ও মডারেটর নিয়োগ, ডিলিট, সিকিউরিটি পলিসি নিয়ন্ত্রণ এবং সকল ডাটার অ্যাক্সেস।',
  },
  admin: {
    nameBn: 'সাধারণ এডমিন (Admin)',
    title: 'অপারেশনস ম্যানেজার',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
    description: 'বিজ্ঞাপন অনুমোদন, ফিচার্ড টগল, প্রতারণার রিপোর্ট সমাধান এবং পেমেন্ট রাজস্ব পর্যবেক্ষণ।',
  },
  content_moderator: {
    nameBn: 'কন্টেন্ট মডারেটর (Content Moderator)',
    title: 'বিজ্ঞাপন পরীক্ষক ও এডিটর',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    description: 'বিজ্ঞাপন যাচাই, ভুল তথ্য সংশোধন এবং প্রতারক ব্যবহারকারীদের একাউন্ট স্থগিত করার ক্ষমতা।',
  },
  support_moderator: {
    nameBn: 'সাপোর্ট ও নিরাপত্তা মডারেটর (Safety Officer)',
    title: 'গ্রাহক সুরক্ষা কর্মকর্তা',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    description: 'ক্রেতা-বিক্রেতার রিপোর্ট তদন্ত, ভুয়া বিজ্ঞাপন চিহ্নিতকরণ এবং সন্দেহভাজন ইউজার একাউন্ট স্থগিত বা ব্যান করার ক্ষমতা।',
  },
};

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-super-1',
    name: 'Md Shaidur Hossen',
    email: 'shaidurfrlncr@gmail.com',
    phone: '01517830164',
    role: 'super_admin',
    status: 'active',
    password: 'Admin@2026',
    securityPin: '998877',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    failedLoginAttempts: 0,
    lastLogin: '২৩ সেপ্টেম্বর ২০২৬, ১৮:৩০',
    lastLoginIp: '103.145.12.89 (Dhaka, Bangladesh)',
    createdAt: '০১ জানুয়ারি ২০২৬',
    permissions: ROLE_DEFAULT_PERMISSIONS.super_admin,
  },
  {
    id: 'staff-admin-2',
    name: 'তানজিল করিম',
    email: 'tanzil@puranbazar.com',
    phone: '01711-224466',
    role: 'admin',
    status: 'active',
    password: 'Admin@123',
    securityPin: '554433',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    failedLoginAttempts: 0,
    lastLogin: '২৩ সেপ্টেম্বর ২০২৬, ১২:১৫',
    lastLoginIp: '103.145.14.22 (Dhaka, Bangladesh)',
    createdAt: '১৫ জানুয়ারি ২০২৬',
    permissions: ROLE_DEFAULT_PERMISSIONS.admin,
  },
  {
    id: 'staff-mod-3',
    name: 'সাদিয়া সুলতানা',
    email: 'moderator@puranbazar.com',
    phone: '01822-335577',
    role: 'content_moderator',
    status: 'active',
    password: 'Mod@2026',
    securityPin: '112233',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
    failedLoginAttempts: 0,
    lastLogin: '২৩ সেপ্টেম্বর ২০২৬, ১৭:৪৫',
    lastLoginIp: '103.111.45.19 (Manikganj, Bangladesh)',
    createdAt: '০১ ফেব্রুয়ারি ২০২৬',
    permissions: ROLE_DEFAULT_PERMISSIONS.content_moderator,
  },
  {
    id: 'staff-safe-4',
    name: 'ফাহিম আশরাফ',
    email: 'safety@puranbazar.com',
    phone: '01933-446688',
    role: 'support_moderator',
    status: 'active',
    password: 'Safe@2026',
    securityPin: '332211',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    failedLoginAttempts: 0,
    lastLogin: '২৩ সেপ্টেম্বর ২০২৬, ১৪:২০',
    lastLoginIp: '103.200.78.4 (Dhaka, Bangladesh)',
    createdAt: '১০ ফেব্রুয়ারি ২০২৬',
    permissions: ROLE_DEFAULT_PERMISSIONS.support_moderator,
  },
];

export const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  maxFailedAttempts: 5,
  lockoutDurationMinutes: 15,
  sessionTimeoutMinutes: 30,
  requirePinForDestructiveActions: true,
  twoFactorEnabled: false,
  disallowDuplicatePhoneAds: true,
  autoExpireDays: 30,
  strictInputSanitization: true,
  systemLockdown: false,
};

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '২৩ সেপ্টেম্বর ২০২৬, ১৮:১৫',
    actorId: 'staff-super-1',
    actorName: 'ইঞ্জিনিয়ার শাহিদুল ইসলাম',
    actorRole: 'super_admin',
    action: 'LOGIN_SUCCESS',
    target: 'Security System',
    details: 'সুপার এডমিন পোর্টালে সফলভাবে লগইন করেছেন (Two-Factor Verified)',
    ipAddress: '103.145.12.89',
    status: 'success',
  },
  {
    id: 'log-2',
    timestamp: '২৩ সেপ্টেম্বর ২০২৬, ১৭:৪৬',
    actorId: 'staff-mod-3',
    actorName: 'সাদিয়া সুলতana',
    actorRole: 'content_moderator',
    action: 'AD_APPROVED',
    target: 'Ad #ad-1 (iPhone 13)',
    details: 'বিজ্ঞাপন পর্যালোচনা করে নীতিমালার শর্ত পূরণ করায় অনুমোদন প্রদান',
    ipAddress: '103.111.45.19',
    status: 'success',
  },
  {
    id: 'log-3',
    timestamp: '২৩ সেপ্টেম্বর ২০২৬, ১৬:১০',
    actorId: 'UNKNOWN_IP',
    actorName: 'অজানা অনুপ্রবেশকারী',
    actorRole: 'content_moderator',
    action: 'BRUTE_FORCE_BLOCKED',
    target: 'admin@puranbazar.com',
    details: 'ভুল পাসওয়ার্ড দিয়ে ক্রমাগত ব্যর্থ চেষ্টার কারণে আইপি ১৫ মিনিটের জন্য স্বয়ংক্রিয় লক করা হয়েছে',
    ipAddress: '45.133.1.20',
    status: 'blocked',
  },
];

/**
 * XSS & HTML Injection Sanitization
 * Strips script tags, iframe, onload, javascript: protocols to prevent malicious payload attacks.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .trim();
}

/**
 * Check if staff account is currently locked due to too many failed attempts
 */
export function checkBruteForceLock(staff: StaffMember, settings: SecuritySettings): { isLocked: boolean; remainingSeconds: number } {
  if (!staff.lockedUntil) {
    return { isLocked: false, remainingSeconds: 0 };
  }

  const now = Date.now();
  if (now < staff.lockedUntil) {
    const remainingSeconds = Math.ceil((staff.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }

  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message: string } {
  if (password.length < 6) {
    return { isValid: false, message: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' };
  }
  return { isValid: true, message: 'পাসওয়ার্ড শক্তিশালী ও সুরক্ষিত' };
}

/* =========================================================================
   BANGLADESHI BANKS, MFS & PAYOUT REVENUE DATASETS (SUPER ADMIN EXCLUSIVE)
   ========================================================================= */

export const BANGLADESH_BANKS = [
  'ডাচ-বাংলা ব্যাংক পিএলসি (DBBL)',
  'ব্র্যাক ব্যাংক পিএলসি (BRAC Bank)',
  'ইসলামী ব্যাংক বাংলাদেশ পিএলসি (IBBL)',
  'সিটি ব্যাংক পিএলসি (The City Bank)',
  'ইস্টার্ন ব্যাংক পিএলসি (EBL)',
  'মিউচুয়াল ট্রাস্ট ব্যাংক (MTB)',
  'সোনালী ব্যাংক পিএলসি (Sonali Bank)',
  'পূবালী ব্যাংক পিএলসি (Pubali Bank)',
  'অগ্রণী ব্যাংক পিএলসি (Agrani Bank)',
  'ট্রাস্ট ব্যাংক পিএলসি (Trust Bank)',
  'ইউনাইটেড কমার্শিয়াল ব্যাংক (UCB)',
  'ব্যাংক এশিয়া পিএলসি (Bank Asia)',
];

export const BANGLADESH_BANKS_SWIFT: Record<string, string> = {
  'ডাচ-বাংলা ব্যাংক পিএলসি (DBBL)': 'DBBLBDDH',
  'ব্র্যাক ব্যাংক পিএলসি (BRAC Bank)': 'BRAKBDDH',
  'ইসলামী ব্যাংক বাংলাদেশ পিএলসি (IBBL)': 'IBBLBDDH',
  'সিটি ব্যাংক পিএলসি (The City Bank)': 'CIUBBDDH',
  'ইস্টার্ন ব্যাংক পিএলসি (EBL)': 'EBLNBDDH',
  'মিউচুয়াল ট্রাস্ট ব্যাংক (MTB)': 'MTBLBDDH',
  'সোনালী ব্যাংক পিএলসি (Sonali Bank)': 'BSONBDDH',
  'পূবালী ব্যাংক পিএলসি (Pubali Bank)': 'PUBABDDH',
  'অগ্রণী ব্যাংক পিএলসি (Agrani Bank)': 'AGBKBDDH',
  'ট্রাস্ট ব্যাংক পিএলসি (Trust Bank)': 'TRBLBDDH',
  'ইউনাইটেড কমার্শিয়াল ব্যাংক (UCB)': 'UCBLBDDH',
  'ব্যাংক এশিয়া পিএলসি (Bank Asia)': 'BASIBDDH',
};

export const BANGLADESH_MFS = [
  'বিকাশ (bKash) - Personal/Merchant',
  'নগদ (Nagad)',
  'রকেট (Rocket - DBBL)',
  'উপায় (Upay - UCB)',
];

export const INITIAL_ADSENSE_CONFIG: GoogleAdSenseConfig = {
  publisherId: 'ca-pub-8849201948291034',
  verificationStatus: 'verified',
  siteVerificationMeta: 'google-site-verification=pb_verify_99812401827401',
  autoAdsEnabled: true,
  adsTxtVerified: true,
  adsTxtContent: 'google.com, pub-8849201948291034, DIRECT, f08c47fec0942fa0',
  adUnits: {
    headerBanner: true,
    feedInArticle: true,
    sidebarSticky: false,
    adDetailBottom: true,
  },
  wireTransferBankId: 'acc-agrani-1',
  paymentThresholdUSD: 100,
  conversionRateBDT: 122,
  sponsorSlot1: {
    enabled: false,
    title: 'টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার',
    badgeText: 'ব্র্যান্ড অফার',
    subtitle: 'গুগল অ্যাডসেন্স নীতিমালা অনুযায়ী স্পষ্ট লেবেলযুক্ত স্লট',
    bannerImageUrl: '',
    targetLinkUrl: '',
    advertiserName: '',
  },
  sponsorSlot2: {
    enabled: false,
    title: 'নতুন পণ্য ও এক্সচেঞ্জ অফার',
    badgeText: 'এক্সচেঞ্জ অফার',
    subtitle: 'বিশ্বস্ত পার্টনার ও এক্সচেঞ্জ শপের প্রিমিয়াম অফার',
    bannerImageUrl: '',
    targetLinkUrl: '',
    advertiserName: '',
  },
};

export const INITIAL_PAYOUT_POLICY: PayoutPolicySettings = {
  minWithdrawalBDT: 1000,
  maxDailyWithdrawalBDT: 100000,
  mfsCashoutFeePercent: 0,
  bankTransferFeeBDT: 0,
  enforcePin2FA: true,
  notifyEmail: true,
  notifySms: true,
  notificationPhone: '01517830164',
  notificationEmail: 'adminpuranbazar@gmail.com',
  clearingScheduleText: 'ব্যাংক কার্যদিবসে (রবি-বৃহস্পতি) BEFTN ক্লিয়ারিং এবং বিকাশ/নগদে তাৎক্ষণিক নিষ্পত্তি।',
};

export const INITIAL_ADSENSE_STATS: AdSenseStats = {
  totalLifetimeEarnings: 64350,
  unpaidBalance: 18720,
  thisMonthEarnings: 12450,
  lastMonthEarnings: 10900,
  pageViews: 184500,
  impressions: 422000,
  clicks: 9840,
  ctr: 2.33,
  rpm: 29.5,
  lastUpdated: '২৩ সেপ্টেম্বর ২০২৬',
  adSensePublisherId: 'pub-8849201948291034',
  autoPayoutThreshold: 12000,
};

export const INITIAL_REVENUE_ITEMS: RevenueItem[] = [
  {
    id: 'rev-1',
    stream: 'adsense',
    streamNameBn: 'গুগল এডসেন্স (Google AdSense)',
    sourceTitle: 'ওয়েবসাইট ও সার্চ রেজাল্ট ব্যানার অ্যাডস রাজস্ব',
    description: 'সেপ্টেম্বর ২০২৬ মাসিক বিজ্ঞাপন ইমপ্রেশন ও ক্লিকের আয়',
    amount: 12450,
    channel: 'Google AdSense',
    trxId: 'ADS-2026-09-BD',
    date: '২৩ সেপ্টেম্বর ২০২৬',
    status: 'received',
  },
  {
    id: 'rev-2',
    stream: 'featured_ads',
    streamNameBn: 'ফিচার্ড ও টপ বিজ্ঞাপন',
    sourceTitle: 'iPhone 13 টপ লিস্টিং প্যাকেজ (৩০ দিন)',
    description: 'বিক্রেতা শাহিদুল ইসলাম কর্তৃক বিকাশ পেমেন্ট',
    amount: 199,
    channel: 'bKash',
    trxId: '9K8J294LZ1',
    date: '২২ সেপ্টেম্বর ২০২৬',
    status: 'received',
  },
  {
    id: 'rev-3',
    stream: 'featured_ads',
    streamNameBn: 'ফিচার্ড ও টপ বিজ্ঞাপন',
    sourceTitle: 'HP Pavilion ল্যাপটপ প্রিমিয়াম প্যাকেজ (১৫ দিন)',
    description: 'বিক্রেতা তানভীর আহমেদ কর্তৃক নগদ পেমেন্ট',
    amount: 99,
    channel: 'Nagad',
    trxId: '7B3L991XP2',
    date: '২১ সেপ্টেম্বর ২০২৬',
    status: 'received',
  },
  {
    id: 'rev-4',
    stream: 'seller_verification',
    streamNameBn: 'ভেরিফাইড সেলার সাবস্ক্রিপশন',
    sourceTitle: 'ব্লু ভেরিফাইড ট্রাস্ট ব্যাজ (বার্ষিক সাবস্ক্রিপশন)',
    description: 'মানিকগঞ্জ ইলেকট্রনিক্স হাব মার্চেন্ট একাউন্ট ভেরিফিকেশন ফি',
    amount: 1500,
    channel: 'Bank Transfer',
    trxId: 'EFT-889104',
    date: '২০ সেপ্টেম্বর ২০২৬',
    status: 'received',
  },
  {
    id: 'rev-5',
    stream: 'banner_sponsorship',
    streamNameBn: 'স্পন্সরড ব্যানার প্রোমোশন',
    sourceTitle: 'হোমপেজ হিরো ব্র্যান্ড পার্টনার ব্যানার (ওয়ালটন মেগা সেল)',
    description: 'সরাসরি পার্টনারশিপ ব্যানার বিজ্ঞাপন ফি',
    amount: 15000,
    channel: 'Bank Transfer',
    trxId: 'BEFTN-2026-WALTON-9',
    date: '১৫ সেপ্টেম্বর ২০২৬',
    status: 'received',
  },
  {
    id: 'rev-6',
    stream: 'escrow_fee',
    streamNameBn: 'নিরাপদ লেনদেন (Escrow) সার্ভিস চার্জ',
    sourceTitle: 'বাইক ডেলিভারি সেফ ডিল ১% প্ল্যাটফর্ম কমিশন',
    description: 'Yamaha FZ V3 লেনদেনে ক্রেতা-বিক্রেতা সুরক্ষা ফি',
    amount: 1200,
    channel: 'bKash',
    trxId: 'BK-SAFE-9901',
    date: '১০ সেপ্টেম্বর ২০২৬',
    status: 'received',
  },
];

export const INITIAL_PAYOUT_ACCOUNTS: PayoutAccount[] = [
  {
    id: 'acc-agrani-1',
    type: 'bank',
    providerName: 'অগ্রণী ব্যাংক পিএলসি (Agrani Bank)',
    accountName: 'Md Shaidur Hossen',
    accountNumber: '0200018344327',
    branchName: 'Manikganj Branch',
    routingNumber: '010560619',
    swiftCode: 'AGBKBDDH',
    accountCategory: 'personal',
    isDefault: true,
    addedAt: '১৮ অক্টোবর ২০২৬',
  },
  {
    id: 'acc-dbbl-1',
    type: 'bank',
    providerName: 'ডাচ-বাংলা ব্যাংক পিএলসি (DBBL)',
    accountName: 'Md Shaidur Hossen',
    accountNumber: '115.120.0094821',
    branchName: 'মিরপুর-১০ শাখা, ঢাকা',
    routingNumber: '090271421',
    swiftCode: 'DBBLBDDH',
    accountCategory: 'corporate',
    isDefault: false,
    addedAt: '০১ জানুয়ারি ২০২৬',
  },
  {
    id: 'acc-bkash-3',
    type: 'mfs',
    providerName: 'বিকাশ (bKash) - Personal/Merchant',
    accountName: 'Md Shaidur Hossen (PuranBazar Official)',
    accountNumber: '01517830164',
    accountCategory: 'merchant',
    mfsChannel: 'bKash',
    isDefault: false,
    addedAt: '০৫ ফেব্রুয়ারি ২০২৬',
  },
  {
    id: 'acc-nagad-4',
    type: 'mfs',
    providerName: 'নগদ (Nagad)',
    accountName: 'Md Shaidur Hossen',
    accountNumber: '01712345678',
    accountCategory: 'personal',
    mfsChannel: 'Nagad',
    isDefault: false,
    addedAt: '১০ ফেব্রুয়ারি ২০২৬',
  },
];

export const INITIAL_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
  {
    id: 'wd-1',
    referenceNo: 'PB-WD-2026-101',
    amount: 25000,
    deductionsOrFee: 0,
    netAmount: 25000,
    payoutAccountId: 'acc-agrani-1',
    payoutAccountTitle: 'অগ্রণী ব্যাংক পিএলসি (A/C: 0200018344327)',
    payoutChannelType: 'bank',
    targetDetails: 'মানিকগঞ্জ শাখা (রাউটিং: 010560619, SWIFT: AGBKBDDH)',
    requestedAt: '০৫ সেপ্টেম্বর ২০২৬, ১১:৩০',
    processedAt: '০৫ সেপ্টেম্বর ২০২৬, ১৫:৪৫',
    status: 'completed',
    bankTxReference: 'BEFTN-20260905AGRANI88192',
    notes: 'এডসেন্স ও প্রিমিয়াম লিস্টিং আয়ের উত্তোলন সম্পন্ন হয়েছে',
    approvedBy: 'Md Shaidur Hossen (Super Admin)',
  },
  {
    id: 'wd-2',
    referenceNo: 'PB-WD-2026-102',
    amount: 10000,
    deductionsOrFee: 0,
    netAmount: 10000,
    payoutAccountId: 'acc-bkash-3',
    payoutAccountTitle: 'বিকাশ মার্চেন্ট (01517830164)',
    payoutChannelType: 'mfs',
    targetDetails: 'bKash MFS Official Gateway',
    requestedAt: '১৫ সেপ্টেম্বর ২০২৬, ১৬:২০',
    processedAt: '১৫ সেপ্টেম্বর ২০২৬, ১৬:২৫',
    status: 'completed',
    bankTxReference: 'BK-TRX-9982410L',
    notes: 'জরুরি সার্ভার বিল ও অপারেশনস খাতের উত্তোলন',
    approvedBy: 'ইঞ্জিনিয়ার শাহিদুল ইসলাম (Super Admin)',
  },
  {
    id: 'wd-3',
    referenceNo: 'PB-WD-2026-103',
    amount: 15000,
    deductionsOrFee: 0,
    netAmount: 15000,
    payoutAccountId: 'acc-brac-2',
    payoutAccountTitle: 'ব্র্যাক ব্যাংক (A/C: 1501204892831001)',
    payoutChannelType: 'bank',
    targetDetails: 'মানিকগঞ্জ শাখা (রাউটিং: 060261942)',
    requestedAt: '২২ সেপ্টেম্বর ২০২৬, ১৮:০০',
    status: 'processing',
    bankTxReference: 'NPSB-IN-PROGRESS-2026',
    notes: 'স্পন্সরশিপ ও বিজ্ঞাপন রাজস্ব উত্তোলন প্রক্রিয়াধীন',
    approvedBy: 'ইঞ্জিনিয়ার শাহিদুল ইসলাম (Super Admin)',
  },
];

