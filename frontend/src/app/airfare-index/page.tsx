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
} from 'recharts';
import { Activity, ShieldAlert, TrendingUp, BarChart as BarChartIcon, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { INDEX_SUMMARY, INDEX_HISTORY, ROUTE_INDEX_DATA } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';

export default function AirfareIndexPage() {
  const airlineIndexData = [
    { name: 'IndiGo', index: 125.4 },
    { name: 'Air India', index: 128.2 },
    { name: 'Akasa Air', index: 119.8 },
    { name: 'SpiceJet', index: 121.0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* TITLE & SUBTITLE */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          <span>AERODEX Analytical Indicator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          AERODEX Airfare Price Index
        </h1>
        <p className="text-slate-600 text-sm font-medium">
          Track changes in airfare levels across India.
        </p>
      </div>

      {/* MANDATORY ANALYTICAL INDICATOR DISCLAIMER BOX */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 flex items-start space-x-4">
        <ShieldAlert className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-blue-900 leading-relaxed font-medium">
          <span className="font-bold text-sm text-blue-950 block">
            Analytical Indicator Context & Clarification
          </span>
          <p>
            The AERODEX Airfare Price Index is an independent <span className="font-bold">AERODEX analytical airfare indicator</span> designed to measure relative domestic airfare movements across major Indian aviation corridors.
          </p>
          <p className="text-blue-800">
            This platform provides <span className="font-semibold">CPI-oriented airfare analysis</span> for economic modeling and prototype research for SIH 2026. It is not an official government CPI release.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Current Index" value={INDEX_SUMMARY.currentIndex} subtitle="Base Period = 100.0" />
        <StatCard title="Previous Period" value={INDEX_SUMMARY.previousPeriod} subtitle="August 2026 reading" />
        <StatCard title="Change" value={`+${INDEX_SUMMARY.changePercent}%`} change={INDEX_SUMMARY.changePercent} subtitle="Month-over-Month" />
        <StatCard title="Base Period" value={INDEX_SUMMARY.basePeriod} subtitle="Normalized Benchmark Baseline" />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: HISTORICAL AIRFARE INDEX */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              1. Historical Airfare Index
            </h3>
            <Badge variant="blue" size="sm">
              Index Series
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INDEX_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[90, 135]} />
                <Tooltip
                  formatter={(val: any) => [val, 'Index Value']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="index" name="AERODEX Index" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="baseLine" name="Base (100.0)" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: MONTHLY INDEX MOVEMENT */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              2. Monthly Index Movement
            </h3>
            <Badge variant="cyan" size="sm">
              MoM % Change
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INDEX_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[90, 135]} />
                <Tooltip
                  formatter={(val: any) => [val, 'Index']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="index" name="Monthly Index" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: ROUTE-WISE INDEX */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              3. Route-wise Index Comparison
            </h3>
            <Badge variant="emerald" size="sm">
              Route Corridors
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ROUTE_INDEX_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="route" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[100, 140]} />
                <Tooltip
                  formatter={(val: any) => [val, 'Route Index']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="indexValue" name="Route Index" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: AIRLINE-WISE INDEX */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              4. Airline-wise Index Comparison
            </h3>
            <Badge variant="amber" size="sm">
              Carrier Indices
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={airlineIndexData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[100, 140]} />
                <Tooltip
                  formatter={(val: any) => [val, 'Carrier Index']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="index" name="Airline Index" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROUTE ANALYSIS CARDS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <h2 className="text-lg font-black text-slate-900">Route Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROUTE_INDEX_DATA.map((item) => (
            <div
              key={item.route}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-base">{item.route}</span>
                <Badge variant={item.trend === 'up' ? 'rose' : 'emerald'}>
                  <span className="flex items-center">
                    {item.trend === 'up' ? (
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
                  </span>
                </Badge>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                {item.from} to {item.to}
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Index Value</span>
                  <div className="text-xl font-black text-slate-900">{item.indexValue}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Avg Fare</span>
                  <div className="text-sm font-bold text-blue-700">₹{item.avgFare.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
