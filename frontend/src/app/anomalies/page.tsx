'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { ANOMALIES } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export default function AnomaliesPage() {
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const filtered = ANOMALIES.filter((a) => severityFilter === 'All' || a.severity === severityFilter);

  const anomalyChartData = ANOMALIES.map((a) => ({
    route: a.route,
    change: a.percentageChange,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-amber-600 text-xs font-black uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Automated Price Spike Watch</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Airfare Anomalies</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Detect unusual or unexpected airfare movements across Indian routes.
          </p>
        </div>

        {/* SEVERITY CONTROLS */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          {(['All', 'High', 'Medium', 'Low'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev} Severity
            </button>
          ))}
        </div>
      </div>

      {/* ANOMALY TREND CHART */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-900 uppercase">
            Anomaly Percentage Deviation Trend Chart
          </h2>
          <Badge variant="amber" size="sm">
            Deviation %
          </Badge>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anomalyChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="route" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Deviation']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="change" name="Deviation %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ANOMALY CARDS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">Detected Anomalies</h2>

        {filtered.map((anomaly) => (
          <div
            key={anomaly.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-amber-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    anomaly.severity === 'High'
                      ? 'bg-rose-50 text-rose-600'
                      : anomaly.severity === 'Medium'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-slate-900">{anomaly.route}</span>
                    <Badge variant={anomaly.severity === 'High' ? 'rose' : anomaly.severity === 'Medium' ? 'amber' : 'blue'} size="sm">
                      {anomaly.severity} Severity
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {anomaly.airline} • Detected on {anomaly.detectedDate}
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-lg font-black text-slate-900">
                  Current ₹{anomaly.currentPrice.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    (Previous ₹{anomaly.previousPrice.toLocaleString('en-IN')})
                  </span>
                </div>
                <div
                  className={`text-xs font-extrabold ${
                    anomaly.percentageChange > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  Change: {anomaly.percentageChange > 0 ? '+' : ''}
                  {anomaly.percentageChange}%
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700 font-medium">
              <strong>Reason:</strong> {anomaly.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
