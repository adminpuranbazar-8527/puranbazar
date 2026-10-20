import React, { useState } from 'react';
import { 
  DollarSign, Building2, Smartphone, ArrowDownRight, PlusCircle, 
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, Lock, 
  ExternalLink, FileSpreadsheet, RefreshCw, Send, Check, 
  CreditCard, Landmark, ArrowUpRight, Copy, CheckCheck,
  Globe, Sliders, Sparkles
} from 'lucide-react';
import { 
  StaffMember, RevenueItem, AdSenseStats, PayoutAccount, 
  WithdrawalRequest, SecuritySettings, GoogleAdSenseConfig, PayoutPolicySettings
} from '../types';
import { 
  BANGLADESH_BANKS, BANGLADESH_MFS, BANGLADESH_BANKS_SWIFT, 
  INITIAL_ADSENSE_CONFIG, INITIAL_PAYOUT_POLICY 
} from '../utils/security';
import { SecurityPinModal } from './SecurityPinModal';
import { AdSenseManagerSection } from './AdSenseManagerSection';
import { PayoutPolicySection } from './PayoutPolicySection';
import { Language, formatPrice, formatNumber } from '../utils/i18n';

interface RevenuePayoutSectionProps {
  currentStaff: StaffMember;
  revenueItems: RevenueItem[];
  adSenseStats: AdSenseStats;
  payoutAccounts: PayoutAccount[];
  withdrawals: WithdrawalRequest[];
  securitySettings: SecuritySettings;
  adSenseConfig?: GoogleAdSenseConfig;
  onUpdateAdSenseConfig?: (config: GoogleAdSenseConfig) => void;
  payoutPolicy?: PayoutPolicySettings;
  onUpdatePayoutPolicy?: (policy: PayoutPolicySettings) => void;
  onAddPayoutAccount: (account: PayoutAccount) => void;
  onDeletePayoutAccount: (accountId: string) => void;
  onSetDefaultAccount: (accountId: string) => void;
  onRequestWithdrawal: (withdrawal: WithdrawalRequest) => void;
  onCompleteWithdrawal: (withdrawalId: string, bankTxRef: string) => void;
  language?: Language;
}

export const RevenuePayoutSection: React.FC<RevenuePayoutSectionProps> = ({
  currentStaff,
  revenueItems,
  adSenseStats,
  payoutAccounts,
  withdrawals,
  securitySettings,
  adSenseConfig = INITIAL_ADSENSE_CONFIG,
  onUpdateAdSenseConfig,
  payoutPolicy = INITIAL_PAYOUT_POLICY,
  onUpdatePayoutPolicy,
  onAddPayoutAccount,
  onDeletePayoutAccount,
  onSetDefaultAccount,
  onRequestWithdrawal,
  onCompleteWithdrawal,
  language = 'bn',
}) => {
  const isSuperAdmin = currentStaff.role === 'super_admin';
  const isEn = language === 'en';

  const formatTk = (amount: number) => {
    return isEn ? `৳${amount.toLocaleString()}` : `৳${amount.toLocaleString('bn-BD')}`;
  };

  const formatNum = (num: number) => {
    return isEn ? num.toLocaleString() : num.toLocaleString('bn-BD');
  };

  const getStreamName = (item: RevenueItem) => {
    if (!isEn) return item.streamNameBn;
    switch (item.stream) {
      case 'adsense': return 'AdSense Revenue';
      case 'featured_ads': return 'Featured Ad Fee';
      case 'seller_verification': return 'Seller Badge';
      case 'banner_sponsorship': return 'Banner Sponsorship';
      case 'escrow_fee': return 'Escrow Fee';
      default: return item.streamNameBn;
    }
  };

  // Sub-tabs inside Revenue & Payout
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'withdraw' | 'accounts' | 'adsense' | 'policy' | 'history'>('overview');

  // New Account Modal/Form State
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [accountType, setAccountType] = useState<'bank' | 'mfs'>('bank');
  const [selectedProvider, setSelectedProvider] = useState(BANGLADESH_BANKS[0]);
  const [accountName, setAccountName] = useState('Md Shaidur Hossen');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchName, setBranchName] = useState(isEn ? 'Mirpur-10 Branch, Dhaka' : 'মিরপুর-১০ শাখা, ঢাকা');
  const [routingNumber, setRoutingNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState(BANGLADESH_BANKS_SWIFT[BANGLADESH_BANKS[0]] || 'DBBLBDDH');
  const [accountCategory, setAccountCategory] = useState<'personal' | 'merchant' | 'corporate'>('corporate');
  const [mfsChannel, setMfsChannel] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay'>('bKash');
  const [isDefaultAccount, setIsDefaultAccount] = useState(false);
  const [addAccountError, setAddAccountError] = useState('');

  // Withdrawal Request Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState(payoutAccounts[0]?.id || '');
  const [withdrawNotes, setWithdrawNotes] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Complete Pending Withdrawal Modal State
  const [completingWdId, setCompletingWdId] = useState<string | null>(null);
  const [bankRefInput, setBankRefInput] = useState('');

  // PIN verification modal state
  const [pinAction, setPinAction] = useState<{
    isOpen: boolean;
    title: string;
    details: string;
    onExecute: () => void;
  }>({
    isOpen: false,
    title: '',
    details: '',
    onExecute: () => {},
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Financial Calculations
  const totalRevenue = revenueItems.reduce((acc, item) => acc + item.amount, 0);
  const totalWithdrawn = withdrawals
    .filter((w) => w.status === 'completed')
    .reduce((acc, w) => acc + w.amount, 0);
  const inProcessingAmount = withdrawals
    .filter((w) => w.status === 'pending' || w.status === 'processing')
    .reduce((acc, w) => acc + w.amount, 0);
  const availableBalance = Math.max(0, totalRevenue - totalWithdrawn - inProcessingAmount);

  // If NOT Super Admin, display Access Denied Barrier
  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isEn ? 'Access Restricted (Super Admin Only)' : 'অনুমোদন সীমাবদ্ধ (Super Admin Only)'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isEn
              ? 'Revenue generated from Google AdSense, sponsorships, and withdrawals to commercial banks or MFS are restricted exclusively to the Chief Super Admin.'
              : 'Google AdSense এবং বিভিন্ন খাত হতে উপার্জিত রাজস্ব এবং বাংলাদেশ অধীনস্থ বাণিজ্যিক ব্যাংক বা মোবাইল ব্যাংকিং (MFS) এ অর্থ উত্তোলনের যাবতীয় এক্সেস শুধুমাত্র প্রধান সুপার এডমিন-এর জন্য সংরক্ষিত।'}
          </p>
          <div className="pt-2 text-[11px] text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900">
            {isEn ? 'You are currently logged in as ' : 'বর্তমানে আপনি '}<span className="font-bold">{currentStaff.role}</span>{isEn ? '.' : ' হিসেবে লগইন আছেন।'}
          </div>
        </div>
      </div>
    );
  }

  // Trigger PIN-protected action
  const requestPinProtectedAction = (title: string, details: string, onExecute: () => void) => {
    if (!securitySettings.requirePinForDestructiveActions) {
      onExecute();
      return;
    }
    setPinAction({
      isOpen: true,
      title,
      details,
      onExecute,
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add Account Submit
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAddAccountError('');

    if (!accountNumber.trim()) {
      setAddAccountError(isEn ? 'Please provide account or mobile number' : 'অ্যাকাউন্ট বা মোবাইল নম্বর প্রদান করুন');
      return;
    }
    if (!accountName.trim()) {
      setAddAccountError(isEn ? 'Please provide account holder name' : 'হিসাবধারীর নাম প্রদান করুন');
      return;
    }

    const newAccount: PayoutAccount = {
      id: `acc-${Date.now()}`,
      type: accountType,
      providerName: selectedProvider,
      accountName: accountName.trim(),
      accountNumber: accountNumber.trim(),
      branchName: accountType === 'bank' ? branchName.trim() : undefined,
      routingNumber: accountType === 'bank' ? routingNumber.trim() : undefined,
      swiftCode: accountType === 'bank' ? swiftCode.trim() : undefined,
      accountCategory,
      mfsChannel: accountType === 'mfs' ? mfsChannel : undefined,
      isDefault: isDefaultAccount || payoutAccounts.length === 0,
      addedAt: new Date().toLocaleDateString(isEn ? 'en-US' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    onAddPayoutAccount(newAccount);
    setIsAddingAccount(false);
    setAccountNumber('');
    setRoutingNumber('');
  };

  // Submit Withdrawal Request
  const handleSubmitWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError(isEn ? 'Please enter a valid withdrawal amount' : 'সঠিক উত্তোলনের পরিমাণ লিখুন');
      return;
    }

    if (amountNum < payoutPolicy.minWithdrawalBDT) {
      setWithdrawError(isEn ? `Minimum withdrawal amount is ৳${payoutPolicy.minWithdrawalBDT.toLocaleString()}` : `ন্যূনতম উত্তোলনের পরিমাণ ৳${payoutPolicy.minWithdrawalBDT.toLocaleString('bn-BD')}`);
      return;
    }

    if (amountNum > payoutPolicy.maxDailyWithdrawalBDT) {
      setWithdrawError(isEn ? `Maximum daily limit is ৳${payoutPolicy.maxDailyWithdrawalBDT.toLocaleString()}` : `দৈনিক সর্বোচ্চ উত্তোলনের সীমা ৳${payoutPolicy.maxDailyWithdrawalBDT.toLocaleString('bn-BD')}`);
      return;
    }

    if (amountNum > availableBalance) {
      setWithdrawError(isEn ? `Insufficient balance! Maximum withdrawable balance is ${formatTk(availableBalance)}` : `পর্যাপ্ত ব্যালেন্স নেই! আপনার সর্বোচ্চ উত্তোলনযোগ্য ব্যালেন্স ৳${availableBalance.toLocaleString('bn-BD')}`);
      return;
    }

    const targetAccount = payoutAccounts.find((a) => a.id === selectedAccountId);
    if (!targetAccount) {
      setWithdrawError(isEn ? 'Please select a bank or mobile banking account' : 'উত্তোলনের জন্য ব্যাংক বা মোবাইল ব্যাংকিং একাউন্ট নির্বাচন করুন');
      return;
    }

    // Require PIN verification
    requestPinProtectedAction(
      isEn ? 'Authorize Withdrawal (Super Admin 2FA)' : 'টাকা উত্তোলন অনুমোদন (Super Admin 2FA)',
      isEn
        ? `You are requesting a withdrawal of ${formatTk(amountNum)} to ${targetAccount.providerName} (${targetAccount.accountNumber}). Enter your 6-digit security PIN to confirm.`
        : `আপনি ৳${amountNum.toLocaleString('bn-BD')} টাকা ${targetAccount.providerName} (${targetAccount.accountNumber})-এ উত্তোলনের রিকোয়েস্ট তৈরি করতে যাচ্ছেন। নিশ্চিত করতে আপনার ৬-সংখ্যার সিকিউরিটি পিন দিন।`,
      () => {
        const newWithdrawal: WithdrawalRequest = {
          id: `wd-${Date.now()}`,
          referenceNo: `PB-WD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: amountNum,
          deductionsOrFee: 0,
          netAmount: amountNum,
          payoutAccountId: targetAccount.id,
          payoutAccountTitle: `${targetAccount.providerName} (${targetAccount.accountNumber})`,
          payoutChannelType: targetAccount.type,
          targetDetails: targetAccount.type === 'bank' 
            ? `${targetAccount.branchName || (isEn ? 'Branch' : 'শাখা')} (${isEn ? 'Routing' : 'রাউটিং'}: ${targetAccount.routingNumber || 'N/A'})`
            : `${targetAccount.providerName} Official MFS`,
          requestedAt: new Date().toLocaleDateString(isEn ? 'en-US' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString(isEn ? 'en-US' : 'bn-BD', { hour: '2-digit', minute: '2-digit' }),
          status: 'processing',
          bankTxReference: 'NPSB/BEFTN-PENDING',
          notes: withdrawNotes.trim() || (isEn ? 'Super Admin Withdrawal Request' : 'সুপার এডমিন উত্তোলন রিকোয়েস্ট'),
          approvedBy: currentStaff.name,
        };

        onRequestWithdrawal(newWithdrawal);
        setWithdrawAmount('');
        setWithdrawNotes('');
        setActiveSubTab('history');
      }
    );
  };

  const handleMarkCompleted = (wdId: string) => {
    if (!bankRefInput.trim()) return;
    onCompleteWithdrawal(wdId, bankRefInput.trim());
    setCompletingWdId(null);
    setBankRefInput('');
  };

  return (
    <div className="space-y-5 text-xs">
      
      {/* Top Header Badge */}
      <div className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl border border-emerald-500/30 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold">
                {isEn ? 'Bangladesh Bank & Mobile Banking Payout Control' : 'বাংলাদেশ ব্যাংক ও মোবাইল ব্যাংকিং উত্তোলন কন্ট্রোল'}
              </h3>
              <span className="px-2 py-0.5 bg-rose-500/90 text-white rounded text-[10px] font-extrabold tracking-wide uppercase">
                Super Admin Exclusive
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5">
              {isEn
                ? 'Central gateway to withdraw AdSense, listing fees, and sponsorships via BEFTN, NPSB, bKash & Nagad'
                : 'Google AdSense, ফিচার্ড লিস্টিং ও স্পন্সরশিপের মোট আয় BEFTN, NPSB ও বিকাশ/নগদে উত্তোলনের কেন্দ্রীয় ব্যবস্থা'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('withdraw')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>{isEn ? 'Withdraw Funds' : 'টাকা উত্তোলন করুন'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
            activeSubTab === 'overview'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>{isEn ? 'Revenue Overview' : 'আয় ও রাজস্ব সারসংক্ষেপ'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('withdraw')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
            activeSubTab === 'withdraw'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>{isEn ? 'New Withdrawal Request' : 'নতুন উত্তোলন রিকোয়েস্ট'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('accounts')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
            activeSubTab === 'accounts'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{isEn ? `Saved Accounts (${payoutAccounts.length})` : `সংরক্ষিত ব্যাংক ও MFS অ্যাকাউন্ট (${payoutAccounts.length})`}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('adsense')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
            activeSubTab === 'adsense'
              ? 'border-amber-500 text-amber-700 dark:text-amber-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span>{isEn ? 'Google AdSense & Linking' : 'গুগল এডসেন্স ও সাইট লিংক'}</span>
          <span className="px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded text-[9px] font-extrabold">
            {isEn ? 'Settings' : 'সেটিংস'}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('policy')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
            activeSubTab === 'policy'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <span>{isEn ? 'Withdrawal Limits & Policy' : 'উত্তোলন লিমিট ও পলিসি'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
            activeSubTab === 'history'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isEn ? `Withdrawal History (${withdrawals.length})` : `উত্তোলন হিস্ট্রি ও ভাউচার (${withdrawals.length})`}</span>
        </button>
      </div>

      {/* SUB-TAB 1: REVENUE OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in">
          
          {/* 4 Financial Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium flex items-center justify-between">
                <span>{isEn ? 'Total Earned Revenue' : 'সর্বমোট অর্জিত আয়'}</span>
                <span className="p-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded">
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {formatTk(totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3 h-3" />
                <span>{isEn ? 'Consolidated all streams' : 'সকল খাতের সমন্বিত রাজস্ব'}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-1">
              <div className="text-emerald-800 dark:text-emerald-300 text-[11px] font-medium flex items-center justify-between">
                <span>{isEn ? 'Available Balance' : 'উত্তোলনযোগ্য ব্যালেন্স'}</span>
                <span className="p-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded">
                  <Landmark className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {formatTk(availableBalance)}
              </div>
              <div className="text-[11px] text-emerald-800/80 dark:text-emerald-400">
                {isEn ? 'Instantly withdrawable to bank/MFS' : 'ব্যাংক বা বিকাশে তাৎক্ষণিক ট্রান্সফারযোগ্য'}
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-1">
              <div className="text-amber-800 dark:text-amber-300 text-[11px] font-medium flex items-center justify-between">
                <span>{isEn ? 'Processing (In Transit)' : 'প্রক্রিয়াধীন উত্তোলন (In Transit)'}</span>
                <span className="p-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
                  <Clock className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-amber-900 dark:text-amber-300 tabular-nums">
                {formatTk(inProcessingAmount)}
              </div>
              <div className="text-[11px] text-amber-800/80 dark:text-amber-400">
                {isEn ? 'BEFTN / bank clearance pending' : 'BEFTN বা ব্যাংক ক্লিয়ারিং অপেক্ষমাণ'}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 space-y-1">
              <div className="text-blue-800 dark:text-blue-300 text-[11px] font-medium flex items-center justify-between">
                <span>{isEn ? 'Total Withdrawn' : 'সর্বমোট উত্তোলিত অর্থ'}</span>
                <span className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-blue-900 dark:text-blue-200 tabular-nums">
                {formatTk(totalWithdrawn)}
              </div>
              <div className="text-[11px] text-blue-800/80 dark:text-blue-400">
                {isEn ? 'Settled into destination accounts' : 'সফলভাবে নিজস্ব ব্যাংক অ্যাকাউন্টে জমা'}
              </div>
            </div>

          </div>

          {/* AdSense Live Metrics Panel */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                  G
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {isEn ? 'Google AdSense Monetization Metrics' : 'গুগল এডসেন্স মনিটাইজেশন মেট্রিক্স (Google AdSense)'}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Publisher ID: <span className="font-mono">{adSenseStats.adSensePublisherId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-bold">
                  {isEn ? '● AdSense Active' : '● এডসেন্স সক্রিয়'}
                </span>
                <span className="text-slate-400">{isEn ? 'Updated:' : 'আপডেট:'} {adSenseStats.lastUpdated}</span>
                <button
                  onClick={() => setActiveSubTab('adsense')}
                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Configure Linking' : 'লিংক সেটিংস'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">{isEn ? 'This Month Earnings' : 'চলতি মাসের এডসেন্স আয়'}</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {formatTk(adSenseStats.thisMonthEarnings)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">{isEn ? 'Last Month Earnings' : 'গত মাসের আয়'}</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {formatTk(adSenseStats.lastMonthEarnings)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">{isEn ? 'Page Views' : 'মোট পেজভিউ (Views)'}</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {formatNum(adSenseStats.pageViews)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">{isEn ? 'Ad Clicks' : 'বিজ্ঞাপন ক্লিক (Clicks)'}</div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {formatNum(adSenseStats.clicks)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">{isEn ? 'Click Rate (CTR)' : 'ক্লিক রেট (CTR)'}</div>
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
                  {adSenseStats.ctr}%
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">{isEn ? 'RPM (per 1k views)' : 'প্রতি হাজার ভিউতে RPM'}</div>
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
                  ৳{adSenseStats.rpm}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Stream Details Breakdown Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                {isEn ? 'Detailed Breakdown of Revenue Streams:' : 'বিভিন্ন খাত হতে অর্জিত রাজস্বের পূর্ণাঙ্গ বিবরণী:'}
              </h4>
              <span className="text-[11px] text-slate-400">{isEn ? `${revenueItems.length} source entries` : `${revenueItems.length} টি সোর্স এন্ট্রি`}</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {revenueItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{item.sourceTitle}</span>
                      <span className="px-2 py-0.2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded font-semibold text-[10px]">
                        {getStreamName(item)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.description}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {isEn ? 'Method:' : 'মেথড:'} {item.channel} {item.trxId && `| Trx: ${item.trxId}`} | {isEn ? 'Date:' : 'তারিখ:'} {item.date}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      +{formatTk(item.amount)}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {isEn ? '✓ Earned & Settled' : '✓ অর্জিত ও জমা'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: WITHDRAWAL FORM */}
      {activeSubTab === 'withdraw' && (
        <div className="max-w-2xl mx-auto p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-5 animate-in fade-in">
          
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? 'Request Fund Withdrawal' : 'টাকা উত্তোলনের রিকোয়েস্ট তৈরি করুন'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn
                  ? 'Direct withdrawal via Bangladesh Bank BEFTN/NPSB network or bKash/Nagad'
                  : 'বাংলাদেশ ব্যাংক BEFTN/NPSB নেটওয়ার্ক অথবা বিকাশ/নগদ এর মাধ্যমে সরাসরি নিজস্ব অ্যাকাউন্টে উত্তোলন'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400">{isEn ? 'Withdrawable Balance:' : 'উত্তোলনযোগ্য ব্যালেন্স:'}</span>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {formatTk(availableBalance)}
              </div>
            </div>
          </div>

          {withdrawError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{withdrawError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitWithdrawal} className="space-y-4">
            
            {/* Amount input */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? 'Withdrawal Amount (BDT) *' : 'উত্তোলনের পরিমাণ (টাকা) *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1000}
                  max={availableBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={isEn ? 'e.g. 15000' : 'যেমন: ১৫০০০'}
                  className="w-full text-base font-bold tabular-nums p-2.5 pl-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
                <span className="absolute left-3 top-3 text-slate-400 font-bold">৳</span>
              </div>

              {/* Fast presets */}
              <div className="flex gap-2 mt-2">
                {[5000, 10000, 20000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWithdrawAmount(preset.toString())}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {formatTk(preset)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(availableBalance.toString())}
                  className="px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold cursor-pointer"
                >
                  {isEn ? `Full Balance (${formatTk(availableBalance)})` : `সম্পূর্ণ ব্যালেন্স (৳${availableBalance.toLocaleString('bn-BD')})`}
                </button>
              </div>
            </div>

            {/* Select Destination Account */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Destination Account (Select Bank or MFS) *' : 'উত্তোলনের গন্তব্য (ব্যাংক বা মোবাইল ব্যাংকিং নির্বাচন করুন) *'}
                </label>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('accounts')}
                  className="text-emerald-600 dark:text-emerald-400 text-[11px] hover:underline font-semibold cursor-pointer"
                >
                  {isEn ? '+ Add New Account' : '+ নতুন অ্যাকাউন্ট যোগ করুন'}
                </button>
              </div>

              {payoutAccounts.length === 0 ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 text-amber-800 dark:text-amber-300 text-xs">
                  {isEn ? 'No bank or MFS accounts added. Please add an account using the button above.' : 'কোনো ব্যাংক বা বিকাশ একাউন্ট যুক্ত নেই। প্রথমে নিচের বোতাম দিয়ে আপনার অ্যাকাউন্ট যুক্ত করুন।'}
                </div>
              ) : (
                <div className="space-y-2">
                  {payoutAccounts.map((acc) => {
                    const isSelected = selectedAccountId === acc.id;
                    return (
                      <div
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            acc.type === 'bank'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
                          }`}>
                            {acc.type === 'bank' ? <Landmark className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{acc.providerName}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              A/C: {acc.accountNumber} ({acc.accountName})
                            </div>
                            {acc.branchName && (
                              <div className="text-[10px] text-slate-400">
                                {acc.branchName} {acc.routingNumber ? `| ${isEn ? 'Routing' : 'রাউটিং'}: ${acc.routingNumber}` : ''}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {acc.isDefault && (
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-semibold">
                              {isEn ? 'Default' : 'ডিফল্ট'}
                            </span>
                          )}
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isEn ? 'Notes or Reference (Optional)' : 'মন্তব্য বা রেফারেন্স নোট (ঐচ্ছিক)'}
              </label>
              <input
                type="text"
                value={withdrawNotes}
                onChange={(e) => setWithdrawNotes(e.target.value)}
                placeholder={isEn ? 'e.g. September revenue payout' : 'যেমন: সেপ্টেম্বর ২০২৬ এডসেন্স ও প্রিমিয়াম প্রমোশনের অংশ উত্তোলন'}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
              />
            </div>

            {/* Security Assurance Notice */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 text-[11px] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? 'Super Admin 2FA Security PIN Required' : 'সুপার এডমিন ২-ফ্যাক্টর নিরাপত্তা পিন বাধ্যতামূলক'}</span>
              </div>
              <p>
                {isEn
                  ? 'To prevent unauthorized withdrawals, you will be prompted for your 6-digit security PIN upon submission.'
                  : 'অননুমোদিত ব্যাংক উত্তোলন বা সাইবার জালিয়াতি ঠেকাতে ফর্ম সাবমিটের পর আপনার ৬-সংখ্যার সিকিউরিটি পিন যাচাই করা হবে।'}
              </p>
            </div>

            <button
              type="submit"
              disabled={availableBalance < 1000 || payoutAccounts.length === 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>{isEn ? 'Request Withdrawal' : 'উত্তোলন নিশ্চিত করুন (Request Withdrawal)'}</span>
            </button>
          </form>

        </div>
      )}

      {/* SUB-TAB 3: SAVED BANK & MFS ACCOUNTS */}
      {activeSubTab === 'accounts' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? 'Saved Bank & MFS Accounts' : 'সংরক্ষিত ব্যাংক ও মোবাইল ফিন্যান্সিয়াল সার্ভিস (MFS) অ্যাকাউন্ট'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn ? 'Configure your bank or mobile wallet accounts to receive revenue' : 'বিজ্ঞাপন রাজস্ব ও প্ল্যাটফর্মের টাকা সরাসরি গ্রহণ করার জন্য আপনার ব্যক্তিগত/প্রাতিষ্ঠানিক অ্যাকাউন্ট কনফিগারেশন'}
              </p>
            </div>

            <button
              onClick={() => setIsAddingAccount(!isAddingAccount)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAddingAccount ? (isEn ? 'Close Form' : 'ফর্ম বন্ধ করুন') : (isEn ? '+ Add New Account' : '+ নতুন অ্যাকাউন্ট যুক্ত করুন')}</span>
            </button>
          </div>

          {/* Add Account Form */}
          {isAddingAccount && (
            <form
              onSubmit={handleSaveAccount}
              className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4"
            >
              <div className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                {isEn ? 'Enter New Bank or Mobile Banking Details' : 'নতুন ব্যাংক বা মোবাইল ব্যাংকিং বিবরণ প্রদান করুন'}
              </div>

              {addAccountError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs">
                  {addAccountError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                
                {/* Account Type */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Account Type *' : 'অ্যাকাউন্টের মাধ্যম *'}</label>
                  <select
                    value={accountType}
                    onChange={(e) => {
                      const t = e.target.value as 'bank' | 'mfs';
                      setAccountType(t);
                      setSelectedProvider(t === 'bank' ? BANGLADESH_BANKS[0] : BANGLADESH_MFS[0]);
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="bank">{isEn ? 'Commercial Bank (BEFTN / NPSB)' : 'বাণিজ্যিক ব্যাংক (BEFTN / NPSB)'}</option>
                    <option value="mfs">{isEn ? 'Mobile Banking (bKash / Nagad / Rocket)' : 'মোবাইল ব্যাংকিং (bKash / Nagad / Rocket)'}</option>
                  </select>
                </div>

                {/* Bank / Provider Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {accountType === 'bank' ? (isEn ? 'Bank Name *' : 'ব্যাংকের নাম *') : (isEn ? 'MFS Provider *' : 'MFS সেবাদাতা *')}
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => {
                      setSelectedProvider(e.target.value);
                      if (BANGLADESH_BANKS_SWIFT[e.target.value]) {
                        setSwiftCode(BANGLADESH_BANKS_SWIFT[e.target.value]);
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    {accountType === 'bank'
                      ? BANGLADESH_BANKS.map((b) => <option key={b} value={b}>{b}</option>)
                      : BANGLADESH_MFS.map((m) => <option key={m} value={m}>{m}</option>)
                    }
                  </select>
                </div>

                {/* Account Name */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Account Holder Name *' : 'হিসাবধারীর পূর্ণ নাম *'}</label>
                  <input
                    type="text"
                    required
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder={isEn ? 'e.g. Shahidul Islam' : 'যেমন: শাহিদুল ইসলাম'}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {accountType === 'bank' ? (isEn ? 'Bank Account Number *' : 'ব্যাংক হিসাব নম্বর (A/C No) *') : (isEn ? 'Mobile Wallet Number *' : 'মোবাইল নম্বর (Wallet No) *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={accountType === 'bank' ? 'e.g. 115.120.0094821' : '01517830164'}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                {/* Bank Specific: Branch */}
                {accountType === 'bank' && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Branch Name' : 'শাখার নাম (Branch)'}</label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      placeholder={isEn ? 'e.g. Mirpur-10, Dhaka' : 'যেমন: মিরপুর-১০ শাখা, ঢাকা'}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                )}

                {/* Bank Specific: Routing */}
                {accountType === 'bank' && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Routing Number' : 'বাংলাদেশ ব্যাংক রাউটিং নম্বর'}</label>
                    <input
                      type="text"
                      maxLength={9}
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder={isEn ? '9-digit code (optional)' : '৯-সংখ্যার কোড (ঐচ্ছিক)'}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                )}

                {/* Bank Specific: SWIFT Code */}
                {accountType === 'bank' && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEn ? 'SWIFT/BIC Code (AdSense Wire)' : 'সুইফট কোড (SWIFT / BIC)'}
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                      placeholder="DBBLBDDH"
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                    <span className="text-[10px] text-emerald-600 font-semibold">{isEn ? 'Google AdSense wire transfers' : 'এডসেন্স পেমেন্ট জমা'}</span>
                  </div>
                )}

                {/* MFS Specific: Channel */}
                {accountType === 'mfs' && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isEn ? 'MFS Wallet Brand' : 'মোবাইল ওয়ালেট ব্র্যান্ড'}
                    </label>
                    <select
                      value={mfsChannel}
                      onChange={(e) => setMfsChannel(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="bKash">বিকাশ (bKash)</option>
                      <option value="Nagad">নগদ (Nagad)</option>
                      <option value="Rocket">রকেট (Rocket)</option>
                      <option value="Upay">উপায় (Upay)</option>
                    </select>
                  </div>
                )}

              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAccCheck"
                  checked={isDefaultAccount}
                  onChange={(e) => setIsDefaultAccount(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <label htmlFor="defaultAccCheck" className="text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                  {isEn ? 'Set as default withdrawal account' : 'এই অ্যাকাউন্টকে ডিফল্ট উত্তোলন অ্যাকাউন্ট হিসেবে নির্ধারণ করুন'}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAccount(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  {isEn ? 'Save Account' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          )}

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {payoutAccounts.map((acc) => (
              <div
                key={acc.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      acc.type === 'bank'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
                    }`}>
                      {acc.type === 'bank' ? <Landmark className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{acc.providerName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{isEn ? 'Holder:' : 'হিসাবধারী:'} {acc.accountName}</div>
                    </div>
                  </div>

                  {acc.isDefault ? (
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-bold text-[10px]">
                      {isEn ? 'Default Channel' : 'ডিফল্ট চ্যানেল'}
                    </span>
                  ) : (
                    <button
                      onClick={() => onSetDefaultAccount(acc.id)}
                      className="text-[11px] text-emerald-600 hover:underline cursor-pointer"
                    >
                      {isEn ? 'Set Default' : 'ডিফল্ট করুন'}
                    </button>
                  )}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>A/C Number:</span>
                    <span className="font-bold tracking-wide">{acc.accountNumber}</span>
                  </div>
                  {acc.branchName && (
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Branch:</span>
                      <span>{acc.branchName}</span>
                    </div>
                  )}
                  {acc.routingNumber && (
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Routing No:</span>
                      <span>{acc.routingNumber}</span>
                    </div>
                  )}
                  {acc.swiftCode && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-[11px]">
                      <span>SWIFT / BIC:</span>
                      <span className="font-bold flex items-center gap-1">
                        {acc.swiftCode}
                        <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 px-1 py-0.2 rounded font-semibold">AdSense Ready</span>
                      </span>
                    </div>
                  )}
                  {acc.mfsChannel && (
                    <div className="flex justify-between items-center text-pink-600 dark:text-pink-400 text-[11px]">
                      <span>Wallet Brand:</span>
                      <span className="font-bold">{acc.mfsChannel}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>{isEn ? 'Added:' : 'যুক্ত করা হয়েছে:'} {acc.addedAt}</span>

                  <button
                    onClick={() =>
                      requestPinProtectedAction(
                        isEn ? 'Delete Account' : 'অ্যাকাউন্ট মুছে ফেলা',
                        isEn
                          ? `Are you sure you want to permanently remove ${acc.providerName} (${acc.accountNumber})?`
                          : `আপনি কি ${acc.providerName} (${acc.accountNumber}) অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলতে চান?`,
                        () => onDeletePayoutAccount(acc.id)
                      )
                    }
                    className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    {isEn ? 'Delete' : 'মুছে ফেলুন'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-TAB 4: WITHDRAWAL HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-4 animate-in fade-in">
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isEn ? 'Withdrawal History & Transaction Tracking' : 'উত্তোলন হিস্ট্রি ও ব্যাংক ট্রানজেকশন ট্র্যাকিং'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn ? 'Permanent audit records of all payouts via BEFTN/NPSB and MFS' : 'BEFTN/NPSB ও MFS এর মাধ্যমে প্রেরিত সকল উত্তোলনের স্থায়ী বিবরণী'}
              </p>
            </div>
            
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              {isEn ? '✓ Tamper-proof audit trail' : '✓ টেম্পার-প্রুফ অডিট ট্রেইল'}
            </span>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="p-4 bg-white dark:bg-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{w.referenceNo}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                      w.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : w.status === 'processing'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                    }`}>
                      {w.status === 'completed' ? (isEn ? '● Completed' : '● সম্পন্ন (Completed)') : (isEn ? '● Processing' : '● প্রক্রিয়াকরণ (Processing)')}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400">{w.requestedAt}</span>
                  </div>

                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {isEn ? 'Destination:' : 'গন্তব্য:'} {w.payoutAccountTitle}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isEn ? 'Details:' : 'শাখা/বিস্তারিত:'} {w.targetDetails} {w.notes && `| ${isEn ? 'Notes' : 'নোট'}: ${w.notes}`}
                  </div>
                  {w.bankTxReference && (
                    <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <span>{isEn ? 'Bank Ref / Trx:' : 'ব্যাংক রেফারেন্স / Trx:'} {w.bankTxReference}</span>
                      <button
                        onClick={() => handleCopy(w.bankTxReference!, w.id)}
                        className="hover:text-emerald-800"
                        title={isEn ? 'Copy' : 'কপি করুন'}
                      >
                        {copiedId === w.id ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                  <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatTk(w.amount)}
                  </div>

                  {w.status === 'processing' && (
                    <button
                      onClick={() => setCompletingWdId(w.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      {isEn ? 'Mark Completed' : 'ক্লিয়ারিং সম্পন্ন মার্ক করুন'}
                    </button>
                  )}

                  {w.status === 'completed' && (
                    <span className="text-[11px] text-slate-400">
                      {isEn ? 'Approved By:' : 'অনুমোদনকারী:'} {w.approvedBy}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mark completed input modal / inline */}
          {completingWdId && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-300">
                {isEn ? 'Provide Bank or MFS Clearing Transaction Reference' : 'ব্যাংক বা MFS ক্লিয়ারিং ট্রানজেকশন রেফারেন্স প্রদান করুন'}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bankRefInput}
                  onChange={(e) => setBankRefInput(e.target.value)}
                  placeholder={isEn ? 'e.g. BEFTN-20260923DBBL9912 or TrxID' : 'যেমন: BEFTN-20260923DBBL9912 অথবা TrxID'}
                  className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                />
                <button
                  onClick={() => handleMarkCompleted(completingWdId)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer"
                >
                  {isEn ? 'Save' : 'সংরক্ষণ করুন'}
                </button>
                <button
                  onClick={() => setCompletingWdId(null)}
                  className="px-3 py-2 border rounded-lg cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'বাতিল'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 5: GOOGLE ADSENSE & SITE LINKING MANAGER */}
      {activeSubTab === 'adsense' && (
        <AdSenseManagerSection
          adSenseConfig={adSenseConfig}
          payoutAccounts={payoutAccounts}
          onUpdateAdSenseConfig={onUpdateAdSenseConfig || (() => {})}
          language={language}
        />
      )}

      {/* SUB-TAB 6: PAYOUT LIMITS & WITHDRAWAL POLICY */}
      {activeSubTab === 'policy' && (
        <PayoutPolicySection
          policy={payoutPolicy}
          onUpdatePolicy={onUpdatePayoutPolicy || (() => {})}
          language={language}
        />
      )}

      {/* 2FA PIN Modal for Protected Withdrawal Actions */}
      <SecurityPinModal
        isOpen={pinAction.isOpen}
        onClose={() => setPinAction((prev) => ({ ...prev, isOpen: false }))}
        staff={currentStaff}
        actionTitle={pinAction.title}
        actionDetails={pinAction.details}
        onConfirm={pinAction.onExecute}
        language={language}
      />

    </div>
  );
};
