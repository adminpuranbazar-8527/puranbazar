import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, ArrowRight, Lock, 
  RefreshCw, Check, Smartphone, AlertCircle, HelpCircle, ChevronRight, Clock
} from 'lucide-react';
import { FeaturedPayment } from '../types';

export type GatewayMethod = 'bKash' | 'Nagad' | 'Rocket';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  adTitle: string;
  adId?: string;
  packageTier: 'featured' | 'premium' | 'top';
  packageName: string;
  amount: number;
  userPhone?: string;
  onPaymentSuccess: (payment: FeaturedPayment) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  adTitle,
  adId,
  packageTier,
  packageName,
  amount,
  userPhone = '',
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<GatewayMethod>('bKash');
  const [currentStep, setCurrentStep] = useState<'account' | 'otp' | 'pin' | 'processing' | 'success'>('account');
  
  // Gateway Form States
  const [accountNumber, setAccountNumber] = useState(userPhone || '01689835975');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('739201');
  const [pinNumber, setPinNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP Timers: 5 minutes (300s) full validity & 3 minutes (180s) resend countdown
  const OTP_VALIDITY_SECONDS = 300; // 5 minutes
  const OTP_RESEND_COOLDOWN_SECONDS = 180; // 3 minutes
  const [resendTimer, setResendTimer] = useState(180);
  const [otpValidityTimer, setOtpValidityTimer] = useState(300);
  const [simulatedTrxId, setSimulatedTrxId] = useState('');

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto prefill user phone when opened
  useEffect(() => {
    if (userPhone && userPhone.startsWith('01')) {
      setAccountNumber(userPhone);
    }
    setSimulatedTrxId(`${selectedMethod === 'bKash' ? 'BK' : selectedMethod === 'Nagad' ? 'NG' : 'RK'}${Math.floor(10000000 + Math.random() * 90000000)}`);
  }, [isOpen, userPhone, selectedMethod]);

  // Resend & Validity Countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (currentStep === 'otp' && (resendTimer > 0 || otpValidityTimer > 0)) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setOtpValidityTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, resendTimer, otpValidityTimer]);

  if (!isOpen) return null;

  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  // Step 1: Proceed to OTP
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNumber = accountNumber.trim().replace(/\D/g, '');
    if (!cleanNumber.match(/^01[3-9]\d{8}$/)) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017xxxxxxxx)');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('অনুগ্রহ করে পেমেন্টের শর্তাবলী মেনে এগিয়ে যান।');
      return;
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setResendTimer(OTP_RESEND_COOLDOWN_SECONDS); // 180s (3 minutes)
    setOtpValidityTimer(OTP_VALIDITY_SECONDS); // 300s (5 minutes)
    setOtpCode('');
    setCurrentStep('otp');
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpValidityTimer <= 0) {
      setErrorMessage('ভেরিফিকেশন কোডের মেয়াদ (৫ মিনিট) উত্তীর্ণ হয়ে গেছে! অনুগ্রহ করে পুনরায় কোড পাঠান।');
      return;
    }

    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setErrorMessage('অনুগ্রহ করে সঠিক ভেরিফিকেশন কোড লিখুন।');
      return;
    }

    // Advance to PIN step
    setCurrentStep('pin');
  };

  // Step 3: Enter PIN and execute payment simulation
  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pinNumber || pinNumber.length < 4) {
      setErrorMessage('অনুগ্রহ করে ৪ বা ৫ ডিজিটের গোপন পিন নম্বর লিখুন।');
      return;
    }

    // Processing animation
    setCurrentStep('processing');

    setTimeout(() => {
      const finalTrxId = `${selectedMethod === 'bKash' ? 'BK' : selectedMethod === 'Nagad' ? 'NG' : 'RK'}${Math.floor(10000000 + Math.random() * 90000000)}`;
      setSimulatedTrxId(finalTrxId);
      setCurrentStep('success');

      const paymentObj: FeaturedPayment = {
        id: `pay-${Date.now()}`,
        ad_id: adId || `ad-${Date.now()}`,
        ad_title: adTitle,
        package_name: packageName,
        amount,
        method: selectedMethod,
        trx_id: finalTrxId,
        created_at: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'completed',
      };

      // Call payment success callback after a brief celebration
      setTimeout(() => {
        onPaymentSuccess(paymentObj);
      }, 1800);
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setResendTimer(OTP_RESEND_COOLDOWN_SECONDS); // 180s (3 minutes)
    setOtpValidityTimer(OTP_VALIDITY_SECONDS); // 300s (5 minutes)
    setErrorMessage('');
  };

  // Method styling configs
  const methodConfig = {
    bKash: {
      name: 'বিকাশ (bKash)',
      bgColor: 'bg-[#E2136E]',
      lightBg: 'bg-[#E2136E]/10',
      textColor: 'text-[#E2136E]',
      borderColor: 'border-[#E2136E]',
      headerGrad: 'from-[#E2136E] to-[#B50D57]',
      accentBtn: 'bg-[#E2136E] hover:bg-[#C20F5D]',
      logoIcon: '🇧🇩',
      tagline: 'বিকাশ পেমেন্ট গেটওয়ে • নিরাপদ ও নির্ভরযোগ্য',
    },
    Nagad: {
      name: 'নগদ (Nagad)',
      bgColor: 'bg-[#F7941D]',
      lightBg: 'bg-[#F7941D]/10',
      textColor: 'text-[#F7941D]',
      borderColor: 'border-[#F7941D]',
      headerGrad: 'from-[#F7941D] to-[#ED1C24]',
      accentBtn: 'bg-[#F7941D] hover:bg-[#DE8215]',
      logoIcon: '🔥',
      tagline: 'ডাক বিভাগের ডিজিটাল লেনদেন নগদ • দ্রুত ও সহজ',
    },
    Rocket: {
      name: 'রকেট (Rocket)',
      bgColor: 'bg-[#8C3494]',
      lightBg: 'bg-[#8C3494]/10',
      textColor: 'text-[#8C3494]',
      borderColor: 'border-[#8C3494]',
      headerGrad: 'from-[#8C3494] to-[#6A1A72]',
      accentBtn: 'bg-[#8C3494] hover:bg-[#722779]',
      logoIcon: '🚀',
      tagline: 'ডাচ-বাংলা ব্যাংক রকেট • সুরক্ষিত ডিজিটাল ব্যাংকিং',
    },
  };

  const currentConfig = methodConfig[selectedMethod];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* ========================================================= */}
        {/* 1. BRAND HEADER & INVOICE DETAILS */}
        {/* ========================================================= */}
        <div className={`p-4 sm:p-5 text-white bg-gradient-to-r ${currentConfig.headerGrad} transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner border border-white/30 shrink-0">
                {currentConfig.logoIcon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base tracking-tight">
                    {currentConfig.name}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/25 text-white font-bold tracking-wider uppercase">
                    Checkout
                  </span>
                </div>
                <p className="text-[11px] text-white/80 leading-tight">
                  {currentConfig.tagline}
                </p>
              </div>
            </div>

            {currentStep !== 'processing' && currentStep !== 'success' && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
                title="পেমেন্ট বাতিল করুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Payment Summary Box */}
          <div className="mt-3.5 p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-[11px] text-white/80 truncate">
                বিজ্ঞাপন: <strong className="text-white">{adTitle}</strong>
              </div>
              <div className="text-[11px] text-white/70 flex items-center gap-1.5 mt-0.5">
                <span>প্যাকেজ: {packageName}</span>
                <span>•</span>
                <span className="font-mono">{invoiceNumber}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase text-white/70 block leading-none">পরিশোধযোগ্য</span>
              <span className="text-xl font-black text-white font-sans">
                ৳{amount}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PAYMENT CHANNEL SWITCHER (bKash / Nagad / Rocket) */}
        {/* ========================================================= */}
        {currentStep === 'account' && (
          <div className="px-5 pt-3 pb-1 border-b border-slate-100 dark:border-slate-800">
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              পেমেন্ট মাধ্যম বেছে নিন:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setSelectedMethod(m);
                    setErrorMessage('');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedMethod === m
                      ? `${methodConfig[m].bgColor} text-white border-transparent shadow-sm shadow-black/10 scale-102`
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{methodConfig[m].logoIcon}</span>
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. STEP CONTENT */}
        {/* ========================================================= */}
        <div className="p-5">

          {/* ---------------------------------------------------- */}
          {/* STEP 1: ACCOUNT NUMBER */}
          {/* ---------------------------------------------------- */}
          {currentStep === 'account' && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>আপনার {currentConfig.name} মোবাইল নম্বর লিখুন</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">যেকোনো অপারেটর</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="017xxxxxxxx"
                    maxLength={11}
                    className="w-full pl-10 pr-3 py-3 text-base font-mono font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                    autoFocus
                  />
                  <Smartphone className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>নম্বর প্রদান করার পর আপনার ফোনে একটি ওটিপি কোড পাঠানো হবে।</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-600 dark:text-slate-300 leading-snug cursor-pointer">
                  আমি <strong>পুরানবাজার বিজ্ঞাপন বুস্টিং নীতিমালা</strong> ও <strong>{selectedMethod} পেমেন্ট শর্তাবলীর</strong> সাথে একমত পোষণ করছি।
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className={`py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${currentConfig.accentBtn}`}
                >
                  <span>পরবর্তী ধাপ</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ---------------------------------------------------- */}
          {/* STEP 2: VERIFICATION OTP CODE */}
          {/* ---------------------------------------------------- */}
          {currentStep === 'otp' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Simulated Device Notification Card for easy 1-click test */}
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400">
                    <span>📱 ইনকামিং SMS ({selectedMethod} Security)</span>
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">এইমাত্র</span>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200 bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl border border-amber-100 dark:border-amber-900 font-sans leading-relaxed">
                  আপনার {selectedMethod} ভেরিফিকেশন কোড হলো: <strong className="font-mono text-sm tracking-wider text-amber-900 dark:text-amber-200">{generatedOtp}</strong>। এই কোডটির মেয়াদ আগামী ৫ মিনিট পর্যন্ত কার্যকর থাকবে।
                </p>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedOtp)}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <span>👉 কোডটি এক ক্লিকে অটো-ফিল করুন ({generatedOtp})</span>
                </button>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                      ৬-ডিজিটের ভেরিফিকেশন কোড লিখুন
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {accountNumber.slice(0, 3)}*****{accountNumber.slice(-3)}
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full py-2.5 px-3 text-center text-2xl font-bold tracking-[0.4em] font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                    autoFocus
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>ওটিপির মেয়াদ:</span>
                    <span className={`font-mono font-bold ${otpValidityTimer < 60 ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                      {formatSeconds(otpValidityTimer)} মিনিট
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {resendTimer > 0 ? (
                      <span className="text-slate-400 text-[11px]">
                        পুনরায় কোড পাঠাতে: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatSeconds(resendTimer)}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className={`font-bold flex items-center gap-1 cursor-pointer ${currentConfig.textColor}`}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>পুনরায় কোড পাঠান</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('account')}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                  >
                    ← মোবাইল নম্বর পরিবর্তন করুন
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className={`py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${currentConfig.accentBtn}`}
                  >
                    <span>যাচাই করুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* STEP 3: WALLET PIN ENTRY */}
          {/* ---------------------------------------------------- */}
          {currentStep === 'pin' && (
            <form onSubmit={handleConfirmPin} className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  ওটিপি যাচাই সফল হয়েছে! এবার পেমেন্ট সম্পন্ন করতে আপনার <strong>{selectedMethod} পিন (PIN)</strong> নম্বর দিন।
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>{selectedMethod} গোপন পিন (PIN)</span>
                  <span className="text-[10px] text-slate-400 font-normal">৪ বা ৫ সংখ্যা (সিমুলেশন)</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={5}
                    value={pinNumber}
                    onChange={(e) => setPinNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••••"
                    className="w-full py-3 px-4 text-center text-2xl font-bold tracking-[0.5em] font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    required
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
                </div>
                <div className="p-2.5 mt-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>এটি টেস্ট সিমুলেশন। যেকোনো ৪/৫ সংখ্যার পিন (যেমন: 12345) দিয়ে পেমেন্ট সফলভাবে সম্পন্ন করুন।</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep('otp')}
                  className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  ← পূর্বে যান
                </button>
                <button
                  type="submit"
                  className={`py-3 px-4 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${currentConfig.accentBtn}`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>পেমেন্ট নিশ্চিত করুন (৳{amount})</span>
                </button>
              </div>
            </form>
          )}

          {/* ---------------------------------------------------- */}
          {/* STEP 4: PROCESSING SPINNER */}
          {/* ---------------------------------------------------- */}
          {currentStep === 'processing' && (
            <div className="py-10 text-center space-y-4 animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className={`w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-transparent animate-spin`} style={{ borderTopColor: selectedMethod === 'bKash' ? '#E2136E' : selectedMethod === 'Nagad' ? '#F7941D' : '#8C3494' }} />
                <div className="absolute inset-0 flex items-center justify-center text-lg">
                  {currentConfig.logoIcon}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  পেমেন্ট প্রসেসিং হচ্ছে...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  দয়া করে অপেক্ষা করুন, {selectedMethod} গেটওয়ে থেকে ট্রানজেকশন নিশ্চিত করা হচ্ছে
                </p>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* STEP 5: SUCCESS RECEIPT */}
          {/* ---------------------------------------------------- */}
          {currentStep === 'success' && (
            <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Payment Successful
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  আপনার বিজ্ঞাপনটি <strong>{packageName}</strong> প্যাকেজে বুস্ট করা হয়েছে।
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">ট্রানজেকশন আইডি (TrxID):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{simulatedTrxId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">পরিশোধিত মাধ্যম:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedMethod} MFS Gateway</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">মোট পরিমাণ:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{amount} (পরিশোধিত)</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5">
                  <span className="text-slate-500 dark:text-slate-400">বুস্ট স্ট্যাটাস:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>সক্রিয় (Active)</span>
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  সম্পন্ন করুন ও ফিরে যান
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================= */}
        {/* 4. FOOTER SECURITY BADGE */}
        {/* ========================================================= */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>১২৮-বিট এসএসএল এনক্রিপশন দ্বারা পেমেন্ট গেটওয়ে সম্পূর্ণ সুরক্ষিত</span>
        </div>

      </div>
    </div>
  );
};
