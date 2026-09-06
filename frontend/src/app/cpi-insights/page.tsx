'use client';

import React from 'react';
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
import { ShieldCheck, Info, TrendingUp } from 'lucide-react';
import { CPI_INSIGHT_DATA } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';

export default function CPIInsightsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-emerald-600 text-xs font-black uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Macroeconomic & Inflation Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          CPI-oriented Airfare Insights
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-medium">
          AERODEX provides analytical insights related to airfare movement and CPI-oriented analysis.
        </p>
      </div>

      {/* MANDATORY CONTEXT DISCLAIMER BOX */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex items-start space-x-4">
        <Info className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-emerald-900 leading-relaxed font-medium">
          <span className="font-bold text-sm text-emerald-950 block">
            Analytical Scope Clarification
          </span>
          <p>
            AERODEX provides analytical insights related to airfare movement and CPI-oriented analysis. It does not officially publish or replace government CPI indices.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Airfare Change" value={`+${CPI_INSIGHT_DATA.airfareChange}%`} subtitle="Overall Rate" />
        <StatCard title="Monthly Movement" value={`+${CPI_INSIGHT_DATA.monthlyMovement}%`} subtitle="MoM Rate" />
        <StatCard title="Highest Increase" value={CPI_INSIGHT_DATA.highestIncreaseRoute} subtitle="Max Inflation Impact" />
        <StatCard title="Lowest Increase" value={CPI_INSIGHT_DATA.lowestIncreaseRoute} subtitle="Lowest Inflation Impact" />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: AIRFARE INFLATION TREND */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              1. Airfare Inflation Trend vs General CPI
            </h3>
            <Badge variant="emerald" size="sm">
              Inflation Trend
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CPI_INSIGHT_DATA.inflationTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 10]} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Rate']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="airfareInflation" name="Airfare Inflation (%)" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="generalCPI" name="General CPI Benchmark (%)" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: MONTHLY FARE MOVEMENT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              2. Monthly Fare Movement (%)
            </h3>
            <Badge variant="blue" size="sm">
              Monthly Delta
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CPI_INSIGHT_DATA.monthlyMovementData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Movement']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="change" name="Monthly % Change" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: ROUTE COMPARISON */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              3. Route-wise Inflation Impact Comparison
            </h3>
            <Badge variant="cyan" size="sm">
              Route Impact
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CPI_INSIGHT_DATA.routeComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="route" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Inflation Rate']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="change" name="Route Inflation Rate (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SHORT ANALYTICAL EXPLANATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <h4 className="font-extrabold text-slate-900 text-sm">4. Regional Comparison Summary</h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Northern and Western metro corridors (DEL-BOM) demonstrate higher inflation elasticity relative to southern regional routes during peak festival months.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <h4 className="font-extrabold text-slate-900 text-sm">5. Historical Comparison Summary</h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            High-frequency airfare observation provides a 3-week leading signal ahead of conventional monthly transportation CPI sub-index publications.
          </p>
        </div>
      </div>
    </div>
  );
}
