'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
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
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Avg Fare']}
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
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderRadius: '12px',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
            }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`]}
          />
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
