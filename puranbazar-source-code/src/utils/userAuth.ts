import { UserProfile } from '../types';

export const STORAGE_KEY_REGISTERED_USERS = 'puranbazar_registered_users_v1';
export const STORAGE_KEY_CURRENT_USER = 'puranbazar_current_user_v1';

export const INITIAL_REGISTERED_USERS: UserProfile[] = [];

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
