export type Condition = 'brand_new' | 'like_new' | 'good' | 'fair' | 'refurbished';

export interface Category {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  subcategories: string[];
}

export interface Ad {
  id: string;
  seller_id?: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  category_id: string;
  subcategory: string;
  condition: Condition;
  division: string;
  district: string;
  upazila: string;
  images: string[];
  seller_name: string;
  seller_phone: string;
  seller_email?: string;
  seller_verified: boolean;
  seller_joined: string;
  status: 'pending' | 'approved' | 'rejected';
  featured_tier: 'none' | 'featured' | 'premium' | 'top';
  views: number;
  created_at: string;
  // Special Deals, Offers & Exchange Flags
  isTopDeal?: boolean;              // টপ ডিলস / বিশেষ মূল্যছাড়
  originalPrice?: number;           // পূর্বের রেগুলার মূল্য (স্ট্রাইকথ্রুর জন্য)
  dealDiscountPercent?: number;     // যেমন: ১৫% বা ২০%
  isBrandOffer?: boolean;           // বিশ্বস্ত ব্র্যান্ড অফার
  brandName?: string;               // যেমন: Samsung, Apple, Walton
  brandWarranty?: string;           // যেমন: '১ বছরের অফিশিয়াল ওয়ারেন্টি'
  isExchangeable?: boolean;         // এক্সচেঞ্জ অফার (অদল-বদল সুবিধা)
  exchangeDetails?: string;         // যেমন: 'পুরাতন ফোন দিয়ে অদল-বদল সম্ভব'
}

/* =========================================================================
   VISITOR & SELLER USER PROFILE TYPES
   ========================================================================= */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  division: string;
  district: string;
  upazila?: string;
  avatar?: string;
  joinedAt: string;
  isVerified: boolean;
  bio?: string;
  // Account Moderation & Ban / Suspension Tracking
  status?: 'active' | 'suspended' | 'banned';
  suspendedUntil?: string | null;     // e.g. "৭ দিন (১৩ অক্টোবর ২০২৬ পর্যন্ত)" or "স্থায়ী ব্যান (Permanent)"
  suspendedReason?: string;           // e.g. "প্রতারণামূলক বিজ্ঞাপন ও ফেক মোবাইল নম্বর"
  suspendedAt?: string;               // e.g. "০৬ অক্টোবর ২০২৬, ০৩:১৫ PM"
  suspendedBy?: {
    staffId: string;
    staffName: string;
    staffRole: StaffRole;
    staffRoleNameBn: string;          // e.g. "কন্টেন্ট মডারেটর", "সাপোর্ট অফিসার", "সাধারণ এডমিন", "সুপার এডমিন"
  };
}


export interface AdReport {
  id: string;
  ad_id: string;
  ad_title: string;
  reporter_name: string;
  reporter_phone: string;
  reason: 'fake_product' | 'scam' | 'wrong_information' | 'prohibited_content' | 'duplicate_ad';
  details: string;
  created_at: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface ChatMessage {
  id: string;
  ad_id: string;
  sender_name: string;
  sender_phone: string;
  text: string;
  timestamp: string;
  is_seller: boolean;
}

export interface FeaturedPayment {
  id: string;
  ad_id: string;
  ad_title: string;
  package_name: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Rocket';
  trx_id: string;
  created_at: string;
  status: 'completed' | 'pending';
}

export interface BuyingGuide {
  id: string;
  title: string;
  category: string;
  read_time: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface LocationDivision {
  name: string;
  districts: {
    name: string;
    upazilas: string[];
  }[];
}

/* =========================================================================
   STAFF, RBAC & ANTI-HACKING SECURITY TYPES
   ========================================================================= */

export type StaffRole = 'super_admin' | 'admin' | 'content_moderator' | 'support_moderator';

export interface StaffPermissions {
  canApproveAds: boolean;
  canRejectAds: boolean;
  canDeleteAds: boolean;
  canFeatureAds: boolean;
  canResolveReports: boolean;
  canViewRevenue: boolean;
  canManageStaff: boolean;      // Only Super Admin
  canConfigureSecurity: boolean; // Only Super Admin
  canViewAuditLogs: boolean;
  canManagePayouts: boolean;    // Only Super Admin
  canManageUsers: boolean;      // Super Admin, Admin, Content Moderator, Support Moderator (all 4 can ban/suspend users)
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: 'active' | 'suspended';
  password: string;             // Password
  securityPin: string;          // 6-digit PIN for high-risk operations
  avatar?: string;
  lastLogin?: string;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  lockedUntil?: number | null;  // Timestamp in ms
  createdAt: string;
  permissions: StaffPermissions;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: StaffRole;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'blocked';
}

export interface SecuritySettings {
  maxFailedAttempts: number;          // e.g. 5 attempts
  lockoutDurationMinutes: number;     // e.g. 15 minutes
  sessionTimeoutMinutes: number;      // e.g. 30 minutes
  requirePinForDestructiveActions: boolean;
  twoFactorEnabled: boolean;
  disallowDuplicatePhoneAds: boolean;
  autoExpireDays: number;
  strictInputSanitization: boolean;
  systemLockdown: boolean;            // Emergency maintenance mode
}

/* =========================================================================
   REVENUE & BANGLADESHI BANK / MFS PAYOUT TYPES (SUPER ADMIN ONLY)
   ========================================================================= */

export type RevenueStreamType = 
  | 'adsense' 
  | 'featured_ads' 
  | 'seller_verification' 
  | 'banner_sponsorship' 
  | 'escrow_fee';

export interface RevenueItem {
  id: string;
  stream: RevenueStreamType;
  streamNameBn: string;
  sourceTitle: string;
  description: string;
  amount: number;
  channel: 'Google AdSense' | 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
  trxId?: string;
  date: string;
  status: 'received' | 'accrued';
}

export interface AdSenseStats {
  totalLifetimeEarnings: number;
  unpaidBalance: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  pageViews: number;
  impressions: number;
  clicks: number;
  ctr: number;
  rpm: number;
  lastUpdated: string;
  adSensePublisherId: string;
  autoPayoutThreshold: number; // e.g. ৳১২,০০০
}

export interface PayoutAccount {
  id: string;
  type: 'bank' | 'mfs';
  providerName: string;       // e.g. 'ডাচ-বাংলা ব্যাংক (DBBL)', 'বিকাশ (bKash)', 'ব্র্যাক ব্যাংক (BRAC Bank)'
  accountName: string;        // e.g. 'শাহিদুল ইসলাম'
  accountNumber: string;      // A/C or mobile number
  branchName?: string;        // For banks
  routingNumber?: string;     // 9-digit Bangladesh Bank routing
  swiftCode?: string;         // 8-11 character SWIFT/BIC for AdSense Wire Transfer
  accountCategory?: 'personal' | 'agent' | 'merchant' | 'corporate';
  mfsChannel?: 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
  isDefault: boolean;
  addedAt: string;
}

export interface CustomSponsorBanner {
  enabled: boolean;
  title: string;
  badgeText?: string;
  subtitle?: string;
  bannerImageUrl?: string;
  targetLinkUrl?: string;
  advertiserName?: string;
}

export interface GoogleAdSenseConfig {
  publisherId: string;           // e.g. "ca-pub-8849201948291034"
  verificationStatus: 'verified' | 'pending' | 'action_needed';
  siteVerificationMeta: string;  // e.g. "google-site-verification=pb_verify_99812401827401"
  autoAdsEnabled: boolean;
  adsTxtVerified: boolean;
  adsTxtContent: string;
  adUnits: {
    headerBanner: boolean;
    feedInArticle: boolean;
    sidebarSticky: boolean;
    adDetailBottom: boolean;
  };
  wireTransferBankId?: string;   // Linked bank account for AdSense Wire Transfer
  paymentThresholdUSD: number;   // $100 USD
  conversionRateBDT: number;     // e.g. 122 BDT per USD
  sponsorSlot1?: CustomSponsorBanner; // Slot 1: Top Deals
  sponsorSlot2?: CustomSponsorBanner; // Slot 2: Exchange & New Products
}

export interface PayoutPolicySettings {
  minWithdrawalBDT: number;          // e.g. 1000
  maxDailyWithdrawalBDT: number;     // e.g. 100000
  mfsCashoutFeePercent: number;      // e.g. 0% or 1.5%
  bankTransferFeeBDT: number;        // e.g. 0
  enforcePin2FA: boolean;            // Require 6-digit PIN
  notifyEmail: boolean;
  notifySms: boolean;
  notificationPhone: string;
  notificationEmail: string;
  clearingScheduleText: string;
}

export interface WithdrawalRequest {
  id: string;
  referenceNo: string;        // e.g. 'PB-WD-2026-901'
  amount: number;
  deductionsOrFee: number;
  netAmount: number;
  payoutAccountId: string;
  payoutAccountTitle: string;
  payoutChannelType: 'bank' | 'mfs';
  targetDetails: string;
  requestedAt: string;
  processedAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bankTxReference?: string;   // BEFTN / NPSB / Trx ID
  notes?: string;
  approvedBy: string;         // Super Admin Name
}

