import React, { useState } from 'react';
import { 
  X, Sparkles, Crown, Zap, ShieldCheck, CheckCircle2, 
  ArrowRight, Flame, Check, CreditCard
} from 'lucide-react';
import { Ad, FeaturedPayment, UserProfile } from '../types';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { handleImageError, getAdImageWithFallback } from '../utils/imageFallback';

interface BoostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad | null;
  currentUser: UserProfile | null;
  onBoostSuccess: (adId: string, newTier: 'featured' | 'premium' | 'top', payment: FeaturedPayment) => void;
}

export const BoostAdModal: React.FC<BoostAdModalProps> = ({
  isOpen,
  onClose,
  ad,
  currentUser,
  onBoostSuccess,
}) => {
  const [selectedTier, setSelectedTier] = useState<'featured' | 'premium' | 'top'>('featured');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen || !ad) return null;

  const packages = [
    {
      tier: 'featured' as const,
      name: 'Featured (ফিচার্ড)',
      price: 49,
      duration: '৭ দিন',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      badgeColor: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200',
      activeRing: 'ring-2 ring-amber-500 border-amber-500',
      features: [
        'হোমপেজে বিশেষ ফিচার্ড ডিসপ্লে',
        '৩ গুণ বেশি ভিউ ও দ্রুত বিক্রি',
        'হলুদ স্পেশাল ব্যাজ'
      ],
      popular: false
    },
    {
      tier: 'premium' as const,
      name: 'Premium (প্রিমিয়াম)',
      price: 99,
      duration: '১৫ দিন',
      icon: <Zap className="w-5 h-5 text-indigo-500" />,
      badgeColor: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200',
      activeRing: 'ring-2 ring-indigo-500 border-indigo-500',
      features: [
        'ক্যাটাগরির শীর্ষ অবস্থানে বিজ্ঞাপন',
        '৫ গুণ বেশি ভিউ ও মেসেজ',
        'হাইলাইটেড প্রিমিয়াম কার্ড'
      ],
      popular: true
    },
    {
      tier: 'top' as const,
      name: 'Top Listing (টপ লিস্টিং)',
      price: 199,
      duration: '৩০ দিন',
      icon: <Crown className="w-5 h-5 text-purple-500" />,
      badgeColor: 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200',
      activeRing: 'ring-2 ring-purple-500 border-purple-500',
      features: [
        'সার্চ রেজাল্ট ও ফিডের সর্বোচ্চ চূড়ায়',
        '১০ গুণ বেশি ক্রেতা রিচ',
        'রয়্যাল গোল্ডেন ক্রাউন ব্যাজ'
      ],
      popular: false
    }
  ];

  const currentPkg = packages.find((p) => p.tier === selectedTier) || packages[0];

  const handleStartPayment = () => {
    setIsGatewayOpen(true);
  };

  const handleGatewaySuccess = (payment: FeaturedPayment) => {
    setIsGatewayOpen(false);
    onBoostSuccess(ad.id, selectedTier, payment);
    setSuccessNotice(`অভিনন্দন! আপনার বিজ্ঞাপনটি '${currentPkg.name}' প্যাকেজে সফলভাবে বুস্ট করা হয়েছে।`);
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-45 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0">
                  <Flame className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg leading-tight">
                    বিজ্ঞাপন বুস্ট ও ফিচার্ড করুন
                  </h3>
                  <p className="text-xs text-emerald-100">
                    কম খরচে সরাসরি বিকাশ / নগদ পেমেন্টে মুহূর্তেই বেশি ক্রেতা পান
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Ad Info Card */}
            <div className="mt-4 p-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <img
                src={getAdImageWithFallback(ad.images, ad.category_id)}
                alt={ad.title}
                onError={(e) => handleImageError(e, ad.category_id)}
                className="w-12 h-12 rounded-xl object-cover border border-white/30 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                  {ad.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-emerald-200">
                  <span>মূল্য: ৳{ad.price.toLocaleString('bn-BD')}</span>
                  <span>•</span>
                  <span>
                    বর্তমান অবস্থা: {ad.featured_tier === 'none' ? 'ফ্রি লিস্টিং' : ad.featured_tier.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {successNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                আপনার পছন্দের প্রমোশন প্যাকেজ নির্বাচন করুন:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.tier}
                    onClick={() => setSelectedTier(pkg.tier)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedTier === pkg.tier
                        ? `${pkg.activeRing} bg-slate-50 dark:bg-slate-800/80 shadow-md`
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                        জনপ্রিয়
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                          {pkg.icon}
                        </span>
                        {selectedTier === pkg.tier && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 dark:text-white mt-2">
                        {pkg.name}
                      </h5>

                      <div className="mt-1">
                        <span className="text-xl font-black text-slate-900 dark:text-white font-sans">
                          ৳{pkg.price}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                          / {pkg.duration}
                        </span>
                      </div>
                    </div>

                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-600 text-xs shrink-0">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary & CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800/80 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  নির্বাচিত প্যাকেজ: <span className="text-emerald-700 dark:text-emerald-400">{currentPkg.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  বিকাশ, নগদ বা রকেট দিয়ে সরাসরি অ্যাপের ভেতরে পেমেন্ট সম্পন্ন হবে
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="text-xs text-slate-400 block -mb-1">মোট ফি</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-sans">
                  ৳{currentPkg.price}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartPayment}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>বিকাশ / নগদ দিয়ে সরাসরি পেমেন্ট করুন (৳{currentPkg.price})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>১০০% নিরাপদ ট্রানজেকশন • পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই বিজ্ঞাপন বুস্ট হবে</span>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded In-App Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        adTitle={ad.title}
        adId={ad.id}
        packageTier={selectedTier}
        packageName={`${currentPkg.name} (৳${currentPkg.price} / ${currentPkg.duration})`}
        amount={currentPkg.price}
        userPhone={currentUser?.phone || ad.seller_phone}
        onPaymentSuccess={handleGatewaySuccess}
      />
    </>
  );
};
