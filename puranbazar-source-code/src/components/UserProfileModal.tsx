import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, MapPin, Calendar, ShieldCheck, 
  Trash2, Eye, PlusCircle, CheckCircle, Clock, AlertTriangle, 
  LogOut, Edit3, Save, PackageCheck, Layers, Zap, Sparkles, Crown,
  Camera, Upload, Image as ImageIcon, Smile
} from 'lucide-react';
import { UserProfile, Ad } from '../types';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { sanitizeInput } from '../utils/security';
import { normalizePhone } from '../utils/userAuth';
import { Language, formatPrice, formatNumber } from '../utils/i18n';
import { handleImageError, getAdImageWithFallback } from '../utils/imageFallback';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop',
];

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  ads: Ad[];
  onLogout: () => void;
  onPostNewAdClick: () => void;
  onViewAdDetails: (ad: Ad) => void;
  onDeleteAd: (adId: string) => void;
  onUpdateProfile: (updatedUser: UserProfile) => void;
  onBoostAdClick?: (ad: Ad) => void;
  language?: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  ads,
  onLogout,
  onPostNewAdClick,
  onViewAdDetails,
  onDeleteAd,
  onUpdateProfile,
  onBoostAdClick,
  language = 'bn',
}) => {
  const isEn = language === 'en';
  const [activeTab, setActiveTab] = useState<'my_ads' | 'profile_info'>('my_ads');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Edit states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editDivision, setEditDivision] = useState(currentUser?.division || 'ঢাকা (Dhaka)');
  const [editDistrict, setEditDistrict] = useState(currentUser?.district || 'ঢাকা (Dhaka)');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [avatarUploadError, setAvatarUploadError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Sync edit states when currentUser changes or modal opens
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditEmail(currentUser.email);
      setEditDivision(currentUser.division || 'ঢাকা (Dhaka)');
      setEditDistrict(currentUser.district || 'ঢাকা (Dhaka)');
      setEditBio(currentUser.bio || '');
      setEditAvatar(currentUser.avatar || '');
      setAvatarUploadError('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Filter ads posted by this user
  const userAds = ads.filter((ad) => {
    if (ad.seller_id && ad.seller_id === currentUser.id) return true;
    if (ad.seller_phone && normalizePhone(ad.seller_phone) === normalizePhone(currentUser.phone)) return true;
    if (ad.seller_email && ad.seller_email.toLowerCase() === currentUser.email.toLowerCase()) return true;
    return false;
  });

  const approvedAdsCount = userAds.filter((a) => a.status === 'approved').length;
  const pendingAdsCount = userAds.filter((a) => a.status === 'pending').length;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAvatarUploadError(isEn ? 'Image size must be less than 5 MB.' : 'ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setEditAvatar(event.target.result);
        setAvatarUploadError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setEditAvatar('');
    setAvatarUploadError('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: sanitizeInput(editName.trim()) || currentUser.name,
      phone: normalizePhone(editPhone.trim()) || currentUser.phone,
      email: sanitizeInput(editEmail.trim().toLowerCase()) || currentUser.email,
      division: editDivision,
      district: editDistrict,
      bio: sanitizeInput(editBio.trim()),
      avatar: editAvatar.trim() ? editAvatar.trim() : undefined,
      password: newPassword.trim() ? newPassword.trim() : currentUser.password
    };

    onUpdateProfile(updated);
    setIsEditing(false);
    setNewPassword('');
    setFeedbackMsg(isEn ? 'Profile updated successfully!' : 'প্রোফাইল তথ্য ও ছবি সফলভাবে হালনাগাদ করা হয়েছে!');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Cover & Profile Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            aria-label={isEn ? 'Close' : 'বন্ধ করুন'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/90 shadow-md bg-white/10"
                />
              ) : (
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 border-white/80 shadow-md flex flex-col items-center justify-center text-white backdrop-blur-xs font-bold text-2xl select-none">
                  <span>{currentUser.name ? currentUser.name[0] : 'ইউ'}</span>
                  <span className="text-[9px] font-medium text-emerald-100 mt-0.5 tracking-tight">{isEn ? 'No Photo' : 'ছবি ছাড়া'}</span>
                </div>
              )}
              
              {/* Quick Camera edit trigger */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('profile_info');
                  setIsEditing(true);
                }}
                className="absolute -bottom-1.5 -right-1.5 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 rounded-full p-1.5 shadow-lg border border-emerald-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title={isEn ? 'Change or upload profile photo (Optional)' : 'প্রোফাইল ছবি পরিবর্তন/যুক্ত/মুছে ফেলুন (ঐচ্ছিক)'}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">{currentUser.name}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-xs w-fit mx-auto sm:mx-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-200" />
                  {isEn ? 'Verified Seller' : 'ভেরিফাইড বিক্রেতা'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-xs text-emerald-100">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-200" />
                  <span className="font-mono">{currentUser.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{currentUser.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{currentUser.district}</span>
                </span>
              </div>

              <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] text-emerald-200/90 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {isEn ? 'Joined:' : 'যোগদান:'} {currentUser.joinedAt}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onPostNewAdClick();
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isEn ? 'Post New Ad' : 'নতুন বিজ্ঞাপন দিন'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-5 p-2 bg-black/20 backdrop-blur-xs rounded-xl text-center text-xs">
            <div className="p-1">
              <div className="text-base font-bold text-white">{formatNumber(userAds.length, language)}</div>
              <div className="text-[10px] text-emerald-200">{isEn ? 'Total Ads' : 'মোট বিজ্ঞাপন'}</div>
            </div>
            <div className="p-1 border-x border-white/10">
              <div className="text-base font-bold text-white">{formatNumber(approvedAdsCount, language)}</div>
              <div className="text-[10px] text-emerald-200">{isEn ? 'Active Ads' : 'সক্রিয় বিজ্ঞাপন'}</div>
            </div>
            <div className="p-1">
              <div className="text-base font-bold text-white">{formatNumber(pendingAdsCount, language)}</div>
              <div className="text-[10px] text-emerald-200">{isEn ? 'Under Review' : 'পর্যালোচনায় আছে'}</div>
            </div>
          </div>

          {/* Account Suspension / Ban Notice if user status is restricted */}
          {(currentUser.status === 'suspended' || currentUser.status === 'banned') && (
            <div className="mt-3 p-3.5 bg-rose-950/80 border border-rose-400/60 rounded-2xl text-xs space-y-1.5 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-2 font-bold text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
                <span>
                  {currentUser.status === 'banned'
                    ? (isEn ? '⚠️ Account Permanently Banned' : '⚠️ আপনার একাউন্টটি স্থায়ীভাবে ব্যান করা হয়েছে')
                    : (isEn ? '⚠️ Account Temporarily Suspended' : '⚠️ আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে')}
                </span>
              </div>
              <div className="text-[11px] text-rose-100/90 leading-relaxed">
                <div>
                  <strong>{isEn ? 'Suspended By Role:' : 'স্থগিতকারী পদবী:'}</strong>{' '}
                  <span className="font-bold underline decoration-rose-300">
                    {currentUser.suspendedBy?.staffRoleNameBn || (isEn ? 'System Admin' : 'এডমিনিস্ট্রেশন সেন্টার')}
                  </span>
                  {currentUser.suspendedBy?.staffName && ` (${currentUser.suspendedBy.staffName})`}
                </div>
                <div>
                  <strong>{isEn ? 'Duration:' : 'মেয়াদ:'}</strong> {currentUser.suspendedUntil || (isEn ? 'Indefinite' : 'অনির্দিষ্ট')}
                </div>
                <div>
                  <strong>{isEn ? 'Reason:' : 'কারণ:'}</strong> {currentUser.suspendedReason || (isEn ? 'Policy violation' : 'মার্কেটপ্লেস নীতিমালা লঙ্ঘন')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 bg-slate-50 dark:bg-slate-900/50 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('my_ads')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'my_ads'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isEn ? `My Ads (${formatNumber(userAds.length, language)})` : `আমার বিজ্ঞাপনসমূহ (${userAds.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile_info')}
              className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'profile_info'
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{isEn ? 'Profile Info & Settings' : 'প্রোফাইল তথ্য ও সেটিংস'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer font-medium"
            title={isEn ? 'Log out' : 'একাউন্ট লগআউট করুন'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isEn ? 'Log Out' : 'লগআউট'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {feedbackMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* TAB 1: MY ADS */}
          {activeTab === 'my_ads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isEn ? 'All Your Posted Ads' : 'আপনার পোস্টকৃত সকল বিজ্ঞাপন'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEn ? 'Monitor your ad statuses and manage them as needed' : 'এখান থেকে আপনার বিজ্ঞাপনের বর্তমান স্ট্যাটাস পর্যবেক্ষণ ও প্রয়োজন অনুসারে ব্যবস্থাপনা করুন'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onPostNewAdClick();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Post Another Ad' : 'আরও বিজ্ঞাপন দিন'}</span>
                </button>
              </div>

              {userAds.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {isEn ? 'No Ads Posted Yet' : 'আপনার কোনো বিজ্ঞাপন পাওয়া যায়নি'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                    {isEn ? 'Post an ad right now to sell your used phone, laptop, or any item easily.' : 'আপনার ব্যবহৃত মোবাইল, ল্যাপটপ বা যেকোনো পণ্য এখনই বিক্রি করতে বিজ্ঞাপন দিন।'}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onPostNewAdClick();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md"
                  >
                    {isEn ? 'Post Your First Ad' : 'প্রথম বিজ্ঞাপন পোস্ট করুন'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getAdImageWithFallback(ad.images, ad.category_id)}
                          alt={ad.title}
                          onError={(e) => handleImageError(e, ad.category_id)}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                            {ad.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                              {formatPrice(ad.price, language)}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              • {ad.created_at}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            {ad.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                {isEn ? 'Live / Approved' : 'লাইভ / অনুমোদিত'}
                              </span>
                            )}
                            {ad.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Clock className="w-3 h-3 text-amber-600" />
                                {isEn ? 'Pending Review' : 'এডমিন যাচাইকরণে অপেক্ষমাণ'}
                              </span>
                            )}
                            {ad.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                {isEn ? 'Rejected' : 'পর্যালোচনায় বাতিল'}
                              </span>
                            )}

                            {/* Tier Badges */}
                            {ad.featured_tier === 'featured' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Featured
                              </span>
                            )}
                            {ad.featured_tier === 'premium' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-300">
                                <Zap className="w-3 h-3 text-indigo-500" />
                                Premium
                              </span>
                            )}
                            {ad.featured_tier === 'top' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300">
                                <Crown className="w-3 h-3 text-purple-500" />
                                Top Listing
                              </span>
                            )}

                            <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                              <Eye className="w-3 h-3" />
                              {formatNumber(ad.views, language)} {isEn ? 'views' : 'ভিউ'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Direct In-App Boost / Featured Button */}
                        {onBoostAdClick && (
                          <button
                            type="button"
                            onClick={() => onBoostAdClick(ad)}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 hover:opacity-90 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                            title={isEn ? 'Boost ad with bKash/Nagad' : 'সরাসরি বিকাশ/নগদ পেমেন্টে বিজ্ঞাপন বুস্ট করুন'}
                          >
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            <span>{ad.featured_tier === 'none' ? (isEn ? 'Boost' : 'বুস্ট করুন') : (isEn ? 'Upgrade' : 'আপগ্রেড')}</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onClose();
                            onViewAdDetails(ad);
                          }}
                          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isEn ? 'View' : 'দেখুন'}</span>
                        </button>

                        {deleteConfirmId === ad.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 p-1 rounded-lg border border-rose-200">
                            <button
                              onClick={() => {
                                onDeleteAd(ad.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-bold cursor-pointer hover:bg-rose-700"
                            >
                              {isEn ? 'Yes, Delete' : 'হ্যাঁ মুছুন'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[11px] cursor-pointer"
                            >
                              {isEn ? 'Cancel' : 'বাতিল'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(ad.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title={isEn ? 'Delete ad' : 'বিজ্ঞাপন মুছুন'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE INFO & SETTINGS */}
          {activeTab === 'profile_info' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isEn ? 'Personal Information & Security Settings' : 'ব্যক্তিগত তথ্য ও নিরাপত্তা সেটিংস'}
                </h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center gap-1 hover:bg-emerald-100 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Edit Profile' : 'এডিট করুন'}</span>
                  </button>
                )}
              </div>

              {/* PROFILE PHOTO (OPTIONAL) SECTION */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-blue-500/5 border border-emerald-200/80 dark:border-emerald-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{isEn ? 'Profile Photo' : 'প্রোফাইল ছবি'}</span>
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                          {isEn ? 'Optional / ঐচ্ছিক' : 'সম্পূর্ণ ঐচ্ছিক'}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isEn 
                          ? 'You can choose to upload a photo, or keep your account without any photo.' 
                          : 'ব্যক্তি ইচ্ছে করলে ছবি দিতেও পারেন আবার নাও দিতে পারেন — কোনো বাধ্যবাধকতা নেই।'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avatar Preview & Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-emerald-100/70 dark:border-emerald-950/60">
                  <div className="relative shrink-0 flex items-center gap-3">
                    {editAvatar ? (
                      <div className="relative">
                        <img
                          src={editAvatar}
                          alt="Avatar Preview"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm bg-slate-100 dark:bg-slate-800"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shadow-xs font-bold" title={isEn ? 'Active Photo' : 'ছবি সক্রিয় আছে'}>
                          ✓
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
                        <User className="w-6 h-6 stroke-1" />
                        <span className="text-[9px] font-semibold mt-0.5">{isEn ? 'No Photo' : 'ছবি ছাড়া'}</span>
                      </div>
                    )}

                    <div className="text-xs">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {editAvatar 
                          ? (isEn ? 'Personal photo selected' : 'ব্যক্তিগত ছবি যুক্ত করা আছে') 
                          : (isEn ? 'Currently without photo (Default)' : 'বর্তমানে কোনো ছবি নেই (ডিফল্ট মোড)')}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {editAvatar
                          ? (isEn ? 'Displays on your profile and ads' : 'আপনার প্রোফাইল ও বিজ্ঞাপনে প্রদর্শিত হবে')
                          : (isEn ? 'Your initials will be shown elegantly' : 'ছবি না থাকলে নামের প্রথম অক্ষরের স্টাইলিশ ব্যাজ শো করবে')}
                      </div>
                    </div>
                  </div>

                  {/* Editing Controls */}
                  {isEditing && (
                    <div className="flex-1 flex flex-wrap items-center gap-2 sm:justify-end">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id="userAvatarFileInput"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />

                      <label
                        htmlFor="userAvatarFileInput"
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{editAvatar ? (isEn ? 'Change Photo' : 'ছবি পরিবর্তন') : (isEn ? 'Upload Photo' : 'ছবি আপলোড করুন')}</span>
                      </label>

                      {editAvatar && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Remove Photo (Keep Empty)' : 'ছবি বাদ দিন (ছবি ছাড়া রাখুন)'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {avatarUploadError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{avatarUploadError}</span>
                  </p>
                )}

                {/* Preset Avatars Row (When Editing) */}
                {isEditing && (
                  <div className="pt-2 border-t border-emerald-100/70 dark:border-emerald-950/60">
                    <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                      <Smile className="w-3 h-3 text-emerald-600" />
                      <span>{isEn ? 'Or pick a ready-made avatar (Optional):' : 'অথবা রেডিমেড অবতার পছন্দ করুন (ঐচ্ছিক):'}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {PRESET_AVATARS.map((presetUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setEditAvatar(presetUrl);
                            setAvatarUploadError('');
                          }}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer shrink-0 ${
                            editAvatar === presetUrl 
                              ? 'border-emerald-600 scale-105 shadow-sm ring-2 ring-emerald-500/30' 
                              : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={presetUrl}
                            alt={`Preset ${idx + 1}`}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        </button>
                      ))}

                      {/* Clear / No Avatar button */}
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className={`h-10 px-2.5 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                          !editAvatar 
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={isEn ? 'Without photo' : 'ছবি ছাড়া'}
                      >
                        {isEn ? '✕ No Photo' : '✕ ছবি ছাড়া'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Full Name' : 'পূর্ণ নাম'}
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Mobile Number' : 'মোবাইল নম্বর'}
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Email Address' : 'ইমেইল এড্রেস'}
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'District / Location' : 'জেলা / লোকেশন'}
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isEn ? 'Short Bio / Intro' : 'সংক্ষিপ্ত বায়ো / পরিচয়'}
                </label>
                <textarea
                  rows={2}
                  disabled={!isEditing}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder={isEn ? 'Write a brief description about yourself or what you sell...' : 'আপনার সম্পর্কে বা বিক্রির ধরন সম্পর্কে কিছু লিখুন...'}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75"
                />
              </div>

              {isEditing && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Set New Password (leave blank to keep unchanged)' : 'নতুন পাসওয়ার্ড নির্ধারণ (পরিবর্তন করতে চাইলে লিখুন)'}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isEn ? 'Leave blank to keep current password' : 'পাসওয়ার্ড অপরিবর্তিত রাখতে ফাঁকা রাখুন'}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />

                  <div className="flex items-center gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Save Changes' : 'সংরক্ষণ করুন'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs rounded-xl cursor-pointer"
                    >
                      {isEn ? 'Cancel' : 'বাতিল'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
