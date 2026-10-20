/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedAdsSection } from './components/FeaturedAdsSection';
import { AdListingGrid } from './components/AdListingGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PostAdModal } from './components/PostAdModal';
import { AdminPanel } from './components/AdminPanel';
import { SecretAdminPortal } from './components/SecretAdminPortal';
import { UserAuthModal } from './components/UserAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { BoostAdModal } from './components/BoostAdModal';
import { ChatDrawer } from './components/ChatDrawer';
import { ReportAdModal } from './components/ReportAdModal';
import { BuyingGuidesSection } from './components/BuyingGuidesSection';
import { AdSenseNotice } from './components/AdSenseNotice';
import { Footer } from './components/Footer';
import { Language, STORAGE_KEY_LANG } from './utils/i18n';

import { 
  Ad, AdReport, FeaturedPayment, Condition, StaffMember, SecurityAuditLog, SecuritySettings,
  RevenueItem, AdSenseStats, PayoutAccount, WithdrawalRequest, UserProfile,
  GoogleAdSenseConfig, PayoutPolicySettings
} from './types';
import { 
  testFirestoreConnection, 
  subscribeToCloudAds, 
  saveAdToCloud, 
  deleteAdFromCloud, 
  saveReportToCloud, 
  savePaymentToCloud,
  seedInitialAdsToCloud 
} from './services/firebase';
import { INITIAL_ADS, INITIAL_PENDING_ADS } from './data/mockAds';
import { useTheme } from './hooks/useTheme';
import { 
  INITIAL_STAFF_MEMBERS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_SECURITY_SETTINGS,
  INITIAL_ADSENSE_STATS,
  INITIAL_ADSENSE_CONFIG,
  INITIAL_REVENUE_ITEMS,
  INITIAL_PAYOUT_ACCOUNTS,
  INITIAL_PAYOUT_POLICY,
  INITIAL_WITHDRAWAL_REQUESTS,
  STORAGE_KEY_STAFF,
  STORAGE_KEY_AUDIT_LOGS,
  STORAGE_KEY_SECURITY_SETTINGS,
  STORAGE_KEY_CURRENT_STAFF,
  STORAGE_KEY_REVENUE_ITEMS,
  STORAGE_KEY_ADSENSE_STATS,
  STORAGE_KEY_ADSENSE_CONFIG,
  STORAGE_KEY_PAYOUT_ACCOUNTS,
  STORAGE_KEY_PAYOUT_POLICY,
  STORAGE_KEY_WITHDRAWALS,
  ROLE_DETAILS,
  sanitizeInput
} from './utils/security';
import { 
  INITIAL_REGISTERED_USERS, 
  STORAGE_KEY_REGISTERED_USERS, 
  STORAGE_KEY_CURRENT_USER 
} from './utils/userAuth';
import { AlertOctagon } from 'lucide-react';

const STORAGE_KEY_ADS = 'puranbazar_ads_v1';
const STORAGE_KEY_REPORTS = 'puranbazar_reports_v1';
const STORAGE_KEY_PAYMENTS = 'puranbazar_payments_v1';

export default function App() {
  // Theme switcher
  const { isDark, toggleTheme } = useTheme();

  // 1. Visitor / Seller User Profile State
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REGISTERED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isUserAuthOpen, setIsUserAuthOpen] = useState(false);
  const [userAuthTab, setUserAuthTab] = useState<'login' | 'register'>('login');
  const [userAuthPrompt, setUserAuthPrompt] = useState<string | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);
  const [postAdPendingAuth, setPostAdPendingAuth] = useState(false);
  const [boostingAd, setBoostingAd] = useState<Ad | null>(null);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY_LANG) as Language) || 'bn';
    } catch {
      return 'bn';
    }
  });

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next: Language = prev === 'bn' ? 'en' : 'bn';
      try {
        localStorage.setItem(STORAGE_KEY_LANG, next);
        // If inside native Android WebView with JS bridge
        if ((window as any).AndroidApp?.onLanguageChanged) {
          (window as any).AndroidApp.onLanguageChanged(next);
        }
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  // Listen to external/Android storage event for language sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_LANG && e.newValue) {
        setLanguage(e.newValue as Language);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // 2. Staff & Security State
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAFF);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STAFF_MEMBERS;
  });

  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_STAFF);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SECURITY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SECURITY_SETTINGS;
  });

  // 2. Marketplace Data State
  const [ads, setAds] = useState<Ad[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [...INITIAL_ADS, ...INITIAL_PENDING_ADS];
  });

  const [reports, setReports] = useState<AdReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'rep-init-1',
        ad_id: 'ad-1',
        ad_title: 'iPhone 13 128GB Midnight Black',
        reporter_name: 'সাকিব আল হাসান',
        reporter_phone: '01811-223344',
        reason: 'wrong_information',
        details: 'ফোনটির ব্যাটারি হেলথ ৮৭% লেখা কিন্তু ফোনে ৮৫% দেখাচ্ছে। তথ্য ঠিক করে দিতে হবে।',
        created_at: '২২ সেপ্টেম্বর ২০২৬',
        status: 'pending'
      }
    ];
  });

  const [payments, setPayments] = useState<FeaturedPayment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'pay-1',
        ad_id: 'ad-1',
        ad_title: 'iPhone 13 128GB Midnight Black',
        package_name: 'Top Listing (৳১৯৯ / ৩০ দিন)',
        amount: 199,
        method: 'bKash',
        trx_id: '9K8J294LZ1',
        created_at: '২২ সেপ্টেম্বর ২০২৬',
        status: 'completed'
      },
      {
        id: 'pay-2',
        ad_id: 'ad-2',
        ad_title: 'HP Pavilion 15 Core i5 Ultrabook',
        package_name: 'Premium (৳৯৯ / ১৫ দিন)',
        amount: 99,
        method: 'Nagad',
        trx_id: '7B3L991XP2',
        created_at: '২১ সেপ্টেম্বর ২০২৬',
        status: 'completed'
      }
    ];
  });

  // 3. Multi-Stream Revenue & Bangladeshi Bank / MFS Payout State (Super Admin Exclusive)
  const [revenueItems, setRevenueItems] = useState<RevenueItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REVENUE_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVENUE_ITEMS;
  });

  const [adSenseStats, setAdSenseStats] = useState<AdSenseStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADSENSE_STATS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADSENSE_STATS;
  });

  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYOUT_ACCOUNTS);
      if (saved) {
        const parsed: PayoutAccount[] = JSON.parse(saved);
        const hasAgrani = parsed.some(a => a.accountNumber === '0200018344327');
        if (hasAgrani) {
          return parsed.map(a => ({
            ...a,
            isDefault: a.accountNumber === '0200018344327'
          }));
        }
        return [INITIAL_PAYOUT_ACCOUNTS[0], ...parsed.map(a => ({ ...a, isDefault: false }))];
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAYOUT_ACCOUNTS;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WITHDRAWALS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WITHDRAWAL_REQUESTS;
  });

  const [adSenseConfig, setAdSenseConfig] = useState<GoogleAdSenseConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADSENSE_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          wireTransferBankId: 'acc-agrani-1'
        };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADSENSE_CONFIG;
  });

  const [payoutPolicy, setPayoutPolicy] = useState<PayoutPolicySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAYOUT_POLICY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          notificationEmail: 'adminpuranbazar@gmail.com',
          notificationPhone: '01517830164'
        };
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAYOUT_POLICY;
  });

  // Persist State Changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffMembers));
    } catch (e) {
      console.error(e);
    }
  }, [staffMembers]);

  useEffect(() => {
    try {
      if (currentStaff) {
        localStorage.setItem(STORAGE_KEY_CURRENT_STAFF, JSON.stringify(currentStaff));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_STAFF);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentStaff]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SECURITY_SETTINGS, JSON.stringify(securitySettings));
    } catch (e) {
      console.error(e);
    }
  }, [securitySettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(ads));
    } catch (e) {
      console.error(e);
    }
  }, [ads]);

  // Real-time Cloud Synchronization (Firebase Firestore)
  // Ensures ads posted on any device (PC, Mobile, etc.) are immediately visible across all devices globally
  useEffect(() => {
    testFirestoreConnection();

    // Subscribe to real-time cloud updates
    const unsubscribe = subscribeToCloudAds((cloudAds) => {
      if (cloudAds && cloudAds.length > 0) {
        setAds((prev) => {
          const map = new Map<string, Ad>();
          // Cloud ads have primary source of truth
          cloudAds.forEach((a) => map.set(a.id, a));
          // Preserve any locally posted ads if still syncing
          prev.forEach((a) => {
            if (!map.has(a.id)) {
              map.set(a.id, a);
            }
          });
          return Array.from(map.values());
        });
      } else {
        // If Firestore collection is empty, seed initial marketplace ads
        seedInitialAdsToCloud([...INITIAL_ADS, ...INITIAL_PENDING_ADS]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
    } catch (e) {
      console.error(e);
    }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVENUE_ITEMS, JSON.stringify(revenueItems));
    } catch (e) {
      console.error(e);
    }
  }, [revenueItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADSENSE_STATS, JSON.stringify(adSenseStats));
    } catch (e) {
      console.error(e);
    }
  }, [adSenseStats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAYOUT_ACCOUNTS, JSON.stringify(payoutAccounts));
    } catch (e) {
      console.error(e);
    }
  }, [payoutAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WITHDRAWALS, JSON.stringify(withdrawals));
    } catch (e) {
      console.error(e);
    }
  }, [withdrawals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADSENSE_CONFIG, JSON.stringify(adSenseConfig));
    } catch (e) {
      console.error(e);
    }
  }, [adSenseConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAYOUT_POLICY, JSON.stringify(payoutPolicy));
    } catch (e) {
      console.error(e);
    }
  }, [payoutPolicy]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Secret Admin Portal URL Parameter and Keyboard Shortcut listener
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.get('admin') === 'vault' || 
      urlParams.get('portal') === 'pb-admin-vault' || 
      window.location.hash === '#admin-vault'
    ) {
      setIsSecretAdminOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin Hotkey: Ctrl+Shift+A or Alt+A
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setIsSecretAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Record Audit Log Helper
  const addAuditLog = useCallback(
    (action: string, target: string, details: string, status: 'success' | 'warning' | 'blocked' = 'success') => {
      const newLog: SecurityAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long' }),
        actorId: currentStaff?.id || 'SYSTEM_GUEST',
        actorName: currentStaff?.name || 'অননুমোদিত গেস্ট',
        actorRole: currentStaff?.role || 'content_moderator',
        action,
        target,
        details,
        ipAddress: currentStaff?.lastLoginIp?.split(' ')[0] || '103.145.12.89',
        status,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    [currentStaff]
  );

  // Inactivity Auto-Timeout Security
  const lastActivityRef = useRef<number>(Date.now());
  useEffect(() => {
    if (!currentStaff) return;

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    const checkInterval = setInterval(() => {
      const timeoutMs = securitySettings.sessionTimeoutMinutes * 60 * 1000;
      if (Date.now() - lastActivityRef.current > timeoutMs) {
        // Auto Logout
        addAuditLog('AUTO_LOGOUT_TIMEOUT', currentStaff.email, 'নিষ্ক্রিয়তার কারণে স্বয়ংক্রিয় সেশন বন্ধ করা হয়েছে', 'warning');
        setCurrentStaff(null);
        setIsAdminOpen(false);
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearInterval(checkInterval);
    };
  }, [currentStaff, securitySettings.sessionTimeoutMinutes, addAuditLog]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<Condition | ''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'views'>('newest');

  // Modals & Drawers state
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isPostAdOpen, setIsPostAdOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [chatAd, setChatAd] = useState<Ad | null>(null);
  const [reportAd, setReportAd] = useState<Ad | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Staff Authentication Handlers (Secret Admin Vault)
  const handleOpenAdminTrigger = () => {
    if (currentStaff) {
      setIsAdminOpen(true);
    } else {
      setIsSecretAdminOpen(true);
    }
  };

  const handleLoginSuccess = (staff: StaffMember) => {
    // Reset failed attempts & set last login
    const updatedStaff: StaffMember = {
      ...staff,
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLogin: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setStaffMembers((prev) => prev.map((s) => (s.id === staff.id ? updatedStaff : s)));
    setCurrentStaff(updatedStaff);
    setIsAdminOpen(true);
    setIsSecretAdminOpen(false);

    addAuditLog('STAFF_LOGIN', staff.email, `${staff.name} (${staff.role}) গোপন ভল্ট থেকে সফলভাবে লগইন করেছেন`, 'success');
  };

  const handleRecordFailedAttempt = (email: string) => {
    setStaffMembers((prev) =>
      prev.map((s) => {
        if (s.email.toLowerCase() === email.toLowerCase()) {
          const newAttempts = s.failedLoginAttempts + 1;
          const willLock = newAttempts >= securitySettings.maxFailedAttempts;
          return {
            ...s,
            failedLoginAttempts: newAttempts,
            lockedUntil: willLock ? Date.now() + securitySettings.lockoutDurationMinutes * 60 * 1000 : null,
          };
        }
        return s;
      })
    );

    addAuditLog('FAILED_LOGIN_ATTEMPT', email, 'গোপন এডমিন ভল্টে ভুল পাসওয়ার্ড দিয়ে লগইনের চেষ্টা সনাক্ত হয়েছে', 'warning');
  };

  const handleLogout = () => {
    if (currentStaff) {
      addAuditLog('STAFF_LOGOUT', currentStaff.email, `${currentStaff.name} সেশন সমাপ্ত করেছেন`, 'success');
    }
    setCurrentStaff(null);
    setIsAdminOpen(false);
  };

  // Visitor User Account Handlers
  const handleUserLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (postAdPendingAuth) {
      setPostAdPendingAuth(false);
      setIsPostAdOpen(true);
    }
  };

  const handleUserRegisterSuccess = (newUser: UserProfile) => {
    setRegisteredUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    if (postAdPendingAuth) {
      setPostAdPendingAuth(false);
      setIsPostAdOpen(true);
    }
  };

  const handleUpdateUserPassword = (userId: string, newPassword: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u))
    );
    setCurrentUser((prev) =>
      prev && prev.id === userId ? { ...prev, password: newPassword } : prev
    );
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUserProfile = (updatedUser: UserProfile) => {
    setRegisteredUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
  };

  const handlePostAdClick = () => {
    if (!currentUser) {
      setPostAdPendingAuth(true);
      setUserAuthPrompt(
        language === 'bn'
          ? 'বিজ্ঞাপন পোস্ট করতে অনুগ্রহ করে আপনার একাউন্টে লগইন করুন বা বিনামূল্যে নতুন একাউন্ট খুলুন। আপনার প্রোফাইল থেকেই সকল বিজ্ঞাপন নিয়ন্ত্রণ করতে পারবেন।'
          : 'To post an ad, please log in or create a free account. You can manage all your ads directly from your profile.'
      );
      setUserAuthTab('login');
      setIsUserAuthOpen(true);
    } else {
      setIsPostAdOpen(true);
    }
  };

  const handleUserDeleteAd = (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
    deleteAdFromCloud(adId);
  };

  const handleOpenBoostAd = (ad: Ad) => {
    setBoostingAd(ad);
    setIsBoostModalOpen(true);
  };

  const handleBoostAdSuccess = (adId: string, newTier: 'featured' | 'premium' | 'top', payment: FeaturedPayment) => {
    const target = ads.find((a) => a.id === adId);
    if (target) {
      const updated = { ...target, featured_tier: newTier };
      setAds((prev) =>
        prev.map((a) => (a.id === adId ? updated : a))
      );
      saveAdToCloud(updated);
    }
    setPayments((prev) => [payment, ...prev]);
    savePaymentToCloud(payment);

    // Register into official platform revenue items
    const revItem: RevenueItem = {
      id: `rev-${Date.now()}`,
      stream: 'featured_ads',
      streamNameBn: 'ফিচার্ড ও টপ বিজ্ঞাপন',
      sourceTitle: payment.package_name,
      description: `বিজ্ঞাপন বুস্ট: ${payment.ad_title}`,
      amount: payment.amount,
      channel: payment.method,
      trxId: payment.trx_id,
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'received',
    };
    setRevenueItems((prev) => [revItem, ...prev]);

    addAuditLog('AD_BOOSTED', payment.ad_title, `আইডি: ${adId}, টায়ার: ${newTier}, পেমেন্ট: ৳${payment.amount} (${payment.method}, TrxID: ${payment.trx_id})`, 'success');
  };

  // Content Actions with Sanitization & Audit Logging
  const handlePostAdSubmit = (newAd: Ad, payment?: FeaturedPayment) => {
    // Prevent posting if system lockdown is active
    if (securitySettings.systemLockdown && (!currentStaff || currentStaff.role !== 'super_admin')) {
      alert('সিস্টেম মেইনটেন্যান্স ও লকডাউন সক্রিয় রয়েছে। সাময়িকভাবে নতুন বিজ্ঞাপন দেওয়া বন্ধ আছে।');
      return;
    }

    // Input sanitization against XSS
    const sanitizedAd: Ad = {
      ...newAd,
      title: sanitizeInput(newAd.title),
      description: sanitizeInput(newAd.description),
      seller_name: sanitizeInput(newAd.seller_name),
      seller_phone: sanitizeInput(newAd.seller_phone),
    };

    setAds((prev) => [sanitizedAd, ...prev]);
    // Instantly sync to Firestore so all visitors across all computers & mobile devices see it
    saveAdToCloud(sanitizedAd);

    if (payment) {
      setPayments((prev) => [payment, ...prev]);
      savePaymentToCloud(payment);

      // Automatically register payment in revenue items
      const revItem: RevenueItem = {
        id: `rev-${Date.now()}`,
        stream: 'featured_ads',
        streamNameBn: 'ফিচার্ড ও টপ বিজ্ঞাপন',
        sourceTitle: payment.package_name,
        description: `বিজ্ঞাপন: ${sanitizedAd.title}, বিক্রেতা: ${sanitizedAd.seller_name}`,
        amount: payment.amount,
        channel: payment.method,
        trxId: payment.trx_id,
        date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'received',
      };
      setRevenueItems((prev) => [revItem, ...prev]);
    }

    addAuditLog('NEW_AD_POSTED', sanitizedAd.title, `আইডি: ${sanitizedAd.id}, বিক্রেতা: ${sanitizedAd.seller_name}`, 'success');
  };

  // Super Admin Exclusive Banking & Payout Handlers
  const handleAddPayoutAccount = (account: PayoutAccount) => {
    if (currentStaff?.role !== 'super_admin') {
      alert('অননুমোদিত চেষ্টা! শুধুমাত্র সুপার এডমিন ব্যাংক বা MFS অ্যাকাউন্ট যুক্ত করতে পারেন।');
      return;
    }
    setPayoutAccounts((prev) => {
      let updated = [...prev];
      if (account.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: false }));
      }
      return [account, ...updated];
    });
    addAuditLog(
      'PAYOUT_ACCOUNT_ADDED',
      account.providerName,
      `নতুন অ্যাকাউন্ট যুক্ত: ${account.accountNumber} (${account.accountName})`,
      'success'
    );
  };

  const handleDeletePayoutAccount = (accountId: string) => {
    if (currentStaff?.role !== 'super_admin') {
      alert('অননুমোদিত চেষ্টা! শুধুমাত্র সুপার এডমিন ব্যাংক অ্যাকাউন্ট মুছে ফেলতে পারেন।');
      return;
    }
    const target = payoutAccounts.find((a) => a.id === accountId);
    setPayoutAccounts((prev) => prev.filter((a) => a.id !== accountId));
    addAuditLog(
      'PAYOUT_ACCOUNT_DELETED',
      target?.providerName || accountId,
      `অ্যাকাউন্ট মুছে ফেলা হয়েছে: ${target?.accountNumber}`,
      'blocked'
    );
  };

  const handleSetDefaultAccount = (accountId: string) => {
    if (currentStaff?.role !== 'super_admin') return;
    const target = payoutAccounts.find((a) => a.id === accountId);
    setPayoutAccounts((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === accountId }))
    );
    addAuditLog(
      'PAYOUT_DEFAULT_ACCOUNT_SET',
      target?.providerName || accountId,
      `ডিফল্ট উত্তোলন চ্যানেল হিসেবে নির্ধারিত`,
      'success'
    );
  };

  const handleRequestWithdrawal = (withdrawal: WithdrawalRequest) => {
    if (currentStaff?.role !== 'super_admin') {
      alert('অননুমোদিত চেষ্টা! শুধুমাত্র প্রধান সুপার এডমিন টাকা উত্তোলন করতে পারেন।');
      return;
    }
    setWithdrawals((prev) => [withdrawal, ...prev]);
    addAuditLog(
      'WITHDRAWAL_REQUESTED',
      withdrawal.referenceNo,
      `টাকা উত্তোলন রিকোয়েস্ট: ৳${withdrawal.amount.toLocaleString('bn-BD')}, গন্তব্য: ${withdrawal.payoutAccountTitle}`,
      'success'
    );
  };

  const handleCompleteWithdrawal = (withdrawalId: string, bankTxRef: string) => {
    if (currentStaff?.role !== 'super_admin') return;
    const target = withdrawals.find((w) => w.id === withdrawalId);
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'completed',
              bankTxReference: bankTxRef,
              processedAt:
                new Date().toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }) +
                ', ' +
                new Date().toLocaleTimeString('bn-BD', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
            }
          : w
      )
    );
    addAuditLog(
      'WITHDRAWAL_COMPLETED',
      target?.referenceNo || withdrawalId,
      `ব্যাংক ক্লিয়ারিং সম্পন্ন। BEFTN/UTR রেফারেন্স: ${bankTxRef}`,
      'success'
    );
  };

  // Super Admin Full Database & Ads Restore Handler
  const handleRestoreBackup = (data: {
    ads?: Ad[];
    users?: UserProfile[];
    payments?: FeaturedPayment[];
    reports?: AdReport[];
    adSenseConfig?: GoogleAdSenseConfig;
    securitySettings?: SecuritySettings;
    staffMembers?: StaffMember[];
  }) => {
    if (data.ads && Array.isArray(data.ads)) {
      setAds(data.ads);
      try {
        localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(data.ads));
      } catch (e) {
        console.error(e);
      }
      data.ads.forEach((ad) => saveAdToCloud(ad));
    }
    if (data.users && Array.isArray(data.users)) {
      setRegisteredUsers(data.users);
      try {
        localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(data.users));
      } catch (e) {
        console.error(e);
      }
    }
    if (data.payments && Array.isArray(data.payments)) {
      setPayments(data.payments);
      try {
        localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(data.payments));
      } catch (e) {
        console.error(e);
      }
    }
    if (data.reports && Array.isArray(data.reports)) {
      setReports(data.reports);
      try {
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(data.reports));
      } catch (e) {
        console.error(e);
      }
    }
    if (data.adSenseConfig) {
      setAdSenseConfig(data.adSenseConfig);
      try {
        localStorage.setItem(STORAGE_KEY_ADSENSE_CONFIG, JSON.stringify(data.adSenseConfig));
      } catch (e) {
        console.error(e);
      }
    }
    if (data.securitySettings) {
      setSecuritySettings(data.securitySettings);
      try {
        localStorage.setItem(STORAGE_KEY_SECURITY_SETTINGS, JSON.stringify(data.securitySettings));
      } catch (e) {
        console.error(e);
      }
    }
    addAuditLog(
      'DATABASE_RESTORE',
      currentStaff?.email || 'admin@puranbazar.com',
      `সম্পূর্ণ ডাটাবেজ ব্যাকআপ রিস্টোর সম্পন্ন: ${data.ads?.length || 0} টি বিজ্ঞাপন লাইভ ডাটাবেজে যুক্ত হয়েছে`,
      'success'
    );
  };


  const handleApproveAd = (adId: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    if (targetAd) {
      const updated = { ...targetAd, status: 'approved' as const };
      setAds((prev) =>
        prev.map((item) => (item.id === adId ? updated : item))
      );
      saveAdToCloud(updated);
    }
    addAuditLog('AD_APPROVED', targetAd?.title || adId, `অনুমোদনকারী: ${currentStaff?.name}`, 'success');
  };

  const handleRejectAd = (adId: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    if (targetAd) {
      const updated = { ...targetAd, status: 'rejected' as const };
      setAds((prev) =>
        prev.map((item) => (item.id === adId ? updated : item))
      );
      saveAdToCloud(updated);
    }
    addAuditLog('AD_REJECTED', targetAd?.title || adId, `বাতিলকারী: ${currentStaff?.name}`, 'warning');
  };

  const handleDeleteAd = (adId: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    setAds((prev) => prev.filter((item) => item.id !== adId));
    deleteAdFromCloud(adId);
    addAuditLog('AD_DELETED', targetAd?.title || adId, `বিজ্ঞাপন স্থায়ীভাবে মুছে ফেলেছেন ${currentStaff?.name}`, 'blocked');
  };

  const handleToggleFeatureAd = (adId: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    if (targetAd) {
      const newTier = targetAd.featured_tier === 'none' ? 'featured' as const : 'none' as const;
      const updated = { ...targetAd, featured_tier: newTier };
      setAds((prev) =>
        prev.map((item) => (item.id === adId ? updated : item))
      );
      saveAdToCloud(updated);
    }
    addAuditLog('FEATURED_TOGGLED', targetAd?.title || adId, `ফিচার্ড স্ট্যাটাস পরিবর্তন`, 'success');
  };

  const handleSubmitReport = (newReport: AdReport) => {
    const sanitizedReport: AdReport = {
      ...newReport,
      details: sanitizeInput(newReport.details),
      reporter_name: sanitizeInput(newReport.reporter_name),
      reporter_phone: sanitizeInput(newReport.reporter_phone),
    };
    setReports((prev) => [sanitizedReport, ...prev]);
    saveReportToCloud(sanitizedReport);
    addAuditLog('USER_REPORT_SUBMITTED', sanitizedReport.ad_title, `কারণ: ${sanitizedReport.reason}`, 'warning');
  };

  const handleResolveReport = (reportId: string, action: 'ban_ad' | 'dismiss') => {
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    if (action === 'ban_ad') {
      setAds((prev) =>
        prev.map((item) => (item.id === rep.ad_id ? { ...item, status: 'rejected' } : item))
      );
      addAuditLog('REPORT_RESOLVED_BAN', rep.ad_title, `রিপোর্টের প্রেক্ষিতে বিজ্ঞাপন ব্যান করেছেন ${currentStaff?.name}`, 'blocked');
    } else {
      addAuditLog('REPORT_DISMISSED', rep.ad_title, `রিপোর্ট খারিজ করেছেন ${currentStaff?.name}`, 'success');
    }

    setReports((prev) =>
      prev.map((item) =>
        item.id === reportId ? { ...item, status: action === 'ban_ad' ? 'resolved' : 'dismissed' } : item
      )
    );
  };

  const handleAddStaffMember = (newStaff: StaffMember) => {
    setStaffMembers((prev) => [...prev, newStaff]);
    addAuditLog('STAFF_ADDED', newStaff.email, `${newStaff.name} কে ${newStaff.role} হিসেবে যুক্ত করেছেন ${currentStaff?.name}`, 'success');
  };

  const handleUpdateStaffMember = (updatedStaff: StaffMember) => {
    setStaffMembers((prev) => {
      const nextStaffList = prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s));
      try {
        localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(nextStaffList));
      } catch (e) {
        console.error(e);
      }
      return nextStaffList;
    });

    if (currentStaff && currentStaff.id === updatedStaff.id) {
      setCurrentStaff(updatedStaff);
      try {
        localStorage.setItem(STORAGE_KEY_CURRENT_STAFF, JSON.stringify(updatedStaff));
      } catch (e) {
        console.error(e);
      }
    }

    addAuditLog(
      'STAFF_CREDENTIALS_UPDATED',
      updatedStaff.email,
      `${updatedStaff.name} (${updatedStaff.role}) এর ইউজার আইডি/পাসওয়ার্ড/পিন সফলভাবে আপডেট করা হয়েছে`,
      'success'
    );
  };

  const handleToggleStaffStatus = (staffId: string) => {
    const target = staffMembers.find((s) => s.id === staffId);
    if (!target) return;

    const newStatus = target.status === 'active' ? 'suspended' : 'active';
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s))
    );
    addAuditLog('STAFF_STATUS_CHANGED', target.email, `স্থিতি পরিবর্তন: ${newStatus}`, 'warning');
  };

  const handleSuspendUser = (userId: string, status: 'suspended' | 'banned', duration: string, reason: string) => {
    if (!currentStaff) return;
    const nowStr = new Date().toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + ', ' + new Date().toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const roleNameBn = ROLE_DETAILS[currentStaff.role].nameBn;

    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status,
            suspendedUntil: duration,
            suspendedReason: reason,
            suspendedAt: nowStr,
            suspendedBy: {
              staffId: currentStaff.id,
              staffName: currentStaff.name,
              staffRole: currentStaff.role,
              staffRoleNameBn: roleNameBn,
            },
          };
        }
        return u;
      })
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              status,
              suspendedUntil: duration,
              suspendedReason: reason,
              suspendedAt: nowStr,
              suspendedBy: {
                staffId: currentStaff.id,
                staffName: currentStaff.name,
                staffRole: currentStaff.role,
                staffRoleNameBn: roleNameBn,
              },
            }
          : null
      );
    }

    const targetUser = registeredUsers.find((u) => u.id === userId);
    addAuditLog(
      status === 'banned' ? 'USER_BANNED' : 'USER_SUSPENDED',
      targetUser?.phone || userId,
      `${currentStaff.name} (${roleNameBn}) কর্তৃক ইউজার ${targetUser?.name || userId} কে ${status === 'banned' ? 'স্থায়ী ব্যান' : 'সাময়িক স্থগিত (' + duration + ')'} করা হয়েছে। কারণ: ${reason}`,
      'blocked'
    );
  };

  const handleReactivateUser = (userId: string) => {
    if (!currentStaff) return;
    const roleNameBn = ROLE_DETAILS[currentStaff.role].nameBn;

    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: 'active',
            suspendedUntil: null,
            suspendedReason: undefined,
            suspendedAt: undefined,
            suspendedBy: undefined,
          };
        }
        return u;
      })
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              status: 'active',
              suspendedUntil: null,
              suspendedReason: undefined,
              suspendedAt: undefined,
              suspendedBy: undefined,
            }
          : null
      );
    }

    const targetUser = registeredUsers.find((u) => u.id === userId);
    addAuditLog(
      'USER_REACTIVATED',
      targetUser?.phone || userId,
      `${currentStaff.name} (${roleNameBn}) কর্তৃক ইউজার ${targetUser?.name || userId} এর স্থগিতাদেশ প্রত্যাহার করে একাউন্ট সক্রিয় করা হয়েছে`,
      'success'
    );
  };

  const handleUpdateSecuritySettings = (newSettings: SecuritySettings) => {
    setSecuritySettings(newSettings);
    addAuditLog('SECURITY_SETTINGS_UPDATED', 'Global Security Policies', `সিস্টেম নিরাপত্তা কনফিগারেশন আপডেট`, 'warning');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedDivision('');
    setSelectedDistrict('');
    setSelectedUpazila('');
    setSelectedCondition('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const handleSearchFocus = () => {
    searchInputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const pendingCount = ads.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* System Lockdown Warning Banner */}
      {securitySettings.systemLockdown && (
        <div className="bg-rose-600 text-white text-xs py-2 px-4 flex items-center justify-center gap-2 font-bold shadow-md">
          <AlertOctagon className="w-4 h-4 animate-pulse" />
          <span>জরুরি নিরাপত্তা মোড সক্রিয়: সাইটে সাময়িকভাবে নতুন বিজ্ঞাপন পোস্ট স্থগিত রাখা হয়েছে।</span>
        </div>
      )}

      {/* 1. Header (Top Bar Contract: 3-zones + Theme Switcher + Auth Indicator) */}
      <Header
        onPostAdClick={handlePostAdClick}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminOpen={isAdminOpen}
        selectedDistrict={selectedDistrict}
        onLocationClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          searchInputRef.current?.focus();
        }}
        onSearchFocus={handleSearchFocus}
        onNavigateSection={handleNavigateSection}
        pendingCount={pendingCount}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        currentStaff={currentStaff}
        onLogout={handleLogout}
        currentUser={currentUser}
        onOpenUserAuth={() => {
          setUserAuthPrompt(null);
          setPostAdPendingAuth(false);
          setUserAuthTab('login');
          setIsUserAuthOpen(true);
        }}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* 2. Hero Search & Location Filter */}
      <HeroSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDistrict={selectedDistrict}
        onDistrictSelect={(dist) => {
          setSelectedDistrict(dist);
          const el = document.getElementById('ads-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onPostAdClick={handlePostAdClick}
        onSearchSubmit={() => {
          const el = document.getElementById('ads-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        searchRef={searchInputRef}
        language={language}
      />

      {/* 3. Popular Categories Grid */}
      <CategoryGrid
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          const el = document.getElementById('ads-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={setSelectedSubcategory}
        ads={ads}
        language={language}
      />

      {/* 3.1 Google AdSense / Sponsor Banner Slot 1 (টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার) */}
      <AdSenseNotice 
        slotTitle="টপ ডিলস ও বিশ্বস্ত ব্র্যান্ডের অফার" 
        sponsorBanner={adSenseConfig.sponsorSlot1}
      />

      {/* 4. Featured Ads Showcase */}
      <FeaturedAdsSection
        ads={ads}
        onSelectAd={(ad) => {
          setAds((prev) =>
            prev.map((item) => (item.id === ad.id ? { ...item, views: item.views + 1 } : item))
          );
          setSelectedAd(ad);
        }}
        onViewAllFeatured={() => {
          setSelectedCategory('');
          const el = document.getElementById('ads-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        language={language}
      />

      {/* 5. Main Ad Listings & Filterable Grid */}
      <AdListingGrid
        ads={ads}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedDivision={selectedDivision}
        selectedDistrict={selectedDistrict}
        selectedUpazila={selectedUpazila}
        selectedCondition={selectedCondition}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sortBy={sortBy}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
        onDivisionChange={setSelectedDivision}
        onDistrictChange={setSelectedDistrict}
        onUpazilaChange={setSelectedUpazila}
        onConditionChange={setSelectedCondition}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onSortByChange={setSortBy}
        onResetFilters={handleResetFilters}
        onSelectAd={(ad) => {
          setAds((prev) =>
            prev.map((item) => (item.id === ad.id ? { ...item, views: item.views + 1 } : item))
          );
          setSelectedAd(ad);
        }}
        language={language}
      />

      {/* 6. Useful Buying Guides & Safety Tips */}
      <BuyingGuidesSection language={language} />

      {/* 6.1 Google AdSense / Sponsor Banner Slot 2 (নিচে ফুটারের উপরে স্পন্সর ব্যানার স্লট ২ / এডসেন্স) */}
      <AdSenseNotice 
        slotTitle={adSenseConfig.sponsorSlot2?.title || "স্পন্সর ব্যানার ও অফার — স্লট ২"} 
        sponsorBanner={adSenseConfig.sponsorSlot2}
      />

      {/* 7. Footer */}
      <Footer
        onSelectDistrict={(dist) => {
          setSelectedDistrict(dist);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPostAdClick={handlePostAdClick}
        onOpenSecretAdmin={() => setIsSecretAdminOpen(true)}
        language={language}
      />

      {/* MODALS & DRAWERS */}
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        ad={selectedAd}
        onClose={() => setSelectedAd(null)}
        onOpenChat={(ad) => {
          setSelectedAd(null);
          setChatAd(ad);
        }}
        onOpenReport={(ad) => {
          setReportAd(ad);
        }}
        onSelectRelatedAd={(ad) => {
          setAds((prev) =>
            prev.map((item) => (item.id === ad.id ? { ...item, views: item.views + 1 } : item))
          );
          setSelectedAd(ad);
        }}
        allAds={ads}
        currentUser={currentUser}
        onBoostAdClick={handleOpenBoostAd}
        language={language}
      />

      {/* Post Ad 4-Step Wizard */}
      <PostAdModal
        isOpen={isPostAdOpen}
        onClose={() => setIsPostAdOpen(false)}
        onSubmitAd={handlePostAdSubmit}
        currentUser={currentUser}
      />

      {/* Visitor User Authentication Modal (Login / Register with Mobile or Email) */}
      <UserAuthModal
        isOpen={isUserAuthOpen}
        onClose={() => {
          setIsUserAuthOpen(false);
          setPostAdPendingAuth(false);
          setUserAuthPrompt(null);
        }}
        onLoginSuccess={handleUserLoginSuccess}
        onRegisterSuccess={handleUserRegisterSuccess}
        onUpdateUserPassword={handleUpdateUserPassword}
        registeredUsers={registeredUsers}
        initialTab={userAuthTab}
        promptMessage={userAuthPrompt || undefined}
        language={language}
      />

      {/* Visitor User Profile & My Ads Dashboard Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        currentUser={currentUser}
        ads={ads}
        onLogout={handleUserLogout}
        onPostNewAdClick={() => {
          setIsUserProfileOpen(false);
          setIsPostAdOpen(true);
        }}
        onViewAdDetails={(ad: Ad) => {
          setIsUserProfileOpen(false);
          setSelectedAd(ad);
        }}
        onDeleteAd={handleUserDeleteAd}
        onUpdateProfile={handleUpdateUserProfile}
        onBoostAdClick={handleOpenBoostAd}
        language={language}
      />

      {/* In-App Direct Boost & Payment Gateway Modal for Existing Ads */}
      <BoostAdModal
        isOpen={isBoostModalOpen}
        onClose={() => {
          setIsBoostModalOpen(false);
          setBoostingAd(null);
        }}
        ad={boostingAd}
        currentUser={currentUser}
        onBoostSuccess={handleBoostAdSuccess}
      />

      {/* Confidential Staff & Moderator Security Gateway (Secret Admin Vault) */}
      <SecretAdminPortal
        isOpen={isSecretAdminOpen}
        onClose={() => setIsSecretAdminOpen(false)}
        staffMembers={staffMembers}
        securitySettings={securitySettings}
        onLoginSuccess={handleLoginSuccess}
        onRecordFailedAttempt={handleRecordFailedAttempt}
        onUpdateStaffMember={handleUpdateStaffMember}
        language={language}
      />

      {/* Multi-Admin & Moderator RBAC Control Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        ads={ads}
        reports={reports}
        payments={payments}
        currentStaff={currentStaff}
        staffMembers={staffMembers}
        registeredUsers={registeredUsers}
        auditLogs={auditLogs}
        securitySettings={securitySettings}
        revenueItems={revenueItems}
        adSenseStats={adSenseStats}
        payoutAccounts={payoutAccounts}
        withdrawals={withdrawals}
        adSenseConfig={adSenseConfig}
        onUpdateAdSenseConfig={setAdSenseConfig}
        payoutPolicy={payoutPolicy}
        onUpdatePayoutPolicy={setPayoutPolicy}
        onLogout={handleLogout}
        onApproveAd={handleApproveAd}
        onRejectAd={handleRejectAd}
        onDeleteAd={handleDeleteAd}
        onToggleFeatureAd={handleToggleFeatureAd}
        onResolveReport={handleResolveReport}
        onAddStaffMember={handleAddStaffMember}
        onUpdateStaffMember={handleUpdateStaffMember}
        onToggleStaffStatus={handleToggleStaffStatus}
        onSuspendUser={handleSuspendUser}
        onReactivateUser={handleReactivateUser}
        onUpdateSecuritySettings={handleUpdateSecuritySettings}
        onAddPayoutAccount={handleAddPayoutAccount}
        onDeletePayoutAccount={handleDeletePayoutAccount}
        onSetDefaultAccount={handleSetDefaultAccount}
        onRequestWithdrawal={handleRequestWithdrawal}
        onCompleteWithdrawal={handleCompleteWithdrawal}
        onRestoreBackup={handleRestoreBackup}
        language={language}
      />

      {/* Live Seller Chat Drawer */}
      <ChatDrawer
        isOpen={Boolean(chatAd)}
        onClose={() => setChatAd(null)}
        ad={chatAd}
      />

      {/* Report Ad Modal */}
      <ReportAdModal
        isOpen={Boolean(reportAd)}
        onClose={() => setReportAd(null)}
        ad={reportAd}
        onSubmitReport={handleSubmitReport}
      />



    </div>
  );
}
