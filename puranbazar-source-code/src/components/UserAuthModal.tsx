import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, 
  CheckCircle2, AlertCircle, ArrowRight, UserPlus, LogIn, Sparkles,
  ArrowLeft, KeyRound, Smartphone, Send, RefreshCw, Check, ShieldAlert, Clock,
  Camera, Upload, Trash2
} from 'lucide-react';
import { UserProfile } from '../types';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { 
  findUserByIdentifier, normalizePhone, maskPhone, maskEmail, generateOtp 
} from '../utils/userAuth';
import { sanitizeInput } from '../utils/security';
import { Language, formatNumber } from '../utils/i18n';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredUsers: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSuccess: (newUser: UserProfile) => void;
  onUpdateUserPassword?: (userId: string, newPassword: string) => void;
  initialTab?: 'login' | 'register';
  promptMessage?: string | null;
  language?: Language;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  registeredUsers,
  onLoginSuccess,
  onRegisterSuccess,
  onUpdateUserPassword,
  initialTab = 'login',
  promptMessage,
  language = 'bn'
}) => {
  const isEn = language === 'en';

  const t = {
    modalTitleLogin: isEn ? 'User Account Login' : 'ইউজার একাউন্টে লগইন',
    modalTitleRegister: isEn ? 'Create User Account' : 'নতুন আইডি ও প্রোফাইল তৈরি',
    modalTitleForgot: isEn ? 'Password Reset & Recovery' : 'পাসওয়ার্ড রিসেট ও রিকভারি',
    modalSubtitleAuth: isEn ? 'PuranBazar — Used Goods, Fresh Feelings' : 'পুরানবাজার — পুরান জিনিস, নতুন অনুভূতি',
    modalSubtitleForgot: isEn ? 'Reset password using Mobile or Email OTP' : 'মোবাইল বা ইমেইল ওটিপি দিয়ে নতুন পাসওয়ার্ড তৈরি',
    backToLogin: isEn ? 'Back to Login' : 'লগইনে ফিরে যান',
    close: isEn ? 'Close' : 'বন্ধ করুন',
    
    // Tabs
    tabLogin: isEn ? 'Log In' : 'লগইন করুন',
    tabRegister: isEn ? 'Register' : 'নতুন রেজিস্টার',
    
    // Login
    labelIdentifier: isEn ? 'Mobile Number or Email Address' : 'মোবাইল নম্বর অথবা ইমেইল এড্রেস',
    placeholderIdentifier: isEn ? '017xxxxxxxx or name@email.com' : '017xxxxxxxx অথবা example@mail.com',
    descIdentifier: isEn ? 'Log in easily using your registered phone or email' : 'আপনার নিবন্ধিত ফোন নম্বর বা ইমেইল দিয়ে সহজে লগইন করুন',
    labelPassword: isEn ? 'Password' : 'পাসওয়ার্ড',
    placeholderPassword: isEn ? 'Enter your password' : 'আপনার পাসওয়ার্ড লিখুন',
    forgotPasswordLink: isEn ? 'Forgot Password?' : 'পাসওয়ার্ড ভুলে গেছেন?',
    btnSubmitLogin: isEn ? 'Log In & Continue' : 'লগইন করুন ও এগিয়ে যান',

    // Register
    labelFullName: isEn ? 'Full Name' : 'আপনার পূর্ণ নাম',
    placeholderFullName: isEn ? 'Enter your full name' : 'আপনার পূর্ণ নাম লিখুন',
    labelPhone: isEn ? 'Mobile Number' : 'মোবাইল নম্বর',
    placeholderPhone: isEn ? '017xxxxxxxx' : '017xxxxxxxx',
    labelEmail: isEn ? 'Email Address' : 'ইমেইল এড্রেস',
    placeholderEmail: isEn ? 'user@example.com' : 'user@example.com',
    labelDivision: isEn ? 'Division' : 'বিভাগ',
    labelDistrict: isEn ? 'District' : 'জেলা',
    districtsSuffix: isEn ? 'districts' : 'টি জেলা',
    labelCreatePassword: isEn ? 'Set Password (min. 6 chars)' : 'পাসওয়ার্ড নির্ধারণ করুন',
    placeholderCreatePassword: isEn ? 'At least 6 characters' : 'কমপক্ষে ৬ অক্ষর বা সংখ্যা',
    btnSubmitRegister: isEn ? 'Create Account & Continue' : 'একাউন্ট তৈরি করুন ও এগিয়ে যান',

    // Stepper (Forgot Mode)
    step1: isEn ? 'Verification' : 'তথ্য যাচাই',
    step2: isEn ? 'OTP Code' : 'ওটিপি কোড',
    step3: isEn ? 'New Password' : 'নতুন পাসওয়ার্ড',
    
    // Forgot Step 1
    forgotInputLabel: isEn ? 'Enter registered Mobile Number or Email' : 'আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল লিখুন',
    forgotInputPlaceholder: isEn ? 'e.g. 017xxxxxxxx or user@example.com' : 'যেমন: 017xxxxxxxx অথবা user@example.com',
    btnVerifyAccount: isEn ? 'Verify Account' : 'একাউন্ট যাচাই করুন',
    verifiedUserBadge: isEn ? 'Verified User' : 'যাচাইকৃত ইউজার',
    memberSince: isEn ? 'Member:' : 'সদস্য:',
    selectChannelTitle: isEn ? 'Choose verification method for OTP:' : 'ওটিপি (OTP) কোড পাঠানোর মাধ্যম নির্বাচন করুন:',
    channelMobile: isEn ? 'Mobile SMS' : 'মোবাইল SMS',
    channelEmail: isEn ? 'Email Inbox' : 'ইমেইল ইনবক্স',
    btnSendingOtp: isEn ? 'Sending OTP code...' : 'ওটিপি কোড পাঠানো হচ্ছে...',
    btnSendMobileOtp: isEn ? 'Send SMS OTP to Mobile' : 'মোবাইলে SMS ওটিপি পাঠান',
    btnSendEmailOtp: isEn ? 'Send OTP to Email' : 'ইমেইলে ওটিপি কোড পাঠান',
    rememberedPassword: isEn ? '← Remember password? Back to Login' : '← পাসওয়ার্ড মনে পড়েছে? লগইনে ফিরে যান',

    // Forgot Step 2
    labelOtp: isEn ? 'Enter 6-Digit OTP Code' : '৬-ডিজিটের ওটিপি (OTP) কোড লিখুন',
    btnVerifyOtp: isEn ? 'Verify OTP & Continue' : 'ওটিপি যাচাই করুন ও এগিয়ে যান',
    otpValidity: isEn ? 'OTP Validity:' : 'ওটিপির মেয়াদ:',
    minsText: isEn ? 'min' : 'মিনিট',
    resendWait: isEn ? 'Wait to resend:' : 'পুনরায় পাঠাতে অপেক্ষা:',
    btnResendOtp: isEn ? 'Resend OTP' : 'পুনরায় ওটিপি পাঠান',
    changeMethod: isEn ? '← Change method or number' : '← মাধ্যম বা নম্বর পরিবর্তন করুন',
    autoFillOtp: isEn ? '👉 Auto-fill code' : '👉 কোডটি অটো-ফিল করুন',
    sender: isEn ? 'Sender:' : 'প্রেরক:',

    // Forgot Step 3
    titleNewPass: isEn ? 'Set a new secure password for account:' : 'এর একাউন্টের জন্য নতুন ও সুরক্ষিত পাসওয়ার্ড সেট করুন:',
    labelNewPass: isEn ? 'New Password' : 'নতুন পাসওয়ার্ড',
    placeholderNewPass: isEn ? 'At least 6 characters' : 'কমপক্ষে ৬ অক্ষর বা সংখ্যা',
    labelConfirmPass: isEn ? 'Confirm Password' : 'পাসওয়ার্ড নিশ্চিত করুন',
    placeholderConfirmPass: isEn ? 'Re-type same password' : 'পুনরায় একই পাসওয়ার্ড লিখুন',
    btnSubmitNewPass: isEn ? 'Save New Password' : 'নতুন পাসওয়ার্ড সংরক্ষণ করুন',

    // Forgot Step 4 Success
    successTitle: isEn ? 'Password Updated Successfully!' : 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!',
    successDesc: (name: string) => isEn 
      ? `A new password has been saved for account ${name}. You can now log in directly.` 
      : `আপনার একাউন্ট ${name}-এর জন্য নতুন পাসওয়ার্ড সংরক্ষিত হয়েছে। আপনি এখন সরাসরি লগইন করতে পারেন।`,
    btnLoginNow: isEn ? 'Log In and Continue' : 'সরাসরি একাউন্টে প্রবেশ করুন',
    btnReturnLogin: isEn ? 'Return to Login Screen' : 'লগইন স্ক্রিনে ফিরে যান',

    // Footer info
    footerEncrypted: isEn ? 'Your phone and private credentials on PuranBazar are 100% encrypted & secure' : 'পুরানবাজারে আপনার ফোন ও ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্টেড',

    // Messages
    errIdentifier: isEn ? 'Please enter your mobile number or email address.' : 'অনুগ্রহ করে আপনার মোবাইল নম্বর অথবা ইমেইল এড্রেস লিখুন।',
    errPassword: isEn ? 'Please provide your password.' : 'অনুগ্রহ করে আপনার পাসওয়ার্ড প্রদান করুন।',
    errUserNotFound: isEn ? 'No user account found with this phone number or email.' : 'এই মোবাইল নম্বর বা ইমেইলে কোনো ইউজার একাউন্ট পাওয়া যায়নি। দয়া করে সঠিক তথ্য দিন অথবা নতুন একাউন্ট খুলুন।',
    errWrongPassword: isEn ? 'Incorrect password! Please try again or click "Forgot Password?".' : 'ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিন অথবা পাসওয়ার্ড ভুলে গেলে নিচে "পাসওয়ার্ড ভুলে গেছেন?" এ ক্লিক করুন।',
    msgLoginSuccess: (name: string) => isEn ? `Welcome, ${name}! Logged in successfully.` : `স্বাগতম, ${name}! সফলভাবে লগইন হয়েছে।`,
    errNameLength: isEn ? 'Please enter your full name (at least 3 characters).' : 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন (কমপক্ষে ৩ অক্ষর)।',
    errPhoneInvalid: isEn ? 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017xxxxxxxx).' : 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 017xxxxxxxx)',
    errEmailInvalid: isEn ? 'Please enter a valid email address (e.g. example@mail.com).' : 'সঠিক ও কার্যকর ইমেইল এড্রেস প্রদান করুন (যেমন: example@mail.com)',
    errPassLength: isEn ? 'Password must be at least 6 characters.' : 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
    errPhoneExists: isEn ? 'An account already exists with this phone number. Please log in.' : 'এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি একাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।',
    errEmailExists: isEn ? 'An account already exists with this email address. Please log in.' : 'এই ইমেইল এড্রেসটি দিয়ে ইতিমধ্যে একটি একাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।',
    msgRegSuccess: (name: string) => isEn ? `Congratulations, ${name}! Account created successfully.` : `অভিনন্দন, ${name}! সফলভাবে আপনার একাউন্ট তৈরি সম্পন্ন হয়েছে।`,
    errOtpWrong: isEn ? 'Invalid 6-digit OTP code. Please enter the correct code.' : 'ভুল ওটিপি কোড! অনুগ্রহ করে আপনার ইনবক্সে প্রেরিত সঠিক ৬ ডিজিট কোড লিখুন।',
    errPassMismatch: isEn ? 'Passwords do not match. Please verify both fields.' : 'উভয় পাসওয়ার্ড হুবহু এক হতে হবে। অনুগ্রহ করে নিশ্চিতকরণ পাসওয়ার্ড মিলিয়ে দেখুন।',
  };

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDivision, setRegDivision] = useState(BANGLADESH_LOCATIONS[0].name);
  const [regDistrict, setRegDistrict] = useState(BANGLADESH_LOCATIONS[0].districts[0].name);
  const [regAvatar, setRegAvatar] = useState('');
  const [regAvatarError, setRegAvatarError] = useState('');

  const handleRegAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setRegAvatarError(isEn ? 'Image size must be less than 5 MB.' : 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setRegAvatar(event.target.result);
        setRegAvatarError('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Forgot Password & OTP States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState<'identify' | 'otp' | 'new_password' | 'success'>('identify');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [targetUser, setTargetUser] = useState<UserProfile | null>(null);
  const [otpChannel, setOtpChannel] = useState<'phone' | 'email'>('phone');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  
  // OTP Timers: 5 minutes (300s) full validity & 3 minutes (180s) resend countdown
  const OTP_VALIDITY_SECONDS = 300; // 5 minutes
  const OTP_RESEND_COOLDOWN_SECONDS = 180; // 3 minutes
  const [resendCountdown, setResendCountdown] = useState(0);
  const [otpValidityCountdown, setOtpValidityCountdown] = useState(0);

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [simulatedInboxNotice, setSimulatedInboxNotice] = useState<{
    channel: 'phone' | 'email';
    title: string;
    sender: string;
    time: string;
    code: string;
    preview: string;
  } | null>(null);

  // OTP Expiry & Resend Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (forgotStep === 'otp' && (resendCountdown > 0 || otpValidityCountdown > 0)) {
      interval = setInterval(() => {
        setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        setOtpValidityCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [forgotStep, resendCountdown, otpValidityCountdown]);

  if (!isOpen) return null;

  // Selected Division object for District cascading
  const selectedDivObj = BANGLADESH_LOCATIONS.find((d) => d.name === regDivision) || BANGLADESH_LOCATIONS[0];

  // ----------------------------------------------------
  // LOGIN SUBMIT
  // ----------------------------------------------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage(t.errIdentifier);
      return;
    }
    if (!loginPassword) {
      setErrorMessage(t.errPassword);
      return;
    }

    const matchedUser = findUserByIdentifier(loginIdentifier, registeredUsers);
    if (!matchedUser) {
      setErrorMessage(t.errUserNotFound);
      return;
    }

    if (matchedUser.password !== loginPassword) {
      setErrorMessage(t.errWrongPassword);
      return;
    }

    // Check account status: suspension or ban
    if (matchedUser.status === 'suspended' || matchedUser.status === 'banned') {
      const isBanned = matchedUser.status === 'banned';
      const suspMsg = isEn
        ? `Account ${isBanned ? 'Banned' : 'Suspended'}: ${matchedUser.suspendedReason || 'Policy violation'}. Duration: ${matchedUser.suspendedUntil || 'Indefinite'}. Suspended by: ${matchedUser.suspendedBy?.staffRoleNameBn || 'Administration'}.`
        : `আপনার একাউন্টটি পুরানবাজার এডমিনিস্ট্রেশন সেন্টার কর্তৃক ${isBanned ? 'স্থায়ীভাবে ব্যান' : 'সাময়িকভাবে স্থগিত'} করা হয়েছে। মেয়াদ: ${matchedUser.suspendedUntil || 'অনির্দিষ্ট'}। কারণ: ${matchedUser.suspendedReason || 'নীতিমালা লঙ্ঘন'}। (স্থগিতকারী: ${matchedUser.suspendedBy?.staffRoleNameBn || 'এডমিনিস্ট্রেশন টিম'})`;
      setErrorMessage(suspMsg);
      return;
    }

    // Login successful
    setSuccessMessage(t.msgLoginSuccess(matchedUser.name));
    setTimeout(() => {
      onLoginSuccess(matchedUser);
      onClose();
    }, 400);
  };

  // ----------------------------------------------------
  // REGISTER SUBMIT
  // ----------------------------------------------------
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = sanitizeInput(regName.trim());
    const cleanPhone = normalizePhone(regPhone.trim());
    const cleanEmail = sanitizeInput(regEmail.trim().toLowerCase());

    if (!cleanName || cleanName.length < 3) {
      setErrorMessage(t.errNameLength);
      return;
    }

    if (!cleanPhone.match(/^01[3-9]\d{8}$/)) {
      setErrorMessage(t.errPhoneInvalid);
      return;
    }

    if (!cleanEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage(t.errEmailInvalid);
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage(t.errPassLength);
      return;
    }

    // Check unique phone
    const phoneExists = registeredUsers.some((u) => normalizePhone(u.phone) === cleanPhone);
    if (phoneExists) {
      setErrorMessage(t.errPhoneExists);
      return;
    }

    // Check unique email
    const emailExists = registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      setErrorMessage(t.errEmailExists);
      return;
    }

    // Create new user profile
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      password: regPassword,
      division: regDivision,
      district: regDistrict,
      avatar: regAvatar.trim() ? regAvatar.trim() : undefined,
      joinedAt: isEn ? 'Recently' : 'এইমাত্র যোগ দিয়েছেন',
      isVerified: true,
    };

    onRegisterSuccess(newUser);
    setSuccessMessage(t.msgRegSuccess(cleanName));
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 500);
  };

  // ----------------------------------------------------
  // FORGOT PASSWORD FLOW
  // ----------------------------------------------------
  const handleStartForgotPassword = () => {
    setIsForgotMode(true);
    setForgotStep('identify');
    setErrorMessage('');
    setSuccessMessage('');
    if (loginIdentifier.trim()) {
      setForgotIdentifier(loginIdentifier.trim());
      const matched = findUserByIdentifier(loginIdentifier.trim(), registeredUsers);
      if (matched) {
        setTargetUser(matched);
      }
    }
  };

  const handleBackToLogin = () => {
    setIsForgotMode(false);
    setForgotStep('identify');
    setTargetUser(null);
    setErrorMessage('');
    setSuccessMessage('');
    setSimulatedInboxNotice(null);
  };

  const handleFindUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotIdentifier.trim()) {
      setErrorMessage(t.errIdentifier);
      return;
    }

    const matched = findUserByIdentifier(forgotIdentifier, registeredUsers);
    if (!matched) {
      setErrorMessage(t.errUserNotFound);
      setTargetUser(null);
      return;
    }

    setTargetUser(matched);
    setSuccessMessage(isEn ? `Account verified: ${matched.name}. Choose how to receive your OTP.` : `একাউন্ট পাওয়া গেছে: ${matched.name}। অনুগ্রহ করে ওটিপি পাওয়ার মাধ্যম বেছে নিন।`);
  };

  const handleSendOtp = () => {
    if (!targetUser) return;
    setErrorMessage('');
    setIsSendingOtp(true);

    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);

    setTimeout(() => {
      setIsSendingOtp(false);
      setForgotStep('otp');
      setEnteredOtp('');
      setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
      setOtpValidityCountdown(OTP_VALIDITY_SECONDS);

      const targetMasked = otpChannel === 'phone' ? maskPhone(targetUser.phone) : maskEmail(targetUser.email);
      setSuccessMessage(isEn 
        ? `A 6-digit OTP code has been sent to (${targetMasked}). Valid for 5 minutes.` 
        : `৬-ডিজিটের ওটিপি কোডটি (${targetMasked})-এ পাঠানো হয়েছে। কোডটির মেয়াদ ৫ মিনিট।`);

      setSimulatedInboxNotice({
        channel: otpChannel,
        title: otpChannel === 'phone' ? (isEn ? '📱 New SMS Received' : '📱 নতুন SMS এসেছে (Messages)') : (isEn ? '✉️ New Email Received' : '✉️ নতুন ইমেইল এসেছে (Inbox)'),
        sender: otpChannel === 'phone' ? 'PURANBAZAR-OTP' : 'security@puranbazar.com',
        time: isEn ? 'Just now' : 'এইমাত্র',
        code: otpCode,
        preview: otpChannel === 'phone'
          ? (isEn ? `Your PuranBazar password reset OTP is: ${otpCode}. Valid for 5 minutes.` : `আপনার পুরানবাজার পাসওয়ার্ড রিসেট ওটিপি কোড: ${otpCode}। কোডটি আগামী ৫ মিনিটের মধ্যে ব্যবহার করুন।`)
          : (isEn ? `PuranBazar Security OTP: ${otpCode}. Enter this code to reset your password (valid for 5 minutes).` : `পুরানবাজার সিকিউরিটি কোড: ${otpCode}। পাসওয়ার্ড পরিবর্তন সম্পন্ন করতে কোডটি ইনপুট বক্সে প্রদান করুন (মেয়াদ ৫ মিনিট)।`)
      });
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpValidityCountdown <= 0) {
      setErrorMessage(isEn ? 'OTP code has expired! Please request a new code.' : 'ওটিপি কোডের মেয়াদ শেষ হয়ে গেছে! অনুগ্রহ করে পুনরায় ওটিপি পাঠান।');
      return;
    }

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMessage(t.errOtpWrong);
      return;
    }

    setSuccessMessage(isEn ? 'OTP verified successfully! Please enter your new password.' : 'ওটিপি কোড সফলভাবে যাচাই হয়েছে! এবার আপনার নতুন পাসওয়ার্ড দিন।');
    setForgotStep('new_password');
  };

  const handleResendOtp = () => {
    if (!targetUser || resendCountdown > 0) return;

    const newCode = generateOtp();
    setGeneratedOtp(newCode);
    setEnteredOtp('');
    setResendCountdown(OTP_RESEND_COOLDOWN_SECONDS);
    setOtpValidityCountdown(OTP_VALIDITY_SECONDS);
    setErrorMessage('');

    const targetMasked = otpChannel === 'phone' ? maskPhone(targetUser.phone) : maskEmail(targetUser.email);
    setSuccessMessage(isEn 
      ? `A new 6-digit OTP has been re-sent to (${targetMasked}).` 
      : `নতুন ৬-ডিজিট ওটিপি কোড সফলভাবে (${targetMasked})-এ পুনরায় পাঠানো হয়েছে।`);

    setSimulatedInboxNotice({
      channel: otpChannel,
      title: otpChannel === 'phone' ? (isEn ? '📱 New SMS' : '📱 নতুন SMS এসেছে') : (isEn ? '✉️ New Email' : '✉️ নতুন ইমেইল এসেছে'),
      sender: otpChannel === 'phone' ? 'PURANBAZAR-OTP' : 'security@puranbazar.com',
      time: isEn ? 'Just now' : 'এইমাত্র',
      code: newCode,
      preview: otpChannel === 'phone'
        ? (isEn ? `Your PuranBazar OTP code: ${newCode}. Valid for 5 minutes.` : `আপনার পুরানবাজার পাসওয়ার্ড রিসেট ওটিপি কোড: ${newCode}। কোডটি আগামী ৫ মিনিটের মধ্যে ব্যবহার করুন।`)
        : (isEn ? `PuranBazar Security Code: ${newCode}. Enter code to complete password reset (valid 5 mins).` : `পুরানবাজার সিকিউরিটি কোড: ${newCode}। পাসওয়ার্ড পরিবর্তন সম্পন্ন করতে কোডটি ইনপুট বক্সে প্রদান করুন (মেয়াদ ৫ মিনিট)।`)
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage(t.errPassLength);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t.errPassMismatch);
      return;
    }

    if (!targetUser) return;

    // Update user password in global state & storage
    if (onUpdateUserPassword) {
      onUpdateUserPassword(targetUser.id, newPassword);
    }

    setErrorMessage('');
    setSuccessMessage(isEn ? 'Password successfully updated!' : 'পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!');
    setForgotStep('success');
  };

  const handleFinishAndLogin = () => {
    if (!targetUser) return;
    const updatedUser: UserProfile = { ...targetUser, password: newPassword };
    onLoginSuccess(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* ========================================================= */}
        {/* HEADER RIBBON */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isForgotMode ? (
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer mr-0.5"
                  title={t.backToLogin}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : null}
              <img 
                src="/logo.png" 
                alt="PuranBazar" 
                referrerPolicy="no-referrer"
                className="w-11 h-11 object-contain rounded-full bg-white/20 p-0.5 border border-white/30 shadow-xs shrink-0" 
              />
              <div>
                <h2 className="text-lg font-bold leading-snug">
                  {isForgotMode ? t.modalTitleForgot : activeTab === 'login' ? t.modalTitleLogin : t.modalTitleRegister}
                </h2>
                <p className="text-xs text-emerald-100">
                  {isForgotMode ? t.modalSubtitleForgot : t.modalSubtitleAuth}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prompt Notice if triggered by Post Ad */}
          {!isForgotMode && promptMessage && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-amber-500/25 border border-amber-300/40 text-amber-50 text-xs flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{promptMessage}</span>
            </div>
          )}

          {/* Tab Selector (Only in Auth mode) */}
          {!isForgotMode && (
            <div className="grid grid-cols-2 gap-1.5 mt-4 p-1 bg-black/20 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.tabLogin}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.tabRegister}</span>
              </button>
            </div>
          )}

          {/* Stepper Progress Bar (Only in Forgot Mode) */}
          {isForgotMode && forgotStep !== 'success' && (
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex items-center justify-between text-[11px] text-emerald-100 font-medium px-1">
                <span className={`flex items-center gap-1 ${forgotStep === 'identify' ? 'text-white font-bold' : ''}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${forgotStep === 'identify' ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-white/30 text-white'}`}>1</span>
                  {t.step1}
                </span>
                <span className="text-white/40">›</span>
                <span className={`flex items-center gap-1 ${forgotStep === 'otp' ? 'text-white font-bold' : ''}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${forgotStep === 'otp' ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-white/30 text-white'}`}>2</span>
                  {t.step2}
                </span>
                <span className="text-white/40">›</span>
                <span className={`flex items-center gap-1 ${forgotStep === 'new_password' ? 'text-white font-bold' : ''}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${forgotStep === 'new_password' ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-white/30 text-white'}`}>3</span>
                  {t.step3}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* FEEDBACK NOTICES */}
        {/* ========================================================= */}
        <div className="px-5 pt-4 space-y-2">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && forgotStep !== 'success' && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: NORMAL LOGIN / REGISTER FORMS */}
        {/* ========================================================= */}
        {!isForgotMode ? (
          activeTab === 'login' ? (
            /* Tab 1: LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  {t.labelIdentifier} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={t.placeholderIdentifier}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {t.descIdentifier}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {t.labelPassword} <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleStartForgotPassword}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:underline transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{t.forgotPasswordLink}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t.placeholderPassword}
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{t.btnSubmitLogin}</span>
              </button>
            </form>
          ) : (
            /* Tab 2: REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="p-5 space-y-3.5">
              {/* Optional Profile Photo in Registration */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-slate-500/5 border border-emerald-200/70 dark:border-emerald-900/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEn ? 'Profile Photo' : 'প্রোফাইল ছবি'}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {isEn ? 'Optional' : 'সম্পূর্ণ ঐচ্ছিক'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isEn ? 'Upload or leave empty' : 'ছবি দিতেও পারেন বা নাও দিতে পারেন'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {regAvatar ? (
                    <div className="relative shrink-0">
                      <img
                        src={regAvatar}
                        alt="Profile preview"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/50 shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => { setRegAvatar(''); setRegAvatarError(''); }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs cursor-pointer hover:bg-rose-600"
                        title={isEn ? 'Remove photo' : 'ছবি মুছে ফেলুন'}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                      <User className="w-5 h-5 stroke-1" />
                      <span className="text-[8px] font-medium mt-0.5">{isEn ? 'No photo' : 'ছবি ছাড়া'}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="regAvatarInput"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleRegAvatarFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="regAvatarInput"
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{regAvatar ? (isEn ? 'Change Photo' : 'ছবি পরিবর্তন') : (isEn ? 'Upload Photo' : 'ছবি নির্বাচন করুন')}</span>
                      </label>
                      {regAvatar && (
                        <button
                          type="button"
                          onClick={() => { setRegAvatar(''); setRegAvatarError(''); }}
                          className="px-2 py-1 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer font-medium"
                        >
                          {isEn ? 'Remove' : 'বাদ দিন'}
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                      {isEn ? 'JPG, PNG up to 5MB. Photo is 100% optional.' : 'ছবি দেওয়া আবশ্যক নয়, খালি রেখেও আইডি খুলতে পারেন।'}
                    </p>
                  </div>
                </div>

                {regAvatarError && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                    <span>⚠️ {regAvatarError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {t.labelFullName} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={t.placeholderFullName}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t.labelPhone} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={t.placeholderPhone}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t.labelEmail} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={t.placeholderEmail}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t.labelDivision} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={regDivision}
                    onChange={(e) => {
                      const newDivName = e.target.value;
                      setRegDivision(newDivName);
                      const div = BANGLADESH_LOCATIONS.find((d) => d.name === newDivName);
                      if (div && div.districts.length > 0) {
                        setRegDistrict(div.districts[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    {BANGLADESH_LOCATIONS.map((div) => (
                      <option key={div.name} value={div.name}>{div.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1 flex items-center justify-between">
                    <span>{t.labelDistrict} <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">({selectedDivObj.districts.length} {t.districtsSuffix})</span>
                  </label>
                  <select
                    value={selectedDivObj.districts.some((d) => d.name === regDistrict) ? regDistrict : selectedDivObj.districts[0]?.name}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  >
                    {selectedDivObj.districts.map((dst) => (
                      <option key={dst.name} value={dst.name}>{dst.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {t.labelCreatePassword} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder={t.placeholderCreatePassword}
                    className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.btnSubmitRegister}</span>
              </button>
            </form>
          )
        ) : (
          /* ========================================================= */
          /* VIEW 2: FORGOT PASSWORD & OTP WORKFLOW */
          /* ========================================================= */
          <div className="p-5 space-y-4">
            
            {/* ---------------------------------------------------- */}
            {/* STEP 1: IDENTIFY USER & SELECT DELIVERY CHANNEL */}
            {/* ---------------------------------------------------- */}
            {forgotStep === 'identify' && (
              <div className="space-y-4">
                <form onSubmit={handleFindUser} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      {t.forgotInputLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={forgotIdentifier}
                        onChange={(e) => {
                          setForgotIdentifier(e.target.value);
                          const matched = findUserByIdentifier(e.target.value, registeredUsers);
                          setTargetUser(matched || null);
                        }}
                        placeholder={t.forgotInputPlaceholder}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                        required
                        autoFocus
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  {!targetUser && (
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>{t.btnVerifyAccount}</span>
                    </button>
                  )}
                </form>

                {/* Found Account Card & Delivery Method Selector */}
                {targetUser && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-3">
                      <img 
                        src={targetUser.avatar} 
                        alt={targetUser.name} 
                        className="w-10 h-10 rounded-full object-cover border border-emerald-500 shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {targetUser.name}
                          </span>
                          <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium rounded-md">
                            {t.verifiedUserBadge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {targetUser.division} • {t.memberSince} {targetUser.joinedAt}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-2">
                        {t.selectChannelTitle}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Option 1: Mobile SMS */}
                        <button
                          type="button"
                          onClick={() => setOtpChannel('phone')}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                            otpChannel === 'phone'
                              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${otpChannel === 'phone' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold flex items-center gap-1">
                              <span>{t.channelMobile}</span>
                              {otpChannel === 'phone' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              {maskPhone(targetUser.phone)}
                            </div>
                          </div>
                        </button>

                        {/* Option 2: Email OTP */}
                        <button
                          type="button"
                          onClick={() => setOtpChannel('email')}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                            otpChannel === 'email'
                              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${otpChannel === 'email' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                            <Mail className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold flex items-center gap-1">
                              <span>{t.channelEmail}</span>
                              {otpChannel === 'email' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                              {maskEmail(targetUser.email)}
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      {isSendingOtp ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{t.btnSendingOtp}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>
                            {otpChannel === 'phone' ? t.btnSendMobileOtp : t.btnSendEmailOtp}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-xs font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 cursor-pointer"
                  >
                    {t.rememberedPassword}
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: ENTER & VERIFY 6-DIGIT OTP */}
            {/* ---------------------------------------------------- */}
            {forgotStep === 'otp' && (
              <div className="space-y-4 animate-in fade-in">
                {/* Simulated Device Notification Card for easy 1-click test */}
                {simulatedInboxNotice && (
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                        {simulatedInboxNotice.channel === 'phone' ? <Smartphone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                        {simulatedInboxNotice.title}
                      </span>
                      <span className="text-[11px] text-blue-500 dark:text-blue-400 font-normal">
                        {t.sender} {simulatedInboxNotice.sender}
                      </span>
                    </div>

                    <p className="text-xs text-blue-900 dark:text-blue-200 bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900 font-sans">
                      {simulatedInboxNotice.preview}
                    </p>

                    <button
                      type="button"
                      onClick={() => setEnteredOtp(simulatedInboxNotice.code)}
                      className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{t.autoFillOtp} ({simulatedInboxNotice.code})</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {t.labelOtp} <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {otpChannel === 'phone' ? maskPhone(targetUser?.phone || '') : maskEmail(targetUser?.email || '')}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        className="w-full py-2.5 px-3 text-center text-2xl font-bold tracking-[0.4em] font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-emerald-800 dark:text-emerald-300 placeholder-slate-300 dark:placeholder-slate-600"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.btnVerifyOtp}</span>
                  </button>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{t.otpValidity}</span>
                      <span className={`font-mono font-bold ${otpValidityCountdown < 60 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                        {formatSeconds(otpValidityCountdown)} {t.minsText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {resendCountdown > 0 ? (
                        <span className="text-slate-400 text-[11px]">
                          {t.resendWait} <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatSeconds(resendCountdown)}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{t.btnResendOtp}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-center pt-0.5">
                    <button
                      type="button"
                      onClick={() => setForgotStep('identify')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {t.changeMethod}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 3: SET NEW PASSWORD */}
            {/* ---------------------------------------------------- */}
            {forgotStep === 'new_password' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 animate-in fade-in">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>{targetUser?.name}</strong>{isEn ? '' : '-'} {t.titleNewPass}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t.labelNewPass} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t.placeholderNewPass}
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      required
                      autoFocus
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {t.labelConfirmPass} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t.placeholderConfirmPass}
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{t.btnSubmitNewPass}</span>
                </button>
              </form>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 4: SUCCESS CONFIRMATION */}
            {/* ---------------------------------------------------- */}
            {forgotStep === 'success' && (
              <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.successTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                    {t.successDesc(targetUser?.name || '')}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleFinishAndLogin}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.btnLoginNow}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {t.btnReturnLogin}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* FOOTER INFO */}
        {/* ========================================================= */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.footerEncrypted}</span>
        </div>
      </div>
    </div>
  );
};
