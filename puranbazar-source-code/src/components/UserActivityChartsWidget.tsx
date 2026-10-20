import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { 
  TrendingUp, BarChart3, Calendar, Clock, Activity, 
  Layers, CheckCircle2, Sparkles, Filter, Users, ArrowUpRight
} from 'lucide-react';
import { 
  DAILY_SESSIONS_TREND, 
  WEEKLY_SESSIONS_TREND, 
  MONTHLY_SESSIONS_TREND, 
  CATEGORY_TIME_SPENT_COMPARISON,
  UserActivityRecord,
  formatMinutesToBangla
} from '../utils/userAnalytics';
import { Language } from '../utils/i18n';

interface UserActivityChartsWidgetProps {
  usersList: UserActivityRecord[];
  language?: Language;
}

export const UserActivityChartsWidget: React.FC<UserActivityChartsWidgetProps> = ({ 
  usersList,
  language = 'bn',
}) => {
  const isEn = language === 'en';

  // Line Chart Period Selector: 'daily' | 'weekly' | 'monthly'
  const [lineChartPeriod, setLineChartPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Comparative Bar Chart Mode: 'category' | 'top_users'
  const [barChartMode, setBarChartMode] = useState<'category' | 'top_users'>('category');

  interface BarChartItem {
    label: string;
    fullName?: string;
    dailyMins: number;
    weeklyHours: number;
    monthlyHours: number;
    district?: string;
  }

  // Bilingual data mapping for line charts
  const dailyData = DAILY_SESSIONS_TREND.map((d) => ({
    ...d,
    displayDay: isEn ? d.dayEn : d.day,
    displayDate: isEn ? d.dateEn : d.date,
  }));

  const weeklyData = WEEKLY_SESSIONS_TREND.map((w) => ({
    ...w,
    displayWeek: isEn ? w.weekEn : w.week,
    displayPeriod: isEn ? w.periodEn : w.period,
  }));

  const monthlyData = MONTHLY_SESSIONS_TREND.map((m) => ({
    ...m,
    displayMonth: isEn ? m.monthEn : m.month,
  }));

  const categoryBarData: BarChartItem[] = CATEGORY_TIME_SPENT_COMPARISON.map((c) => ({
    label: isEn ? c.categoryEn : c.category,
    fullName: isEn ? c.categoryEn : c.category,
    dailyMins: c.dailyMins,
    weeklyHours: c.weeklyHours,
    monthlyHours: c.monthlyHours,
  }));

  const topUsersBarData: BarChartItem[] = usersList
    .slice(0, 7)
    .map((u) => {
      const displayName = isEn ? (u.nameEn || u.name) : u.name;
      const displayDistrict = isEn
        ? (u.district.includes('(') ? u.district.split('(')[1].replace(')', '').trim() : u.district)
        : u.district;
      return {
        label: displayName.split(' ')[0] || displayName,
        fullName: displayName,
        dailyMins: u.timeSpentTodayMinutes,
        weeklyHours: Number((u.timeSpentWeekMinutes / 60).toFixed(1)),
        monthlyHours: Number((u.timeSpentMonthMinutes / 60).toFixed(1)),
        district: displayDistrict,
      };
    });

  const currentBarData = barChartMode === 'category' ? categoryBarData : topUsersBarData;

  // Custom Tooltip for Line Chart
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 font-sans">
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between gap-4">
            <span>{label}</span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {isEn ? 'Active Session Data' : 'সক্রিয় সেশন ডাটা'}
            </span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold font-mono text-white">
                {isEn ? entry.value.toLocaleString('en-US') : entry.value.toLocaleString('bn-BD')} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Comparative Bar Chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 font-sans">
          <div className="font-bold text-amber-400 border-b border-slate-700 pb-1 flex items-center justify-between gap-4">
            <span>{dataPoint?.fullName || label}</span>
            {dataPoint?.district && (
              <span className="text-[10px] text-slate-400 font-normal">{dataPoint.district}</span>
            )}
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`bar-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold font-mono text-white">
                {entry.dataKey === 'dailyMins'
                  ? (isEn ? `${entry.value.toLocaleString('en-US')} mins` : `${entry.value.toLocaleString('bn-BD')} মিনিট`)
                  : (isEn ? `${entry.value.toLocaleString('en-US')} hrs` : `${entry.value.toLocaleString('bn-BD')} ঘন্টা`)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. LINE CHART: ACTIVE USER SESSIONS (DAILY, WEEKLY, MONTHLY)             */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isEn ? 'Active User Sessions Line Chart' : 'সক্রিয় ইউজার সেশন ট্রেন্ড (Active User Sessions Line Chart)'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Daily, weekly and monthly browsing sessions and unique user stats' : 'দিনে, সপ্তাহে ও মাসে ব্যবহারকারীদের ব্রাউজিং সেশন ও অনন্য ইউজারের পরিসংখ্যান'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeframe Selector Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setLineChartPeriod('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                lineChartPeriod === 'daily'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📅 {isEn ? 'Daily' : 'দৈনিক (Daily Trend)'}
            </button>
            <button
              onClick={() => setLineChartPeriod('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                lineChartPeriod === 'weekly'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📆 {isEn ? 'Weekly' : 'সাপ্তাহিক (Weekly Trend)'}
            </button>
            <button
              onClick={() => setLineChartPeriod('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                lineChartPeriod === 'monthly'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🗓️ {isEn ? 'Monthly' : 'মাসিক (Monthly Trend)'}
            </button>
          </div>
        </div>

        {/* Dynamic Line Chart */}
        <div className="w-full h-72 sm:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {lineChartPeriod === 'daily' ? (
              <LineChart data={dailyData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis 
                  dataKey="displayDay" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(val) => isEn ? val.toLocaleString('en-US') : val.toLocaleString('bn-BD')}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name={isEn ? "Total Active Sessions" : "মোট সক্রিয় সেশন"}
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, fill: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueUsers"
                  name={isEn ? "Unique Users" : "অনন্য ব্যবহারকারী (Users)"}
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            ) : lineChartPeriod === 'weekly' ? (
              <LineChart data={weeklyData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis 
                  dataKey="displayWeek" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(val) => isEn ? val.toLocaleString('en-US') : val.toLocaleString('bn-BD')}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name={isEn ? "Weekly Total Sessions" : "সাপ্তাহিক মোট সেশন"}
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, fill: '#4f46e5' }}
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  name={isEn ? "Weekly Active Users" : "সাপ্তাহিক সক্রিয় ইউজার"}
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#db2777' }}
                />
              </LineChart>
            ) : (
              <LineChart data={monthlyData} margin={{ top: 10, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis 
                  dataKey="displayMonth" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toLocaleString(isEn ? 'en-US' : 'bn-BD')}k` : val.toLocaleString(isEn ? 'en-US' : 'bn-BD'))}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  name={isEn ? "Monthly Total Sessions" : "মাসিক মোট সেশন"}
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, fill: '#7c3aed' }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  name={isEn ? "Monthly Active Users" : "মাসিক সক্রিয় ব্যবহারকারী"}
                  stroke="#10b981"
                  strokeWidth={2.5}
                  strokeDasharray="3 3"
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#059669' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Quick Insights Below Line Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/80 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              {isEn ? 'Peak Daily Sessions:' : 'সর্বোচ্চ দৈনিক সেশন:'}
            </span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
              {isEn ? '1,140 (Today)' : '১,১৪০ টি (আজ)'}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              {isEn ? 'Peak Weekly Sessions:' : 'সর্বোচ্চ সাপ্তাহিক সেশন:'}
            </span>
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
              {isEn ? '7,250 (This Week)' : '৭,২৫০ টি (চলতি সপ্তাহ)'}
            </strong>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              {isEn ? 'Peak Monthly Sessions:' : 'সর্বোচ্চ মাসিক সেশন:'}
            </span>
            <strong className="text-purple-600 dark:text-purple-400 font-bold">
              {isEn ? '54,800 (September)' : '৫৪,৮০০ টি (সেপ্টেম্বর)'}
            </strong>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. COMPARATIVE BAR CHART: TIME SPENT ON PLATFORM                         */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs space-y-4">
        
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isEn ? 'Comparative Bar Chart: Time Spent on Platform' : 'প্ল্যাটফর্মে সময় ব্যয়ের তুলনামূলক চার্ট (Comparative Bar Chart: Time Spent)'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEn ? 'Direct comparison of user time spent daily (mins), weekly (hrs) and monthly (hrs)' : 'দিনে (মিনিট), সপ্তাহে (ঘন্টা) ও মাসে (ঘন্টা) ব্যবহারকারীদের সময় ব্যয়ের সরাসরি তুলনা'}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setBarChartMode('category')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                barChartMode === 'category'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🏷️ {isEn ? 'By Category' : 'ক্যাটাগরি অনুযায়ী'}
            </button>
            <button
              onClick={() => setBarChartMode('top_users')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                barChartMode === 'top_users'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              👥 {isEn ? 'By Top Users' : 'শীর্ষ সক্রিয় ইউজার অনুযায়ী'}
            </button>
          </div>
        </div>

        {/* Dynamic Comparative Bar Chart */}
        <div className="w-full h-72 sm:h-84 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentBarData}
              margin={{ top: 15, right: 15, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={{ stroke: '#cbd5e1' }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(val) => isEn ? val.toLocaleString('en-US') : val.toLocaleString('bn-BD')}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                iconType="square"
              />
              <Bar 
                dataKey="dailyMins" 
                name={isEn ? "Time Spent Today (Mins)" : "আজকের দিনে সময় (মিনিট)"}
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={32}
              />
              <Bar 
                dataKey="weeklyHours" 
                name={isEn ? "Time Spent This Week (Hours)" : "সপ্তাহে সময় (ঘন্টা)"}
                fill="#6366f1" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={32}
              />
              <Bar 
                dataKey="monthlyHours" 
                name={isEn ? "Time Spent This Month (Hours)" : "মাসে সময় (ঘন্টা)"}
                fill="#a855f7" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend Explanations */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span>{isEn ? 'Daily Time: in minutes' : 'দৈনিক সময়: মিনিট এককে'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
              <span>{isEn ? 'Weekly Time: in hours' : 'সাপ্তাহিক সময়: ঘন্টা এককে'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-500" />
              <span>{isEn ? 'Monthly Time: in hours' : 'মাসিক সময়: ঘন্টা এককে'}</span>
            </span>
          </div>
          <span className="text-slate-400 text-[10px]">
            {isEn ? 'Recharts v2.15 • Powered by real-time framework' : 'Recharts v2.15 • রিয়েল-টাইম ফ্রেমওয়ার্ক চালিত'}
          </span>
        </div>

      </div>

    </div>
  );
};
