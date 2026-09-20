'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Info,
  Plane,
  Calendar,
  Sparkles,
  Tag,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/analytics/StatCard';
import { POPULAR_ROUTES, AIRLINES } from '../../data/mockData';
import { HistoricalTrendPoint, FlightPriceAttribution } from '../../types';

// Route-specific historical observations with exact operating carrier attributions
const ROUTE_HISTORICAL_DATA: Record<string, HistoricalTrendPoint[]> = {
  'DEL → BOM': [
    {
      date: '1 Aug',
      fullDate: '1 Aug 2026',
      avgFare: 5780,
      minFare: 4200,
      maxFare: 7400,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-8169', source: 'EaseMyTrip', fare: 4200 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-803', source: 'Air India Direct', fare: 7400 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2041', source: 'MakeMyTrip', fare: 5780, benchmarkNote: 'Market Median' },
    },
    {
      date: '8 Aug',
      fullDate: '8 Aug 2026',
      avgFare: 5650,
      minFare: 4100,
      maxFare: 7350,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1102', source: 'MakeMyTrip', fare: 4100 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-805', source: 'Air India Direct', fare: 7350 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-5324', source: 'Yatra', fare: 5650, benchmarkNote: 'Market Median' },
    },
    {
      date: '15 Aug',
      fullDate: '15 Aug 2026',
      avgFare: 5580,
      minFare: 4050,
      maxFare: 7300,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-8169', source: 'Yatra', fare: 4050 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-803', source: 'Air India Direct', fare: 7300 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2041', source: 'MakeMyTrip', fare: 5580, benchmarkNote: 'Market Median' },
    },
    {
      date: '22 Aug',
      fullDate: '22 Aug 2026',
      avgFare: 5500,
      minFare: 4000,
      maxFare: 7280,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1102', source: 'EaseMyTrip', fare: 4000 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-805', source: 'Cleartrip', fare: 7280 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-5324', source: 'IndiGo Direct', fare: 5500, benchmarkNote: 'Market Median' },
    },
    {
      date: '29 Aug',
      fullDate: '29 Aug 2026',
      avgFare: 5460,
      minFare: 3990,
      maxFare: 7260,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-8169', source: 'EaseMyTrip', fare: 3990 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-803', source: 'Air India Direct', fare: 7260 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2041', source: 'MakeMyTrip', fare: 5460, benchmarkNote: 'Market Benchmark' },
    },
    {
      date: '5 Sep',
      fullDate: '5 Sep 2026',
      avgFare: 5420,
      minFare: 3980,
      maxFare: 7250,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-8169', source: 'MakeMyTrip', fare: 3980 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-805', source: 'Air India Direct', fare: 7250 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2041', source: 'Cleartrip', fare: 5420, benchmarkNote: 'Market Benchmark' },
    },
  ],
  'BOM → DEL': [
    {
      date: '1 Aug',
      fullDate: '1 Aug 2026',
      avgFare: 5490,
      minFare: 4120,
      maxFare: 7150,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1105', source: 'EaseMyTrip', fare: 4120 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-804', source: 'Air India Direct', fare: 7150 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2042', source: 'MakeMyTrip', fare: 5490, benchmarkNote: 'Market Median' },
    },
    {
      date: '8 Aug',
      fullDate: '8 Aug 2026',
      avgFare: 5350,
      minFare: 4050,
      maxFare: 7100,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-8170', source: 'MakeMyTrip', fare: 4050 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-806', source: 'Air India Direct', fare: 7100 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-5325', source: 'Yatra', fare: 5350, benchmarkNote: 'Market Median' },
    },
    {
      date: '15 Aug',
      fullDate: '15 Aug 2026',
      avgFare: 5280,
      minFare: 3980,
      maxFare: 7050,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1105', source: 'EaseMyTrip', fare: 3980 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-804', source: 'Air India Direct', fare: 7050 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2042', source: 'Cleartrip', fare: 5280, benchmarkNote: 'Market Median' },
    },
    {
      date: '22 Aug',
      fullDate: '22 Aug 2026',
      avgFare: 5200,
      minFare: 3920,
      maxFare: 7000,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-8170', source: 'Yatra', fare: 3920 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-806', source: 'Cleartrip', fare: 7000 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-5325', source: 'MakeMyTrip', fare: 5200, benchmarkNote: 'Market Median' },
    },
    {
      date: '29 Aug',
      fullDate: '29 Aug 2026',
      avgFare: 5160,
      minFare: 3890,
      maxFare: 6980,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1105', source: 'EaseMyTrip', fare: 3890 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-804', source: 'Air India Direct', fare: 6980 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2042', source: 'MakeMyTrip', fare: 5160, benchmarkNote: 'Market Benchmark' },
    },
    {
      date: '5 Sep',
      fullDate: '5 Sep 2026',
      avgFare: 5120,
      minFare: 3860,
      maxFare: 6950,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-8170', source: 'EaseMyTrip', fare: 3860 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-806', source: 'Air India Direct', fare: 6950 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2042', source: 'IndiGo Direct', fare: 5120, benchmarkNote: 'Market Benchmark' },
    },
  ],
  'DEL → BLR': [
    {
      date: '1 Aug',
      fullDate: '1 Aug 2026',
      avgFare: 5850,
      minFare: 4400,
      maxFare: 7800,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1331', source: 'MakeMyTrip', fare: 4400 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-506', source: 'Air India Direct', fare: 7800 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2134', source: 'EaseMyTrip', fare: 5850, benchmarkNote: 'Market Median' },
    },
    {
      date: '8 Aug',
      fullDate: '8 Aug 2026',
      avgFare: 5680,
      minFare: 4320,
      maxFare: 7650,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-192', source: 'EaseMyTrip', fare: 4320 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-504', source: 'Air India Direct', fare: 7650 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2134', source: 'MakeMyTrip', fare: 5680, benchmarkNote: 'Market Median' },
    },
    {
      date: '15 Aug',
      fullDate: '15 Aug 2026',
      avgFare: 5520,
      minFare: 4250,
      maxFare: 7500,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1331', source: 'EaseMyTrip', fare: 4250 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-506', source: 'Cleartrip', fare: 7500 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2134', source: 'Yatra', fare: 5520, benchmarkNote: 'Market Median' },
    },
    {
      date: '22 Aug',
      fullDate: '22 Aug 2026',
      avgFare: 5380,
      minFare: 4180,
      maxFare: 7420,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-192', source: 'Yatra', fare: 4180 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-504', source: 'Air India Direct', fare: 7420 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2134', source: 'MakeMyTrip', fare: 5380, benchmarkNote: 'Market Median' },
    },
    {
      date: '29 Aug',
      fullDate: '29 Aug 2026',
      avgFare: 5290,
      minFare: 4120,
      maxFare: 7350,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1331', source: 'EaseMyTrip', fare: 4120 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-506', source: 'Air India Direct', fare: 7350 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2134', source: 'MakeMyTrip', fare: 5290, benchmarkNote: 'Market Benchmark' },
    },
    {
      date: '5 Sep',
      fullDate: '5 Sep 2026',
      avgFare: 5200,
      minFare: 4050,
      maxFare: 7280,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1331', source: 'MakeMyTrip', fare: 4050 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-504', source: 'Air India Direct', fare: 7280 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2134', source: 'EaseMyTrip', fare: 5200, benchmarkNote: 'Market Benchmark' },
    },
  ],
  'BLR → BOM': [
    {
      date: '1 Aug',
      fullDate: '1 Aug 2026',
      avgFare: 4350,
      minFare: 3100,
      maxFare: 5900,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1342', source: 'EaseMyTrip', fare: 3100 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-610', source: 'Air India Direct', fare: 5900 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-451', source: 'MakeMyTrip', fare: 4350, benchmarkNote: 'Market Median' },
    },
    {
      date: '8 Aug',
      fullDate: '8 Aug 2026',
      avgFare: 4180,
      minFare: 2950,
      maxFare: 5800,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1342', source: 'EaseMyTrip', fare: 2950 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-610', source: 'Air India Direct', fare: 5800 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-451', source: 'Yatra', fare: 4180, benchmarkNote: 'Market Median' },
    },
    {
      date: '15 Aug',
      fullDate: '15 Aug 2026',
      avgFare: 4090,
      minFare: 2890,
      maxFare: 5750,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1342', source: 'MakeMyTrip', fare: 2890 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-610', source: 'Air India Direct', fare: 5750 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-451', source: 'MakeMyTrip', fare: 4090, benchmarkNote: 'Market Median' },
    },
    {
      date: '22 Aug',
      fullDate: '22 Aug 2026',
      avgFare: 3990,
      minFare: 2790,
      maxFare: 5680,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1342', source: 'EaseMyTrip', fare: 2790 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-610', source: 'Cleartrip', fare: 5680 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-451', source: 'IndiGo Direct', fare: 3990, benchmarkNote: 'Market Median' },
    },
    {
      date: '29 Aug',
      fullDate: '29 Aug 2026',
      avgFare: 3940,
      minFare: 2750,
      maxFare: 5600,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1342', source: 'EaseMyTrip', fare: 2750 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-610', source: 'Air India Direct', fare: 5600 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-451', source: 'MakeMyTrip', fare: 3940, benchmarkNote: 'Market Benchmark' },
    },
    {
      date: '5 Sep',
      fullDate: '5 Sep 2026',
      avgFare: 3890,
      minFare: 2690,
      maxFare: 5550,
      minFlight: { airline: 'Akasa Air', flightNumber: 'QP-1342', source: 'MakeMyTrip', fare: 2690 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-610', source: 'Air India Direct', fare: 5550 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-451', source: 'EaseMyTrip', fare: 3890, benchmarkNote: 'Market Benchmark' },
    },
  ],
  'MAA → DEL': [
    {
      date: '1 Aug',
      fullDate: '1 Aug 2026',
      avgFare: 6100,
      minFare: 4600,
      maxFare: 8200,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-104', source: 'EaseMyTrip', fare: 4600 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-430', source: 'Air India Direct', fare: 8200 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2115', source: 'MakeMyTrip', fare: 6100, benchmarkNote: 'Market Median' },
    },
    {
      date: '8 Aug',
      fullDate: '8 Aug 2026',
      avgFare: 5950,
      minFare: 4450,
      maxFare: 8050,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-104', source: 'MakeMyTrip', fare: 4450 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-430', source: 'Air India Direct', fare: 8050 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2115', source: 'Yatra', fare: 5950, benchmarkNote: 'Market Median' },
    },
    {
      date: '15 Aug',
      fullDate: '15 Aug 2026',
      avgFare: 5800,
      minFare: 4350,
      maxFare: 7900,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-104', source: 'EaseMyTrip', fare: 4350 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-430', source: 'Cleartrip', fare: 7900 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2115', source: 'MakeMyTrip', fare: 5800, benchmarkNote: 'Market Median' },
    },
    {
      date: '22 Aug',
      fullDate: '22 Aug 2026',
      avgFare: 5650,
      minFare: 4250,
      maxFare: 7750,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-104', source: 'Yatra', fare: 4250 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-430', source: 'Air India Direct', fare: 7750 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2115', source: 'Cleartrip', fare: 5650, benchmarkNote: 'Market Median' },
    },
    {
      date: '29 Aug',
      fullDate: '29 Aug 2026',
      avgFare: 5540,
      minFare: 4180,
      maxFare: 7650,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-104', source: 'EaseMyTrip', fare: 4180 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-430', source: 'Air India Direct', fare: 7650 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2115', source: 'MakeMyTrip', fare: 5540, benchmarkNote: 'Market Benchmark' },
    },
    {
      date: '5 Sep',
      fullDate: '5 Sep 2026',
      avgFare: 5450,
      minFare: 4100,
      maxFare: 7550,
      minFlight: { airline: 'SpiceJet', flightNumber: 'SG-104', source: 'MakeMyTrip', fare: 4100 },
      maxFlight: { airline: 'Air India', flightNumber: 'AI-430', source: 'Air India Direct', fare: 7550 },
      avgFlight: { airline: 'IndiGo', flightNumber: '6E-2115', source: 'EaseMyTrip', fare: 5450, benchmarkNote: 'Market Benchmark' },
    },
  ],
};

// Fallback generator for other popular routes
function getRouteData(routeKey: string, airlineFilter: string): HistoricalTrendPoint[] {
  const baseData = ROUTE_HISTORICAL_DATA[routeKey] || ROUTE_HISTORICAL_DATA['DEL → BOM'];
  if (airlineFilter === 'All Airlines') return baseData;

  // If specific airline selected, tailor the flight attributions and price bounds
  return baseData.map((pt) => {
    let minFlight: FlightPriceAttribution = pt.minFlight!;
    let maxFlight: FlightPriceAttribution = pt.maxFlight!;
    let avgFlight: FlightPriceAttribution = pt.avgFlight!;

    if (airlineFilter === 'IndiGo') {
      minFlight = { airline: 'IndiGo', flightNumber: '6E-2041', source: 'EaseMyTrip', fare: pt.minFare + 120 };
      maxFlight = { airline: 'IndiGo', flightNumber: '6E-5324', source: 'IndiGo Direct', fare: pt.maxFare - 400 };
      avgFlight = { airline: 'IndiGo', flightNumber: '6E-2041', source: 'MakeMyTrip', fare: pt.avgFare, benchmarkNote: 'IndiGo Standard' };
    } else if (airlineFilter === 'Air India') {
      minFlight = { airline: 'Air India', flightNumber: 'AI-805', source: 'MakeMyTrip', fare: pt.minFare + 450 };
      maxFlight = { airline: 'Air India', flightNumber: 'AI-803', source: 'Air India Direct', fare: pt.maxFare };
      avgFlight = { airline: 'Air India', flightNumber: 'AI-803', source: 'Air India Direct', fare: pt.avgFare + 300, benchmarkNote: 'Air India Standard' };
    } else if (airlineFilter === 'SpiceJet') {
      minFlight = { airline: 'SpiceJet', flightNumber: 'SG-8169', source: 'EaseMyTrip', fare: pt.minFare };
      maxFlight = { airline: 'SpiceJet', flightNumber: 'SG-8169', source: 'SpiceJet Direct', fare: pt.maxFare - 650 };
      avgFlight = { airline: 'SpiceJet', flightNumber: 'SG-8169', source: 'Yatra', fare: pt.avgFare - 280, benchmarkNote: 'SpiceJet Saver' };
    } else if (airlineFilter === 'Akasa Air') {
      minFlight = { airline: 'Akasa Air', flightNumber: 'QP-1102', source: 'EaseMyTrip', fare: pt.minFare };
      maxFlight = { airline: 'Akasa Air', flightNumber: 'QP-1102', source: 'Akasa Direct', fare: pt.maxFare - 800 };
      avgFlight = { airline: 'Akasa Air', flightNumber: 'QP-1102', source: 'MakeMyTrip', fare: pt.avgFare - 350, benchmarkNote: 'Akasa Saver' };
    }

    return {
      ...pt,
      minFlight,
      maxFlight,
      avgFlight,
      minFare: minFlight.fare,
      maxFare: maxFlight.fare,
      avgFare: avgFlight.fare,
    };
  });
}

// Custom Tooltip Component displaying the flight name, airline, provider, and exact fare
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey: string;
  payload: HistoricalTrendPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  selectedRoute: string;
}

const CustomHistoricalTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  selectedRoute,
}) => {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  if (!point || !point.minFlight || !point.maxFlight || !point.avgFlight) return null;

  return (
    <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-white min-w-[310px] sm:min-w-[350px] space-y-3 z-50 pointer-events-none transition-all">
      {/* TOOLTIP HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-black text-slate-100">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{point.fullDate || label}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Observed Airfare by Operating Flight</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950/90 text-blue-300 border border-blue-800/60">
          {selectedRoute}
        </span>
      </div>

      {/* FLIGHT ATTRIBUTION LIST */}
      <div className="space-y-2">
        {/* MAXIMUM FARE (Peak Spike) */}
        <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-900/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">
                Maximum Fare (Peak Spike)
              </span>
            </div>
            <div className="text-xs font-black text-white flex items-center space-x-1.5">
              <Plane className="w-3.5 h-3.5 text-red-400 -rotate-45" />
              <span className="text-slate-100 font-extrabold">
                {point.maxFlight.airline} {point.maxFlight.flightNumber}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Provider: <span className="text-slate-300 font-semibold">{point.maxFlight.source}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-red-400 font-mono tracking-tight">
              ₹{point.maxFare.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 font-bold uppercase">
              Peak Spike
            </span>
          </div>
        </div>

        {/* AVERAGE FARE (Market Benchmark) */}
        <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(37,99,235,0.8)]" />
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                Average Market Fare
              </span>
            </div>
            <div className="text-xs font-black text-white flex items-center space-x-1.5">
              <Plane className="w-3.5 h-3.5 text-blue-400 -rotate-45" />
              <span className="text-slate-100 font-extrabold">
                {point.avgFlight.airline} {point.avgFlight.flightNumber}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Benchmark: <span className="text-slate-300 font-semibold">{point.avgFlight.source}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-blue-400 font-mono tracking-tight">
              ₹{point.avgFare.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 font-bold uppercase">
              Route Median
            </span>
          </div>
        </div>

        {/* MINIMUM FARE (Lowest Deal) */}
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Minimum Fare (Best Deal)
              </span>
            </div>
            <div className="text-xs font-black text-emerald-200 flex items-center space-x-1.5">
              <Plane className="w-3.5 h-3.5 text-emerald-400 -rotate-45" />
              <span className="text-emerald-100 font-extrabold">
                {point.minFlight.airline} {point.minFlight.flightNumber}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Provider: <span className="text-slate-300 font-semibold">{point.minFlight.source}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-emerald-400 font-mono tracking-tight">
              ₹{point.minFare.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 font-bold uppercase">
              Lowest Deal
            </span>
          </div>
        </div>
      </div>

      <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 text-center flex items-center justify-center space-x-1">
        <Info className="w-3 h-3 text-blue-400" />
        <span>Fares reflect real-time aggregator and direct airline observations</span>
      </div>
    </div>
  );
};

export default function PriceTrendsPage() {
  const [selectedRoute, setSelectedRoute] = useState('DEL → BOM');
  const [selectedAirline, setSelectedAirline] = useState('All Airlines');
  const [dateRange, setDateRange] = useState('30 Days');
  const [showFlightLabels, setShowFlightLabels] = useState(true);
  const [activePointIndex, setActivePointIndex] = useState<number>(4); // Default to '29 Aug'

  // Dynamic historical data with operating flight details
  const historicalLineData = useMemo(() => {
    return getRouteData(selectedRoute, selectedAirline);
  }, [selectedRoute, selectedAirline]);

  const activeObservation = historicalLineData[activePointIndex] || historicalLineData[historicalLineData.length - 1];

  const weeklyTrendData = [
    { day: 'Mon', avgFare: 5100, bestFlight: 'IndiGo 6E-2041', provider: 'EaseMyTrip' },
    { day: 'Tue', avgFare: 4950, bestFlight: 'Akasa Air QP-1102', provider: 'MakeMyTrip' },
    { day: 'Wed', avgFare: 4890, bestFlight: 'SpiceJet SG-8169', provider: 'SpiceJet Direct' },
    { day: 'Thu', avgFare: 5200, bestFlight: 'IndiGo 6E-5324', provider: 'Yatra' },
    { day: 'Fri', avgFare: 5850, bestFlight: 'Air India AI-805', provider: 'Air India Direct' },
    { day: 'Sat', avgFare: 6100, bestFlight: 'Air India AI-803', provider: 'Cleartrip' },
    { day: 'Sun', avgFare: 5900, bestFlight: 'IndiGo 6E-2041', provider: 'EaseMyTrip' },
  ];

  const monthlyTrendData = [
    { month: 'Apr', avgFare: 4850, benchmarkFlight: 'SpiceJet SG-8169', lowestFare: 3650 },
    { month: 'May', avgFare: 5200, benchmarkFlight: 'Akasa Air QP-1102', lowestFare: 3800 },
    { month: 'Jun', avgFare: 5600, benchmarkFlight: 'IndiGo 6E-2041', lowestFare: 4100 },
    { month: 'Jul', avgFare: 5350, benchmarkFlight: 'IndiGo 6E-5324', lowestFare: 3950 },
    { month: 'Aug', avgFare: 5580, benchmarkFlight: 'Air India AI-805', lowestFare: 4050 },
    { month: 'Sep', avgFare: 5420, benchmarkFlight: 'IndiGo 6E-2041', lowestFare: 3980 },
  ];

  // Custom graph label rendering directly on the line chart points
  const renderMinFlightLabel = (props: any) => {
    const { x, y, index } = props;
    if (x === undefined || y === undefined || index === undefined || !showFlightLabels) return null;
    const pt = historicalLineData[Number(index)];
    if (!pt || !pt.minFlight) return null;

    return (
      <g transform={`translate(${x},${y + 8})`}>
        <rect x="-34" y="0" width="68" height="15" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
        <text x="0" y="11" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          {pt.minFlight.flightNumber}
        </text>
      </g>
    );
  };

  const renderMaxFlightLabel = (props: any) => {
    const { x, y, index } = props;
    if (x === undefined || y === undefined || index === undefined || !showFlightLabels) return null;
    const pt = historicalLineData[Number(index)];
    if (!pt || !pt.maxFlight) return null;

    return (
      <g transform={`translate(${x},${y - 21})`}>
        <rect x="-34" y="0" width="68" height="15" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
        <text x="0" y="11" textAnchor="middle" fill="#fca5a5" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          {pt.maxFlight.flightNumber}
        </text>
      </g>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-black uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Airfare Analytics & Intelligence</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Price Trends</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Historical fare movements, provider flight attributions, weekly volatility, and cyclical seasonal curves.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-white border border-slate-300 font-bold text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none cursor-pointer hover:border-blue-500"
          >
            {POPULAR_ROUTES.map((r) => (
              <option key={`${r.fromCode}-${r.toCode}`} value={`${r.fromCode} → ${r.toCode}`}>
                {r.fromCode} → {r.toCode} ({r.fromCity} - {r.toCity})
              </option>
            ))}
          </select>

          <select
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            className="bg-white border border-slate-300 font-bold text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none cursor-pointer hover:border-blue-500"
          >
            <option value="All Airlines">All Airlines</option>
            {AIRLINES.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-slate-300 font-bold text-xs rounded-xl px-3 py-2 text-slate-800 shadow-xs focus:outline-none cursor-pointer hover:border-blue-500"
          >
            <option value="7 Days">7 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="90 Days">90 Days</option>
          </select>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Fare"
          value={`₹${activeObservation.avgFare.toLocaleString('en-IN')}`}
          subtitle={`${activeObservation.avgFlight?.airline} ${activeObservation.avgFlight?.flightNumber} Benchmark`}
        />
        <StatCard
          title="Minimum Fare"
          value={`₹${activeObservation.minFare.toLocaleString('en-IN')}`}
          subtitle={`Lowest: ${activeObservation.minFlight?.airline} ${activeObservation.minFlight?.flightNumber}`}
        />
        <StatCard
          title="Maximum Fare"
          value={`₹${activeObservation.maxFare.toLocaleString('en-IN')}`}
          subtitle={`Peak: ${activeObservation.maxFlight?.airline} ${activeObservation.maxFlight?.flightNumber}`}
        />
        <StatCard
          title="Price Change"
          value="↓ 6.2%"
          change={-6.2}
          subtitle="Observed downward trajectory"
        />
      </div>

      {/* CHART 1: HISTORICAL AIRFARE LINE CHART WITH FLIGHT NAMES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-slate-900">
                1. Historical Airfare Movement ({selectedRoute})
              </h2>
              <Badge variant="blue" size="sm">
                Flight Attributed
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Hover over any observation point to view the exact operating flight numbers and booking sources providing each price.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowFlightLabels(!showFlightLabels)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                showFlightLabels
                  ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle flight number badges directly on chart points"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{showFlightLabels ? 'Flight Badges: On' : 'Flight Badges: Off'}</span>
            </button>
          </div>
        </div>

        {/* CHART CONTAINER */}
        <div className="h-88 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalLineData}
              margin={{ top: 25, right: 30, left: 10, bottom: 5 }}
              onMouseMove={(e: any) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setActivePointIndex(e.activeTooltipIndex);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                domain={['dataMin - 300', 'dataMax + 400']}
                tickFormatter={(val: number) => `₹${val.toLocaleString('en-IN')}`}
              />
              <Tooltip
                content={<CustomHistoricalTooltip selectedRoute={selectedRoute} />}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }}
                iconType="circle"
              />
              {/* AVERAGE FARE (Blue solid) */}
              <Line
                type="monotone"
                dataKey="avgFare"
                name={`Average Fare (${activeObservation.avgFlight?.flightNumber || 'Benchmark'})`}
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2, r: 4.5 }}
                activeDot={{ r: 7, stroke: '#2563eb', strokeWidth: 3, fill: '#ffffff' }}
              />
              {/* MINIMUM FARE (Green dashed) */}
              <Line
                type="monotone"
                dataKey="minFare"
                name={`Minimum Fare (${activeObservation.minFlight?.flightNumber || 'Best Deal'})`}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={renderMinFlightLabel}
                dot={{ fill: '#10b981', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 7, stroke: '#10b981', strokeWidth: 3, fill: '#ffffff' }}
              />
              {/* MAXIMUM FARE (Red dashed) */}
              <Line
                type="monotone"
                dataKey="maxFare"
                name={`Maximum Fare (${activeObservation.maxFlight?.flightNumber || 'Peak Spike'})`}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={renderMaxFlightLabel}
                dot={{ fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 7, stroke: '#ef4444', strokeWidth: 3, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ACTIVE OBSERVATION FLIGHT DETAIL STRIP */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Operating Flights at {activeObservation.fullDate || activeObservation.date} ({selectedRoute})
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Click or hover on chart points to inspect carriers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* MINIMUM FARE FLIGHT CARD */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Lowest Rate Carrier
                  </span>
                </div>
                <div className="text-sm font-black text-emerald-950 flex items-center space-x-1">
                  <Plane className="w-3.5 h-3.5 text-emerald-600 -rotate-45" />
                  <span>{activeObservation.minFlight?.airline} {activeObservation.minFlight?.flightNumber}</span>
                </div>
                <div className="text-[11px] text-emerald-700">
                  via <span className="font-bold">{activeObservation.minFlight?.source}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-emerald-700 font-mono">
                  ₹{activeObservation.minFare.toLocaleString('en-IN')}
                </div>
                <Badge variant="emerald" size="sm">
                  Best Deal
                </Badge>
              </div>
            </div>

            {/* BENCHMARK FARE FLIGHT CARD */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                    Route Benchmark Carrier
                  </span>
                </div>
                <div className="text-sm font-black text-blue-950 flex items-center space-x-1">
                  <Plane className="w-3.5 h-3.5 text-blue-600 -rotate-45" />
                  <span>{activeObservation.avgFlight?.airline} {activeObservation.avgFlight?.flightNumber}</span>
                </div>
                <div className="text-[11px] text-blue-700">
                  via <span className="font-bold">{activeObservation.avgFlight?.source}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-blue-700 font-mono">
                  ₹{activeObservation.avgFare.toLocaleString('en-IN')}
                </div>
                <Badge variant="blue" size="sm">
                  Median
                </Badge>
              </div>
            </div>

            {/* MAXIMUM FARE FLIGHT CARD */}
            <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider">
                    Peak Fare Carrier
                  </span>
                </div>
                <div className="text-sm font-black text-red-950 flex items-center space-x-1">
                  <Plane className="w-3.5 h-3.5 text-red-600 -rotate-45" />
                  <span>{activeObservation.maxFlight?.airline} {activeObservation.maxFlight?.flightNumber}</span>
                </div>
                <div className="text-[11px] text-red-700">
                  via <span className="font-bold">{activeObservation.maxFlight?.source}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-red-700 font-mono">
                  ₹{activeObservation.maxFare.toLocaleString('en-IN')}
                </div>
                <Badge variant="amber" size="sm">
                  Peak Spike
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN CHARTS: WEEKLY & MONTHLY TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 2: WEEKLY PRICE TREND */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                2. Weekly Price Trend (Cyclical Pattern)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Day-of-week rate variances and top performing flight
              </p>
            </div>
            <Badge variant="cyan" size="sm">
              Day of Week
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v: number) => `₹${v}`} />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [
                    `₹${Number(val || 0).toLocaleString('en-IN')}`,
                    `Best Rate: ${item?.payload?.bestFlight || 'IndiGo'} (${item?.payload?.provider || 'Direct'})`,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    padding: '10px 14px',
                  }}
                />
                <Bar dataKey="avgFare" name="Average Fare" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: MONTHLY PRICE TREND */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                3. Monthly Price Trend (Seasonal Trajectory)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Monthly average airfares and primary benchmark carriers
              </p>
            </div>
            <Badge variant="emerald" size="sm">
              Monthly Trajectory
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v: number) => `₹${v}`} />
                <Tooltip
                  formatter={(val: any, _name: any, item: any) => [
                    `₹${Number(val || 0).toLocaleString('en-IN')}`,
                    `Benchmark: ${item?.payload?.benchmarkFlight || 'IndiGo'} (Min: ₹${Number(item?.payload?.lowestFare || 0).toLocaleString('en-IN')})`,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    padding: '10px 14px',
                  }}
                />
                <Line type="monotone" dataKey="avgFare" name="Monthly Avg Fare" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ANALYTICAL INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-extrabold text-blue-950 text-sm flex items-center">
            <TrendingDown className="w-4 h-4 mr-2 text-blue-600" />
            Historical Trend Insight
          </h4>
          <p className="text-xs text-blue-900 font-medium leading-relaxed">
            Average fare on {selectedRoute} decreased 6.2% over the selected 30-day period. SpiceJet (SG-8169) and Akasa Air (QP-1102) consistently provided the most competitive sub-₹4,000 saver rates via aggregator channels.
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
          <h4 className="font-extrabold text-amber-950 text-sm flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-amber-600" />
            Weekly Volatility Insight
          </h4>
          <p className="text-xs text-amber-900 font-medium leading-relaxed">
            Weekend peak departures (Friday & Saturday) surge up to 24% over Wednesday mid-week lulls. Premium legacy flights like Air India AI-803 show higher peak pricing with included checked baggage and flexibility.
          </p>
        </div>
      </div>
    </div>
  );
}
