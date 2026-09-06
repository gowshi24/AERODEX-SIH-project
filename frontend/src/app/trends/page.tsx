'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';
import { POPULAR_ROUTES, AIRLINES } from '../../data/mockData';

export default function PriceTrendsPage() {
  const [selectedRoute, setSelectedRoute] = useState('DEL → BOM');
  const [selectedAirline, setSelectedAirline] = useState('All Airlines');
  const [dateRange, setDateRange] = useState('30 Days');

  const historicalLineData = [
    { date: '1 Aug', avgFare: 5780, minFare: 4200, maxFare: 7400 },
    { date: '8 Aug', avgFare: 5650, minFare: 4100, maxFare: 7350 },
    { date: '15 Aug', avgFare: 5580, minFare: 4050, maxFare: 7300 },
    { date: '22 Aug', avgFare: 5500, minFare: 4000, maxFare: 7280 },
    { date: '29 Aug', avgFare: 5460, minFare: 3990, maxFare: 7260 },
    { date: '5 Sep', avgFare: 5420, minFare: 3980, maxFare: 7250 },
  ];

  const weeklyTrendData = [
    { day: 'Mon', avgFare: 5100 },
    { day: 'Tue', avgFare: 4950 },
    { day: 'Wed', avgFare: 4890 },
    { day: 'Thu', avgFare: 5200 },
    { day: 'Fri', avgFare: 5850 },
    { day: 'Sat', avgFare: 6100 },
    { day: 'Sun', avgFare: 5900 },
  ];

  const monthlyTrendData = [
    { month: 'Apr', avgFare: 4850 },
    { month: 'May', avgFare: 5200 },
    { month: 'Jun', avgFare: 5600 },
    { month: 'Jul', avgFare: 5350 },
    { month: 'Aug', avgFare: 5580 },
    { month: 'Sep', avgFare: 5420 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-black uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Airfare Analytics Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Price Trends</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Historical fare distribution, weekly cyclical volatility, and monthly price movement curves.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-white border border-slate-300 font-bold text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none cursor-pointer"
          >
            {POPULAR_ROUTES.map((r) => (
              <option key={`${r.fromCode}-${r.toCode}`} value={`${r.fromCode} → ${r.toCode}`}>
                {r.fromCode} → {r.toCode} ({r.fromCity} - {r.toCity})
              </option>
            ))}
          </select>

          <select
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            className="bg-white border border-slate-300 font-bold text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="All Airlines">All Airlines</option>
            {AIRLINES.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-300 font-bold text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="7 Days">7 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="90 Days">90 Days</option>
          </select>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Average Fare" value="₹5,420" subtitle={`Selected route: ${selectedRoute}`} />
        <StatCard title="Minimum Fare" value="₹3,980" subtitle="Lowest observed rate" />
        <StatCard title="Maximum Fare" value="₹7,250" subtitle="Peak fare spike" />
        <StatCard title="Price Change" value="↓ 6.2%" change={-6.2} subtitle="Over selected date range" />
      </div>

      {/* CHART 1: HISTORICAL AIRFARE LINE CHART */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              1. Historical Airfare Movement ({selectedRoute})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Average, minimum, and maximum observed fares over time.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            Historical Line
          </Badge>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalLineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Fare']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="avgFare" name="Average Fare" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="minFare" name="Minimum Fare" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="maxFare" name="Maximum Fare" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TWO COLUMN CHARTS: WEEKLY & MONTHLY TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 2: WEEKLY PRICE TREND */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              2. Weekly Price Trend (Cyclical Pattern)
            </h3>
            <Badge variant="cyan" size="sm">
              Day of Week
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Avg Fare']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="avgFare" name="Average Fare" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: MONTHLY PRICE TREND */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              3. Monthly Price Trend (Seasonal Trajectory)
            </h3>
            <Badge variant="emerald" size="sm">
              Monthly Trajectory
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Avg Fare']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="avgFare" name="Monthly Avg Fare" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ANALYTICAL INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-extrabold text-blue-950 text-sm flex items-center">
            <Info className="w-4 h-4 mr-2 text-blue-600" />
            Historical Trend Insight
          </h4>
          <p className="text-xs text-blue-900 font-medium leading-relaxed">
            “Average fare decreased 6.2% over the selected period.”
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-extrabold text-amber-950 text-sm flex items-center">
            <Info className="w-4 h-4 mr-2 text-amber-600" />
            Weekly Volatility Insight
          </h4>
          <p className="text-xs text-amber-900 font-medium leading-relaxed">
            “Weekend fares show higher volatility.”
          </p>
        </div>
      </div>
    </div>
  );
}
