import React, { useState } from 'react';
import { X, Send, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { Ad } from '../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad | null;
}

interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  time: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  ad
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'seller',
      text: 'আসসালামু আলাইকুম! পণ্যটি এখনো স্টকে আছে। আপনার কোনো জানার থাকলে বলুন।',
      time: '১০:৩০ AM'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen || !ad) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `${Date.now()}`,
      sender: 'buyer',
      text: inputText.trim(),
      time: '১০:৩২ AM'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated automated seller reply after 1s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now() + 1}`,
          sender: 'seller',
          text: 'ধন্যবাদ মেসেজের জন্য! সরাসরি দেখতে চাইলে স্থান ও সময় নির্ধারণ করতে পারি। কোনো অগ্রিম পেমেন্ট নেওয়া হয় না।',
          time: '১০:৩৩ AM'
        }
      ]);
    }, 1000);
  };

  const quickQuestions = [
    'পণ্যটি কি এখনো পাওয়া যাবে?',
    'দাম কিছুটা কমানো সম্ভব?',
    'পণ্যটির অরিজিনাল ক্যাশ মেমো বা বক্স আছে কি?'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {ad.seller_name.slice(0, 1)}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                <span>{ad.seller_name}</span>
                {ad.seller_verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">সক্রিয় আছেন (Online)</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product mini banner */}
        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <img src={ad.images[0]} alt={ad.title} className="w-12 h-12 rounded-lg object-cover bg-white dark:bg-slate-700 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{ad.title}</div>
            <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
              ৳{ad.price.toLocaleString('bn-BD')}
            </div>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>সতর্কতা: পণ্য সামনাসামনি দেখার পূর্বে কখনোই কোনো অগ্রিম টাকা প্রদান করবেন না।</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'buyer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'buyer'
                    ? 'bg-emerald-600 text-white rounded-tr-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex gap-1.5 whitespace-nowrap">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setInputText(q);
              }}
              className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="আপনার মেসেজ লিখুন..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
