'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { HistoricalTrendPoint, WeeklyTrendPoint } from '../../types';

interface PriceTrendChartProps {
  type?: 'line' | 'area' | 'weekly';
  data: HistoricalTrendPoint[] | WeeklyTrendPoint[];
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
    payload: HistoricalTrendPoint;
  }>;
  label?: string;
}

const HistoricalAreaTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white min-w-[280px] space-y-2.5 z-50">
      <div className="text-xs font-black text-slate-200 border-b border-slate-800 pb-1.5 flex justify-between items-center">
        <span>{label}</span>
        <span className="text-[10px] text-blue-400 font-mono font-bold">Observed Airfare</span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-blue-950/30 border border-blue-900/40">
          <div>
            <div className="text-[10px] text-blue-300 font-semibold uppercase">Average Market Fare</div>
            {point.avgFlight && (
              <div className="font-bold text-slate-100 text-[11px]">
                ✈ {point.avgFlight.airline} {point.avgFlight.flightNumber}
              </div>
            )}
          </div>
          <div className="text-sm font-black text-blue-400 font-mono">
            ₹{point.avgFare.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-cyan-950/30 border border-cyan-900/40">
          <div>
            <div className="text-[10px] text-cyan-300 font-semibold uppercase">Minimum Fare (Deal)</div>
            {point.minFlight && (
              <div className="font-bold text-cyan-100 text-[11px]">
                ✈ {point.minFlight.airline} {point.minFlight.flightNumber}
              </div>
            )}
          </div>
          <div className="text-sm font-black text-cyan-400 font-mono">
            ₹{point.minFare.toLocaleString('en-IN')}
          </div>
        </div>

        {point.maxFare !== undefined && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-red-950/30 border border-red-900/40">
            <div>
              <div className="text-[10px] text-red-300 font-semibold uppercase">Maximum Fare (Peak)</div>
              {point.maxFlight && (
                <div className="font-bold text-red-100 text-[11px]">
                  ✈ {point.maxFlight.airline} {point.maxFlight.flightNumber}
                </div>
              )}
            </div>
            <div className="text-sm font-black text-red-400 font-mono">
              ₹{point.maxFare.toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  type = 'area',
  data,
  height = 320,
}) => {
  if (type === 'weekly') {
    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data as WeeklyTrendPoint[]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '12px',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
              }}
              formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Avg Fare']}
            />
            <Bar dataKey="avgFare" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data as HistoricalTrendPoint[]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="fareGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
          <Tooltip content={<HistoricalAreaTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Area
            type="monotone"
            dataKey="avgFare"
            name="Average Fare"
            stroke="#2563EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#fareGradient)"
          />
          <Area
            type="monotone"
            dataKey="minFare"
            name="Minimum Fare"
            stroke="#06B6D4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#minGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
