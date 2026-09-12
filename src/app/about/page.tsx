'use client';

import React from 'react';
import { Plane, ArrowRight, ShieldCheck, Database, Award, Activity, Cpu, Layers } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* TITLE & OVERVIEW */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">
          Airfare Intelligence Platform
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          About AERODEX Platform
        </h1>
        <p className="text-slate-600 text-sm font-medium leading-relaxed">
          AERODEX is an Indian airfare intelligence and price analytics platform designed for real-time price monitoring and Consumer Price Index (CPI) analytics.
        </p>
      </div>

      {/* WHAT IS AERODEX & MISSION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Plane className="w-5 h-5 transform -rotate-45" />
          </div>
          <h2 className="text-xl font-black text-slate-900">What is AERODEX?</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            AERODEX is a specialized aviation data platform designed to monitor route-level price movements across Indian airlines and Online Travel Aggregators (OTAs), compute a real-time Airfare Price Index, and analyze airfare volatility for CPI inflation context.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Core Mission & Objective</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed border-l-2 border-cyan-500 pl-3 italic">
            “Providing high-frequency airfare intelligence for India by aggregating real-time flight data across airline direct portals and Online Travel Aggregators to augment CPI analytics.”
          </p>
        </div>
      </div>

      {/* HOW AERODEX WORKS VISUAL PROCESS */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-6 shadow-xl">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variant="cyan" size="sm">
            Architecture Blueprint
          </Badge>
          <h2 className="text-2xl font-black text-white">How AERODEX Works</h2>
          <p className="text-xs text-slate-400 font-medium">
            Frontend visualization of the planned 10-step data collection & processing pipeline.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center items-center pt-4">
          {[
            'Airlines / OTAs',
            'Data Collection',
            'Data Processing',
            'Fare Normalization',
            'Flight Matching',
            'Historical Database',
            'Price Analytics',
            'AERODEX Airfare Price Index',
            'Anomaly Detection',
            'CPI-oriented Insights',
          ].map((step, idx) => (
            <div key={step} className="bg-slate-800 border border-slate-700 rounded-2xl p-3 space-y-1">
              <span className="text-[9px] font-bold text-cyan-400 uppercase block">Step {idx + 1}</span>
              <span className="text-xs font-extrabold text-white block">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TECHNOLOGY, KEY FEATURES & EXPECTED IMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Technology</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Built using Next.js, React, TypeScript, Tailwind CSS, Lucide React icons, and Recharts visualization components.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Key Features</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Multi-source fare comparison, national airfare price index calculation, anomaly detection, and CPI inflation insights.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Expected Impact</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Enhances high-frequency transportation price monitoring for economic analysis and Consumer Price Index (CPI) research.
          </p>
        </div>
      </div>
    </div>
  );
}
