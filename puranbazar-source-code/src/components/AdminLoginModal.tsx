import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Lock, Mail, Eye, EyeOff, AlertTriangle, 
  KeyRound, ShieldAlert, CheckCircle2, UserCheck, ArrowRight, Clock
} from 'lucide-react';
import { StaffMember, SecuritySettings, StaffRole } from '../types';
import { ROLE_DETAILS, checkBruteForceLock } from '../utils/security';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
  securitySettings: SecuritySettings;
  onLoginSuccess: (staff: StaffMember) => void;
  onRecordFailedAttempt: (email: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  staffMembers,
  securitySettings,
  onLoginSuccess,
  onRecordFailedAttempt,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when opening
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setLockoutRemaining(null);
    }
  }, [isOpen]);

  // Live timer for lockout
  useEffect(() => {
    if (lockoutRemaining === null || lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();
    const staff = staffMembers.find((s) => s.email.toLowerCase() === normalizedEmail);

    if (!staff) {
      setIsSubmitting(false);
      setErrorMessage('ভুল ইমেইল বা পাসওয়ার্ড। পুনরায় চেষ্টা করুন।');
      onRecordFailedAttempt(normalizedEmail);
      return;
    }

    // Check account status
    if (staff.status === 'suspended') {
      setIsSubmitting(false);
      setErrorMessage('এই একাউন্টটি সুপার এডমিন কর্তৃক সাময়িকভাবে সাসপেন্ড (স্থগিত) করা হয়েছে।');
      return;
    }

    // Check brute-force lock
    const lockStatus = checkBruteForceLock(staff, securitySettings);
    if (lockStatus.isLocked) {
      setIsSubmitting(false);
      setLockoutRemaining(lockStatus.remainingSeconds);
      setErrorMessage(`অতিরিক্ত ব্যর্থ চেষ্টার কারণে একাউন্টটি সাময়িকভাবে লক করা হয়েছে।`);
      return;
    }

    // Verify Password
    if (staff.password !== password) {
      setIsSubmitting(false);
      onRecordFailedAttempt(normalizedEmail);
      const newAttempts = staff.failedLoginAttempts + 1;
      const left = securitySettings.maxFailedAttempts - newAttempts;
      if (left <= 0) {
        setLockoutRemaining(securitySettings.lockoutDurationMinutes * 60);
        setErrorMessage(`একাউন্টটি ${securitySettings.lockoutDurationMinutes} মিনিটের জন্য লক করা হয়েছে!`);
      } else {
        setErrorMessage(`ভুল পাসওয়ার্ড! আর মাত্র ${left} বার চেষ্টা বাকি আছে।`);
      }
      return;
    }

    // Success
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(staff);
      onClose();
    }, 400);
  };

  const handleQuickDemoLogin = (role: StaffRole) => {
    const staff = staffMembers.find((s) => s.role === role && s.status === 'active');
    if (staff) {
      setEmail(staff.email);
      setPassword(staff.password);
      setErrorMessage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">এডমিন ও মডারেটর সিকিউর গেটওয়ে</h3>
              <p className="text-[11px] text-slate-400">পুরানবাজার নিরাপত্তা কন্ট্রোল সেন্টার</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Alert Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>অ্যান্টি-হ্যাকিং ও ব্রুট-ফোর্স প্রটেকশন সক্রিয়:</strong> প্রতিবার ব্যর্থ লগইন চেষ্টা স্বয়ংক্রিয়ভাবে অডিট লগে আইপি সহ রেকর্ড হবে। ৫ বার ভুল হলে একাউন্ট লক হয়ে যাবে।
          </div>
        </div>

        {/* Lockout countdown notice */}
        {lockoutRemaining && lockoutRemaining > 0 ? (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 font-bold">
            <Clock className="w-4 h-4 text-rose-600 animate-spin" />
            <span>নিরাপত্তা লক সক্রিয়। অপেক্ষা করুন: {Math.floor(lockoutRemaining / 60)} মি. {lockoutRemaining % 60} সে.</span>
          </div>
        ) : null}

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              কর্মকর্তার ইমেইল (Staff Email)
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@puranbazar.com"
                className="w-full text-xs p-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              সিক্রেট পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs p-2.5 pl-9 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || Boolean(lockoutRemaining && lockoutRemaining > 0)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'নিরাপদে প্রবেশ করুন (Secure Login)'}</span>
          </button>
        </form>

        {/* Quick Demo Role Selector */}
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>দ্রুত টেস্ট লগইন করুন (ডেমো রোলস):</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">১-ক্লিক সুইচ</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('super_admin')}
              className="p-2 text-left rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/70 transition-colors cursor-pointer"
            >
              <div className="font-bold text-rose-800 dark:text-rose-300">১. সুপার এডমিন</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">শাহিদুল (Full Access)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2 text-left rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/70 transition-colors cursor-pointer"
            >
              <div className="font-bold text-purple-800 dark:text-purple-300">২. সাধারণ এডমিন</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">তানজিল (Ads + Revenue)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('content_moderator')}
              className="p-2 text-left rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 transition-colors cursor-pointer"
            >
              <div className="font-bold text-emerald-800 dark:text-emerald-300">৩. কন্টেন্ট মডারেটর</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">সাদিয়া (Ads Review Only)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('support_moderator')}
              className="p-2 text-left rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100/70 transition-colors cursor-pointer"
            >
              <div className="font-bold text-amber-800 dark:text-amber-300">৪. নিরাপত্তা মডারেটর</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">ফাহিম (Scam Reports)</div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <span>SSL 256-Bit Encrypted</span>
          <span>PuratonBazar Security Sentinel</span>
        </div>

      </div>
    </div>
  );
};
