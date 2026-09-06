'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CheckCircle2, ShieldCheck, Activity, Layers } from 'lucide-react';
import { BACKTEST_RESULTS } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';

export default function BacktestingPage() {
  const [windowDays, setWindowDays] = useState<'30D' | '60D' | '90D'>('90D');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-cyan-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Statistical Validation Model</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Backtesting & Model Validation</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Evaluating AERODEX Airfare Index accuracy against reference baseline datasets.
          </p>
        </div>

        <Badge variant="amber" size="md">
          Prototype / Demonstration Data
        </Badge>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Actual Index" value={BACKTEST_RESULTS.actualIndex} subtitle="Observed Index" />
        <StatCard title="Estimated Index" value={BACKTEST_RESULTS.estimatedIndex} subtitle="Model Baseline" />
        <StatCard title="Difference" value={BACKTEST_RESULTS.difference} subtitle="Absolute Delta" />
        <StatCard title="Correlation (r)" value={BACKTEST_RESULTS.correlation} subtitle="Pearson Correlation" />
        <StatCard title="MAPE Error" value={`${BACKTEST_RESULTS.mape}%`} subtitle="Mean Abs Pct Error" />
      </div>

      {/* CHART CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">Actual Index vs Model Estimate</h2>
            <p className="text-xs text-slate-600 font-medium">
              Historical 90-day tracking precision evaluation.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            {(['30D', '60D', '90D'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWindowDays(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  windowDays === w
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {w} Window
              </button>
            ))}
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={BACKTEST_RESULTS.historicalPoints}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[105, 125]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="actual" name="Actual AERODEX Index" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="estimated" name="Reference Model Estimate" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
