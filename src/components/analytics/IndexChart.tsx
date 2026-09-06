'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { IndexHistoryPoint } from '../../types';

interface IndexChartProps {
  data: IndexHistoryPoint[];
  height?: number;
}

export const IndexChart: React.FC<IndexChartProps> = ({ data, height = 340 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
          <YAxis domain={[90, 140]} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderRadius: '12px',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
            }}
            formatter={(value: any, name: any) => [
              value,
              name === 'index' ? 'AERODEX Index' : 'CPI Ref Benchmark',
            ]}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <ReferenceLine y={100} label="Base 100" stroke="#94A3B8" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="index"
            name="AERODEX Airfare Index"
            stroke="#2563EB"
            strokeWidth={3.5}
            dot={{ r: 4, fill: '#2563EB' }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="cpiReference"
            name="CPI General Reference"
            stroke="#06B6D4"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#06B6D4' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
