import React from 'react';
import Link from 'next/link';
import { Plane, ShieldCheck, Database, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Plane className="w-4 h-4 transform -rotate-45" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                AERO<span className="text-cyan-400">DEX</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Indian airfare intelligence and price analytics platform for Consumer Price Index (CPI) augmentation.
            </p>
            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              Tagline: <span className="text-slate-300">Track. Compare. Understand Airfare.</span>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800/60 text-cyan-400 text-[11px] font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>SIH 2026 Prototype Project</span>
            </div>
          </div>

          {/* COLUMN 1: NAVIGATION */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white transition-colors">
                  Flight Results & Fares
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About AERODEX
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: ANALYTICS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Analytics</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/trends" className="hover:text-white transition-colors">
                  Price Trends
                </Link>
              </li>
              <li>
                <Link href="/index" className="hover:text-white transition-colors">
                  Airfare Price Index
                </Link>
              </li>
              <li>
                <Link href="/anomalies" className="hover:text-white transition-colors">
                  Airfare Anomalies
                </Link>
              </li>
              <li>
                <Link href="/cpi-insights" className="hover:text-white transition-colors">
                  CPI Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: PROTOTYPE NOTICE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">SIH 2026</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
              Real-time Airfare Price Index for India through Automated Web Scraping for Augmentation of the Consumer Price Index (CPI).
            </p>
          </div>
        </div>

        {/* BOTTOM DISCLAIMER & COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© {new Date().getFullYear()} AERODEX Platform • SIH 2026</div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right italic">
            Disclaimer: AERODEX is a prototype analytical platform. Data shown in this frontend is mock data for demonstration.
          </div>
        </div>
      </div>
    </footer>
  );
};
