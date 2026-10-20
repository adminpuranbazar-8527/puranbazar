import React, { useState } from 'react';
import { ShieldAlert, X, KeyRound, AlertCircle } from 'lucide-react';
import { StaffMember } from '../types';
import { Language } from '../utils/i18n';

interface SecurityPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember;
  actionTitle: string;
  actionDetails: string;
  onConfirm: () => void;
  language?: Language;
}

export const SecurityPinModal: React.FC<SecurityPinModalProps> = ({
  isOpen,
  onClose,
  staff,
  actionTitle,
  actionDetails,
  onConfirm,
  language = 'bn',
}) => {
  const isEn = language === 'en';
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() !== staff.securityPin) {
      setError(isEn ? 'Incorrect Security PIN! Please try again.' : 'ভুল সিকিউরিটি পিন (Security PIN)! পুনরায় চেষ্টা করুন।');
      return;
    }

    onConfirm();
    setPin('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-2xl max-w-sm w-full border border-rose-300 dark:border-rose-900/60 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>{isEn ? 'High-Risk Action Confirmation' : 'উচ্চ-ঝুঁকি নিরাপত্তা নিশ্চিতকরণ'}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900 text-slate-500 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleVerify} className="p-5 space-y-4 text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{actionTitle}</div>
            <div className="text-slate-600 dark:text-slate-300 text-xs mt-1 leading-relaxed">
              {actionDetails}
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px]">
            {isEn
              ? 'To protect against unauthorized deletion or tampering, please enter your 6-digit staff Security PIN.'
              : 'হ্যাক বা অননুমোদিত মুছে ফেলা রোধ করতে আপনার কর্মকর্তা ৬-সংখ্যার সিকিউরিটি পিন (Security PIN) প্রদান করা আবশ্যক।'}
          </div>

          {error && (
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-lg flex items-center gap-1.5 font-semibold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                {isEn ? 'Enter Security PIN:' : 'সিকিউরিটি পিন প্রবেশ করান:'}
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                ({isEn ? 'Demo PIN:' : 'ডেমো পিন:'} {staff.securityPin})
              </span>
            </div>

            <div className="relative">
              <input
                type="password"
                maxLength={6}
                autoFocus
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full tracking-widest text-center text-lg font-mono py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold cursor-pointer"
            >
              {isEn ? 'Cancel' : 'বাতিল'}
            </button>
            <button
              type="submit"
              disabled={pin.length < 4}
              className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Confirm' : 'নিশ্চিত করুন'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
