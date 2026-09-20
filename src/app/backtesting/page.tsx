'use client';

import React, { useState, useEffect } from 'react';
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
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';
import { getBacktestResults } from '../../lib/api';
import { BacktestResult } from '../../types';

export default function BacktestingPage() {
  const [windowDays, setWindowDays] = useState<'30D' | '60D' | '90D'>('90D');
  const [results, setResults] = useState<BacktestResult>({
    period: '90-Day Validation Window',
    actualIndex: 124.6,
    estimatedIndex: 123.8,
    difference: -0.8,
    correlation: 0.942,
    mape: 2.1,
    rmse: 1.4,
    historicalPoints: [
      { date: 'Jun 2026', actual: 112.4, estimated: 111.8 },
      { date: 'Jul 2026', actual: 118.2, estimated: 117.5 },
      { date: 'Aug 2026', actual: 123.5, estimated: 122.9 },
      { date: 'Sep 2026', actual: 127.44, estimated: 126.8 },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBacktestResults()
      .then((res) => {
        if (res) setResults(res);
      })
      .finally(() => setLoading(false));
  }, []);

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

        <Badge variant="blue" size="md">
          Model Confidence: High (r = {results.correlation})
        </Badge>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Actual Index" value={results.actualIndex} subtitle="Observed Index" />
        <StatCard title="Estimated Index" value={results.estimatedIndex} subtitle="Model Baseline" />
        <StatCard title="Difference" value={results.difference} subtitle="Absolute Delta" />
        <StatCard title="Correlation (r)" value={results.correlation} subtitle="Pearson Correlation" />
        <StatCard title="MAPE Error" value={`${results.mape}%`} subtitle="Mean Abs Pct Error" />
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
            <LineChart data={results.historicalPoints}>
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
