'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, Home, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-slate-50/50">
      <div className="max-w-lg w-full text-center space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* ICON & 404 BADGE */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-blue-100/70 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Plane className="w-10 h-10 transform -rotate-45" />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-slate-900 text-cyan-400 text-xs font-black px-2.5 py-1 rounded-full border-2 border-white shadow-xs">
            404
          </span>
        </div>

        {/* HEADER & TEXT */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Whoops! You seem to have lost your way
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            The page or flight route you are looking for doesn&apos;t exist or may have been moved. Return to the dashboard or search available flight routes.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="md" variant="primary" className="w-full font-bold shadow-md">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard / Home
            </Button>
          </Link>
          <Link href="/search" className="w-full sm:w-auto">
            <Button size="md" variant="outline" className="w-full font-bold border-slate-300">
              <Search className="w-4 h-4 mr-2 text-cyan-600" />
              Search Flights
            </Button>
          </Link>
        </div>

        {/* HELPFUL QUICK LINKS */}
        <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2">
          <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
            Popular Destinations
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/trends" className="hover:text-blue-600 font-semibold transition-colors">
              Price Trends
            </Link>
            <span>•</span>
            <Link href="/airfare-index" className="hover:text-blue-600 font-semibold transition-colors">
              Airfare Index
            </Link>
            <span>•</span>
            <Link href="/anomalies" className="hover:text-blue-600 font-semibold transition-colors">
              Anomalies
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-blue-600 font-semibold transition-colors">
              About AERODEX
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
