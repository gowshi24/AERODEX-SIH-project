'use client';

import React from 'react';
import { HeatmapVisualizer } from '../../components/analytics/HeatmapVisualizer';
import { MapPin, Activity, ShieldCheck } from 'lucide-react';

export default function HeatmapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          <span>Geographic Route Analytics</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">India Airfare Route Heatmap</h1>
        <p className="text-slate-600 text-xs font-medium mt-1">
          Visual representation of domestic Indian flight density, route observation volume, and price volatility.
        </p>
      </div>

      {/* HEATMAP CANVAS */}
      <HeatmapVisualizer />
    </div>
  );
}
