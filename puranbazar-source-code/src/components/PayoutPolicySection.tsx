import React, { useState } from 'react';
import { 
  Sliders, ShieldCheck, CheckCircle2, DollarSign, Smartphone, 
  Building2, Bell, Clock, Check
} from 'lucide-react';
import { PayoutPolicySettings } from '../types';
import { Language, formatNumber } from '../utils/i18n';

interface PayoutPolicySectionProps {
  policy: PayoutPolicySettings;
  onUpdatePolicy: (policy: PayoutPolicySettings) => void;
  language?: Language;
}

export const PayoutPolicySection: React.FC<PayoutPolicySectionProps> = ({
  policy,
  onUpdatePolicy,
  language = 'bn',
}) => {
  const isEn = language === 'en';
  const [minWithdrawal, setMinWithdrawal] = useState(policy.minWithdrawalBDT.toString());
  const [maxDaily, setMaxDaily] = useState(policy.maxDailyWithdrawalBDT.toString());
  const [mfsFee, setMfsFee] = useState(policy.mfsCashoutFeePercent.toString());
  const [bankFee, setBankFee] = useState(policy.bankTransferFeeBDT.toString());
  const [enforce2FA, setEnforce2FA] = useState(policy.enforcePin2FA);
  const [notifySms, setNotifySms] = useState(policy.notifySms);
  const [notifyEmail, setNotifyEmail] = useState(policy.notifyEmail);
  const [phoneInput, setPhoneInput] = useState(policy.notificationPhone);
  const [emailInput, setEmailInput] = useState(policy.notificationEmail);
  const [scheduleText, setScheduleText] = useState(policy.clearingScheduleText);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PayoutPolicySettings = {
      minWithdrawalBDT: parseFloat(minWithdrawal) || 1000,
      maxDailyWithdrawalBDT: parseFloat(maxDaily) || 100000,
      mfsCashoutFeePercent: parseFloat(mfsFee) || 0,
      bankTransferFeeBDT: parseFloat(bankFee) || 0,
      enforcePin2FA: enforce2FA,
      notifySms,
      notifyEmail,
      notificationPhone: phoneInput.trim(),
      notificationEmail: emailInput.trim(),
      clearingScheduleText: scheduleText.trim(),
    };
    onUpdatePolicy(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs animate-in fade-in max-w-4xl">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl border border-blue-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">
              {isEn ? 'Withdrawal Limits & Security Policy' : 'উত্তোলন লিমিট, চার্জ ও সিকিউরিটি পলিসি'}
            </h4>
            <p className="text-slate-300 text-[11px]">
              {isEn 
                ? 'Configure thresholds, MFS/Bank processing charges, 2FA enforcement, and clearing windows.'
                : 'বিকাশ, নগদ ও ব্যাংকে উত্তোলনের ন্যূনতম/সর্বোচ্চ সীমা, চার্জ ও নোটিফিকেশন অ্যালার্ট নিয়ন্ত্রণ করুন।'}
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isEn ? 'Withdrawal policy updated successfully!' : 'উত্তোলন পলিসি ও সেটিংস সফলভাবে আপডেট হয়েছে!'}</span>
        </div>
      )}

      {/* Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Section 1: Financial Limits */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'Threshold & Daily Limits' : 'উত্তোলনের ন্যূনতম ও দৈনিক সীমা'}</span>
          </h4>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'Minimum Withdrawal per Request (BDT)' : 'প্রতি রিকোয়েস্টে ন্যূনতম উত্তোলনের পরিমাণ (টাকা)'}
            </label>
            <input
              type="number"
              required
              min={100}
              value={minWithdrawal}
              onChange={(e) => setMinWithdrawal(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
            />
            <span className="text-[10px] text-slate-400">{isEn ? 'Default: ৳1,000' : 'ডিফল্ট: ৳১,০০০'}</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'Maximum Daily Withdrawal Limit (BDT)' : 'দৈনিক সর্বোচ্চ উত্তোলনের সীমা (টাকা)'}
            </label>
            <input
              type="number"
              required
              min={1000}
              value={maxDaily}
              onChange={(e) => setMaxDaily(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
            />
            <span className="text-[10px] text-slate-400">{isEn ? 'Default: ৳100,000' : 'ডিফল্ট: ৳১,০০,০০০'}</span>
          </div>
        </div>

        {/* Section 2: Cashout & Transfer Fees */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-pink-600" />
            <span>{isEn ? 'Processing & Cashout Fees' : 'ক্যাশআউট ও প্রসেসিং ফি নির্ধারণ'}</span>
          </h4>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'MFS Cashout Charge (bKash/Nagad %)' : 'বিকাশ ও নগদ ক্যাশআউট চার্জের শতকরা হার (%)'}
            </label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={mfsFee}
              onChange={(e) => setMfsFee(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
            />
            <span className="text-[10px] text-slate-400">{isEn ? '0% = Platform absorbs charge (Free for admin)' : '০% = প্ল্যাটফর্ম কর্তৃক ফ্রি ক্যাশআউট'}</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'Bank Transfer Fee (BEFTN/NPSB BDT)' : 'ব্যাংক ট্রান্সফার সার্ভিস চার্জ (BEFTN/NPSB)'}
            </label>
            <input
              type="number"
              min={0}
              value={bankFee}
              onChange={(e) => setBankFee(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
            />
            <span className="text-[10px] text-slate-400">{isEn ? 'Default: ৳0 (No bank transfer fee)' : 'ডিফল্ট: ৳০ (সম্পূর্ণ ফ্রি)'}</span>
          </div>
        </div>

        {/* Section 3: 2FA & Notification Alerts */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>{isEn ? 'Security 2FA & Approvals' : 'সিকিউরিটি পিন ও টু-ফ্যাক্টর অনুমোদন'}</span>
          </h4>

          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 cursor-pointer">
            <input
              type="checkbox"
              checked={enforce2FA}
              onChange={(e) => setEnforce2FA(e.target.checked)}
              className="rounded text-emerald-600"
            />
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {isEn ? 'Enforce 6-Digit Staff PIN for Payouts' : 'উত্তোলনে ৬-সংখ্যার সিকিউরিটি পিন বাধ্যতামূলক'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {isEn ? 'Protects against unauthorized fund transfers.' : 'অননুমোদিত বা ভুলবশত অর্থ ট্রান্সফার প্রতিরোধে কার্যকর।'}
              </div>
            </div>
          </label>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'SMS Notification Mobile' : 'এসএমএস নোটিফিকেশন মোবাইল নম্বর'}
            </label>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
            />
          </div>
        </div>

        {/* Section 4: Clearing Schedule & Guidelines */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{isEn ? 'Settlement Schedule' : 'নিষ্পত্তি ও ক্লিয়ারিং সময়সূচী'}</span>
          </h4>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'Clearing Window Guidelines' : 'ব্যাংক ও মোবাইল ব্যাংকিং কার্যদিবস নীতি'}
            </label>
            <textarea
              rows={3}
              value={scheduleText}
              onChange={(e) => setScheduleText(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <div>• <strong>MFS (bKash/Nagad):</strong> {isEn ? 'Instant / 10-30 mins' : '১০ থেকে ৩০ মিনিট (২৪/৭ দিনরাত)'}</div>
            <div>• <strong>Bank (BEFTN/NPSB):</strong> {isEn ? '1-2 Banking Business Days' : '১-২ ব্যাংক কার্যদিবস (রবি থেকে বৃহস্পতি)'}</div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{isEn ? 'Save Withdrawal Policy' : 'উত্তোলন পলিসি সংরক্ষণ করুন'}</span>
        </button>
      </div>
    </form>
  );
};
