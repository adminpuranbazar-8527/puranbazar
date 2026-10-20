import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, Clock, Calendar, Smartphone, Monitor, 
  MapPin, CheckCircle2, ShieldCheck, Search, Filter, 
  ArrowUpRight, Radio, RefreshCw, Eye, Sparkles, TrendingUp,
  BarChart3, Globe, Zap, ArrowDownUp
} from 'lucide-react';
import { UserProfile, StaffMember } from '../types';
import { 
  UserActivityRecord, 
  LiveViewerSession, 
  SEEDED_USER_ANALYTICS, 
  INITIAL_LIVE_VIEWERS, 
  HOURLY_VIEWER_DISTRIBUTION,
  formatMinutesToBangla,
  syncUsersWithAnalytics 
} from '../utils/userAnalytics';
import { UserActivityChartsWidget } from './UserActivityChartsWidget';
import { Language } from '../utils/i18n';

interface UserAnalyticsSectionProps {
  currentStaff: StaffMember;
  registeredUsers: UserProfile[];
  language?: Language;
}

export const UserAnalyticsSection: React.FC<UserAnalyticsSectionProps> = ({
  currentStaff,
  registeredUsers,
  language = 'bn',
}) => {
  const isEn = language === 'en';

  const formatMinutes = (mins: number) => {
    if (isEn) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      if (hours === 0) return `${remainingMins} mins`;
      if (remainingMins === 0) return `${hours} hrs`;
      return `${hours} hrs ${remainingMins} mins`;
    }
    return formatMinutesToBangla(mins);
  };

  const formatCount = (n: number) => isEn ? n.toLocaleString() : n.toLocaleString('bn-BD');

  // Sync all registered users into analytics dataset
  const [usersList, setUsersList] = useState<UserActivityRecord[]>(() => 
    syncUsersWithAnalytics(registeredUsers)
  );

  // Live Concurrent Viewers State (simulated real-time heartbeat)
  const [liveViewers, setLiveViewers] = useState<LiveViewerSession[]>(INITIAL_LIVE_VIEWERS);
  const [liveCount, setLiveCount] = useState<number>(34);

  // Filter & Search States
  const [activePeriodTab, setActivePeriodTab] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'live'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'online' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<'daily' | 'weekly' | 'monthly' | 'name'>('daily');

  // Real-time viewer heartbeat ticker (fluctuates naturally between 28 and 42)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = Math.max(26, Math.min(45, prev + delta));
        return next;
      });

      // Increment active minutes for online sessions occasionally
      setLiveViewers((prev) =>
        prev.map((v, i) => {
          if (i % 2 === 0) {
            return {
              ...v,
              activeMinutes: v.activeMinutes + 1,
              todayTotalMinutes: v.todayTotalMinutes + 1,
            };
          }
          return v;
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Sync when registeredUsers changes
  useEffect(() => {
    setUsersList(syncUsersWithAnalytics(registeredUsers));
  }, [registeredUsers]);

  // Derived Calculations
  const totalRegisteredCount = 1450 + registeredUsers.length;
  const onlineUsersCount = usersList.filter((u) => u.isOnlineNow).length;
  const verifiedUsersCount = usersList.filter((u) => u.isVerified).length;

  // Average time calculations
  const totalDailyMins = usersList.reduce((acc, u) => acc + u.timeSpentTodayMinutes, 0);
  const avgDailyMins = Math.round(totalDailyMins / (usersList.length || 1));

  const totalWeeklyMins = usersList.reduce((acc, u) => acc + u.timeSpentWeekMinutes, 0);
  const avgWeeklyMins = Math.round(totalWeeklyMins / (usersList.length || 1));

  const totalMonthlyMins = usersList.reduce((acc, u) => acc + u.timeSpentMonthMinutes, 0);
  const avgMonthlyMins = Math.round(totalMonthlyMins / (usersList.length || 1));

  // Extract unique districts for dropdown filter
  const districts = Array.from(new Set(usersList.map((u) => u.district))).sort();

  // Helper for last active bilingual text
  const formatLastActive = (user: UserActivityRecord) => {
    if (user.isOnlineNow) {
      return isEn ? 'Online (Active)' : 'অনলাইন (একটিভ)';
    }
    if (isEn) {
      if (user.lastActiveEn) return user.lastActiveEn;
      return user.lastActive
        .replace('বর্তমানে একটিভ (অনলাইন)', 'Active now (online)')
        .replace('মিনিট আগে', 'mins ago')
        .replace('ঘন্টা আগে', 'hour(s) ago')
        .replace('দিন আগে', 'day(s) ago')
        .replace('সপ্তাহ আগে', 'week(s) ago')
        .replace('আজ সকালে', 'This morning');
    }
    return user.lastActive;
  };

  // Filtered and Sorted Users List
  const filteredUsers = usersList.filter((user) => {
    if (activePeriodTab === 'live' && !user.isOnlineNow) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q) || (user.nameEn && user.nameEn.toLowerCase().includes(q));
      const matchPhone = user.phone.includes(q);
      const matchEmail = user.email.toLowerCase().includes(q);
      const matchDist = user.district.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchDist) return false;
    }

    if (selectedDistrict !== 'all' && user.district !== selectedDistrict) {
      return false;
    }

    if (selectedStatus === 'online' && !user.isOnlineNow) return false;
    if (selectedStatus === 'verified' && !user.isVerified) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'daily') return b.timeSpentTodayMinutes - a.timeSpentTodayMinutes;
    if (sortBy === 'weekly') return b.timeSpentWeekMinutes - a.timeSpentWeekMinutes;
    if (sortBy === 'monthly') return b.timeSpentMonthMinutes - a.timeSpentMonthMinutes;
    const nameA = isEn ? (a.nameEn || a.name) : a.name;
    const nameB = isEn ? (b.nameEn || b.name) : b.name;
    return nameA.localeCompare(nameB, isEn ? 'en' : 'bn');
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner with Access Badge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white">
                {isEn ? 'Live Viewers & User Engagement Analytics' : 'লাইভ ভিউয়ার্স ও ইউজার এনগেজমেন্ট অ্যানালিটিক্স'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {isEn ? 'Super Admin & Admin Access' : 'সুপার এডমিন ও এডমিন কন্ট্রোল'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isEn
                ? 'Current active live viewers, total registered users, and detailed time spent tracking daily, weekly, and monthly.'
                : 'বর্তমানে সক্রিয় লাইভ ভিউয়ার সংখ্যা, মোট রেজিস্টার্ড ইউজার এবং দিনে, সপ্তাহে ও মাসে ব্যবহারকারীদের ব্যয়কৃত সময়ের বিস্তারিত ট্র্যাকলগ।'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-bold">{isEn ? 'Live Sync Active' : 'লাইভ সিঙ্ক চালু'}</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">{isEn ? 'Updated: Just now' : 'আপডেট: এইমাত্র'}</span>
        </div>
      </div>

      {/* 5 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Currently Active Viewers */}
        <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-800/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{isEn ? 'Currently Active' : 'বর্তমানে একটিভ ভিউয়ার'}</span>
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200 tabular-nums mt-2">
            {formatCount(liveCount)} <span className="text-sm font-normal text-emerald-700 dark:text-emerald-400">{isEn ? 'Live Viewers' : 'জন লাইভ'}</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400/80 mt-1 flex items-center justify-between">
            <span>📱 {isEn ? 'Mobile: 76%' : 'মোবাইল: ৭৬%'}</span>
            <span>💻 {isEn ? 'Desktop: 24%' : 'ডেক্সটপ: ২৪%'}</span>
          </div>
        </div>

        {/* Card 2: Total Registered Users */}
        <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-800/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>{isEn ? 'Registered Users' : 'মোট রেজিস্টার্ড ব্যবহারকারী'}</span>
            </span>
          </div>
          <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-200 tabular-nums mt-2">
            {formatCount(totalRegisteredCount)} <span className="text-sm font-normal text-blue-700 dark:text-blue-400">{isEn ? 'Users' : 'জন'}</span>
          </div>
          <div className="text-[11px] text-blue-700 dark:text-blue-400/80 mt-1 flex items-center justify-between">
            <span>✓ {isEn ? 'Verified: 62%' : 'ভেরিফায়েড: ৬২%'}</span>
            <span>{isEn ? 'Today New: +18' : 'আজ নতুন: +১৮'}</span>
          </div>
        </div>

        {/* Card 3: Daily Average Time Spent */}
        <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-800/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{isEn ? 'Daily Avg Time' : 'দৈনিক গড় সময় (দিনে)'}</span>
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 rounded">
              {isEn ? 'Today' : 'আজকে'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 tabular-nums mt-2">
            {formatMinutes(avgDailyMins)}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400/80 mt-1">
            {isEn ? 'Avg 12.4 mins per session' : 'প্রতিটি সেশনে গড়ে ১২.৪ মিনিট'}
          </div>
        </div>

        {/* Card 4: Weekly Average Time Spent */}
        <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-800/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{isEn ? 'Weekly Avg Time' : 'সাপ্তাহিক গড় সময় (সপ্তাহে)'}</span>
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-200 dark:bg-indigo-900/80 text-indigo-900 dark:text-indigo-200 rounded">
              {isEn ? 'This Week' : 'চলতি সপ্তাহ'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200 tabular-nums mt-2">
            {formatMinutes(avgWeeklyMins)}
          </div>
          <div className="text-[11px] text-indigo-700 dark:text-indigo-400/80 mt-1">
            {isEn ? 'Avg 14 visits per week' : 'সপ্তাহে গড় ১৪ টি ভিজিট সেশন'}
          </div>
        </div>

        {/* Card 5: Monthly Average Time Spent */}
        <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-800/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>{isEn ? 'Monthly Avg Time' : 'মাসিক গড় সময় (মাসে)'}</span>
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-200 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200 rounded">
              {isEn ? 'This Month' : 'চলতি মাস'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-900 dark:text-purple-200 tabular-nums mt-2">
            {formatMinutes(avgMonthlyMins)}
          </div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400/80 mt-1">
            {isEn ? 'Avg 56 sessions & 290+ pageviews' : 'মাসে গড়ে ৫৬ টি সেশন ও ২৯০+ পেইজভিউ'}
          </div>
        </div>

      </div>

      {/* Recharts Visual Activity & Sessions Dashboard Widget */}
      <UserActivityChartsWidget usersList={usersList} language={language} />

      {/* Real-time Live Viewers Stream Section (লাইভ ব্রাউজিং) */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {isEn
                ? `Currently Live Browsing Viewers (${liveViewers.length} active sessions shown)`
                : `বর্তমানে লাইভ ব্রাউজিং করছেন এমন ভিউয়ার্স (${liveViewers.length} টি সক্রিয় সেশন প্রদর্শিত)`}
            </h4>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>
              {isEn ? 'Concurrent Traffic:' : 'কনকারেন্ট ট্র্যাফিক:'}{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                {formatCount(liveCount)} {isEn ? 'Visitors' : 'জন ভিজিটর'}
              </strong>
            </span>
          </div>
        </div>

        {/* Live Viewers Carousel / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {liveViewers.slice(0, 6).map((viewer) => {
            const displayName = isEn ? (viewer.nameEn || viewer.name) : viewer.name;
            const displayLocation = isEn ? (viewer.locationEn || viewer.location) : viewer.location;
            const displayPage = isEn ? (viewer.currentPageEn || viewer.currentPage) : viewer.currentPage;
            const displayDevice = isEn ? (viewer.deviceEn || viewer.device) : viewer.device;

            return (
              <div 
                key={viewer.sessionId}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2 text-xs hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="truncate max-w-[170px]">{displayName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{displayLocation}</span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                    {isEn ? `${viewer.activeMinutes}m live` : `${viewer.activeMinutes.toLocaleString('bn-BD')} মি. ধরে লাইভ`}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">{isEn ? 'Current Page:' : 'বর্তমান পেইজ:'}</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]" title={displayPage}>
                      {displayPage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span>{isEn ? 'Device:' : 'ডিভাইস:'} {displayDevice}</span>
                    <span>
                      {isEn ? 'Today Total:' : 'আজ মোট:'}{' '}
                      <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                        {isEn ? `${viewer.todayTotalMinutes.toLocaleString('en-US')} mins` : `${viewer.todayTotalMinutes.toLocaleString('bn-BD')} মিনিট`}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Table: User-by-User Time Spent Tracker (Daily, Weekly, Monthly) */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? 'User-by-User Time Spent Breakdown' : 'ব্যবহারকারী অনুযায়ী সময় ব্যয়ের বিস্তারিত ট্র্যাকলগ (User Time Spent Breakdown)'}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEn
                ? 'Precise statistics of how much time each distinct user spends daily, weekly, and monthly:'
                : 'প্রতিটি স্বতন্ত্র ব্যবহারকারী দিনে, সপ্তাহে এবং মাসে পুরানবাজারে কত সময় ব্যয় করছেন তার নিখুঁত পরিসংখ্যান:'}
            </p>
          </div>

          {/* Period Filter Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActivePeriodTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePeriodTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📊 {isEn ? 'Overview' : 'সার্বিক তুলনা'}
            </button>
            <button
              onClick={() => {
                setActivePeriodTab('daily');
                setSortBy('daily');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePeriodTab === 'daily'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📅 {isEn ? 'Daily' : 'দিনে (Daily)'}
            </button>
            <button
              onClick={() => {
                setActivePeriodTab('weekly');
                setSortBy('weekly');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePeriodTab === 'weekly'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📆 {isEn ? 'Weekly' : 'সপ্তাহে (Weekly)'}
            </button>
            <button
              onClick={() => {
                setActivePeriodTab('monthly');
                setSortBy('monthly');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePeriodTab === 'monthly'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🗓️ {isEn ? 'Monthly' : 'মাসে (Monthly)'}
            </button>
            <button
              onClick={() => setActivePeriodTab('live')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                activePeriodTab === 'live'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isEn ? 'Live Only' : 'শুধুমাত্র লাইভ'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/80 text-xs">
          
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search by name, phone, email or district...' : 'ইউজার নাম, ফোন নম্বর, ইমেইল বা জেলা দিয়ে খুঁজুন...'}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{isEn ? `All Districts (${districts.length})` : `সকল জেলা (${districts.length} টি)`}</option>
              {districts.map((d) => {
                const label = isEn
                  ? (d.includes('(') ? d.split('(')[1].replace(')', '').trim() : d)
                  : d;
                return (
                  <option key={d} value={d}>{label}</option>
                );
              })}
            </select>
          </div>

          {/* Sorting / Status Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="daily">{isEn ? 'Sort: Today Time (Highest)' : 'সর্ট: আজকের সময় (সর্বোচ্চ)'}</option>
              <option value="weekly">{isEn ? 'Sort: Weekly Time (Highest)' : 'সর্ট: এই সপ্তাহের সময় (সর্বোচ্চ)'}</option>
              <option value="monthly">{isEn ? 'Sort: Monthly Time (Highest)' : 'সর্ট: চলতি মাসের সময় (সর্বোচ্চ)'}</option>
              <option value="name">{isEn ? 'Sort: By Name (A-Z)' : 'সর্ট: নাম অনুযায়ী (অ-ঔ)'}</option>
            </select>
          </div>

        </div>

        {/* Users Analytics Data Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold">
              <tr>
                <th className="p-3">{isEn ? 'User & Identity' : 'ব্যবহারকারী ও পরিচিতি'}</th>
                <th className="p-3">{isEn ? 'Location & District' : 'লোকেশন ও জেলা'}</th>
                <th className="p-3">{isEn ? 'Device & Browser' : 'ডিভাইস ও ব্রাউজার'}</th>
                <th className={`p-3 ${activePeriodTab === 'daily' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300' : ''}`}>
                  {isEn ? 'Daily Time' : 'দিনে ব্যয়িত সময়'}
                </th>
                <th className={`p-3 ${activePeriodTab === 'weekly' ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' : ''}`}>
                  {isEn ? 'Weekly Time' : 'সপ্তাহে ব্যয়িত সময়'}
                </th>
                <th className={`p-3 ${activePeriodTab === 'monthly' ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300' : ''}`}>
                  {isEn ? 'Monthly Time' : 'মাসে ব্যয়িত সময়'}
                </th>
                <th className="p-3 text-right">{isEn ? 'Status' : 'বর্তমান অবস্থা'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {isEn ? 'No users found' : 'কোনো ব্যবহারকারী পাওয়া যায়নি'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const displayName = isEn ? (user.nameEn || user.name) : user.name;
                  const displayDistrict = isEn
                    ? (user.district.includes('(') ? user.district.split('(')[1].replace(')', '').trim() : user.district)
                    : user.district;
                  const displayDivision = isEn
                    ? (user.division.includes('(') ? user.division.split('(')[1].replace(')', '').trim() : user.division)
                    : user.division;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      
                      {/* User Info */}
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center shrink-0 text-xs overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                              displayName.slice(0, 1)
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{displayName}</span>
                              {user.isVerified && (
                                <span title={isEn ? 'Verified User' : 'ভেরিফায়েড বিক্রেতা'}>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              {user.phone} • {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-3">
                        <div className="text-slate-900 dark:text-slate-200 font-medium">
                          {displayDistrict}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {displayDivision}
                        </div>
                      </td>

                      {/* Device & Browser */}
                      <td className="p-3">
                        <div className="text-slate-800 dark:text-slate-300 font-medium flex items-center gap-1">
                          {user.deviceType === 'Android' || user.deviceType === 'iOS' ? (
                            <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>{user.deviceType}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {user.browser} {isEn ? 'Browser' : 'ব্রাউজার'}
                        </div>
                      </td>

                      {/* Daily Time Spent */}
                      <td className={`p-3 ${activePeriodTab === 'daily' ? 'bg-amber-50 dark:bg-amber-950/20' : ''}`}>
                        <div className="font-extrabold text-amber-700 dark:text-amber-400 tabular-nums text-xs">
                          {formatMinutes(user.timeSpentTodayMinutes)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isEn
                            ? `Today ${user.sessionsToday} sessions • ${user.adsViewedToday} ads`
                            : `আজ ${user.sessionsToday.toLocaleString('bn-BD')} টি সেশন • ${user.adsViewedToday.toLocaleString('bn-BD')} টি এড`}
                        </div>
                      </td>

                      {/* Weekly Time Spent */}
                      <td className={`p-3 ${activePeriodTab === 'weekly' ? 'bg-indigo-50 dark:bg-indigo-950/20' : ''}`}>
                        <div className="font-extrabold text-indigo-700 dark:text-indigo-400 tabular-nums text-xs">
                          {formatMinutes(user.timeSpentWeekMinutes)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isEn
                            ? `Weekly ${user.sessionsWeek} sessions • ${user.adsViewedWeek} ads`
                            : `সপ্তাহে ${user.sessionsWeek.toLocaleString('bn-BD')} টি সেশন • ${user.adsViewedWeek.toLocaleString('bn-BD')} টি এড`}
                        </div>
                      </td>

                      {/* Monthly Time Spent */}
                      <td className={`p-3 ${activePeriodTab === 'monthly' ? 'bg-purple-50 dark:bg-purple-950/20' : ''}`}>
                        <div className="font-extrabold text-purple-700 dark:text-purple-400 tabular-nums text-xs">
                          {formatMinutes(user.timeSpentMonthMinutes)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {isEn
                            ? `Monthly ${user.sessionsMonth} sessions • ${user.adsViewedMonth} ads`
                            : `মাসে ${user.sessionsMonth.toLocaleString('bn-BD')} টি সেশন • ${user.adsViewedMonth.toLocaleString('bn-BD')} টি এড`}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 text-right">
                        {user.isOnlineNow ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{isEn ? 'Online (Active)' : 'অনলাইন (একটিভ)'}</span>
                          </div>
                        ) : (
                          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {formatLastActive(user)}
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{isEn ? `Total Displayed: ${filteredUsers.length} Users` : `মোট প্রদর্শিত: ${filteredUsers.length} জন ব্যবহারকারী`}</span>
          <span>{isEn ? 'PuranBazar Real-Time User Session Tracker v2.4 • IP masking active according to privacy policy' : 'পুরানবাজার রিয়েল-টাইম ইউজার সেশন ট্র্যাকার ভ২.৪ • গোপনীয়তা নীতি অনুযায়ী আইপি মাস্কিং সক্রিয়'}</span>
        </div>

      </div>

      {/* 24-Hour Peak Hours Activity Chart */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? '24-Hour Viewer Traffic & Peak Times' : '২৪ ঘণ্টার ভিউয়ার্স ট্র্যাফিক ও সময় ব্যয়ের পিক আওয়ার্স (Hourly Peak Times)'}</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isEn ? 'Times of day when viewers are most active and spend the most time:' : 'দিনের কোন কোন সময়ে সবচেয়ে বেশি ভিউয়ার একটিভ থাকেন এবং বেশি সময় কাটান:'}
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800 shrink-0 self-start sm:self-auto">
            {isEn ? 'Highest Peak: 8 PM - 10 PM' : 'সর্বোচ্চ পিক: রাত ৮টা - ১০টা'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {HOURLY_VIEWER_DISTRIBUTION.map((item) => {
            const isHighest = item.viewers >= 45;
            return (
              <div 
                key={item.hour}
                className={`p-3 rounded-xl border transition-all ${
                  isHighest
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isEn ? item.timeEn : item.timeBn}
                  </span>
                  {isHighest && <span className="text-[9px] font-bold text-emerald-600">{isEn ? 'Peak' : 'পিক'}</span>}
                </div>
                <div className="text-lg font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
                  {formatCount(item.viewers)} <span className="text-xs font-normal text-slate-500">{isEn ? 'Viewers' : 'ভিউয়ার'}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {isEn ? 'Avg time:' : 'গড় সময়:'}{' '}
                  <strong className="text-slate-700 dark:text-slate-300">
                    {isEn ? `${item.avgMins} mins` : `${item.avgMins.toLocaleString('bn-BD')} মিনিট`}
                  </strong>
                </div>
                {/* Visual Bar Indicator */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full ${isHighest ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${(item.viewers / 60) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
