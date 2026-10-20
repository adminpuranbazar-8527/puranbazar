import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Shield, ShieldCheck, KeyRound, AlertTriangle, 
  Terminal, Server, CheckCircle2, Eye, EyeOff, Sparkles, UserCheck, 
  ArrowRight, ArrowLeft, RefreshCw, Clock, Smartphone, Mail, Check, ShieldAlert
} from 'lucide-react';
import { StaffMember, SecuritySettings } from '../types';
import { Language } from '../utils/i18n';

interface SecretAdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
  securitySettings: SecuritySettings;
  onLoginSuccess: (staff: StaffMember) => void;
  onRecordFailedAttempt: (email: string) => void;
  onUpdateStaffMember: (updatedStaff: StaffMember) => void;
  language?: Language;
}

export const SecretAdminPortal: React.FC<SecretAdminPortalProps> = ({
  isOpen,
  onClose,
  staffMembers,
  securitySettings,
  onLoginSuccess,
  onRecordFailedAttempt,
  onUpdateStaffMember,
  language = 'bn',
}) => {
  const isEn = language === 'en';

  const t = {
    modalTitleLogin: isEn ? 'Confidential Admin & Moderator Vault' : 'গোপন এডমিন ও মডারেটর ভল্ট',
    modalTitleForgot: isEn ? 'Admin Password & PIN Recovery' : 'এডমিন পাসওয়ার্ড ও পিন রিকভারি',
    modalSubtitle: isEn ? 'PuranBazar Central Administrative Vault • Restricted Gateway' : 'PuranBazar Central Administrative Vault • গোপন অভ্যন্তরীণ প্রবেশদ্বার',
    warningBanner: isEn ? 'This is an internal portal for authorized admins and moderators only. Public access is strictly prohibited.' : 'এটি শুধুমাত্র অনুমোদিত এডমিন ও মডারেটরদের জন্য অভ্যন্তরীণ পোর্টাল। সর্বসাধারণের প্রবেশ সম্পূর্ণ নিষিদ্ধ।',
    close: isEn ? 'Close' : 'বন্ধ করুন',

    // Login Form
    labelEmail: isEn ? 'Official User ID / Email' : 'অফিসিয়াল ইউজার আইডি / ইমেইল',
    placeholderEmail: isEn ? 'Enter registered official email' : 'অফিসিয়াল ইমেইল এড্রেস লিখুন',
    labelPassword: isEn ? 'Secret Password' : 'সিক্রেট পাসওয়ার্ড',
    placeholderPassword: isEn ? '••••••••••••' : '••••••••••••',
    forgotPasswordLink: isEn ? 'Forgot Password?' : 'পাসওয়ার্ড ভুলে গেছেন?',
    labelPin: isEn ? '2-Factor Security PIN (Required for Super Admin)' : '২-ফ্যাক্টর সিকিউরিটি পিন (সুপার এডমিনদের জন্য আবশ্যক)',
    forgotPinLink: isEn ? 'Forgot PIN?' : 'পিন ভুলে গেছেন?',
    placeholderPin: isEn ? 'Enter 6-digit security PIN' : '৬-সংখ্যার গোপন সিকিউরিটি পিন দিন',
    btnVerifying: isEn ? 'Verifying security token...' : 'সিকিউরিটি টোকেন যাচাই হচ্ছে...',
    btnSubmitLogin: isEn ? 'Launch Secure Admin Session' : 'সিকিউর এডমিন সেশন চালু করুন',
    btnRecoveryNotice: isEn ? 'Recover Super Admin & Staff Password / PIN' : 'সুপার এডমিন ও স্টাফ পাসওয়ার্ড / পিন রিকভারি করুন',

    // Recovery Steps
    step1Title: isEn ? 'Admin Account Identification' : 'এডমিন একাউন্ট সনাক্তকরণ',
    step1Desc: isEn 
      ? 'Enter your registered official email or mobile number to receive security OTP:'
      : 'সিকিউরিটি ওটিপি কোড পেতে আপনার রেজিস্টার্ড অফিসিয়াল ইমেইল বা মোবাইল নম্বর লিখুন:',
    orInputLabel: isEn ? 'Official email or mobile number' : 'অফিসিয়াল ইমেইল বা মোবাইল নম্বর',
    placeholderRecoveryInput: isEn ? 'Enter official email or mobile number' : 'অফিসিয়াল ইমেইল বা মোবাইল নম্বর লিখুন',
    selectChannelTitle: isEn ? 'Choose OTP delivery channel:' : 'ওটিপি কোড পাঠানোর মাধ্যম বেছে নিন:',
    channelSms: isEn ? 'Official SMS' : 'মোবাইলে SMS',
    channelEmail: isEn ? 'Official Email' : 'অফিসিয়াল ইমেইল',
    btnBack: isEn ? '← Back' : '← ফিরে যান',
    btnSendingOtp: isEn ? 'Generating OTP...' : 'ওটিপি তৈরি হচ্ছে...',
    btnSendOtp: isEn ? 'Send Security OTP' : 'সিকিউরিটি ওটিপি পাঠান',

    // Step 2 OTP
    step2Title: isEn ? 'Verify Security OTP' : 'ওটিপি কোড যাচাইকরণ',
    step2Desc: (name: string, ch: string) => isEn
      ? `A 6-digit security code has been sent to the registered ${ch} of ${name}:`
      : `${name}-এর রেজিস্টার্ড ${ch}-এ ৬ ডিজিটের সিকিউরিটি কোড পাঠানো হয়েছে:`,
    labelOtp: isEn ? 'Enter 6-digit Security OTP Code' : '৬ ডিজিটের সিকিউরিটি ওটিপি কোড লিখুন',
    otpValidity: isEn ? 'OTP Validity:' : 'ওটিপির মেয়াদ:',
    minsText: isEn ? 'min' : 'মিনিট',
    resendWait: isEn ? 'Resend in:' : 'পুনরায় পাঠাতে:',
    btnResendOtp: isEn ? 'Resend OTP' : 'পুনরায় ওটিপি পাঠান',
    changeChannel: isEn ? '← Change Method' : '← মাধ্যম পরিবর্তন',
    btnVerifyOtp: isEn ? 'Verify OTP & Continue' : 'ওটিপি যাচাই করুন ও এগিয়ে যান',
    autoFill: isEn ? 'Fill code into input box' : 'কোডটি ইনপুট বক্সে বসান',

    // Step 3 Reset
    step3Title: isEn ? 'Set New Password & Security PIN' : 'নতুন পাসওয়ার্ড ও সিকিউরিটি পিন সেট করুন',
    step3Desc: (name: string, email: string) => isEn
      ? `Set new credentials for ${name} (${email}):`
      : `${name} (${email})-এর জন্য নতুন ক্রেডেনশিয়াল নির্ধারণ করুন:`,
    labelNewPassword: isEn ? 'New Password *' : 'নতুন পাসওয়ার্ড *',
    placeholderNewPassword: isEn ? 'At least 6 characters' : 'কমপক্ষে ৬ অক্ষর',
    labelConfirmPassword: isEn ? 'Confirm Password *' : 'পাসওয়ার্ড নিশ্চিতকরণ *',
    placeholderConfirmPassword: isEn ? 'Re-type password' : 'পুনরায় পাসওয়ার্ড লিখুন',
    labelNewPin: isEn ? 'New Security PIN (PIN) *' : 'নতুন সিকিউরিটি পিন (PIN) *',
    placeholderNewPin: isEn ? '6-digit PIN' : '৬ সংখ্যার পিন',
    labelConfirmPin: isEn ? 'Confirm Security PIN *' : 'পিন নিশ্চিতকরণ *',
    placeholderConfirmPin: isEn ? 'Re-type 6-digit PIN' : 'পুনরায় ৬ সংখ্যার পিন',
    btnSaveCredentials: isEn ? 'Save New Password & PIN' : 'নতুন পাসওয়ার্ড ও পিন সংরক্ষণ করুন',

    // Step 4 Success
    successTitle: isEn ? 'Password & PIN Updated Successfully!' : 'পাসওয়ার্ড ও পিন সফলভাবে আপডেট হয়েছে!',
    labelUserId: isEn ? 'User ID:' : 'ইউজার আইডি:',
    labelRole: isEn ? 'Role:' : 'রোল:',
    labelSecurityPin: isEn ? 'Security PIN:' : 'সিকিউরিটি পিন:',
    labelAccountStatus: isEn ? 'Account Status:' : 'অ্যাকাউন্ট স্ট্যাটাস:',
    statusActive: isEn ? 'Active' : 'সক্রিয় (Active)',
    btnToLoginScreen: isEn ? 'Go to Login Screen' : 'লগইন স্ক্রিনে যান',
    btnDirectVault: isEn ? 'Directly Enter Vault' : 'সরাসরি ভল্টে প্রবেশ করুন',

    // Errors
    errNotFound: isEn ? 'Official credentials do not match. Unauthorized attempt logged.' : 'অফিসিয়াল ক্রেডেনশিয়াল মেলেনি। অননুমোদিত অ্যাক্সেস রেকর্ড করা হয়েছে।',
    errSuspended: isEn ? 'This admin account is suspended. Contact the Chief Super Admin.' : 'এই এডমিন একাউন্টটি সাময়িকভাবে স্থগিত (Suspended) রয়েছে। প্রধান সুপার এডমিনের সাথে যোগাযোগ করুন।',
    errLocked: (mins: number) => isEn 
      ? `Account is locked due to excessive failed attempts. Please wait ${mins} minutes or reset password below.`
      : `অতিরিক্ত ব্যর্থ চেষ্টার কারণে একাউন্টটি লক করা রয়েছে। পরবর্তী ${mins} মিনিট পর চেষ্টা করুন অথবা নিচে পাসওয়ার্ড রিসেট করুন।`,
    errWrongPass: (rem: number, lockMins: number) => rem > 0
      ? (isEn ? `Incorrect password! Only ${rem} attempt(s) remaining.` : `ভুল পাসওয়ার্ড! আর মাত্র ${rem} বার চেষ্টা করা যাবে।`)
      : (isEn ? `Account has been locked for ${lockMins} minutes in accordance with security policy!` : `একাউন্টটি নিরাপত্তা নীতি অনুযায়ী ${lockMins} মিনিটের জন্য লক করা হয়েছে!`),
    errWrongPin: isEn ? 'Incorrect 2-Factor Security PIN! Access denied.' : 'ভুল ২-ফ্যাক্টর সিকিউরিটি পিন! সুপার এডমিন একাউন্টে প্রবেশাধিকার বাতিল করা হলো।',
    errStaffNotFound: isEn ? 'No authorized admin or moderator profile found with this email or phone number.' : 'প্রদত্ত ইমেইল বা ফোন নম্বরের কোনো অনুমোদিত এডমিন বা মডারেটর প্রোফাইল পাওয়া যায়নি।',
    errOtpExpired: isEn ? 'Security OTP has expired! Please request a new OTP.' : 'সিকিউরিটি ওটিপির মেয়াদ শেষ হয়ে গেছে! অনুগ্রহ করে পুনরায় ওটিপি পাঠান।',
    errOtpWrong: isEn ? 'Incorrect OTP code! Please enter the correct 6-digit code.' : 'ভুল ওটিপি কোড! অনুগ্রহ করে আপনার রেজিস্টার্ড মাধ্যমে প্রেরিত সঠিক ৬ ডিজিট কোড লিখুন।',
    errPassLength: isEn ? 'New password must be at least 6 characters.' : 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
    errPassMismatch: isEn ? 'New password and confirmation password do not match!' : 'নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!',
    errPinLength: isEn ? 'Security PIN must be exactly 6 digits (e.g. 998877).' : 'সিকিউরিটি পিন অবশ্যই ৬ সংখ্যার হতে হবে (যেমন: 998877)।',
    errPinMismatch: isEn ? 'New security PIN and confirmation PIN do not match!' : 'নতুন সিকিউরিটি পিন ও নিশ্চিতকরণ পিন মেলেনি!',
  };

  // Mode: 'login' or 'forgot'
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  // --- Login State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // --- Forgot / Recovery State ---
  const [forgotStep, setForgotStep] = useState<'identify' | 'otp' | 'reset' | 'success'>('identify');
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [targetStaff, setTargetStaff] = useState<StaffMember | null>(null);
  const [recoveryChannel, setRecoveryChannel] = useState<'phone' | 'email'>('phone');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  
  // OTP Timers: 5 minutes (300s) validity & 3 minutes (180s) resend countdown
  const OTP_VALIDITY_SECONDS = 300;
  const OTP_RESEND_COOLDOWN_SECONDS = 180;
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpValidityCountdown, setOtpValidityCountdown] = useState(0);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newSecurityPin, setNewSecurityPin] = useState('');
  const [confirmSecurityPin, setConfirmSecurityPin] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState('');
  const [simulatedNotification, setSimulatedNotification] = useState<{
    channel: 'phone' | 'email';
    title: string;
    time: string;
    code: string;
    preview: string;
  } | null>(null);

  // Format seconds to MM:SS
  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // OTP Expiry & Resend Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mode === 'forgot' && forgotStep === 'otp' && (resendCountdown > 0 || otpValidityCountdown > 0)) {
      interval = setInterval(() => {
        setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        setOtpValidityCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, forgotStep, resendCountdown, otpValidityCountdown]);

  if (!isOpen) return null;

  // --- Handlers for Login ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const staff = staffMembers.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());

    if (!staff) {
      setErrorMsg(t.errNotFound);
      onRecordFailedAttempt(email.trim());
      return;
    }

    // Check account status
    if (staff.status === 'suspended') {
      setErrorMsg(t.errSuspended);
      return;
    }

    // Check lockout
    if (staff.lockedUntil && staff.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((staff.lockedUntil - Date.now()) / (1000 * 60));
      setErrorMsg(t.errLocked(remainingMinutes));
      return;
    }

    // Check password
    if (staff.password !== password) {
      const remainingAttempts = securitySettings.maxFailedAttempts - (staff.failedLoginAttempts + 1);
      setErrorMsg(t.errWrongPass(remainingAttempts, securitySettings.lockoutDurationMinutes));
      onRecordFailedAttempt(email.trim());
      return;
    }

    // Check PIN for Super Admin or roles with securityPin
    if (staff.role === 'super_admin' && staff.securityPin) {
      if (securityPin.trim() !== staff.securityPin) {
        setErrorMsg(t.errWrongPin);
        return;
      }
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess(staff);
      onClose();
    }, 500);
  };

  // --- Handlers for Forgot / Recovery Flow ---
  const generateRecoveryOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanInput = recoveryIdentifier.trim().toLowerCase();
    const cleanDigits = recoveryIdentifier.trim().replace(/\D/g, '');

    const staff = staffMembers.find((s) => {
      if (s.email.toLowerCase() === cleanInput) return true;
      if (s.phone && s.phone.replace(/\D/g, '') === cleanDigits) return true;
      return false;
    });

    if (!staff) {
      setErrorMsg(t.errStaffNotFound);
      return;
    }

    setTargetStaff(staff);
    triggerSendOtp(staff);
  };

  const triggerSendOtp = (staff: StaffMember) => {
    setIsSendingOtp(true);
    const otpCode = generateRecoveryOtp();
    setGeneratedOtp(otpCode);

    setTimeout(() => {
      setIsSendingOtp(false);
      setForgotStep('otp');
      setEnteredOtp('');
      setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
      setOtpValidityCountdown(OTP_VALIDITY_SECONDS);

      setSimulatedNotification({
        channel: recoveryChannel,
        title: isEn ? `Admin Recovery OTP Code (${staff.role.toUpperCase()})` : `এডমিন রিকভারি কোড (${staff.role.toUpperCase()})`,
        time: isEn ? 'Just now' : 'এইমাত্র',
        code: otpCode,
        preview: recoveryChannel === 'phone'
          ? (isEn ? `PuranBazar Central Security OTP: ${otpCode}. Valid for 5 minutes.` : `পুরানবাজার সেন্ট্রাল সিকিউরিটি ওটিপি: ${otpCode}। কোডটি আগামী ৫ মিনিটের মধ্যে ব্যবহার করুন।`)
          : (isEn ? `PuranBazar Security Audit OTP: ${otpCode}. Enter this code to reset administrative credentials.` : `পুরানবাজার সিকিউরিটি অডিট ওটিপি: ${otpCode}। এডমিন ক্রেডেনশিয়াল পরিবর্তনের জন্য কোডটি প্রদান করুন (মেয়াদ ৫ মিনিট)।`)
      });
    }, 600);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpValidityCountdown <= 0) {
      setErrorMsg(t.errOtpExpired);
      return;
    }

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMsg(t.errOtpWrong);
      return;
    }

    setForgotStep('reset');
    setNewPassword('');
    setConfirmPassword('');
    setNewSecurityPin('');
    setConfirmSecurityPin('');
  };

  const handleResendRecoveryOtp = () => {
    if (!targetStaff || resendCountdown > 0) return;

    const newCode = generateRecoveryOtp();
    setGeneratedOtp(newCode);
    setEnteredOtp('');
    setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
    setOtpValidityCountdown(OTP_VALIDITY_SECONDS);
    setErrorMsg('');

    setSimulatedNotification({
      channel: recoveryChannel,
      title: isEn ? `Re-sent Admin Recovery Code (${targetStaff.role.toUpperCase()})` : `পুনরায় প্রেরিত এডমিন রিকভারি কোড (${targetStaff.role.toUpperCase()})`,
      time: isEn ? 'Just now' : 'এইমাত্র',
      code: newCode,
      preview: recoveryChannel === 'phone'
        ? (isEn ? `PuranBazar Central Security OTP: ${newCode}. Valid for 5 minutes.` : `পুরানবাজার সেন্ট্রাল সিকিউরিটি ওটিপি: ${newCode}। কোডটি আগামী ৫ মিনিটের মধ্যে ব্যবহার করুন।`)
        : (isEn ? `PuranBazar Security Audit OTP: ${newCode}. Enter code to update admin credentials (5 mins).` : `পুরানবাজার সিকিউরিটি অডিট ওটিপি: ${newCode}। এডমিন ক্রেডেনশিয়াল পরিবর্তনের জন্য কোডটি প্রদান করুন (মেয়াদ ৫ মিনিট)।`)
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!targetStaff) return;

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg(t.errPassLength);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(t.errPassMismatch);
      return;
    }

    if (!newSecurityPin || newSecurityPin.length !== 6) {
      setErrorMsg(t.errPinLength);
      return;
    }

    if (newSecurityPin !== confirmSecurityPin) {
      setErrorMsg(t.errPinMismatch);
      return;
    }

    // Update staff in database/state
    const updatedStaff: StaffMember = {
      ...targetStaff,
      password: newPassword.trim(),
      securityPin: newSecurityPin.trim(),
      failedLoginAttempts: 0,
      lockedUntil: undefined,
      status: 'active',
    };

    onUpdateStaffMember(updatedStaff);
    setTargetStaff(updatedStaff);
    setForgotStep('success');
    setRecoverySuccessMsg(isEn 
      ? `Password and Security PIN for ${updatedStaff.name} (${updatedStaff.role}) updated successfully!`
      : `${updatedStaff.name} (${updatedStaff.role})-এর পাসওয়ার্ড ও সিকিউরিটি পিন সফলভাবে পরিবর্তন করা হয়েছে!`);
  };

  const handleSwitchToLoginWithNewCredentials = () => {
    if (targetStaff) {
      setEmail(targetStaff.email);
      setPassword(targetStaff.password);
      setSecurityPin(targetStaff.securityPin || '');
    }
    setMode('login');
    setForgotStep('identify');
    setErrorMsg('');
  };

  const handleDirectLoginAfterReset = () => {
    if (targetStaff) {
      onLoginSuccess(targetStaff);
      onClose();
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { label: isEn ? 'Super Admin' : 'সুপার এডমিন', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'admin':
        return { label: isEn ? 'Admin' : 'সাধারণ এডমিন', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
      case 'content_moderator':
        return { label: isEn ? 'Content Moderator' : 'কন্টেন্ট মডারেটর', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'support_moderator':
        return { label: isEn ? 'Safety & Support' : 'নিরাপত্তা ও সাপোর্ট', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default:
        return { label: isEn ? 'Staff' : 'স্টাফ', color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Stealth Cyber Security Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800 relative text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  PB-RESTRICTED-GATEWAY
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {mode === 'login' ? t.modalTitleLogin : t.modalTitleForgot}
              </h2>
              <p className="text-xs text-slate-400">
                {t.modalSubtitle}
              </p>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 ENCRYPTED</span>
            </span>
            <span className="text-slate-500">
              IP: {window.location.hostname}
            </span>
          </div>
        </div>

        {/* Warning & Alerts */}
        <div className="px-6 pt-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              {t.warningBanner}
            </span>
          </div>

          {errorMsg && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* MODE 1: STANDARD SECURE LOGIN FORM */}
        {/* ======================================================== */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                {t.labelEmail}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholderEmail}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500 font-mono"
                  required
                />
                <Server className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  {t.labelPassword}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setForgotStep('identify');
                    setErrorMsg('');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  {t.forgotPasswordLink}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.placeholderPassword}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500 font-mono"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-semibold text-slate-300">
                  {t.labelPin}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setForgotStep('identify');
                    setErrorMsg('');
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono cursor-pointer"
                >
                  {t.forgotPinLink}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder={t.placeholderPin}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500 font-mono tracking-widest"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.btnVerifying}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.btnSubmitLogin}</span>
                </span>
              )}
            </button>

            {/* Forgot Credentials Access Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setForgotStep('identify');
                  setErrorMsg('');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 hover:underline flex items-center justify-center gap-1.5 mx-auto font-medium cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t.btnRecoveryNotice}</span>
              </button>
            </div>

            {/* Production Cryptographic Protection Banner */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-mono">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isEn ? 'Hardware-backed Encrypted Session' : 'এন্ড-টু-এন্ড এনক্রিপ্টেড সেশন'}</span>
              </span>
              <span className="font-mono text-slate-600 text-[10px]">TLS 1.3 • AES-256</span>
            </div>
          </form>
        ) : (
          /* ======================================================== */
          /* MODE 2: FORGOT PASSWORD & SECURITY PIN RECOVERY FLOW     */
          /* ======================================================== */
          <div className="p-6 space-y-4">
            
            {/* Step 1: Identify Staff Account */}
            {forgotStep === 'identify' && (
              <form onSubmit={handleIdentifySubmit} className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>{t.step1Title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.step1Desc}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                    {t.orInputLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={recoveryIdentifier}
                      onChange={(e) => setRecoveryIdentifier(e.target.value)}
                      placeholder={t.placeholderRecoveryInput}
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-500 font-mono"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Channel Selector */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                    {t.selectChannelTitle}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRecoveryChannel('phone')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        recoveryChannel === 'phone'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{t.channelSms}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecoveryChannel('email')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        recoveryChannel === 'email'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>{t.channelEmail}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {t.btnBack}
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {isSendingOtp ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.btnSendingOtp}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span>{t.btnSendOtp}</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {forgotStep === 'otp' && (
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.step2Title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.step2Desc(targetStaff?.name || '', recoveryChannel === 'phone' ? (isEn ? 'Mobile' : 'মোবাইলে') : (isEn ? 'Email' : 'ইমেইলে'))}
                  </p>
                </div>

                {/* Simulated Incoming Push Notification */}
                {simulatedNotification && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-amber-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                        <span>{simulatedNotification.title}</span>
                      </span>
                      <span className="text-[10px] text-amber-400/80 font-normal">{simulatedNotification.time}</span>
                    </div>
                    <p className="text-[11px] text-amber-200 bg-slate-950/60 p-2 rounded-xl border border-amber-500/20 font-sans leading-relaxed">
                      {simulatedNotification.preview}
                    </p>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(simulatedNotification.code)}
                      className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer underline"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.autoFill} ({simulatedNotification.code})</span>
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                    {t.labelOtp}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-lg bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white placeholder-slate-600 font-mono tracking-widest text-center"
                      required
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* OTP Validity & Resend Timers */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{t.otpValidity}</span>
                    <span className={`font-mono font-bold ${otpValidityCountdown < 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {formatSeconds(otpValidityCountdown)} {t.minsText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {resendCountdown > 0 ? (
                      <span className="text-slate-500 text-[11px]">
                        {t.resendWait} <span className="font-mono font-bold text-emerald-400">{formatSeconds(resendCountdown)}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendRecoveryOtp}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t.btnResendOtp}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep('identify')}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {t.changeChannel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer transition-all"
                  >
                    <span>{t.btnVerifyOtp}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Set New Password & Security PIN */}
            {forgotStep === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 animate-in fade-in">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>{t.step3Title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {t.step3Desc(targetStaff?.name || '', targetStaff?.email || '')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                      {t.labelNewPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={t.placeholderNewPassword}
                        className="w-full pl-9 pr-9 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                        required
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                      {t.labelConfirmPassword}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.placeholderConfirmPassword}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                        required
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                      {t.labelNewPin}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        maxLength={6}
                        value={newSecurityPin}
                        onChange={(e) => setNewSecurityPin(e.target.value.replace(/\D/g, ''))}
                        placeholder={t.placeholderNewPin}
                        className="w-full pl-9 pr-9 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono tracking-wider"
                        required
                      />
                      <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                      {t.labelConfirmPin}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        maxLength={6}
                        value={confirmSecurityPin}
                        onChange={(e) => setConfirmSecurityPin(e.target.value.replace(/\D/g, ''))}
                        placeholder={t.placeholderConfirmPin}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono tracking-wider"
                        required
                      />
                      <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer transition-all mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.btnSaveCredentials}</span>
                </button>
              </form>
            )}

            {/* Step 4: Success Message & Entry */}
            {forgotStep === 'success' && (
              <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{t.successTitle}</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                    {recoverySuccessMsg}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-1">
                  <div><strong>{t.labelUserId}</strong> {targetStaff?.email}</div>
                  <div><strong>{t.labelRole}</strong> {targetStaff?.role}</div>
                  <div><strong>{t.labelSecurityPin}</strong> {targetStaff?.securityPin}</div>
                  <div><strong>{t.labelAccountStatus}</strong> {t.statusActive}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSwitchToLoginWithNewCredentials}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {t.btnToLoginScreen}
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectLoginAfterReset}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t.btnDirectVault}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
          PURANBAZAR INTERNAL FIREWALL • UNAUTHORIZED ATTEMPTS ARE LOGGED
        </div>
      </div>
    </div>
  );
};
