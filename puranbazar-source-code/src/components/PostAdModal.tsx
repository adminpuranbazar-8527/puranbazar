import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, ArrowRight, ArrowLeft, Camera, Sparkles, 
  MapPin, ShieldCheck, Check, Smartphone, AlertCircle, User, Phone, Mail,
  CreditCard, Crown, Zap
} from 'lucide-react';
import { Ad, Condition, FeaturedPayment, UserProfile } from '../types';
import { CATEGORIES, CONDITION_LABELS } from '../data/categories';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshLocations';
import { PaymentGatewayModal } from './PaymentGatewayModal';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAd: (ad: Ad, payment?: FeaturedPayment) => void;
  currentUser: UserProfile | null;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  onSubmitAd,
  currentUser
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: User Registration / Verification
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(Boolean(currentUser));

  // Sync state with currentUser when modal opens
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserPhone(currentUser.phone);
      setUserEmail(currentUser.email);
      setDivision(currentUser.division || 'ঢাকা (Dhaka)');
      setDistrict(currentUser.district || 'ঢাকা (Dhaka)');
      setIsPhoneVerified(true);
    }
  }, [currentUser, isOpen]);

  // Step 2: Ad Details
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [subcategory, setSubcategory] = useState(CATEGORIES[0].subcategories[0]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [condition, setCondition] = useState<Condition>('good');
  const [description, setDescription] = useState('');
  const [division, setDivision] = useState('ঢাকা (Dhaka)');
  const [district, setDistrict] = useState('মানিকগঞ্জ (Manikganj)');
  const [upazila, setUpazila] = useState('সিংগাইর (Singair)');
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');
  const [imageError, setImageError] = useState('');

  // Step 4: Monetization / Package Selection
  const [selectedPackage, setSelectedPackage] = useState<'free' | 'featured' | 'premium' | 'top'>('free');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<FeaturedPayment | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // Selected Division & District Objects
  const activeDivObj = BANGLADESH_LOCATIONS.find((d) => d.name === division) || BANGLADESH_LOCATIONS[0];
  const activeDistObj = activeDivObj.districts.find((d) => d.name === district) || activeDivObj.districts[0];

  // Helper for simulated photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedPhoto(event.target?.result as string);
        setImageError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = () => {
    if (!userPhone.match(/^01[3-9]\d{8}$/)) {
      alert('সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 01712345678)');
      return;
    }
    setIsOtpSent(true);
    setOtpCode('1234'); // Pre-fill mock OTP for smooth verification
  };

  const handleVerifyOtp = () => {
    if (otpCode === '1234' || otpCode.length === 4) {
      setIsPhoneVerified(true);
      setCurrentStep(2);
    } else {
      alert('ভুল ওটিপি কোড। অনুগ্রহ করে সঠিক কোড দিন।');
    }
  };

  // Final Submission
  const handleFinalSubmit = () => {
    // If paid package selected and gateway payment not completed yet, open gateway simulation
    if (selectedPackage !== 'free' && !completedPayment) {
      setIsGatewayOpen(true);
      return;
    }

    executeFinalSubmission(completedPayment || undefined);
  };

  const handleGatewaySuccess = (payment: FeaturedPayment) => {
    setCompletedPayment(payment);
    setTrxId(payment.trx_id);
    setIsGatewayOpen(false);
    executeFinalSubmission(payment);
  };

  const executeFinalSubmission = (paymentObj?: FeaturedPayment) => {
    const currentPriceNum = parseInt(price, 10) || 0;

    const newAd: Ad = {
      id: `ad-${Date.now()}`,
      seller_id: currentUser?.id,
      title,
      description,
      price: currentPriceNum,
      negotiable,
      category_id: categoryId,
      subcategory,
      condition,
      division,
      district,
      upazila,
      images: [selectedPhoto || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop'],
      seller_name: userName || currentUser?.name || 'অনামী বিক্রেতা',
      seller_phone: userPhone || currentUser?.phone || '',
      seller_email: userEmail || currentUser?.email || '',
      seller_verified: true,
      seller_joined: currentUser?.joinedAt || 'সেপ্টেম্বর ২০২৬',
      status: 'pending', // Sent to Admin Review queue as required!
      featured_tier: selectedPackage === 'free' ? 'none' : selectedPackage,
      views: 1,
      created_at: '২৩ সেপ্টেম্বর ২০২৬',
    };

    let finalPayment = paymentObj;
    if (!finalPayment && selectedPackage !== 'free') {
      const amount = selectedPackage === 'featured' ? 49 : selectedPackage === 'premium' ? 99 : 199;
      finalPayment = {
        id: `pay-${Date.now()}`,
        ad_id: newAd.id,
        ad_title: newAd.title,
        package_name: selectedPackage === 'featured' ? 'Featured (৳49 / 7 days)' : selectedPackage === 'premium' ? 'Premium (৳99 / 15 days)' : 'Top Listing (৳199 / 30 days)',
        amount,
        method: paymentMethod,
        trx_id: trxId || `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
        created_at: '২৩ সেপ্টেম্বর ২০২৬',
        status: 'completed'
      };
    }

    onSubmitAd(newAd, finalPayment);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="পুরানবাজার" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-contain rounded-full shadow-xs border border-emerald-600/30 p-0.5 bg-white dark:bg-slate-800"
            />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                বিজ্ঞাপন দিন (Post Your Ad)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ব্যবহৃত পণ্য সহজে ও নিরাপদে বিক্রি করুন — পুরানবাজার
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isSubmitted && (
          <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-semibold">
            <div className={`py-2.5 border-b-2 ${currentStep === 1 ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30' : currentStep > 1 ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-400 dark:text-slate-500'}`}>
              ১. ইউজার তথ্য
            </div>
            <div className={`py-2.5 border-b-2 ${currentStep === 2 ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30' : currentStep > 2 ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-400 dark:text-slate-500'}`}>
              ২. পণ্যের বিবরণ
            </div>
            <div className={`py-2.5 border-b-2 ${currentStep === 3 ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30' : currentStep > 3 ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-400 dark:text-slate-500'}`}>
              ৩. প্রিভিউ
            </div>
            <div className={`py-2.5 border-b-2 ${currentStep === 4 ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30' : 'border-transparent text-slate-400 dark:text-slate-500'}`}>
              ৪. প্যাকেজ ও জমা
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Post Submission Success View */}
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                বিজ্ঞাপনটি সফলভাবে জমা দেওয়া হয়েছে!
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                স্প্যাম ও ফেক বিজ্ঞাপন রোধে আমাদের এডমিন টিম বিজ্ঞাপনটি পরীক্ষা করছে। অনুমোদিত হওয়া মাত্রই সাইটে লাইভ দেখা যাবে।
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 text-left max-w-sm mx-auto space-y-1">
                <div><strong>বিজ্ঞাপনের শিরোনাম:</strong> {title}</div>
                <div><strong>নির্ধারিত মূল্য:</strong> ৳{price}</div>
                <div><strong>স্থান:</strong> {upazila}, {district}</div>
                <div><strong>স্ট্যাটাস:</strong> ⏳ Admin Review Pending</div>
              </div>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  বিজ্ঞাপন তালিকায় ফিরে যান
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Registration / Login or Verified User Profile */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {currentUser ? (
                    <div className="space-y-4">
                      {/* Verified User Profile Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
                            {currentUser.name[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                {currentUser.name}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                                <ShieldCheck className="w-3 h-3" />
                                ভেরিফাইড আইডি
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-300">
                              <span className="flex items-center gap-1 font-mono font-medium">
                                <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                {currentUser.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                {currentUser.email}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>আপনার এই সংরক্ষিত প্রোফাইল থেকে বিজ্ঞাপনটি প্রকাশিত হবে এবং আপনার ড্যাশবোর্ডে সংরক্ষিত থাকবে।</span>
                        </div>
                      </div>

                      {/* Display Contact Phone for this Ad */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          বিজ্ঞাপনের জন্য ক্রেতাদের সাথে যোগাযোগের ফোন নম্বর
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            placeholder={currentUser.phone}
                            className="w-full text-sm p-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                          />
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          ক্রেতারা এই নম্বরে ফোন বা এসএমএস করবেন। প্রয়োজনবোধে পরিবর্তন করতে পারেন।
                        </p>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          <span>পরবর্তী ধাপ (বিজ্ঞাপনের বিবরণ)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        নিরাপদ ও ভেরিফাইড লেনদেনের জন্য আপনার নাম ও মোবাইল নম্বর দিয়ে ওটিপি ভেরিফাই করুন।
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          আপনার পুরো নাম *
                        </label>
                        <input
                          type="text"
                          placeholder="যেমন: শাহিদুল ইসলাম"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          মোবাইল নম্বর (OTP ভেরিফিকেশনের জন্য) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            placeholder="01712345678"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className="flex-1 text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                          />
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl whitespace-nowrap cursor-pointer"
                          >
                            {isOtpSent ? 'পুনরায় পাঠান' : 'OTP পাঠান'}
                          </button>
                        </div>
                      </div>

                      {isOtpSent && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                              ওটিপি কোড দিন (সিমুলেশন কোড: 1234)
                            </span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">এসএমএস পাঠানো হয়েছে</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              placeholder="1234"
                              className="w-32 text-center text-lg font-mono font-bold p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 dark:text-white tracking-widest"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="px-4 py-2 bg-emerald-700 dark:bg-emerald-600 hover:bg-emerald-800 dark:hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>যাচাই সম্পন্ন করুন</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          ইমেইল ঠিকানা (ঐচ্ছিক / Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="example@mail.com"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          disabled={!userName || !userPhone}
                          onClick={() => {
                            if (!isPhoneVerified) {
                              setIsPhoneVerified(true);
                            }
                            setCurrentStep(2);
                          }}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer"
                        >
                          <span>পরবর্তী ধাপ</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 2: Ad Details Form */}
              {currentStep === 2 && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  
                  {/* Category & Subcategory */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ক্যাটাগরি *</label>
                      <select
                        value={categoryId}
                        onChange={(e) => {
                          setCategoryId(e.target.value);
                          const cat = CATEGORIES.find((c) => c.id === e.target.value);
                          if (cat) setSubcategory(cat.subcategories[0]);
                        }}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id} className="dark:bg-slate-800">{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">সাব-ক্যাটাগরি *</label>
                      <select
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {CATEGORIES.find((c) => c.id === categoryId)?.subcategories.map((sub) => (
                          <option key={sub} value={sub} className="dark:bg-slate-800">{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      বিজ্ঞাপনের শিরোনাম (Product Title) *
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: iPhone 13 128GB Midnight Black"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Price & Negotiable */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        মূল্য (৳ BDT) *
                      </label>
                      <input
                        type="number"
                        placeholder="যেমন: 45000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <input
                        type="checkbox"
                        id="negotiableCheck"
                        checked={negotiable}
                        onChange={(e) => setNegotiable(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <label htmlFor="negotiableCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                        দাম আলোচনা সাপেক্ষ
                      </label>
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">কন্ডিশন / পণ্যের অবস্থা *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(Object.keys(CONDITION_LABELS) as Condition[])
                        .filter((cond) => cond !== 'brand_new')
                        .map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => setCondition(cond)}
                          className={`p-2.5 text-xs rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            condition === cond
                              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{CONDITION_LABELS[cond]}</span>
                        </button>
                      ))}
                    </div>
                  </div>



                  {/* Location: Division -> District -> Upazila */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">বিভাগ *</label>
                      <select
                        value={division}
                        onChange={(e) => {
                          setDivision(e.target.value);
                          const div = BANGLADESH_LOCATIONS.find((d) => d.name === e.target.value);
                          if (div && div.districts.length > 0) {
                            setDistrict(div.districts[0].name);
                            setUpazila(div.districts[0].upazilas[0] || '');
                          }
                        }}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {BANGLADESH_LOCATIONS.map((d) => (
                          <option key={d.name} value={d.name} className="dark:bg-slate-800">{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">জেলা *</label>
                      <select
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          const dist = activeDivObj.districts.find((d) => d.name === e.target.value);
                          if (dist && dist.upazilas.length > 0) {
                            setUpazila(dist.upazilas[0]);
                          }
                        }}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {activeDivObj.districts.map((dist) => (
                          <option key={dist.name} value={dist.name} className="dark:bg-slate-800">{dist.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">উপজেলা / থানা *</label>
                      <select
                        value={upazila}
                        onChange={(e) => setUpazila(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        {activeDistObj.upazilas.map((u) => (
                          <option key={u} value={u} className="dark:bg-slate-800">{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Photo Upload Simulation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      পণ্যের আসল ছবি সংযুক্ত করুন (সর্বোচ্চ ৫টি ছবি) *
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-800 transition-colors w-28 sm:w-32 h-28 shrink-0">
                        <Camera className="w-6 h-6 text-slate-400" />
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">ছবি আপলোড</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {selectedPhoto ? (
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                          <img src={selectedPhoto} alt="Upload Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setSelectedPhoto('')}
                            className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                          ডিভাইস বা গুগল ড্রাইভ থেকে পণ্যের আসল ছবি সংযুক্ত করুন।
                        </div>
                      )}
                    </div>
                    {imageError && <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">{imageError}</div>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      বিস্তারিত বিবরণ (Description) *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="পণ্যটি কতদিন ব্যবহার করেছেন, কোনো সমস্যা আছে কি না, বক্স বা চার্জার আছে কি না ইত্যাদি বিস্তারিত লিখুন..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Step Buttons */}
                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>পূর্ববর্তী ধাপ</span>
                    </button>

                    <button
                      type="button"
                      disabled={!title || !price || !description}
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>প্রিভিউ দেখুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Preview */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ক্রেতারা আপনার বিজ্ঞাপনটি যেভাবে দেখতে পাবে তার লাইভ প্রিভিউ:
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/70 dark:bg-slate-800/70 space-y-3">
                    <div className="flex gap-4">
                      <div className="w-28 h-24 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                        {selectedPhoto ? (
                          <img src={selectedPhoto} alt="Ad Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                            ছবি দেওয়া হয়নি
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{subcategory}</span>
                          <span aria-hidden="true">·</span>
                          <span>{CONDITION_LABELS[condition]}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">{title}</h4>
                        <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
                          ৳{parseInt(price, 10).toLocaleString('bn-BD')}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{upazila}, {district}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                      <strong>বিবরণ:</strong> {description}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>বিক্রেতা: {userName} ({userPhone})</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">ভেরিফাইড ওটিপি</span>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>সংশোধন করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>প্যাকেজ নির্বাচন করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Package & Submission */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    আপনার বিজ্ঞাপন দ্রুত বিক্রি করতে প্রমোশনাল প্যাকেজ বেছে নিন অথবা ফ্রিতে পোস্ট করুন:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    
                    {/* Free Option */}
                    <div
                      onClick={() => {
                        setSelectedPackage('free');
                        setCompletedPayment(null);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPackage === 'free'
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-slate-900 dark:text-white text-xs">সাধারণ বিজ্ঞাপন</div>
                      <div className="text-base font-extrabold text-slate-800 dark:text-slate-100 my-1">ফ্রি (Free)</div>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-300 space-y-0.5">
                        <li>✓ স্ট্যান্ডার্ড লিস্টিং</li>
                        <li>✓ ৩০ দিন মেয়াদের বিজ্ঞাপন</li>
                      </ul>
                    </div>

                    {/* Featured ৳49 */}
                    <div
                      onClick={() => {
                        setSelectedPackage('featured');
                        setCompletedPayment(null);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPackage === 'featured'
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-amber-700 dark:text-amber-400 text-xs flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Featured</span>
                      </div>
                      <div className="text-base font-extrabold text-amber-900 dark:text-amber-300 my-1">৳৪৯ / ৭ দিন</div>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-300 space-y-0.5">
                        <li>✓ হোমপেজ ফিচার্ড স্লাইডার</li>
                        <li>✓ ৩ গুণ বেশি ভিউ ও কল</li>
                      </ul>
                    </div>

                    {/* Premium ৳99 */}
                    <div
                      onClick={() => {
                        setSelectedPackage('premium');
                        setCompletedPayment(null);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPackage === 'premium'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-indigo-700 dark:text-indigo-400 text-xs flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Premium</span>
                      </div>
                      <div className="text-base font-extrabold text-indigo-900 dark:text-indigo-300 my-1">৳৯৯ / ১৫ দিন</div>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-300 space-y-0.5">
                        <li>✓ ক্যাটাগরির শীর্ষে অবস্থান</li>
                        <li>✓ ৫ গুণ বেশি মেসেজ ও সাড়া</li>
                      </ul>
                    </div>

                    {/* Top Listing ৳199 */}
                    <div
                      onClick={() => {
                        setSelectedPackage('top');
                        setCompletedPayment(null);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPackage === 'top'
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-purple-700 dark:text-purple-400 text-xs flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5" />
                        <span>Top Listing</span>
                      </div>
                      <div className="text-base font-extrabold text-purple-900 dark:text-purple-300 my-1">৳১৯৯ / ৩০ দিন</div>
                      <ul className="text-[10px] text-slate-600 dark:text-slate-300 space-y-0.5">
                        <li>✓ সার্চের সর্বোচ্চ চূড়ায়</li>
                        <li>✓ রয়্যাল গোল্ডেন ক্রাউন ব্যাজ</li>
                      </ul>
                    </div>
                  </div>

                  {/* Payment section if paid package selected */}
                  {selectedPackage !== 'free' && (
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-slate-800 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>সরাসরি অ্যাপের ভেতর পেমেন্ট গেটওয়ে (In-App Gateway)</span>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">
                          ৳{selectedPackage === 'featured' ? 49 : selectedPackage === 'premium' ? 99 : 199}
                        </span>
                      </div>

                      {completedPayment ? (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div>
                              <div className="font-bold">
                                {completedPayment.method} গেটওয়ে দিয়ে পেমেন্ট সফল হয়েছে!
                              </div>
                              <div className="text-[11px] font-mono text-emerald-700/80 dark:text-emerald-400">
                                TrxID: {completedPayment.trx_id} • ৳{completedPayment.amount} পরিশোধিত
                              </div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            পরিশোধিত
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            বিকাশ, নগদ বা রকেট অ্যাকাউন্ট নম্বর ও ওটিপি দিয়ে সরাসরি অ্যাপের ভেতরে নিরাপদে পেমেন্ট সম্পন্ন করুন।
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsGatewayOpen(true)}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 via-orange-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>
                              বিকাশ / নগদ দিয়ে এখনই পেমেন্ট করুন (৳{selectedPackage === 'featured' ? 49 : selectedPackage === 'premium' ? 99 : 199})
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>পূর্ববর্তী</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer active:scale-98"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {selectedPackage !== 'free' && !completedPayment
                          ? 'পেমেন্ট ও বিজ্ঞাপন পোস্ট করুন'
                          : 'বিজ্ঞাপন চূড়ান্তভাবে জমা দিন'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* In-App Payment Gateway Modal for Post Ad */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        adTitle={title || 'নতুন বিজ্ঞাপন'}
        packageTier={selectedPackage === 'free' ? 'featured' : selectedPackage}
        packageName={
          selectedPackage === 'featured' 
            ? 'Featured (৳49 / 7 days)' 
            : selectedPackage === 'premium' 
            ? 'Premium (৳99 / 15 days)' 
            : 'Top Listing (৳199 / 30 days)'
        }
        amount={selectedPackage === 'featured' ? 49 : selectedPackage === 'premium' ? 99 : 199}
        userPhone={userPhone}
        onPaymentSuccess={handleGatewaySuccess}
      />
    </div>
  );
};
