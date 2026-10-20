import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertOctagon, Trash2, Sparkles, ShieldAlert, 
  DollarSign, FileText, CheckCircle2, UserCheck, ShieldCheck,
  TrendingUp, AlertTriangle, Eye, EyeOff, ArrowUpRight, Lock, UserPlus,
  Users, KeyRound, Shield, RefreshCw, Power, Download, Clock,
  CheckCircle, Ban, Sliders, Landmark, Server, Globe, FileCode, Terminal,
  User, Mail, Phone, Edit, Edit3, Save, Key, Activity, Radio, Smartphone, Play,
  Camera, Upload, UserX, ShieldOff, Search, Filter, Database
} from 'lucide-react';
import { 
  Ad, AdReport, FeaturedPayment, StaffMember, StaffRole, SecurityAuditLog, SecuritySettings,
  RevenueItem, AdSenseStats, PayoutAccount, WithdrawalRequest, UserProfile,
  GoogleAdSenseConfig, PayoutPolicySettings
} from '../types';
import { ROLE_DETAILS, ROLE_DEFAULT_PERMISSIONS, STAFF_PRESET_AVATARS } from '../utils/security';
import { normalizePhone } from '../utils/userAuth';
import { SecurityPinModal } from './SecurityPinModal';
import { RevenuePayoutSection } from './RevenuePayoutSection';
import { UserAnalyticsSection } from './UserAnalyticsSection';
import { DataBackupVaultSection } from './DataBackupVaultSection';
import { Language, formatPrice, formatNumber } from '../utils/i18n';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  ads: Ad[];
  reports: AdReport[];
  payments: FeaturedPayment[];
  currentStaff: StaffMember | null;
  staffMembers: StaffMember[];
  registeredUsers?: UserProfile[];
  auditLogs: SecurityAuditLog[];
  securitySettings: SecuritySettings;
  revenueItems: RevenueItem[];
  adSenseStats: AdSenseStats;
  payoutAccounts: PayoutAccount[];
  withdrawals: WithdrawalRequest[];
  adSenseConfig?: GoogleAdSenseConfig;
  onUpdateAdSenseConfig?: (config: GoogleAdSenseConfig) => void;
  payoutPolicy?: PayoutPolicySettings;
  onUpdatePayoutPolicy?: (policy: PayoutPolicySettings) => void;
  onLogout: () => void;
  onApproveAd: (adId: string) => void;
  onRejectAd: (adId: string) => void;
  onDeleteAd: (adId: string) => void;
  onToggleFeatureAd: (adId: string) => void;
  onResolveReport: (reportId: string, action: 'ban_ad' | 'dismiss') => void;
  onAddStaffMember: (newStaff: StaffMember) => void;
  onUpdateStaffMember: (updatedStaff: StaffMember) => void;
  onToggleStaffStatus: (staffId: string) => void;
  onSuspendUser?: (userId: string, status: 'suspended' | 'banned', duration: string, reason: string) => void;
  onReactivateUser?: (userId: string) => void;
  onUpdateSecuritySettings: (newSettings: SecuritySettings) => void;
  onAddPayoutAccount: (account: PayoutAccount) => void;
  onDeletePayoutAccount: (accountId: string) => void;
  onSetDefaultAccount: (accountId: string) => void;
  onRequestWithdrawal: (withdrawal: WithdrawalRequest) => void;
  onCompleteWithdrawal: (withdrawalId: string, bankTxRef: string) => void;
  onRestoreBackup?: (data: {
    ads?: Ad[];
    users?: UserProfile[];
    payments?: FeaturedPayment[];
    reports?: AdReport[];
    adSenseConfig?: GoogleAdSenseConfig;
    securitySettings?: SecuritySettings;
    staffMembers?: StaffMember[];
  }) => void;
  language?: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  ads,
  reports,
  payments,
  currentStaff,
  staffMembers,
  registeredUsers = [],
  auditLogs,
  securitySettings,
  revenueItems,
  adSenseStats,
  payoutAccounts,
  withdrawals,
  adSenseConfig,
  onUpdateAdSenseConfig,
  payoutPolicy,
  onUpdatePayoutPolicy,
  onLogout,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onToggleFeatureAd,
  onResolveReport,
  onAddStaffMember,
  onUpdateStaffMember,
  onToggleStaffStatus,
  onSuspendUser,
  onReactivateUser,
  onUpdateSecuritySettings,
  onAddPayoutAccount,
  onDeletePayoutAccount,
  onSetDefaultAccount,
  onRequestWithdrawal,
  onCompleteWithdrawal,
  onRestoreBackup,
  language = 'bn',
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'reports' | 'payouts' | 'payments' | 'users' | 'staff' | 'logs' | 'security' | 'deploy' | 'backup' | 'profile' | 'analytics'>('pending');

  // Profile & Credentials State for Current Staff
  const [profileName, setProfileName] = useState(currentStaff?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentStaff?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentStaff?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(currentStaff?.avatar || '');
  const [avatarUploadError, setAvatarUploadError] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password change state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Security PIN change state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);

  // Super Admin Edit Staff Modal State
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editStaffName, setEditStaffName] = useState('');
  const [editStaffEmail, setEditStaffEmail] = useState('');
  const [editStaffPhone, setEditStaffPhone] = useState('');
  const [editStaffRole, setEditStaffRole] = useState<StaffRole>('content_moderator');
  const [editStaffPassword, setEditStaffPassword] = useState('');
  const [editStaffPin, setEditStaffPin] = useState('');
  const [editStaffAvatar, setEditStaffAvatar] = useState('');
  const [editStaffError, setEditStaffError] = useState('');

  // Keep profile inputs in sync with currentStaff
  useEffect(() => {
    if (currentStaff) {
      setProfileName(currentStaff.name);
      setProfileEmail(currentStaff.email);
      setProfilePhone(currentStaff.phone || '');
      setProfileAvatar(currentStaff.avatar || '');
      setAvatarUploadError('');
    }
  }, [currentStaff]);

  // Handler for staff avatar upload
  const handleStaffAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarUploadError(isEn ? 'Avatar image must be under 5 MB.' : 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setProfileAvatar(event.target.result);
        setAvatarUploadError('');
      }
    };
    reader.readAsDataURL(file);
  };

  // New staff form state
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('content_moderator');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [newStaffAvatar, setNewStaffAvatar] = useState('');
  const [addStaffError, setAddStaffError] = useState('');

  // User Moderation (Ban / Suspension) States (Super Admin, Admin, Content Moderator, Safety & Support)
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<'all' | 'active' | 'suspended_or_banned'>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<StaffRole | 'all'>('all');
  const [suspendingUser, setSuspendingUser] = useState<UserProfile | null>(null);
  const [suspendType, setSuspendType] = useState<'suspended' | 'banned'>('suspended');
  const [suspendDuration, setSuspendDuration] = useState('৭ দিন (7 Days)');
  const [suspendReason, setSuspendReason] = useState('প্রতারণামূলক ভুয়া বিজ্ঞাপন ও ফেক তথ্য প্রদান');
  const [customReason, setCustomReason] = useState('');
  const [userModerationFeedback, setUserModerationFeedback] = useState('');

  // Handlers for new staff and editing staff avatar uploads
  const handleNewStaffAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAddStaffError(isEn ? 'Avatar image must be under 5 MB.' : 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setNewStaffAvatar(event.target.result);
        setAddStaffError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditStaffAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setEditStaffError(isEn ? 'Avatar image must be under 5 MB.' : 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setEditStaffAvatar(event.target.result);
        setEditStaffError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenSuspendModal = (user: UserProfile) => {
    setSuspendingUser(user);
    setSuspendType(user.status === 'banned' ? 'banned' : 'suspended');
    setSuspendDuration(user.suspendedUntil || '৭ দিন (7 Days)');
    setSuspendReason(user.suspendedReason || 'প্রতারণামূলক ভুয়া বিজ্ঞাপন ও ফেক তথ্য প্রদান');
    setCustomReason('');
  };

  const handleExecuteSuspension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendingUser || !onSuspendUser) return;

    const finalReason = customReason.trim() ? customReason.trim() : suspendReason;
    const finalDuration = suspendType === 'banned' ? (isEn ? 'Permanent Ban' : 'স্থায়ী ব্যান (Permanent)') : suspendDuration;

    onSuspendUser(suspendingUser.id, suspendType, finalDuration, finalReason);
    setUserModerationFeedback(
      isEn
        ? `Account for ${suspendingUser.name} has been ${suspendType === 'banned' ? 'permanently banned' : 'suspended'}. Recorded with your role: ${roleInfo.title}.`
        : `ইউজার ${suspendingUser.name}-এর একাউন্ট সফলভাবে ${suspendType === 'banned' ? 'স্থায়ী ব্যান' : 'সাময়িক স্থগিত'} করা হয়েছে। আপনার পদবী (${roleInfo.nameBn}) হিসেবে অডিটে রেকর্ড হয়েছে।`
    );
    setSuspendingUser(null);
    setTimeout(() => setUserModerationFeedback(''), 5000);
  };

  const handleExecuteReactivate = (user: UserProfile) => {
    if (!onReactivateUser) return;
    onReactivateUser(user.id);
    setUserModerationFeedback(
      isEn
        ? `Account for ${user.name} has been reactivated successfully.`
        : `ইউজার ${user.name}-এর স্থগিতাদেশ প্রত্যাহার করে একাউন্ট পুনরায় চালু করা হয়েছে।`
    );
    setTimeout(() => setUserModerationFeedback(''), 5000);
  };

  // Security PIN Confirmation Modal State
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

  if (!isOpen || !currentStaff) return null;

  const permissions = currentStaff.permissions;
  const roleInfo = ROLE_DETAILS[currentStaff.role];

  const pendingAds = ads.filter((a) => a.status === 'pending');
  const approvedAds = ads.filter((a) => a.status === 'approved');
  const featuredAds = ads.filter((a) => a.featured_tier !== 'none' && a.status === 'approved');
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const filteredUsers = registeredUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.phone.includes(userSearchTerm) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.district.toLowerCase().includes(userSearchTerm.toLowerCase());

    const matchesStatus =
      userFilterStatus === 'all'
        ? true
        : userFilterStatus === 'active'
        ? user.status === 'active' || !user.status
        : user.status === 'suspended' || user.status === 'banned';

    const matchesRoleFilter =
      userRoleFilter === 'all'
        ? true
        : user.suspendedBy?.staffRole === userRoleFilter;

    return matchesSearch && matchesStatus && matchesRoleFilter;
  });

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

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setAddStaffError('');

    if (!newStaffName.trim() || !newStaffEmail.trim() || !newStaffPassword.trim()) {
      setAddStaffError('সকল ঘর পূরণ করুন');
      return;
    }

    if (newStaffPassword.length < 6) {
      setAddStaffError('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে');
      return;
    }

    if (newStaffPin.length < 4) {
      setAddStaffError('সিকিউরিটি পিন ন্যূনতম ৪-৬ সংখ্যার হতে হবে');
      return;
    }

    // Check duplicate email
    if (staffMembers.some((s) => s.email.toLowerCase() === newStaffEmail.trim().toLowerCase())) {
      setAddStaffError('এই ইমেইলে ইতিমধ্যে একজন এডমিন/মডারেটর নিবন্ধিত আছে');
      return;
    }

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim().toLowerCase(),
      phone: newStaffPhone.trim() || '01XXXXXXXXX',
      role: newStaffRole,
      status: 'active',
      password: newStaffPassword.trim(),
      securityPin: newStaffPin.trim(),
      avatar: newStaffAvatar.trim() ? newStaffAvatar.trim() : undefined,
      failedLoginAttempts: 0,
      createdAt: '০৬ অক্টোবর ২০২৬',
      permissions: ROLE_DEFAULT_PERMISSIONS[newStaffRole],
    };

    onAddStaffMember(newStaff);
    setIsAddingStaff(false);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffPassword('');
    setNewStaffPin('');
    setNewStaffAvatar('');
  };

  // 1. Update Profile Info (User ID / Email, Name, Phone, Avatar) for Current Staff
  const handleUpdateProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileErrorMsg('নাম এবং অফিসিয়াল ইমেইল/ইউজার আইডি আবশ্যক।');
      return;
    }

    // Check duplicate email with another staff member
    const duplicate = staffMembers.find(
      (s) => s.id !== currentStaff.id && s.email.toLowerCase() === profileEmail.trim().toLowerCase()
    );
    if (duplicate) {
      setProfileErrorMsg('এই ইমেইল/ইউজার আইডিটি অন্য একজন স্টাফ মেম্বার ইতিমধ্যে ব্যবহার করছেন!');
      return;
    }

    const updated: StaffMember = {
      ...currentStaff,
      name: profileName.trim(),
      email: profileEmail.trim().toLowerCase(),
      phone: profilePhone.trim() || currentStaff.phone,
      avatar: profileAvatar.trim() ? profileAvatar.trim() : undefined,
    };

    onUpdateStaffMember(updated);
    setProfileSuccessMsg(isEn ? 'Profile information and photo updated successfully!' : 'আপনার পরিচিতি, ইউজার আইডি ও প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  // 2. Change Password for Current Staff
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    if (currentPasswordInput !== currentStaff.password) {
      setProfileErrorMsg('বর্তমান পাসওয়ার্ড মেলেনি! অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    if (newPasswordInput.length < 6) {
      setProfileErrorMsg('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setProfileErrorMsg('নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!');
      return;
    }

    const updated: StaffMember = {
      ...currentStaff,
      password: newPasswordInput.trim(),
      failedLoginAttempts: 0,
      lockedUntil: undefined,
    };

    onUpdateStaffMember(updated);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setProfileSuccessMsg('লগইন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  // 3. Change Security PIN for Current Staff
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');

    if (currentStaff.securityPin && currentPinInput !== currentStaff.securityPin) {
      setProfileErrorMsg('বর্তমান সিকিউরিটি পিন মেলেনি!');
      return;
    }

    if (newPinInput.length !== 6) {
      setProfileErrorMsg('নতুন সিকিউরিটি পিন অবশ্যই ৬ সংখ্যার হতে হবে (যেমন: 998877)।');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setProfileErrorMsg('নতুন সিকিউরিটি পিন ও নিশ্চিতকরণ পিন মেলেনি!');
      return;
    }

    const updated: StaffMember = {
      ...currentStaff,
      securityPin: newPinInput.trim(),
    };

    onUpdateStaffMember(updated);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setProfileSuccessMsg('২-ফ্যাক্টর সিকিউরিটি পিন সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  // 4. Super Admin open edit modal for another staff member
  const handleOpenEditStaffModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setEditStaffName(staff.name);
    setEditStaffEmail(staff.email);
    setEditStaffPhone(staff.phone || '');
    setEditStaffRole(staff.role);
    setEditStaffPassword(staff.password);
    setEditStaffPin(staff.securityPin || '');
    setEditStaffAvatar(staff.avatar || '');
    setEditStaffError('');
  };

  // 5. Super Admin save edit for another staff member
  const handleSaveStaffEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditStaffError('');

    if (!editingStaff) return;

    if (!editStaffName.trim() || !editStaffEmail.trim() || !editStaffPassword.trim()) {
      setEditStaffError('সকল আবশ্যক ঘর পূরণ করুন।');
      return;
    }

    if (editStaffPassword.length < 6) {
      setEditStaffError('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (editStaffPin && editStaffPin.length < 4) {
      setEditStaffError('সিকিউরিটি পিন ৪ থেকে ৬ সংখ্যার হতে হবে।');
      return;
    }

    const duplicate = staffMembers.find(
      (s) => s.id !== editingStaff.id && s.email.toLowerCase() === editStaffEmail.trim().toLowerCase()
    );
    if (duplicate) {
      setEditStaffError('এই ইমেইল/ইউজার আইডিটি অন্য একজন স্টাফের ব্যবহৃত হচ্ছে!');
      return;
    }

    const updated: StaffMember = {
      ...editingStaff,
      name: editStaffName.trim(),
      email: editStaffEmail.trim().toLowerCase(),
      phone: editStaffPhone.trim() || editingStaff.phone,
      role: editStaffRole,
      password: editStaffPassword.trim(),
      securityPin: editStaffPin.trim() || editingStaff.securityPin,
      avatar: editStaffAvatar.trim() ? editStaffAvatar.trim() : undefined,
      permissions: ROLE_DEFAULT_PERMISSIONS[editStaffRole],
      failedLoginAttempts: 0,
      lockedUntil: undefined,
    };

    onUpdateStaffMember(updated);
    setEditingStaff(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Top Header with Role & Session Info */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900 dark:bg-slate-950 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {currentStaff.avatar ? (
                <img
                  src={currentStaff.avatar}
                  alt={currentStaff.name}
                  className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500/50 shadow-md bg-slate-800"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-base shadow-xs">
                  {currentStaff.name.slice(0, 1)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" title="Active Staff" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {isEn ? 'PuranBazar Administration Center' : 'পুরানবাজার এডমিনিস্ট্রেশন সেন্টার'}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.badgeColor}`}>
                  {isEn ? roleInfo.title : roleInfo.nameBn}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>{isEn ? 'Official Officer:' : 'লগইন কর্মকর্তা:'}</span>
                <strong className="text-slate-200">{currentStaff.name}</strong>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-[11px] text-slate-300">{currentStaff.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isEn ? 'Change my profile, user ID, password & PIN' : 'আমার প্রোফাইল, ইউজার আইডি, পাসওয়ার্ড ও পিন পরিবর্তন করুন'}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'My Credentials' : 'আমার ক্রেডেনশিয়াল'}</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isEn ? 'Logout' : 'লগআউট করুন'}
            >
              <Power className="w-3.5 h-3.5 text-rose-400" />
              <span>{isEn ? 'Logout' : 'লগআউট'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{isEn ? 'Total Ads' : 'মোট বিজ্ঞাপন'}</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">{ads.length}</div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <div className="text-amber-800 dark:text-amber-300 text-[11px] font-medium">{isEn ? 'Pending Approval' : 'পেন্ডিং অনুমোদন'}</div>
            <div className="text-xl font-bold text-amber-900 dark:text-amber-300 tabular-nums mt-0.5">{pendingAds.length}</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
            <div className="text-emerald-800 dark:text-emerald-300 text-[11px] font-medium">{isEn ? 'Live Active Ads' : 'লাইভ বিজ্ঞাপন'}</div>
            <div className="text-xl font-bold text-emerald-900 dark:text-emerald-300 tabular-nums mt-0.5">{approvedAds.length}</div>
          </div>
          
          {/* Card: Live Active Viewers */}
          <div 
            onClick={() => (currentStaff.role === 'super_admin' || currentStaff.role === 'admin') && setActiveTab('analytics')}
            className={`p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 transition-all ${
              (currentStaff.role === 'super_admin' || currentStaff.role === 'admin') ? 'cursor-pointer hover:border-emerald-500 hover:scale-[1.02]' : ''
            }`}
            title={isEn ? 'View live users and engagement' : 'লাইভ ভিউয়ার্স ও ইউজার এনগেজমেন্ট দেখুন'}
          >
            <div className="text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-between">
              <span>{isEn ? 'Live Viewers' : 'লাইভ ভিউয়ার'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 tabular-nums mt-0.5">
              {isEn ? '34 online' : '৩৪ জন'}
            </div>
          </div>

          {/* Card: Total Registered Users */}
          <div 
            onClick={() => (currentStaff.role === 'super_admin' || currentStaff.role === 'admin') && setActiveTab('analytics')}
            className={`p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-300 transition-all ${
              (currentStaff.role === 'super_admin' || currentStaff.role === 'admin') ? 'cursor-pointer hover:border-blue-500 hover:scale-[1.02]' : ''
            }`}
            title={isEn ? 'View users analytics and retention' : 'ব্যবহারকারীদের দিনে/সপ্তাহে/মাসে সময় ব্যয় দেখুন'}
          >
            <div className="text-blue-800 dark:text-blue-300 text-[11px] font-medium">{isEn ? 'Registered Users' : 'নিবন্ধিত ইউজার'}</div>
            <div className="text-xl font-bold text-blue-900 dark:text-blue-200 tabular-nums mt-0.5">
              {isEn ? `${1450 + registeredUsers.length} users` : `${(1450 + registeredUsers.length).toLocaleString('bn-BD')} জন`}
            </div>
          </div>

          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
            <div className="text-rose-800 dark:text-rose-300 text-[11px] font-medium">{isEn ? 'Reports & Disputes' : 'অভিযোগ (Reports)'}</div>
            <div className="text-xl font-bold text-rose-900 dark:text-rose-300 tabular-nums mt-0.5">{pendingReports.length}</div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/50">
            <div className="text-purple-800 dark:text-purple-300 text-[11px] font-medium">{isEn ? 'Total Revenue' : 'মোট রাজস্ব'}</div>
            <div className="text-xl font-bold text-purple-900 dark:text-purple-300 tabular-nums mt-0.5">
              {permissions.canViewRevenue ? `৳${totalRevenue}` : (isEn ? 'Restricted' : 'গোপন')}
            </div>
          </div>
        </div>

        {/* Tab Navigation (Role-Adaptive) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold">
          
          {/* Tab 1: Pending */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pending'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{isEn ? `Pending Approval (${pendingAds.length})` : `পেন্ডিং অনুমোদন (${pendingAds.length})`}</span>
          </button>

          {/* Tab 2: All ads */}
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{isEn ? `All Ads (${approvedAds.length})` : `সকল বিজ্ঞাপন (${approvedAds.length})`}</span>
          </button>

          {/* Tab 3: Reports */}
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'border-rose-600 text-rose-700 dark:text-rose-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>{isEn ? `Reports & Disputes (${pendingReports.length})` : `অভিযোগ ও রিপোর্ট (${pendingReports.length})`}</span>
          </button>

          {/* Tab: User Accounts & Moderation (Super Admin, Admin, Content Moderator, Safety & Support) */}
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'border-rose-600 text-rose-700 dark:text-rose-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserX className="w-3.5 h-3.5 text-rose-500" />
            <span>{isEn ? `User Accounts & Moderation (${registeredUsers.length})` : `ইউজার একাউন্ট পরিচালনা ও ব্যান/স্থগিত (${registeredUsers.length})`}</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full text-[9px] font-bold">
              {isEn ? 'All 4 Roles' : '৪টি পদবী'}
            </span>
          </button>

          {/* Tab 4: Payments (Revenue) */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{isEn ? 'Payment History' : 'পেমেন্ট হিস্ট্রি'}</span>
          </button>

          {/* Tab: Revenue & Bangladeshi Bank / MFS Payouts (Super Admin Exclusive) */}
          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'payouts'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isEn ? 'AdSense & Bank Payouts' : 'এডসেন্স ও ব্যাংক উত্তোলন'}</span>
            <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold">
              {isEn ? 'Super Admin' : 'সুপার এডমিন'}
            </span>
          </button>

          {/* Tab 5: Team & Staff Management (Super Admin & Admin) */}
          <button
            onClick={() => setActiveTab('staff')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'staff'
                ? 'border-purple-600 text-purple-700 dark:text-purple-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>{isEn ? `Staff & Team (${staffMembers.length})` : `এডমিন ও মডারেটর টিম (${staffMembers.length})`}</span>
          </button>

          {/* Tab 6: Security Audit Logs */}
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>{isEn ? `Security Audit Logs (${auditLogs.length})` : `সিকিউরিটি অডিট লগ (${auditLogs.length})`}</span>
          </button>

          {/* Tab 7: Anti-Hacking & Security Policies */}
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-rose-600 text-rose-700 dark:text-rose-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-600" />
            <span>{isEn ? 'Anti-Hacking Control' : 'অ্যান্টি-হ্যাকিং কন্ট্রোল'}</span>
          </button>

          {/* Tab 8: Super Admin Source Code & Deployment (Restricted to Super Admin) */}
          {currentStaff.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('deploy')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'deploy'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? 'Domain & Source Code Download' : 'ডোমেন ও সোর্স কোড ডাউনলোড'}</span>
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[9px] font-extrabold">
                {isEn ? 'Owner Vault' : 'মালিকানা ভল্ট'}
              </span>
            </button>
          )}

          {/* Tab 8.1: Super Admin Data & File Backup Vault */}
          {currentStaff.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('backup')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'backup'
                  ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isEn ? 'Data & File Backup' : 'ডাটা ও ফাইল ব্যাকআপ'}</span>
              <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[9px] font-extrabold">
                {isEn ? 'Live Vault' : 'লাইভ ভল্ট'}
              </span>
            </button>
          )}

          {/* Tab 9: Staff Profile & Credentials Management (Available for all staff) */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>{isEn ? 'My Profile & Credentials' : 'আমার ক্রেডেনশিয়াল ও প্রোফাইল'}</span>
          </button>

          {/* Tab 10: Real-Time Live Viewers & User Analytics (Super Admin & Admin Exclusive) */}
          {(currentStaff.role === 'super_admin' || currentStaff.role === 'admin') && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'analytics'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isEn ? 'Live Viewers & Analytics' : 'লাইভ ভিউয়ার ও অ্যানালিটিক্স'}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          
          {/* TAB 1: PENDING ADS */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{isEn ? 'Review and approve or reject newly submitted ads:' : 'নতুন বিজ্ঞাপনসমূহ পর্যালোচনা করে অনুমোদন (Approve) বা বাতিল (Reject) করুন:'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {formatNumber(pendingAds.length, language)} {isEn ? 'pending' : 'টি অপেক্ষমাণ'}
                </span>
              </div>

              {!permissions.canApproveAds && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 text-amber-800 dark:text-amber-300 text-xs">
                  {isEn ? 'Your role does not have permission to approve ads.' : 'আপনার রোলের জন্য বিজ্ঞাপন অনুমোদন করার অনুমতি নেই।'}
                </div>
              )}

              {pendingAds.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                  <div className="font-bold text-slate-800 dark:text-white text-sm">
                    {isEn ? 'No Pending Ads' : 'কোনো পেন্ডিং বিজ্ঞাপন নেই'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isEn ? 'All new ad submissions have been approved.' : 'সব নতুন বিজ্ঞাপন ইতিমধ্যে অনুমোদিত হয়েছে।'}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                    >
                      <div className="flex gap-3">
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-700 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{ad.subcategory}</span>
                            <span aria-hidden="true">·</span>
                            <span>{ad.district} ({ad.upazila})</span>
                            <span aria-hidden="true">·</span>
                            <span>{ad.created_at}</span>
                          </div>

                          <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{ad.title}</h4>
                          
                          <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                            {ad.description}
                          </div>

                          <div className="flex items-center gap-3 text-xs mt-1.5">
                            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                              {formatPrice(ad.price, language)}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap text-slate-500 dark:text-slate-400">
                              <span>{isEn ? 'Seller:' : 'বিক্রেতা:'} {ad.seller_name} ({ad.seller_phone})</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const targetUser = registeredUsers.find(
                                    (u) => normalizePhone(u.phone) === normalizePhone(ad.seller_phone) || u.name === ad.seller_name
                                  ) || {
                                    id: `usr-${ad.seller_phone}`,
                                    name: ad.seller_name,
                                    email: ad.seller_email || '',
                                    phone: ad.seller_phone,
                                    password: '',
                                    division: ad.division,
                                    district: ad.district,
                                    joinedAt: ad.seller_joined,
                                    isVerified: ad.seller_verified,
                                    status: 'active',
                                  };
                                  handleOpenSuspendModal(targetUser);
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1 cursor-pointer transition-colors"
                                title={isEn ? 'Suspend or ban this seller account' : 'এই বিক্রেতার একাউন্ট সাময়িক স্থগিত বা ব্যান করুন'}
                              >
                                <UserX className="w-3 h-3 text-rose-500" />
                                <span>{isEn ? 'Suspend/Ban' : 'ইউজার স্থগিত/ব্যান'}</span>
                              </button>
                            </div>
                            {ad.featured_tier !== 'none' && (
                              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded font-semibold text-[10px]">
                                {ad.featured_tier} {isEn ? 'package request' : 'প্যাকেজ রিকোয়েস্ট'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {permissions.canApproveAds && (
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                          <button
                            onClick={() => onApproveAd(ad.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Approve' : 'অনুমোদন দিন (Approve)'}</span>
                          </button>

                          <button
                            onClick={() => onRejectAd(ad.id)}
                            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Reject' : 'বাতিল (Reject)'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL APPROVED ADS */}
          {activeTab === 'all' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? 'List of all live active ads on the marketplace:' : 'সাইটে সক্রিয় সকল বিজ্ঞাপনের তালিকা:'}
              </div>

              <div className="space-y-2">
                {approvedAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={ad.images[0]} alt={ad.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{ad.title}</div>
                        <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {formatPrice(ad.price, language)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{ad.district}</span>
                          <span aria-hidden="true">·</span>
                          <span>{formatNumber(ad.views, language)} {isEn ? 'views' : 'ভিউ'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {permissions.canFeatureAds && (
                        <button
                          onClick={() => onToggleFeatureAd(ad.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                            ad.featured_tier !== 'none'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{ad.featured_tier !== 'none' ? (isEn ? 'Featured Off' : 'Featured Off') : (isEn ? 'Make Featured' : 'Make Featured')}</span>
                        </button>
                      )}

                      {permissions.canDeleteAds && (
                        <button
                          onClick={() =>
                            requestPinProtectedAction(
                              isEn ? 'Permanently Delete Ad' : 'বিজ্ঞাপন স্থায়ীভাবে মুছে ফেলা',
                              isEn ? `Are you sure you want to permanently delete "${ad.title}"?` : `আপনি কি নিশ্চিত যে "${ad.title}" বিজ্ঞাপনটি স্থায়ীভাবে মুছে ফেলতে চান?`,
                              () => onDeleteAd(ad.id)
                            )
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={isEn ? 'Delete (PIN Protected)' : 'মুছে ফেলুন (PIN Protected)'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REPORTS & ABUSE */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEn ? 'Review fraud and fake ad dispute reports submitted by users:' : 'ব্যবহারকারীদের পাঠানো প্রতারণা ও ভুয়া বিজ্ঞাপনের অভিযোগ পর্যালোচনা করুন:'}
              </div>

              {reports.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                  {isEn ? 'No dispute reports submitted yet.' : 'এখনো কোনো অভিযোগ জমা পড়েনি।'}
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{isEn ? `Reason: ${report.reason}` : `অভিযোগের ধরণ: ${report.reason}`}</span>
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">{report.created_at}</span>
                      </div>

                      <div><strong>{isEn ? 'Ad:' : 'বিজ্ঞাপন:'}</strong> {report.ad_title} (ID: {report.ad_id})</div>
                      <div><strong>{isEn ? 'Reporter:' : 'অভিযোগকারী:'}</strong> {report.reporter_name} ({report.reporter_phone})</div>
                      <div className="p-2.5 bg-rose-50/50 dark:bg-rose-950/30 rounded-lg border border-rose-100 dark:border-rose-900/40 text-rose-950 dark:text-rose-200">
                        <strong>{isEn ? 'Details:' : 'বিবরণ:'}</strong> {report.details}
                      </div>

                      {report.status === 'pending' ? (
                        permissions.canResolveReports && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => onResolveReport(report.id, 'ban_ad')}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer"
                            >
                              {isEn ? 'Ban & Reject Ad' : 'বিজ্ঞাপনটি বাতিল ও ব্যান করুন'}
                            </button>
                            <button
                              onClick={() => onResolveReport(report.id, 'dismiss')}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg cursor-pointer"
                            >
                              {isEn ? 'Dismiss Report' : 'অভিযোগ খারিজ করুন'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const matchedAd = ads.find((a) => a.id === report.ad_id);
                                const sPhone = matchedAd?.seller_phone || '';
                                const sName = matchedAd?.seller_name || '';
                                const targetUser = registeredUsers.find(
                                  (u) => (sPhone && normalizePhone(u.phone) === normalizePhone(sPhone)) || (sName && u.name === sName)
                                ) || {
                                  id: `usr-${sPhone || Date.now()}`,
                                  name: sName || report.ad_title,
                                  email: '',
                                  phone: sPhone,
                                  password: '',
                                  division: matchedAd?.division || '',
                                  district: matchedAd?.district || '',
                                  joinedAt: matchedAd?.seller_joined || '',
                                  isVerified: false,
                                  status: 'active',
                                };
                                handleOpenSuspendModal(targetUser);
                              }}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold rounded-lg border border-rose-300 dark:border-rose-900 flex items-center gap-1 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Suspend/Ban Seller' : 'অভিযুক্তের একাউন্ট স্থগিত/ব্যান'}</span>
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                          {isEn ? `✓ Resolved (${report.status})` : `✓ নিষ্পত্তি সম্পন্ন (${report.status})`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PAYMENTS & REVENUE */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              {!permissions.canViewRevenue ? (
                <div className="p-6 text-center bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <div className="font-bold text-sm">{isEn ? 'Access Denied' : 'অনুমোদন নেই (Access Denied)'}</div>
                  <div className="mt-1">
                    {isEn ? 'Financial revenue and payment data is restricted to authorized administrative roles.' : 'কন্টেন্ট বা সাপোর্ট মডারেটরদের জন্য পেমেন্ট ও আর্থিক রাজস্ব ডেটা সুরক্ষিত রাখা হয়েছে।'}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {isEn ? 'Payment transaction history for featured listings and ad promotions:' : 'ফিচার্ড লিস্টিং ও প্রিমিয়াম প্রমোশনের পেমেন্ট ট্রানজেকশন তালিকা:'}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    {payments.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                        {isEn ? 'No payments found' : 'কোনো পেমেন্ট নেই'}
                      </div>
                    ) : (
                      payments.map((p) => (
                        <div key={p.id} className="p-3 bg-white dark:bg-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{p.package_name}</div>
                            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                              {isEn ? 'Ad:' : 'বিজ্ঞাপন:'} {p.ad_title}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                              {isEn ? 'Method:' : 'মেথড:'} {p.method} | TrxID: {p.trx_id}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                              {formatPrice(p.amount, language)}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">{p.created_at}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: USER ACCOUNTS & MODERATION (SUPER ADMIN, ADMIN, CONTENT MODERATOR, SAFETY & SUPPORT) */}
          {activeTab === 'users' && (
            <div className="space-y-5 text-xs animate-in fade-in">
              {/* Header & Transparency Notice */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-indigo-950/70 text-white border border-rose-500/30 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
                      <UserX className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base text-white">
                          {isEn ? 'User Accounts & Moderation Control Center' : 'ব্যবহারকারী একাউন্ট পরিচালনা ও ব্যান/স্থগিতকরণ নিয়ন্ত্রণ কেন্দ্র'}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {isEn ? 'Multi-Role Authorized' : 'সকল ৪টি পদের কর্মকর্তাদের ক্ষমতা'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {isEn
                          ? 'Super Admin, Admin, Content Moderator, and Safety & Support can all temporarily suspend or permanently ban accounts.'
                          : 'সুপার এডমিন, সাধারণ এডমিন, কন্টেন্ট মডারেটর এবং সেফটি অ্যান্ড সাপোর্ট অফিসার — প্রত্যেকেই ক্ষতিকর বা প্রতারক ইউজার একাউন্ট সাময়িক স্থগিত বা স্থায়ী ব্যান করতে পারেন।'}
                      </p>
                    </div>
                  </div>

                  {/* Current Acting Officer Badge */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-left sm:text-right text-xs shrink-0">
                    <div className="text-[10px] text-slate-400">{isEn ? 'Logged-in Moderating Officer:' : 'আপনার দায়িত্বপ্রাপ্ত পদবী:'}</div>
                    <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.badgeColor}`}>
                        {isEn ? roleInfo.title : roleInfo.nameBn}
                      </span>
                      <strong className="text-slate-100">{currentStaff.name}</strong>
                    </div>
                  </div>
                </div>

                {/* Super Admin Oversight Highlight Banner */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed text-[11px]">
                    <strong className="text-white">
                      {isEn ? 'Super Admin Oversight & Transparency Guarantee:' : 'সুপার এডমিন নজরদারি ও পদবী স্বচ্ছতা নিশ্চয়তা:'}
                    </strong>{' '}
                    {isEn
                      ? 'Every suspension and ban explicitly logs and permanently displays the designated role (Super Admin, Admin, Content Moderator, or Safety & Support) along with the officer name, reason, and duration.'
                      : 'যেকোনো কর্মকর্তা একাউন্ট স্থগিত বা ব্যান করলে সুপার এডমিনের প্যানেল ও অডিট লগে সরাসরি উল্লেখ থাকে কোন পদধারী ব্যক্তি (সুপার এডমিন, সাধারণ এডমিন, কন্টেন্ট মডারেটর, নাকি সেফটি অ্যান্ড সাপোর্ট) এবং কোন কর্মকর্তা স্থগিত বা ব্যান করলো।'}
                  </div>
                </div>
              </div>

              {/* User Moderation Feedback Notice */}
              {userModerationFeedback && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{userModerationFeedback}</span>
                </div>
              )}

              {/* Quick Counts Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">{isEn ? 'Total Registered Users' : 'মোট নিবন্ধিত ব্যবহারকারী'}</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">{registeredUsers.length}</div>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                  <div className="text-emerald-800 dark:text-emerald-300 text-[11px] font-medium">{isEn ? 'Active Accounts' : 'সক্রিয় একাউন্ট'}</div>
                  <div className="text-xl font-bold text-emerald-900 dark:text-emerald-300 tabular-nums mt-0.5">
                    {registeredUsers.filter((u) => u.status === 'active' || !u.status).length}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <div className="text-amber-800 dark:text-amber-300 text-[11px] font-medium">{isEn ? 'Temporarily Suspended' : 'সাময়িক স্থগিত'}</div>
                  <div className="text-xl font-bold text-amber-900 dark:text-amber-300 tabular-nums mt-0.5">
                    {registeredUsers.filter((u) => u.status === 'suspended').length}
                  </div>
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
                  <div className="text-rose-800 dark:text-rose-300 text-[11px] font-medium">{isEn ? 'Permanently Banned' : 'স্থায়ী ব্যান'}</div>
                  <div className="text-xl font-bold text-rose-900 dark:text-rose-300 tabular-nums mt-0.5">
                    {registeredUsers.filter((u) => u.status === 'banned').length}
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      placeholder={isEn ? 'Search user name, phone, email, district...' : 'ব্যবহারকারীর নাম, ফোন নম্বর, ইমেইল বা জেলা দিয়ে খুঁজুন...'}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={userFilterStatus}
                      onChange={(e) => setUserFilterStatus(e.target.value as any)}
                      className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="all">{isEn ? 'All Statuses (Show All Users)' : 'সকল স্ট্যাটাস (সকল ব্যবহারকারী)'}</option>
                      <option value="active">{isEn ? '● Active Accounts Only' : '● শুধুমাত্র সক্রিয় একাউন্ট'}</option>
                      <option value="suspended_or_banned">{isEn ? '⚠️ Suspended & Banned Only' : '⚠️ শুধুমাত্র স্থগিত বা ব্যানকৃত একাউন্ট'}</option>
                    </select>
                  </div>

                  {/* Suspension Role Filter (Super Admin Transparency Filter) */}
                  <div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value as any)}
                      className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      <option value="all">{isEn ? 'Filter by Action Role: All Authorities' : 'পদবী ফিল্টার: সকল কর্মকর্তার স্থগিতকরণ'}</option>
                      <option value="super_admin">{isEn ? '👑 Suspended by Super Admin' : '👑 সুপার এডমিন কর্তৃক স্থগিত/ব্যান'}</option>
                      <option value="admin">{isEn ? '🟣 Suspended by Admin' : '🟣 সাধারণ এডমিন কর্তৃক স্থগিত/ব্যান'}</option>
                      <option value="content_moderator">{isEn ? '🟢 Suspended by Content Moderator' : '🟢 কন্টেন্ট মডারেটর কর্তৃক স্থগিত/ব্যান'}</option>
                      <option value="support_moderator">{isEn ? '🟠 Suspended by Safety & Support Officer' : '🟠 নিরাপত্তা ও সাপোর্ট অফিসার কর্তৃক স্থগিত/ব্যান'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Cards List */}
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                    {isEn ? 'No users found matching your search or filters.' : 'আপনার ফিল্টারের সাথে মিলে এমন কোনো ব্যবহারকারী পাওয়া যায়নি।'}
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const isSuspended = user.status === 'suspended';
                    const isBanned = user.status === 'banned';
                    const isRestricted = isSuspended || isBanned;

                    return (
                      <div
                        key={user.id}
                        className={`p-4 bg-white dark:bg-slate-800 rounded-2xl border transition-all space-y-3 shadow-xs ${
                          isBanned
                            ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/20 dark:bg-rose-950/20'
                            : isSuspended
                            ? 'border-amber-300 dark:border-amber-900/80 bg-amber-50/20 dark:bg-amber-950/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* User Info with Avatar */}
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-emerald-400 border border-slate-700 flex flex-col items-center justify-center font-bold text-base shadow-xs select-none">
                                  <span>{user.name.slice(0, 1)}</span>
                                  <span className="text-[8px] font-normal text-slate-400">{isEn ? 'No Pic' : 'ছবি ছাড়া'}</span>
                                </div>
                              )}
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 ${
                                  isBanned ? 'bg-rose-600' : isSuspended ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                title={isBanned ? 'Banned' : isSuspended ? 'Suspended' : 'Active'}
                              />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</span>
                                {user.isVerified && (
                                  <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] rounded-md font-bold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                    <span>{isEn ? 'Verified' : 'যাচাইকৃত'}</span>
                                  </span>
                                )}
                                {/* Status Badge */}
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isBanned
                                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                      : isSuspended
                                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  }`}
                                >
                                  {isBanned
                                    ? (isEn ? '🚫 Permanently Banned' : '🚫 স্থায়ী ব্যান (Banned)')
                                    : isSuspended
                                    ? (isEn ? '⏳ Temporarily Suspended' : '⏳ সাময়িক স্থগিত (Suspended)')
                                    : (isEn ? '● Active Account' : '● সক্রিয় একাউন্ট (Active)')}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                <span>📞 {user.phone}</span>
                                <span>✉️ {user.email}</span>
                                <span>📍 {user.district} {user.upazila ? `(${user.upazila})` : ''}</span>
                              </div>
                            </div>
                          </div>

                          {/* Moderation Action Buttons (Super Admin, Admin, Content Moderator, Safety & Support) */}
                          <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
                            {isRestricted ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleExecuteReactivate(user)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                  title={isEn ? 'Reactivate and remove suspension' : 'স্থগিতাদেশ প্রত্যাহার করে একাউন্ট সক্রিয় করুন'}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>{isEn ? 'Reactivate Account' : 'পুনরায় চালু করুন'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenSuspendModal(user)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5 text-blue-500" />
                                  <span>{isEn ? 'Edit Suspension' : 'স্থগিতাদেশ পরিবর্তন'}</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleOpenSuspendModal(user);
                                    setSuspendType('suspended');
                                  }}
                                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title={isEn ? 'Temporarily suspend this account' : 'সাময়িক সময়ের জন্য স্থগিত করুন'}
                                >
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{isEn ? 'Suspend' : 'সাময়িক স্থগিত'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleOpenSuspendModal(user);
                                    setSuspendType('banned');
                                  }}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                  title={isEn ? 'Permanently ban this account' : 'স্থায়ীভাবে একাউন্ট ব্যান করুন'}
                                >
                                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                                  <span>{isEn ? 'Permanent Ban' : 'স্থায়ী ব্যান'}</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* CRITICAL SUPER ADMIN OVERSIGHT CARD: EXACT DESIGNATION AND OFFICER WHO SUSPENDED/BANNED */}
                        {isRestricted && (
                          <div className="p-3 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 rounded-xl space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {isEn ? 'Suspended/Banned By Role:' : 'কোন পদধারী ব্যক্তি স্থগিত করলো:'}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shadow-xs ${
                                  user.suspendedBy?.staffRole
                                    ? ROLE_DETAILS[user.suspendedBy.staffRole]?.badgeColor
                                    : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {user.suspendedBy?.staffRoleNameBn ||
                                  (user.suspendedBy?.staffRole
                                    ? (isEn ? ROLE_DETAILS[user.suspendedBy.staffRole]?.title : ROLE_DETAILS[user.suspendedBy.staffRole]?.nameBn)
                                    : (isEn ? 'System Administrator' : 'সিস্টেম এডমিনিস্ট্রেটর'))}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">
                                {isEn ? 'Officer Name:' : 'কর্মকর্তার নাম:'}{' '}
                                <strong className="text-slate-900 dark:text-white underline decoration-emerald-500">
                                  {user.suspendedBy?.staffName || (isEn ? 'Official Moderator' : 'দায়িত্বপ্রাপ্ত কর্মকর্তা')}
                                </strong>
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
                              <div>
                                <span className="text-slate-500 dark:text-slate-400">{isEn ? 'Suspension Duration:' : 'স্থগিতের মেয়াদ:'} </span>
                                <strong className="text-amber-800 dark:text-amber-300 font-bold">{user.suspendedUntil || (isEn ? 'Indefinite' : 'অনির্দিষ্ট')}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-slate-400">{isEn ? 'Date & Time:' : 'তারিখ ও সময়:'} </span>
                                <strong className="text-slate-800 dark:text-slate-200 font-mono">{user.suspendedAt || (isEn ? 'Recorded' : 'রেকর্ডকৃত')}</strong>
                              </div>
                            </div>

                            <div className="text-[11px] text-rose-800 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 dark:border-rose-900/60 leading-relaxed">
                              <strong className="text-rose-900 dark:text-rose-300">{isEn ? 'Official Reason:' : 'স্থগিত বা ব্যানের কারণ:'} </strong>
                              {user.suspendedReason || (isEn ? 'Fraudulent activity or terms of service violation' : 'মার্কেটপ্লেস নীতিমালা ও বিশ্বাসযোগ্যতা লঙ্ঘন')}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: REVENUE & BANGLADESHI BANK / MFS PAYOUTS (SUPER ADMIN ONLY) */}
          {activeTab === 'payouts' && (
            <RevenuePayoutSection
              currentStaff={currentStaff}
              revenueItems={revenueItems}
              adSenseStats={adSenseStats}
              payoutAccounts={payoutAccounts}
              withdrawals={withdrawals}
              securitySettings={securitySettings}
              adSenseConfig={adSenseConfig}
              onUpdateAdSenseConfig={onUpdateAdSenseConfig}
              payoutPolicy={payoutPolicy}
              onUpdatePayoutPolicy={onUpdatePayoutPolicy}
              onAddPayoutAccount={onAddPayoutAccount}
              onDeletePayoutAccount={onDeletePayoutAccount}
              onSetDefaultAccount={onSetDefaultAccount}
              onRequestWithdrawal={onRequestWithdrawal}
              onCompleteWithdrawal={onCompleteWithdrawal}
              language={language}
            />
          )}

          {/* TAB 5: STAFF & RBAC MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {isEn ? 'Platform Admin & Moderator Directory (RBAC)' : 'প্ল্যাটফর্ম এডমিন ও মডারেটর তালিকা (RBAC)'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {isEn ? 'Privileges and access rights specifically allocated according to official roles' : 'প্রতিটি অফিসিয়াল রোল অনুযায়ী প্রিভিলেজ ও পারমিশন সুনির্দিষ্টভাবে বন্টনকৃত'}
                  </p>
                </div>

                {permissions.canManageStaff && (
                  <button
                    onClick={() => setIsAddingStaff(!isAddingStaff)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isAddingStaff ? (isEn ? 'Close Form' : 'ফর্ম বন্ধ করুন') : (isEn ? '+ Add New Admin/Moderator' : '+ নতুন এডমিন/মডারেটর যোগ করুন')}</span>
                  </button>
                )}
              </div>

              {/* Add Staff Form (Super Admin only) */}
              {isAddingStaff && permissions.canManageStaff && (
                <form
                  onSubmit={handleCreateStaff}
                  className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in"
                >
                  <div className="font-bold text-slate-900 dark:text-white text-sm border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isEn ? 'Create New Staff Member' : 'নতুন স্টাফ মেম্বার তৈরি করুন'}</span>
                  </div>

                  {addStaffError && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl flex items-center gap-2 text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{addStaffError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Full Name *' : 'পূর্ণ নাম *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder={isEn ? 'e.g. Shahidul Islam' : 'যেমন: নাজমুল হাসান'}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Official Email *' : 'অফিসিয়াল ইমেইল *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        placeholder="staff@puranbazar.com"
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Mobile Number' : 'মোবাইল নম্বর'}
                      </label>
                      <input
                        type="tel"
                        value={newStaffPhone}
                        onChange={(e) => setNewStaffPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Role *' : 'পদবী বা রোল (Role) *'}
                      </label>
                      <select
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <option value="content_moderator">Content Moderator (কন্টেন্ট মডারেটর)</option>
                        <option value="support_moderator">Support / Safety Officer (নিরাপত্তা ও সাপোর্ট মডারেটর)</option>
                        <option value="admin">Admin (সাধারণ এডমিন)</option>
                        <option value="super_admin">Super Admin (সুপার এডমিন)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Login Password *' : 'লগইন পাসওয়ার্ড *'}
                      </label>
                      <input
                        type="password"
                        required
                        value={newStaffPassword}
                        onChange={(e) => setNewStaffPassword(e.target.value)}
                        placeholder={isEn ? 'At least 6 characters' : 'ন্যূনতম ৬ অক্ষর'}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Security PIN (PIN) *' : 'সিকিউরিটি পিন (PIN) *'}
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        required
                        value={newStaffPin}
                        onChange={(e) => setNewStaffPin(e.target.value)}
                        placeholder={isEn ? '6-digit PIN (e.g. 445566)' : '৬ সংখ্যার পিন (যেমন: 445566)'}
                        className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Staff Profile Photo (Optional) */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                        {isEn ? 'Official Profile Photo (Optional)' : 'অফিসিয়াল প্রোফাইল ছবি (ঐচ্ছিক)'}
                      </label>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {newStaffAvatar ? (isEn ? '✓ Photo Attached' : '✓ ছবি নির্বাচিত') : (isEn ? 'Optional (No photo)' : 'ঐচ্ছিক (ছবি ছাড়াও যোগ করা যাবে)')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {newStaffAvatar ? (
                        <img src={newStaffAvatar} alt="Staff preview" className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-xs" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>{newStaffAvatar ? (isEn ? 'Change Photo' : 'ছবি পরিবর্তন') : (isEn ? 'Upload Photo' : 'ছবি আপলোড করুন')}</span>
                            <input type="file" accept="image/*" onChange={handleNewStaffAvatarFileChange} className="hidden" />
                          </label>
                          {newStaffAvatar && (
                            <button
                              type="button"
                              onClick={() => setNewStaffAvatar('')}
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              {isEn ? 'Remove' : 'ছবি বাদ দিন'}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400">{isEn ? 'Quick presets:' : 'প্রিসেট ছবি:'}</span>
                          {STAFF_PRESET_AVATARS.slice(0, 5).map((url, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setNewStaffAvatar(url)}
                              className={`w-5 h-5 rounded-full overflow-hidden border ${newStaffAvatar === url ? 'border-emerald-500 scale-110 shadow-xs' : 'border-slate-300 dark:border-slate-700'}`}
                            >
                              <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingStaff(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      {isEn ? 'Cancel' : 'বাতিল'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                    >
                      {isEn ? 'Add Staff Member' : 'যুক্ত করুন'}
                    </button>
                  </div>
                </form>
              )}

              {/* Staff Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {staffMembers.map((staff) => {
                  const r = ROLE_DETAILS[staff.role];
                  const isCurrent = staff.id === currentStaff.id;

                  return (
                    <div
                      key={staff.id}
                      className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {staff.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-500/50 shadow-xs bg-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                              {staff.name.slice(0, 1)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{staff.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] rounded font-bold">
                                  {isEn ? 'You' : 'আপনি'}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-[11px]">{staff.email}</div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${r.badgeColor}`}>
                          {isEn ? r.title : r.nameBn}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {r.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700 gap-2">
                        <div>
                          <span>{isEn ? 'Status: ' : 'অবস্থা: '}</span>
                          <span className={staff.status === 'active' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-600 font-bold'}>
                            {staff.status === 'active' ? (isEn ? '● Active' : '● সক্রিয় (Active)') : (isEn ? '● Suspended' : '● স্থগিত (Suspended)')}
                          </span>
                        </div>

                        {staff.lastLogin && (
                          <div>{isEn ? 'Last login:' : 'শেষ লগইন:'} {staff.lastLogin}</div>
                        )}
                      </div>

                      {/* Super Admin Control Buttons */}
                      {permissions.canManageStaff && (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                          <button
                            type="button"
                            onClick={() => handleOpenEditStaffModal(staff)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                            title={isEn ? 'Edit credentials, password and PIN' : 'ক্রেডেনশিয়াল, পাসওয়ার্ড ও পিন এডিট করুন'}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                            <span>{isEn ? 'Edit Credentials' : 'ক্রেডেনশিয়াল এডিট'}</span>
                          </button>

                          {!isCurrent && (
                            <button
                              onClick={() =>
                                requestPinProtectedAction(
                                  isEn ? 'Change Staff Status' : 'স্টাফ একাউন্ট স্থিতি পরিবর্তন',
                                  isEn ? `Are you sure you want to ${staff.status === 'active' ? 'suspend' : 'reactivate'} account for ${staff.name}?` : `আপনি কি নিশ্চিত যে ${staff.name}-এর একাউন্ট ${staff.status === 'active' ? 'স্থগিত (Suspend)' : 'পুনরায় সক্রিয় (Activate)'} করতে চান?`,
                                  () => onToggleStaffStatus(staff.id)
                                )
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                                staff.status === 'active'
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                              }`}
                            >
                              {staff.status === 'active' ? (isEn ? 'Suspend' : 'সাসপেন্ড করুন') : (isEn ? 'Activate' : 'সক্রিয় করুন')}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {isEn ? 'Security Audit Logs (Audit Trail)' : 'নিরাপত্তা ও অ্যাক্টিভিটি অডিট লগ (Audit Trail)'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {isEn ? 'Permanent audit log of every administrative action, approval, and security event' : 'প্রতিটি প্রশাসনিক পদক্ষেপ, অনুমোদন ও সন্দেহজনক অনুপ্রবেশের স্থায়ী রেকর্ড'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {isEn ? '✓ Tamper-proof tracking active' : '✓ টেম্পার-প্রুফ ট্র্যাকিং সক্রিয়'}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-white dark:bg-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'success'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : log.status === 'blocked'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}>
                          {log.action}
                        </span>
                        {/* Officer Designation / Role Badge for Transparency */}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          ROLE_DETAILS[log.actorRole]?.badgeColor || 'bg-slate-100 text-slate-800'
                        }`}>
                          {isEn ? ROLE_DETAILS[log.actorRole]?.title : ROLE_DETAILS[log.actorRole]?.nameBn}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{log.actorName}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{log.ipAddress}</span>
                      </div>

                      <div className="text-slate-600 dark:text-slate-300 text-xs">
                        <strong>{isEn ? 'Target:' : 'টার্গেট:'}</strong> {log.target} — {log.details}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 whitespace-nowrap self-end sm:self-center font-mono">
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: ANTI-HACKING & SYSTEM SECURITY POLICIES */}
          {activeTab === 'security' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isEn ? 'Anti-Hacking & Cybersecurity Central Control' : 'অ্যান্টি-হ্যাকিং ও সার্বিক সাইবার নিরাপত্তা কন্ট্রোল'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  {isEn ? 'Automated brute-force defense, session hijacking prevention, and database integrity enforcement' : 'ব্রুট-ফোর্স রোধ, সেশন হাইজ্যাকিং প্রতিরোধ ও ডাটাবেজ ইন্টিগ্রিটি এনফোর্সমেন্ট'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Policy 1: Brute-Force Guard */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Brute-Force & Credential Guard' : 'ব্রুট-ফোর্স ও ক্রেডেনশিয়াল গার্ড'}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-bold text-[10px]">
                      {isEn ? 'Active' : 'সক্রিয় (Active)'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {isEn
                      ? `After ${securitySettings.maxFailedAttempts} consecutive failed password attempts, the account is automatically locked for ${securitySettings.lockoutDurationMinutes} minutes.`
                      : `টানা ${securitySettings.maxFailedAttempts} বার ভুল পাসওয়ার্ড দিলে সিস্টেম স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট একাউন্ট ${securitySettings.lockoutDurationMinutes} মিনিটের জন্য লক করে দেয়।`}
                  </p>
                </div>

                {/* Policy 2: Session Inactivity Timeout */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {isEn ? 'Automatic Session Timeout' : 'অটো সেশন টাইমআউট'}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-bold text-[10px]">
                      {securitySettings.sessionTimeoutMinutes} {isEn ? 'minutes' : 'মিনিট'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {isEn
                      ? 'Admin sessions automatically terminate upon inactivity to prevent unauthorized device access.'
                      : 'নিষ্ক্রিয় থাকলে ব্রাউজার হাইজ্যাকিং ও অননুমোদিত ব্যবহার রোধে এডমিন সেশন স্বয়ংক্রিয়ভাবে লগআউট হয়ে যায়।'}
                  </p>
                </div>

                {/* Policy 3: PIN Protection for Destructive Actions */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {isEn ? 'High-Risk 2-Factor Security PIN' : 'উচ্চ-ঝুঁকি ২-ফ্যাক্টর সিকিউরিটি পিন'}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-bold text-[10px]">
                      {isEn ? 'Enforced' : 'এনফোর্সড'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {isEn
                      ? 'Requires a 6-digit staff PIN confirmation prior to permanent ad deletion or staff suspension.'
                      : 'বিজ্ঞাপন পার্মানেন্ট ডিলিট বা মডারেটর সাসপেন্ডের ক্ষেত্রে কর্মকর্তার ৬-ডিজিট সিকিউরিটি পিন নিশ্চিতকরণ বাধ্যতামূলক।'}
                  </p>
                </div>

                {/* Policy 4: XSS & Code Injection Filter */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {isEn ? 'XSS & Code Injection Filter' : 'XSS ও কোড ইনজেকশন ফিল্টার'}
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded font-bold text-[10px]">
                      {isEn ? '100% Protected' : '১০০% সুরক্ষিত'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {isEn
                      ? 'Sanitizes all ad submissions, stripping out script tags, iframes, and malicious payloads.'
                      : 'বিজ্ঞাপন বা মেসেজে কোনো ধরণের ক্ষতিকর <script>, iframe বা javascript: পে-লোড পোস্ট হওয়া ব্লক করে ফিল্টার করা হয়।'}
                  </p>
                </div>

              </div>

              {/* Super Admin Emergency Controls */}
              {permissions.canConfigureSecurity && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 space-y-3">
                  <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-600" />
                    <span>{isEn ? 'Super Admin Emergency Controls' : 'সুপার এডমিন ইমার্জেন্সি কন্ট্রোল (Emergency Controls)'}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-rose-800 dark:text-rose-300">
                        {isEn ? 'System Lockdown (Emergency Maintenance Mode)' : 'সিস্টেম লকডাউন (জরুরি মেইনটেন্যান্স মোড)'}
                      </div>
                      <div className="text-[11px] text-rose-700/80 dark:text-rose-400">
                        {isEn
                          ? 'Temporarily pause new ad submissions during critical maintenance or threat investigations'
                          : 'জরুরি সাইবার আক্রমণের ঝুঁকি দেখা দিলে নতুন বিজ্ঞাপন পোস্ট সাময়িক স্থগিত রাখুন'}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        requestPinProtectedAction(
                          isEn ? 'Toggle System Lockdown' : 'সিস্টেম লকডাউন পরিবর্তন',
                          isEn
                            ? `Do you want to ${securitySettings.systemLockdown ? 'disable' : 'enable'} emergency system lockdown?`
                            : `আপনি কি সিস্টেম মেইনটেন্যান্স মোড ${securitySettings.systemLockdown ? 'বন্ধ' : 'চালু'} করতে চান?`,
                          () =>
                            onUpdateSecuritySettings({
                              ...securitySettings,
                              systemLockdown: !securitySettings.systemLockdown,
                            })
                        )
                      }
                      className={`px-4 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                        securitySettings.systemLockdown
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                      }`}
                    >
                      {securitySettings.systemLockdown
                        ? (isEn ? 'Lockdown Active (Disable)' : 'লকডাউন সক্রিয় (বন্ধ করুন)')
                        : (isEn ? 'Enable Lockdown' : 'লকডাউন চালু করুন')}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 8: SUPER ADMIN SOURCE CODE & DEPLOYMENT VAULT */}
          {activeTab === 'deploy' && currentStaff.role === 'super_admin' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* Header Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">
                        {isEn ? 'Proprietary Vault: Domain & Source Code Packages' : 'স্বত্বাধিকারী ভল্ট: ডোমেন ও সোর্স কোড প্যাকেজ'}
                      </h3>
                      <p className="text-xs text-slate-300">
                        {isEn
                          ? 'These files are completely invisible and private to regular visitors. Only authorized Super Admins can download and manage core files here.'
                          : 'সাধারণ ভিজিটরদের জন্য এই ফাইলগুলো সম্পূর্ণ অদৃশ্য ও গোপন। শুধুমাত্র অনুমোদিত সুপার এডমিন হিসেবে আপনি এখান থেকে মূল ফাইল ডাউনলোড ও পরিচালনা করতে পারবেন।'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                    {isEn ? 'Confidential Ownership' : 'গোপনীয় মালিকানা'}
                  </span>
                </div>
              </div>

              {/* Highlight Banner: Data & Ads Backup */}
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>{isEn ? 'Visitor Ads & Database Backup:' : 'ভিজিটরদের দেওয়া বিজ্ঞাপনের ফাইল ব্যাকআপ:'}</strong>{' '}
                    {isEn ? 'Export or restore all posted ads, user profiles, and photos.' : 'সকল বিজ্ঞাপন, ছবি ও ব্যবহারকারীদের ডাটা ১-ক্লিকে ব্যাকআপ ও রিস্টোর করুন।'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('backup')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  {isEn ? 'Open Backup Vault' : 'ব্যাকআপ ভল্ট খুলুন'} →
                </button>
              </div>

              {/* Download Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Developer Source Code Bundle */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3.5 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {isEn ? '1. Complete Web Source Code' : '১. সম্পূর্ণ ওয়েব সোর্স কোড'}
                        </h4>
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          puranbazar-source-code.zip
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Core codebase for future developers. Includes React 19, TypeScript, Tailwind CSS v4, complete UI and configuration files.'
                      : 'ভবিষ্যতে যেকোনো ডেভেলপারকে দেওয়ার জন্য মূল কোডবেজ। React 19, TypeScript, Tailwind CSS v4, সম্পূর্ণ UI ও কনফিগারেশন ফাইল অন্তর্ভুক্ত।'}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <div>$ npm install</div>
                    <div>$ npm run dev</div>
                  </div>

                  <a
                    href="/downloads/puranbazar-source-code.zip"
                    download="puranbazar-source-code.zip"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isEn ? 'Download Web Source (ZIP)' : 'ওয়েব সোর্স জিপ ডাউনলোড (ZIP)'}</span>
                  </a>
                </div>

                {/* 2. Production Dist Bundle */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3.5 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 flex items-center justify-center shrink-0">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {isEn ? '2. Production Ready Build (Hosting)' : '২. প্রোডাকশন রেডি বিল্ড (Hosting)'}
                        </h4>
                        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          puranbazar-production-dist.zip
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Ready-to-deploy build (including .htaccess) to extract directly into the public_html folder of cPanel, Apache, or any web hosting.'
                      : 'সরাসরি সিপ্যানেল (cPanel), অ্যাপাচি বা যেকোনো ওয়েব হোস্টিংয়ের public_html ফোল্ডারে আনজিপ করে লাইভ করার জন্য তৈরি বিল্ড (.htaccess সহ)।'}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <div>cPanel &gt; File Manager &gt; public_html</div>
                    <div>Extract puranbazar-production-dist.zip</div>
                  </div>

                  <a
                    href="/downloads/puranbazar-production-dist.zip"
                    download="puranbazar-production-dist.zip"
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isEn ? 'Download Production Build (ZIP)' : 'প্রোডাকশন বিল্ড জিপ ডাউনলোড (ZIP)'}</span>
                  </a>
                </div>

                {/* 3. Android Studio Native App Bundle (Google Play Store Ready) */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3.5 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {isEn ? '3. Android App (Play Store AAB)' : '৩. অ্যান্ড্রয়েড অ্যাপ (Play Store AAB)'}
                        </h4>
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          Android 9.0+ (API 28-34)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {isEn
                      ? 'Native Kotlin Android Studio project ready for Google Play Store upload. Includes camera upload, pull-to-refresh, and keystore generator.'
                      : 'গুগল প্লে স্টোরে আপলোড করার জন্য নেটিভ Kotlin অ্যান্ড্রয়েড স্টুডিও প্রজেক্ট। এতে ক্যামেরা আপলোড, সোয়াইপ রিফ্রেশ ও কিস্টোর জেনারেটর রয়েছে।'}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <div>$ ./generate_keystore.sh</div>
                    <div>$ ./gradlew bundleRelease # .aab {isEn ? 'ready' : 'প্রস্তুত'}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href="/downloads/puranbazar-android-project.zip"
                      download="puranbazar-android-project.zip"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isEn ? 'Android Studio Project (.ZIP)' : 'Android Studio প্রজেক্ট (.ZIP)'}</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Custom Domain Connection Guide */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? 'Custom Domain Setup Guide (DNS Connection Guide):' : 'কাস্টম ডোমেন নেম সেটআপ নির্দেশিকা (DNS Connection Guide):'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{isEn ? 'Step 1: Buy Domain' : 'ধাপ ১: ডোমেন ক্রয়'}</div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {isEn
                        ? 'Buy your desired domain from Namecheap, Hostinger or BTCL (.com.bd) (e.g. puranbazar.com).'
                        : 'Namecheap, Hostinger বা BTCL (.com.bd) থেকে আপনার পছন্দের ডোমেন কিনুন (যেমন: puranbazar.com)।'}
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{isEn ? 'Step 2: Hosting or Deploy' : 'ধাপ ২: হোস্টিং বা ডিপ্লয়'}</div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {isEn
                        ? 'Connect source code to Vercel/Netlify for free or extract production build zip in cPanel.'
                        : 'বিনামূল্যে Vercel/Netlify-এ সোর্স কোড কানেক্ট করুন অথবা cPanel-এ প্রোডাকশন বিল্ড জিপ এক্সট্রাক্ট করুন।'}
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{isEn ? 'Step 3: DNS Connection' : 'ধাপ ৩: DNS সংযোগ'}</div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                      {isEn
                        ? 'Set A Record (@ -> Hosting IP) and CNAME (www) in Domain DNS Management to make the site live!'
                        : 'ডোমেন ডিএনএস ম্যানেজমেন্টে A Record (@ -> হোস্টিং আইপি) এবং CNAME (www) সেট করলেই সাইট লাইভ!'}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span>{isEn ? 'Detailed DEPLOYMENT_GUIDE_BN.md and README.md files are available in the project root folder.' : 'প্রজেক্টের মূল ফোল্ডারে বিস্তারিত DEPLOYMENT_GUIDE_BN.md ও README.md ফাইল রয়েছে।'}</span>
                </div>
              </div>

              {/* 100% Free Domain & Hosting Walkthrough Card */}
              <div className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-700/80 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-emerald-950/40 dark:via-slate-800 dark:to-slate-800 space-y-4 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {isEn ? 'How to Go Live 100% Free (Free Domain + Free Hosting)' : 'সম্পূর্ণ বিনামূল্যে ডোমেন ও হোস্টিং নিয়ে লাইভ করার সহজ পদ্ধতি (১ টাকাও খরচ ছাড়া)'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs">
                          {isEn ? '100% Free' : '১০০% ফ্রি'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        {isEn
                          ? 'Publish your website right now with zero investment using Netlify Drop or Vercel.'
                          : 'কোনো ব্যাংক কার্ড বা টাকা ছাড়াই মাত্র ২ মিনিটে ওয়েবসাইট লাইভ করুন এবং আজীবন ফ্রি হোস্টিং ও ফ্রি ডোমেন উপভোগ করুন।'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  {/* Method 1: Netlify Drag & Drop */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {isEn ? 'Method 1: Netlify Drop (Fastest - 2 Mins)' : 'পদ্ধতি ১: Netlify Drop (সবচেয়ে সহজ - ২ মিনিটে)'}
                      </span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                        {isEn ? 'No Coding / Drag & Drop' : 'ড্র্যাগ অ্যান্ড ড্রপ'}
                      </span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      <li>উপরের ২ নং বাটন থেকে <strong>puranbazar-production-dist.zip</strong> ডাউনলোড করে আনজিপ করুন।</li>
                      <li>ব্রাউজারে যান <strong>app.netlify.com/drop</strong> (গুগল দিয়ে ফ্রি একাউন্ট খুলুন)।</li>
                      <li>আনজিপ করা ফোল্ডারটি মাউস দিয়ে টেনে সেখানে ছেড়ে দিন। ৩০ সেকেন্ডে সাইট লাইভ!</li>
                      <li>সেটিংস থেকে আপনার পছন্দমতো নাম দিন: <strong>puranbazar.netlify.app</strong>।</li>
                    </ol>
                  </div>

                  {/* Method 2: Vercel Free Cloud */}
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                        <Server className="w-4 h-4" />
                        {isEn ? 'Method 2: Vercel Cloud (Git Auto-Deploy)' : 'পদ্ধতি ২: Vercel Cloud (অটো ডিপ্লয়)'}
                      </span>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                        {isEn ? 'Global Fast CDN' : 'ফ্রি SSL + CDN'}
                      </span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      <li><strong>vercel.com</strong>-এ গুগল বা গিটহাব দিয়ে ফ্রি একাউন্ট তৈরি করুন।</li>
                      <li><strong>Add New Project</strong>-এ গিয়ে সোর্স কোড ইমপোর্ট করুন।</li>
                      <li>Deploy বাটনে চাপ দিলে স্বয়ংক্রিয়ভাবে <strong>puranbazar.vercel.app</strong> ডোমেনে সাইট লাইভ হবে।</li>
                      <li>ভবিষ্যতে যেকোনো সময় নিজের কেনা ডোমেইন (.com) ১-ক্লিকে বিনামূল্যে যুক্ত করতে পারবেন।</li>
                    </ol>
                  </div>
                </div>

                <div className="p-3 bg-emerald-100/60 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center justify-between flex-wrap gap-2">
                  <span>
                    💡 <strong>লাইভ সাইটে পূর্বের বিজ্ঞাপন দেখার উপায়:</strong> সাইট লাইভ করার পর এডমিন প্যানেলের <strong>"ডাটা ও ফাইল ব্যাকআপ ভল্ট"</strong> থেকে পূর্বে নামিয়ে রাখা ব্যাকআপ ফাইলটি রিস্টোর করলেই বর্তমান সব বিজ্ঞাপন সাথে সাথে লাইভ সাইটে দেখা যাবে!
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('backup')}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    ব্যাকআপ ভল্টে যান →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8.1: SUPER ADMIN DATA & FILE BACKUP VAULT */}
          {activeTab === 'backup' && currentStaff.role === 'super_admin' && (
            <DataBackupVaultSection
              ads={ads}
              registeredUsers={registeredUsers}
              payments={payments}
              reports={reports}
              adSenseConfig={adSenseConfig}
              securitySettings={securitySettings}
              staffMembers={staffMembers}
              payoutAccounts={payoutAccounts}
              payoutPolicy={payoutPolicy}
              onRestoreBackup={onRestoreBackup}
              language={language}
            />
          )}

          {/* TAB 9: STAFF PROFILE & CREDENTIALS MANAGEMENT (AVAILABLE FOR ALL STAFF ROLES) */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in">
              {/* Header Info Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      {currentStaff.avatar ? (
                        <img
                          src={currentStaff.avatar}
                          alt={currentStaff.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-md bg-slate-800"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-lg shadow-inner">
                          {currentStaff.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">{currentStaff.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.badgeColor}`}>
                          {isEn ? roleInfo.title : roleInfo.nameBn}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">
                        {isEn ? 'Official User ID:' : 'অফিসিয়াল ইউজার আইডি:'} {currentStaff.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-400 font-mono">
                    <div>{isEn ? 'Account Status:' : 'একাউন্ট স্ট্যাটাস:'} <span className="text-emerald-400 font-bold">{isEn ? '● Active' : '● সক্রিয় (Active)'}</span></div>
                    {currentStaff.phone && <div>{isEn ? 'Contact Number:' : 'যোগাযোগ নম্বর:'} {currentStaff.phone}</div>}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-700/60">
                  {isEn
                    ? 'Super Admin, Admin, Content Moderator, and Support Moderator — everyone can update and save their official User ID (email), name, mobile number, secret login password, 2-factor security PIN, and optional profile photo from here.'
                    : 'সুপার এডমিন, সাধারণ এডমিন, কন্টেন্ট মডারেটর এবং সাপোর্ট মডারেটর — সকলেই এখান থেকে নিজ নিজ ইউজার আইডি (ইমেইল), নাম, মোবাইল নম্বর, গোপন লগইন পাসওয়ার্ড, ২-ফ্যাক্টর সিকিউরিটি পিন ও ঐচ্ছিক প্রোফাইল ছবি সংরক্ষণ করতে পারবেন।'}
                </p>
              </div>

              {/* Success / Error Alerts */}
              {profileSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{profileSuccessMsg}</span>
                </div>
              )}

              {profileErrorMsg && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{profileErrorMsg}</span>
                </div>
              )}

              {/* Section 1: User ID & Profile Info */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-700/80 pb-2.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? '1. Update Official User ID (Email), Photo & Profile Info' : '১. অফিসিয়াল ইউজার আইডি (ইমেইল), ছবি ও পরিচিতি তথ্য পরিবর্তন'}</span>
                </div>

                <form onSubmit={handleUpdateProfileInfo} className="space-y-4">
                  {/* PROFILE PHOTO (OPTIONAL) SECTION */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-blue-500/5 border border-emerald-200/80 dark:border-emerald-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {isEn ? 'Official Profile Photo (Optional)' : 'অফিসিয়াল প্রোফাইল ছবি (ঐচ্ছিক)'}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {profileAvatar ? (isEn ? '✓ Photo Attached' : '✓ ছবি সংযুক্ত রয়েছে') : (isEn ? 'Optional (No photo)' : 'ঐচ্ছিক (ছবি ছাড়া পরিচালনা সম্ভব)')}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Photo Preview */}
                      <div className="relative group shrink-0">
                        {profileAvatar ? (
                          <img
                            src={profileAvatar}
                            alt={profileName || currentStaff.name}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-md bg-slate-100 dark:bg-slate-800"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-emerald-400 border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center font-bold text-xl shadow-inner select-none">
                            <span>{(profileName || currentStaff.name).slice(0, 1)}</span>
                            <span className="text-[9px] font-normal text-slate-400 mt-0.5">{isEn ? 'No Photo' : 'ছবি ছাড়া'}</span>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{profileAvatar ? (isEn ? 'Change Photo (Upload)' : 'নতুন ছবি আপলোড করুন') : (isEn ? 'Upload Photo' : 'ছবি আপলোড করুন')}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleStaffAvatarFileChange}
                              className="hidden"
                            />
                          </label>

                          {profileAvatar && (
                            <button
                              type="button"
                              onClick={() => {
                                setProfileAvatar('');
                                setAvatarUploadError('');
                              }}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isEn ? 'Remove Photo' : 'ছবি মুছে ফেলুন / ছবি ছাড়া রাখুন'}</span>
                            </button>
                          )}
                        </div>

                        {avatarUploadError && (
                          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">{avatarUploadError}</p>
                        )}

                        {/* Preset avatars */}
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                            {isEn ? 'Or select from official avatar presets:' : 'বা পছন্দের কোনো অফিসিয়াল অবতার নির্বাচন করুন:'}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {STAFF_PRESET_AVATARS.map((url, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setProfileAvatar(url);
                                  setAvatarUploadError('');
                                }}
                                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                                  profileAvatar === url ? 'border-emerald-600 scale-110 shadow-xs' : 'border-slate-300 dark:border-slate-700 hover:scale-105 opacity-70 hover:opacity-100'
                                }`}
                                title={`Preset ${idx + 1}`}
                              >
                                <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {isEn
                            ? 'Note: Profile photo is optional. An officer can upload a picture or manage the portal without one.'
                            : 'উল্লেখ্য: প্রোফাইল ছবি দেওয়া সম্পূর্ণ ঐচ্ছিক। কর্মকর্তা ইচ্ছে করলে ছবি দিতেও পারেন আবার ছবি ছাড়াও কোনো সমস্যা ছাড়া দায়িত্ব পালন করতে পারেন।'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Official User ID / Email *' : 'অফিসিয়াল ইউজার আইডি / ইমেইল *'}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          placeholder="admin@puranbazar.com"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {isEn ? 'This User ID will be used for logging into the admin vault.' : 'ভল্টে লগইনে এই ইউজার আইডিটি ব্যবহার হবে।'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Full Name *' : 'পূর্ণ নাম *'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder={isEn ? 'e.g. Nazmul Hasan' : 'যেমন: নাজমুল হাসান'}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Mobile Number' : 'মোবাইল নম্বর'}
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {isEn ? 'Used for emergency OTP and account recovery.' : 'জরুরি ওটিপি ও রিকভারিতে ব্যবহার হবে।'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Save User ID & Profile' : 'ইউজার আইডি ও পরিচিতি সংরক্ষণ করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Section 2: Password Change */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-700/80 pb-2.5">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>{isEn ? '2. Change Secret Login Password' : '২. সিক্রেট লগইন পাসওয়ার্ড পরিবর্তন'}</span>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Current Password *' : 'বর্তমান পাসওয়ার্ড *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPasswordInput}
                          onChange={(e) => setCurrentPasswordInput(e.target.value)}
                          placeholder={isEn ? 'Your current password' : 'আপনার বর্তমান পাসওয়ার্ড'}
                          className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'New Password *' : 'নতুন পাসওয়ার্ড *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder={isEn ? 'Minimum 6 characters' : 'কমপক্ষে ৬ অক্ষর'}
                          className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                        />
                        <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Confirm New Password *' : 'নতুন পাসওয়ার্ড নিশ্চিতকরণ *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder={isEn ? 'Re-enter password' : 'পুনরায় পাসওয়ার্ড লিখুন'}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                        />
                        <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Change Login Password' : 'লগইন পাসওয়ার্ড পরিবর্তন করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Section 3: Security PIN Change */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm border-b border-slate-100 dark:border-slate-700/80 pb-2.5">
                  <KeyRound className="w-4 h-4 text-purple-600" />
                  <span>{isEn ? '3. Change 2-Factor Security PIN' : '৩. ২-ফ্যাক্টর সিকিউরিটি পিন (PIN) পরিবর্তন'}</span>
                </div>

                <form onSubmit={handleChangePin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Current Security PIN' : 'বর্তমান সিকিউরিটি পিন'} {currentStaff.securityPin && '*'}
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPin ? 'text' : 'password'}
                          maxLength={6}
                          value={currentPinInput}
                          onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder={currentStaff.securityPin ? (isEn ? 'Current 6-digit PIN' : 'বর্তমান ৬ সংখ্যার পিন') : (isEn ? 'No PIN set' : 'কোনো পিন সেট নেই')}
                          className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono tracking-widest"
                        />
                        <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPin(!showCurrentPin)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showCurrentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'New 6-Digit PIN *' : 'নতুন ৬-সংখ্যার পিন *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPin ? 'text' : 'password'}
                          maxLength={6}
                          required
                          value={newPinInput}
                          onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder={isEn ? 'e.g. 998877' : 'যেমন: 998877'}
                          className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono tracking-widest"
                        />
                        <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <button
                          type="button"
                          onClick={() => setShowNewPin(!showNewPin)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Confirm New PIN *' : 'নতুন পিন নিশ্চিতকরণ *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPin ? 'text' : 'password'}
                          maxLength={6}
                          required
                          value={confirmPinInput}
                          onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ''))}
                          placeholder={isEn ? 'Re-enter 6-digit PIN' : 'পুনরায় ৬ সংখ্যার পিন'}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono tracking-widest"
                        />
                        <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Update Security PIN' : 'সিকিউরিটি পিন আপডেট করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 10: REAL-TIME LIVE VIEWERS & USER ENGAGEMENT TRACKER (SUPER ADMIN & ADMIN ONLY) */}
          {activeTab === 'analytics' && (currentStaff.role === 'super_admin' || currentStaff.role === 'admin') && (
            <UserAnalyticsSection
              currentStaff={currentStaff}
              registeredUsers={registeredUsers}
              language={language}
            />
          )}

        </div>

      </div>

      {/* Super Admin Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{isEn ? 'Edit Staff Credentials & Role' : 'স্টাফ ক্রেডেনশিয়াল ও রোল এডিট'}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{editingStaff.name} ({editingStaff.email})</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editStaffError && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editStaffError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStaffEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Full Name *' : 'পূর্ণ নাম *'}</label>
                  <input
                    type="text"
                    required
                    value={editStaffName}
                    onChange={(e) => setEditStaffName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Official Email / User ID *' : 'অফিসিয়াল ইমেইল / ইউজার আইডি *'}</label>
                  <input
                    type="email"
                    required
                    value={editStaffEmail}
                    onChange={(e) => setEditStaffEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Mobile Number' : 'মোবাইল নম্বর'}</label>
                  <input
                    type="tel"
                    value={editStaffPhone}
                    onChange={(e) => setEditStaffPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Designation / Role *' : 'পদবী বা রোল (Role) *'}</label>
                  <select
                    value={editStaffRole}
                    onChange={(e) => setEditStaffRole(e.target.value as StaffRole)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="content_moderator">{isEn ? 'Content Moderator' : 'কন্টেন্ট মডারেটর (Content Moderator)'}</option>
                    <option value="support_moderator">{isEn ? 'Safety & Support Officer' : 'নিরাপত্তা ও সাপোর্ট মডারেটর (Safety Officer)'}</option>
                    <option value="admin">{isEn ? 'Admin' : 'সাধারণ এডমিন (Admin)'}</option>
                    <option value="super_admin">{isEn ? 'Super Admin' : 'সুপার এডমিন (Super Admin)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Login Password *' : 'লগইন পাসওয়ার্ড *'}</label>
                  <input
                    type="text"
                    required
                    value={editStaffPassword}
                    onChange={(e) => setEditStaffPassword(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{isEn ? 'Security PIN *' : 'সিকিউরিটি পিন (PIN) *'}</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={editStaffPin}
                    onChange={(e) => setEditStaffPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={isEn ? '6-digit PIN' : '৬ সংখ্যার পিন'}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono tracking-wider"
                  />
                </div>
              </div>

              {/* Staff Profile Photo (Optional) in Edit Staff Modal */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                    {isEn ? 'Official Profile Photo (Optional)' : 'অফিসিয়াল প্রোফাইল ছবি (ঐচ্ছিক)'}
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {editStaffAvatar ? (isEn ? '✓ Photo Set' : '✓ ছবি বিদ্যমান') : (isEn ? 'Optional (No photo)' : 'ঐচ্ছিক (ছবি ছাড়া রাখা যাবে)')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {editStaffAvatar ? (
                    <img src={editStaffAvatar} alt="Staff preview" className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-xs" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>{editStaffAvatar ? (isEn ? 'Change Photo' : 'ছবি পরিবর্তন') : (isEn ? 'Upload Photo' : 'ছবি আপলোড')}</span>
                        <input type="file" accept="image/*" onChange={handleEditStaffAvatarFileChange} className="hidden" />
                      </label>
                      {editStaffAvatar && (
                        <button
                          type="button"
                          onClick={() => setEditStaffAvatar('')}
                          className="px-2.5 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          {isEn ? 'Remove' : 'ছবি বাদ দিন'}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">{isEn ? 'Presets:' : 'প্রিসেট:'}</span>
                      {STAFF_PRESET_AVATARS.slice(0, 5).map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditStaffAvatar(url)}
                          className={`w-5 h-5 rounded-full overflow-hidden border ${editStaffAvatar === url ? 'border-emerald-500 scale-110 shadow-xs' : 'border-slate-300 dark:border-slate-700'}`}
                        >
                          <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  {isEn ? 'Save Changes' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Suspension & Ban Execution Modal (Super Admin, Admin, Content Moderator, Safety & Support) */}
      {suspendingUser && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 space-y-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  suspendType === 'banned'
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400'
                    : 'bg-amber-100 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400'
                }`}>
                  {suspendType === 'banned' ? <Ban className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {suspendType === 'banned'
                      ? (isEn ? 'Permanent Account Ban' : 'ব্যবহারকারী একাউন্ট স্থায়ী ব্যান (Permanent Ban)')
                      : (isEn ? 'Temporary Account Suspension' : 'ব্যবহারকারী একাউন্ট সাময়িক স্থগিতকরণ (Temporary)')}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {suspendingUser.name} ({suspendingUser.phone})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSuspendingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Acting Designation & Transparency Box (Crucial for Super Admin Oversight) */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-300/60 dark:border-emerald-800/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Authorized Staff Action Log:' : 'স্থগিতকারী কর্মকর্তার পদবী ও পরিচয়:'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${roleInfo.badgeColor}`}>
                  {isEn ? roleInfo.title : roleInfo.nameBn}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span>{isEn ? 'Acting Officer:' : 'স্থগিতকারী কর্মকর্তা:'}</span>
                <strong className="text-slate-900 dark:text-white">{currentStaff.name}</strong>
                <span className="text-slate-400">({currentStaff.email})</span>
              </div>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {isEn
                  ? '✓ Note: Your official designation and full name will be transparently recorded and displayed on the Super Admin control panel and permanent audit trail.'
                  : '✓ নিশ্চিত থাকুন: স্থগিতাদেশ প্রদানকারী হিসেবে আপনার পদবী ও নাম সুপার এডমিনের ড্যাশবোর্ডে এবং স্থায়ী অডিট ট্রেইলে স্বচ্ছভাবে লিপিবদ্ধ থাকবে।'}
              </p>
            </div>

            {/* Action Form */}
            <form onSubmit={handleExecuteSuspension} className="space-y-3.5 text-xs">
              {/* Type Switcher: Temporary Suspend vs Permanent Ban */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isEn ? 'Select Moderation Action Type *' : 'শাস্তিমূলক পদক্ষেপের ধরণ নির্বাচন করুন *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSuspendType('suspended');
                      if (suspendDuration === (isEn ? 'Permanent Ban' : 'স্থায়ী ব্যান (Permanent)')) {
                        setSuspendDuration('৭ দিন (7 Days)');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      suspendType === 'suspended'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 font-bold ring-1 ring-amber-500'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-xs">{isEn ? 'Temporary Suspension' : 'সাময়িক স্থগিত (Temporary)'}</div>
                      <div className="text-[10px] opacity-80">{isEn ? 'Auto-reactivates after days' : 'নির্দিষ্ট দিন পর স্বয়ংক্রিয়/ম্যানুয়াল'}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSuspendType('banned');
                      setSuspendDuration(isEn ? 'Permanent Ban' : 'স্থায়ী ব্যান (Permanent)');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      suspendType === 'banned'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200 font-bold ring-1 ring-rose-500'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <div className="text-xs">{isEn ? 'Permanent Ban' : 'স্থায়ী ব্যান (Permanent)'}</div>
                      <div className="text-[10px] opacity-80">{isEn ? 'Lifetime blacklist' : 'লাইফটাইম কালো তালিকাভুক্তি'}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Suspension Duration (if temporary) */}
              {suspendType === 'suspended' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Suspension Duration *' : 'স্থগিতাদেশের মেয়াদ (Duration) *'}
                  </label>
                  <select
                    value={suspendDuration}
                    onChange={(e) => setSuspendDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="২৪ ঘণ্টা (24 Hours)">২৪ ঘণ্টা (24 Hours - প্রাথমিক সতর্কতা)</option>
                    <option value="৩ দিন (3 Days)">৩ দিন (3 Days)</option>
                    <option value="৭ দিন (7 Days)">৭ দিন (7 Days - সাধারণ মেয়াদ)</option>
                    <option value="১৫ দিন (15 Days)">১৫ দিন (15 Days)</option>
                    <option value="৩০ দিন (1 Month)">৩০ দিন (1 Month - গুরুতর লঙ্ঘন)</option>
                    <option value="৩ মাস (90 Days)">৩ মাস (90 Days - দীর্ঘমেয়াদী স্থগিতাদেশ)</option>
                    <option value="তদন্তাধীন অনির্দিষ্টকাল (Under Investigation)">তদন্তাধীন অনির্দিষ্টকাল (Under Investigation)</option>
                  </select>
                </div>
              )}

              {/* Reason Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEn ? 'Primary Reason for Action *' : 'স্থগিত বা ব্যানের সুনির্দিষ্ট কারণ *'}
                </label>
                <select
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="প্রতারণামূলক ভুয়া বিজ্ঞাপন ও ফেক তথ্য প্রদান">প্রতারণামূলক ভুয়া বিজ্ঞাপন ও ফেক তথ্য প্রদান</option>
                  <option value="ভুয়া মোবাইল নম্বর প্রদান ও কোড জালিয়াতি">ভুয়া মোবাইল নম্বর প্রদান ও কোড জালিয়াতি</option>
                  <option value="কপিরাইট পণ্য ও ভুয়া ইন্টারনেট ছবি ব্যবহার">কপিরাইট পণ্য ও ভুয়া ইন্টারনেট ছবি ব্যবহার</option>
                  <option value="নিষিদ্ধ বা ঝুঁকিপূর্ণ চোরাই পণ্য লিস্টিংয়ের চেষ্টা">নিষিদ্ধ বা ঝুঁকিপূর্ণ চোরাই পণ্য লিস্টিংয়ের চেষ্টা</option>
                  <option value="অগ্রিম কুরিয়ার/ডেলিভারি টাকা নিয়ে পণ্য না পাঠানো">অগ্রিম কুরিয়ার/ডেলিভারি টাকা নিয়ে পণ্য না পাঠানো</option>
                  <option value="ক্রেতা বা বিক্রেতার সাথে অশালীন আচরণ ও প্রতারণা">ক্রেতা বা বিক্রেতার সাথে অশালীন আচরণ ও প্রতারণা</option>
                  <option value="বারংবার স্প্যাম ও ডুপ্লিকেট বিজ্ঞাপন পোস্ট করা">বারংবার স্প্যাম ও ডুপ্লিকেট বিজ্ঞাপন পোস্ট করা</option>
                  <option value="অন্যান্য বিশেষ কারণ">অন্যান্য বিশেষ কারণ</option>
                </select>
              </div>

              {/* Custom Reason Details */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isEn ? 'Additional Investigation Notes (Optional)' : 'অতিরিক্ত বিস্তারিত বিবরণ বা তদন্ত নোট (ঐচ্ছিক)'}
                </label>
                <textarea
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={isEn ? 'Add specific details, complaint reference, or context...' : 'অভিযোগকারীর নম্বর, প্রতারণার প্রমাণ বা বিশেষ কোনো নোট থাকলে এখানে লিখুন...'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSuspendingUser(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer ${
                    suspendType === 'banned'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {suspendType === 'banned'
                    ? (isEn ? 'Confirm Permanent Ban' : 'স্থায়ী ব্যান নিশ্চিত করুন')
                    : (isEn ? 'Confirm Suspension' : 'স্থগিতাদেশ নিশ্চিত করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security PIN Modal */}
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
