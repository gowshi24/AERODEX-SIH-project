'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Clock, TrendingUp, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LEAD_TIME_DATA } from '../../data/mockData';
import { Badge } from '../../components/ui/Badge';

export default function LeadTimePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-cyan-600 text-xs font-extrabold uppercase tracking-wider mb-1">
          <Clock className="w-4 h-4" />
          <span>Advance Booking Window Analytics</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Booking Lead-Time Analysis</h1>
        <p className="text-slate-600 text-xs font-medium mt-1">
          Understand how Indian airfares evolve as departure day approaches across T+45 to T+1 windows.
        </p>
      </div>

      {/* INSIGHT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Lowest Average Fare Window
          </span>
          <div className="text-2xl font-black text-emerald-600">T+45 Days</div>
          <p className="text-xs text-slate-600">Avg ₹3,850 (Save up to 44% vs last-minute)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Highest Average Fare Window
          </span>
          <div className="text-2xl font-black text-rose-600">T+1 Day</div>
          <p className="text-xs text-slate-600">Avg ₹6,890 (Peak urgent travel surge)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Largest Price Increase Step
          </span>
          <div className="text-2xl font-black text-amber-600">T+7 → T+1</div>
          <p className="text-xs text-slate-600">+₹1,650 average spike in final week</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Most Stable Booking Window
          </span>
          <div className="text-2xl font-black text-blue-600">T+30 to T+15</div>
          <p className="text-xs text-slate-600">Optimal balance between flexibility & fare</p>
        </div>
      </div>

      {/* LEAD-TIME CURVE CHART */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Indian Domestic Airfare Lead-Time Curve
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Average fare vs days remaining before departure.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            Empirical Lead Curve
          </Badge>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LEAD_TIME_DATA}>
              <defs>
                <linearGradient id="colorLead" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} />
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
              <Area
                type="monotone"
                dataKey="avgFare"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLead)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
