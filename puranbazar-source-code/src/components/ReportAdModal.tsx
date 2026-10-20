import React, { useState } from 'react';
import { X, AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import { Ad, AdReport } from '../types';

interface ReportAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad | null;
  onSubmitReport: (report: AdReport) => void;
}

export const ReportAdModal: React.FC<ReportAdModalProps> = ({
  isOpen,
  onClose,
  ad,
  onSubmitReport
}) => {
  const [reason, setReason] = useState<AdReport['reason']>('fake_product');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !ad) return null;

  const reasonsList: { key: AdReport['reason']; label: string; desc: string }[] = [
    { key: 'fake_product', label: 'ভুয়া বা নকল পণ্য (Fake product)', desc: 'পণ্যের ছবি বা ব্র্যান্ড আসল নয়' },
    { key: 'scam', label: 'প্রতারণা বা জালিয়াতির চেষ্টা (Scam)', desc: 'অগ্রিম টাকা চাওয়া বা ডেলিভারি প্রতারণা' },
    { key: 'wrong_information', label: 'ভুল বা বিভ্রান্তিকর তথ্য (Wrong info)', desc: 'মূল্য, মডেল বা লোকেশন ভুল দেওয়া' },
    { key: 'duplicate_ad', label: 'একই পণ্যের একাধিক বিজ্ঞাপন (Duplicate)', desc: 'বারবার একই পোস্ট স্প্যাম করা হয়েছে' },
    { key: 'prohibited_content', label: 'নিষিদ্ধ বা অবৈধ সামগ্রী (Prohibited)', desc: 'আইনত নিষিদ্ধ কোনো সামগ্রী বা অনুপযুক্ত কনটেন্ট' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const newReport: AdReport = {
      id: `rep-${Date.now()}`,
      ad_id: ad.id,
      ad_title: ad.title,
      reporter_name: reporterName || 'সচেতন ক্রেতা',
      reporter_phone: reporterPhone || '01XXXXXXXXX',
      reason,
      details,
      created_at: '২৩ সেপ্টেম্বর ২০২৬',
      status: 'pending'
    };

    onSubmitReport(newReport);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/40">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              বিজ্ঞাপনের বিরুদ্ধে অভিযোগ জানান
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">আপনার অভিযোগটি গৃহীত হয়েছে</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              ধন্যবাদ। পুরানবাজার কমিউনিটিকে নিরাপদ ও স্বচ্ছ রাখতে আমাদের এডমিন টিম এই বিজ্ঞাপনটি জরুরি ভিত্তিতে তদন্ত করবে।
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              অভিযুক্ত বিজ্ঞাপন: <strong className="text-slate-800 dark:text-slate-200">{ad.title}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                অভিযোগের কারণ বেছে নিন:
              </label>
              <div className="space-y-1.5">
                {reasonsList.map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      reason === item.key
                        ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/40 dark:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={reason === item.key}
                      onChange={() => setReason(item.key)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                বিস্তারিত বিবরণ (কী ঘটেছে?) *
              </label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="যেমন: বিক্রেতা আগেই ৫০০০ টাকা বিকাশ পাঠাতে বলছে, কিংবা ছবি অন্য সাইট থেকে চুরি করা..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">আপনার নাম</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="নাম (ঐচ্ছিক)"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">আপনার মোবাইল</label>
                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={!details.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                অভিযোগ জমা দিন
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
