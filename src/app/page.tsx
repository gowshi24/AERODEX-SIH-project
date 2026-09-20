'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plane,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { FlightSearchForm } from '../components/search/FlightSearchForm';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getPopularRoutes } from '../lib/api';
import { PopularRouteItem } from '../types';

export default function HomePage() {
  const [routes, setRoutes] = React.useState<PopularRouteItem[]>([]);

  React.useEffect(() => {
    getPopularRoutes().then((res) => {
      if (res) setRoutes(res);
    });
  }, []);
  return (
    <div className="space-y-16 pb-20 bg-slate-50/50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-12 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Subtle Aviation Background Graphic */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/50 text-cyan-300 text-xs font-bold tracking-widest uppercase shadow-sm">
              <Plane className="w-3.5 h-3.5 text-cyan-400 transform -rotate-12" />
              <span>AIRFARE INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-sans">
              Track. Compare.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                Understand Airfare.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Compare airfare, monitor price movements and understand how flight prices change across India.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
              <Link href="/search">
                <Button size="lg" variant="primary" className="shadow-md">
                  <Search className="w-4 h-4 mr-2" />
                  Search Flights
                </Button>
              </Link>
              <Link href="/trends">
                <Button
                  size="lg"
                  variant="dark-outline"
                  className="shadow-md"
                >
                  <BarChart3 className="w-4 h-4 mr-2 text-cyan-400" />
                  Explore Price Trends
                </Button>
              </Link>
            </div>
          </div>

          {/* FLOATING HOME SEARCH CARD */}
          <div className="mt-12 max-w-5xl mx-auto transform translate-y-6">
            <FlightSearchForm initialFrom="DEL" initialTo="BOM" />
          </div>
        </div>
      </section>

      {/* AIRFARE INTELLIGENCE AT A GLANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Airfare Intelligence at a Glance
          </h2>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            Automated price extraction, trend matching, and analytical index computation for India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Real-time Fare Comparison</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Compare fares across airlines and OTAs.
            </p>
            <Link href="/search" className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 pt-2">
              <span>Compare Fares</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Price Trend Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Track airfare movements over time.
            </p>
            <Link href="/trends" className="inline-flex items-center text-xs font-bold text-cyan-600 hover:text-cyan-700 pt-2">
              <span>View Price Trends</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Anomaly Detection</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Identify unusual airfare changes.
            </p>
            <Link href="/anomalies" className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 pt-2">
              <span>Detect Anomalies</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">CPI-oriented Insights</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Understand airfare movements in a broader price context.
            </p>
            <Link href="/cpi-insights" className="inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2">
              <span>Explore CPI Insights</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR INDIAN ROUTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Popular Indian Routes</h2>
            <p className="text-slate-600 text-xs mt-1 font-medium">
              Average historical fares on primary Indian aviation corridors.
            </p>
          </div>
          <Link href="/search">
            <Button variant="outline" size="sm">
              View All Routes
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={`${route.fromCode}-${route.toCode}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black text-slate-900">{route.fromCode}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-black text-slate-900">{route.toCode}</span>
                </div>
                <Badge variant="blue" size="sm">
                  Active Route
                </Badge>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                {route.fromCity} → {route.toCity}
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Live Benchmark Fare</span>
                  <div className="text-xl font-black text-blue-700">
                    ₹{route.avgFare.toLocaleString('en-IN')}
                  </div>
                </div>
                <Link href={`/results?from=${route.fromCode}&to=${route.toCode}`}>
                  <Button variant="outline" size="sm" className="py-1 px-3 text-xs">
                    View Fare
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
