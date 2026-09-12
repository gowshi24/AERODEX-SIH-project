'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  AlertTriangle,
  Activity,
  Layers,
  Plane,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';
import { INDEX_SUMMARY, POPULAR_ROUTES, ANOMALIES } from '../../data/mockData';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Airfare Intelligence Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            AERODEX Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Real-time summary of Indian airfare movements, indices, anomalies, and active search portals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/search">
            <Button variant="primary" size="md" className="shadow-md font-bold">
              <Search className="w-4 h-4 mr-2" />
              Search Flights
            </Button>
          </Link>
          <Link href="/trends">
            <Button variant="outline" size="md" className="font-bold border-slate-300">
              <TrendingUp className="w-4 h-4 mr-2 text-cyan-600" />
              Trends
            </Button>
          </Link>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Airfare Index" value={INDEX_SUMMARY.currentIndex} change={INDEX_SUMMARY.changePercent} subtitle="Base Period = 100.0" />
        <StatCard title="Tracked Routes" value="12 Active" subtitle="Primary Metro Corridors" />
        <StatCard title="Active Anomalies" value={`${ANOMALIES.length} Detected`} subtitle="Real-time price spikes" />
        <StatCard title="CPI Correlation" value="94.2%" subtitle="Economic Augmentation Model" />
      </div>

      {/* CORE MODULE SHORTCUTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MODULE 1: FLIGHT SEARCH */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Flight Search & Comparison</h2>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              Compare real-time ticket prices across major Indian carriers and travel aggregators.
            </p>
          </div>
          <Link href="/search" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 pt-2">
            <span>Launch Search Tool</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* MODULE 2: PRICE INDEX */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Airfare Price Index</h2>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              Track macro-level price movements and historical fare variations across India.
            </p>
          </div>
          <Link href="/index" className="inline-flex items-center text-xs font-bold text-cyan-600 hover:text-cyan-700 pt-2">
            <span>View Airfare Index</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* MODULE 3: ANOMALY DETECTION */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Anomaly Detection</h2>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              Identify unusual fare spikes and sudden price dips across major aviation routes.
            </p>
          </div>
          <Link href="/anomalies" className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 pt-2">
            <span>Inspect Anomalies</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* POPULAR ROUTE MONITORS & RECENT ANOMALIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* POPULAR ROUTE MONITORS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 uppercase">
              Monitored Indian Routes
            </h3>
            <Badge variant="blue" size="sm">
              Live Feed
            </Badge>
          </div>

          <div className="space-y-3">
            {POPULAR_ROUTES.slice(0, 4).map((route) => (
              <div
                key={`${route.fromCode}-${route.toCode}`}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center font-black text-xs">
                    {route.fromCode}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {route.fromCity} → {route.toCity} ({route.fromCode}-{route.toCode})
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Avg Fare: ₹{route.avgFare.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <Link href={`/results?from=${route.fromCode}&to=${route.toCode}`}>
                  <Button variant="outline" size="sm" className="text-xs py-1 px-3">
                    View Fares
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ANOMALY ALERTS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 uppercase">
              Recent Price Spikes
            </h3>
            <Badge variant="amber" size="sm">
              Spike Watch
            </Badge>
          </div>

          <div className="space-y-3">
            {ANOMALIES.slice(0, 3).map((anom) => (
              <div
                key={anom.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-black text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      {anom.route} ({anom.airline})
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Current: ₹{anom.currentPrice.toLocaleString('en-IN')} (Was ₹{anom.previousPrice.toLocaleString('en-IN')})
                    </div>
                  </div>
                </div>
                <Badge variant={anom.severity === 'High' ? 'rose' : 'amber'} size="sm">
                  +{anom.percentageChange}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
