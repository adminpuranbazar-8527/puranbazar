import { UserProfile } from '../types';

export const STORAGE_KEY_REGISTERED_USERS = 'puranbazar_registered_users_v1';
export const STORAGE_KEY_CURRENT_USER = 'puranbazar_current_user_v1';

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    id: 'user-1',
    name: 'শাহিদুল ইসলাম',
    email: 'shahidul@example.com',
    phone: '01712345678',
    password: 'password123',
    division: 'ঢাকা (Dhaka)',
    district: 'মানিকগঞ্জ (Manikganj)',
    upazila: 'সিংগাইর (Singair)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    joinedAt: 'জানুয়ারি ২০২৫',
    isVerified: true,
    bio: 'টেকনোলজি ও গ্যাজেট উৎসাহী। পুরানবাজারের একজন নিয়মিত বিশ্বস্ত বিক্রেতা।',
    status: 'active',
  },
  {
    id: 'user-2',
    name: 'তানভীর আহমেদ',
    email: 'tanvir@example.com',
    phone: '01819987654',
    password: 'password123',
    division: 'ঢাকা (Dhaka)',
    district: 'ঢাকা (Dhaka)',
    upazila: 'মিরপুর (Mirpur)',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop',
    joinedAt: 'মার্চ ২০২৫',
    isVerified: true,
    bio: 'আইটি প্রফেশনাল। অফিসিয়াল গ্যাজেট ও ল্যাপটপ ব্যক্তিগত ব্যবহারের পর বিক্রি করি।',
    status: 'active',
  },
  {
    id: 'user-3',
    name: 'মো: রাশেদ করিম',
    email: 'rashed@example.com',
    phone: '01911223344',
    password: 'password123',
    division: 'চট্টগ্রাম (Chattogram)',
    district: 'চট্টগ্রাম (Chattogram)',
    upazila: 'পাঁচলাইশ (Panchlaish)',
    joinedAt: 'মে ২০২৫',
    isVerified: false,
    bio: 'পুরাতন গ্যাজেট ও মোটর পার্টস বিক্রেতা।',
    status: 'suspended',
    suspendedUntil: '৭ দিন (১৩ অক্টোবর ২০২৬ পর্যন্ত)',
    suspendedReason: 'কপিরাইট পণ্য ও ভুয়া ইন্টারনেট ছবি ব্যবহার করে বিজ্ঞাপন পোস্ট',
    suspendedAt: '০৬ অক্টোবর ২০২৬, ১১:৩০ AM',
    suspendedBy: {
      staffId: 'staff-mod-3',
      staffName: 'সাদিয়া সুলতানা',
      staffRole: 'content_moderator',
      staffRoleNameBn: 'কন্টেন্ট মডারেটর (Content Moderator)',
    },
  },
  {
    id: 'user-4',
    name: 'মেহেদী হাসান রনি',
    email: 'mehedi@example.com',
    phone: '01677889900',
    password: 'password123',
    division: 'রাজশাহী (Rajshahi)',
    district: 'বগুড়া (Bogura)',
    upazila: 'বগুড়া সদর (Bogura Sadar)',
    joinedAt: 'জুন ২০২৫',
    isVerified: false,
    bio: 'স্মার্টফোন ও ক্যামেরা লিস্টিং।',
    status: 'suspended',
    suspendedUntil: '১৫ দিন (২১ অক্টোবর ২০২৬ পর্যন্ত)',
    suspendedReason: 'ভুয়া ফোন নম্বর প্রদান ও ক্রেতাদের সাথে অশোভন আচরণ',
    suspendedAt: '০৫ অক্টোবর ২০২৬, ০৪:১৫ PM',
    suspendedBy: {
      staffId: 'staff-safe-4',
      staffName: 'ফাহিম আশরাফ',
      staffRole: 'support_moderator',
      staffRoleNameBn: 'নিরাপত্তা ও সাপোর্ট অফিসার (Safety Officer)',
    },
  },
  {
    id: 'user-5',
    name: 'জহিরুল ইসলাম আকাশ',
    email: 'zahirul@example.com',
    phone: '01799001122',
    password: 'password123',
    division: 'ঢাকা (Dhaka)',
    district: 'গাজীপুর (Gazipur)',
    upazila: 'টঙ্গী (Tongi)',
    joinedAt: 'জুলাই ২০২৫',
    isVerified: false,
    bio: 'ইলেকট্রনিক্স ডিলার।',
    status: 'banned',
    suspendedUntil: 'স্থায়ী ব্যান (Permanent)',
    suspendedReason: 'একাধিকবার অগ্রিম কুরিয়ার চার্জ নিয়ে পণ্য না পাঠিয়ে প্রতারণা',
    suspendedAt: '০৪ অক্টোবর ২০২৬, ০২:০০ PM',
    suspendedBy: {
      staffId: 'staff-admin-2',
      staffName: 'তানজিল করিম',
      staffRole: 'admin',
      staffRoleNameBn: 'সাধারণ এডমিন (Admin)',
    },
  },
  {
    id: 'user-6',
    name: 'নাজমুল হুদা',
    email: 'nazmul@example.com',
    phone: '01555667788',
    password: 'password123',
    division: 'সিলেট (Sylhet)',
    district: 'সিলেট (Sylhet)',
    upazila: 'কোতোয়ালী (Kotwali)',
    joinedAt: 'আগস্ট ২০২৫',
    isVerified: true,
    bio: 'ব্যক্তিগত ব্যবহৃত আইটেম ও বই পুস্তক বিক্রি করি।',
    status: 'active',
  },
];

/**
 * Normalizes phone numbers by removing spaces, hyphens, and leading +88
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+88')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('88')) {
    cleaned = cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Find user by either Phone or Email
 */
export function findUserByIdentifier(identifier: string, users: UserProfile[]): UserProfile | undefined {
  const cleanId = identifier.trim().toLowerCase();
  const normalizedPhoneInput = normalizePhone(cleanId);

  return users.find((u) => {
    const isEmailMatch = u.email.toLowerCase() === cleanId;
    const isPhoneMatch = normalizePhone(u.phone) === normalizedPhoneInput;
    return isEmailMatch || isPhoneMatch;
  });
}

/**
 * Mask phone number for privacy display, e.g. 017*****678
 */
export function maskPhone(phone: string): string {
  const cleaned = normalizePhone(phone);
  if (cleaned.length < 7) return cleaned;
  return `${cleaned.substring(0, 3)}*****${cleaned.substring(cleaned.length - 3)}`;
}

/**
 * Mask email address for privacy display, e.g. s*****l@example.com
 */
export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const user = parts[0];
  const domain = parts[1];
  if (user.length <= 2) {
    return `${user[0]}*@${domain}`;
  }
  return `${user[0]}*****${user[user.length - 1]}@${domain}`;
}

/**
 * Generate secure 6-digit OTP
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
