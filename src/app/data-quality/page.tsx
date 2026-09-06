'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ShieldCheck, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { DATA_QUALITY_METRICS } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';

export default function DataQualityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-emerald-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Health & Integrity Monitoring</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Data Quality Dashboard</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Real-time validation metrics for completeness, deduplication, and source availability.
          </p>
        </div>

        <Badge variant="emerald" size="md">
          Overall Status: Excellent (99.4%)
        </Badge>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Completeness" value={`${DATA_QUALITY_METRICS.completeness}%`} subtitle="Field Integrity" />
        <StatCard title="Duplicate Rate" value={`${DATA_QUALITY_METRICS.duplicateRate}%`} subtitle="Deduplicated" />
        <StatCard title="Missing Values" value={`${DATA_QUALITY_METRICS.missingValuesRate}%`} subtitle="Null Rate" />
        <StatCard title="Outlier Rate" value={`${DATA_QUALITY_METRICS.outlierRate}%`} subtitle="3-Sigma Outliers" />
        <StatCard title="Availability" value={`${DATA_QUALITY_METRICS.sourceAvailability}%`} subtitle="Uptime Rate" />
        <StatCard title="Validation" value={`${DATA_QUALITY_METRICS.validationSuccess}%`} subtitle="Schema Pass Rate" />
      </div>

      {/* COMPLETENESS & RELIABILITY CHART */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-black text-slate-900">
            Data Completeness & Reliability Over Time
          </h2>
          <Badge variant="blue" size="sm">
            7-Day Pipeline Health
          </Badge>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DATA_QUALITY_METRICS.history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[98, 100]} />
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
              <Line type="monotone" dataKey="completeness" name="Completeness (%)" stroke="#2563eb" strokeWidth={3} />
              <Line type="monotone" dataKey="reliability" name="Reliability (%)" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
