'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AlertTriangle, TrendingUp, Filter, ShieldCheck, Radio } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { getAnomalies } from '../../lib/api';
import { AirfareAnomaly } from '../../types';

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<AirfareAnomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  useEffect(() => {
    getAnomalies()
      .then((data) => {
        if (data && data.length > 0) {
          setAnomalies(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = anomalies.filter((a) => severityFilter === 'All' || a.severity === severityFilter);

  const anomalyChartData = anomalies.map((a) => ({
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
            <span>Automated Live Outlier & Tariff Surge Radar</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Real-Time Airfare Anomalies</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Statistical IQR outlier detection and sudden dynamic tariff surges observed on live domestic scrapers.
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
            Live Anomaly Percentage Deviation vs Corridor Baseline
          </h2>
          <Badge variant="amber" size="sm">
            Live Deviation %
          </Badge>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
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
        )}
      </div>

      {/* ANOMALY CARDS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900">
          Detected Surge Incidents ({filtered.length})
        </h2>

        {filtered.map((anomaly) => (
          <div
            key={anomaly.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3 hover:border-amber-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-black text-slate-900">{anomaly.route}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                  {anomaly.airline} {anomaly.flightNumber ? `(${anomaly.flightNumber})` : ''}
                </span>
                {anomaly.source && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    {anomaly.source}
                  </span>
                )}
              </div>
              <Badge
                variant={
                  anomaly.severity === 'High'
                    ? 'rose'
                    : anomaly.severity === 'Medium'
                    ? 'amber'
                    : 'blue'
                }
                size="sm"
              >
                {anomaly.severity} Severity
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Observed Fare:</span>
                <p className="text-sm font-black text-rose-600">
                  ₹{anomaly.currentPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Corridor Normal:</span>
                <p className="text-sm font-bold text-slate-700">
                  ₹{anomaly.previousPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Deviation:</span>
                <p className="text-sm font-extrabold text-amber-600">
                  +{anomaly.percentageChange}%
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Detection Time:</span>
                <p className="text-xs font-bold text-slate-600 mt-0.5 font-mono">
                  {anomaly.detectedDate}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              <span className="font-bold text-slate-800">Observation Note: </span>
              {anomaly.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
