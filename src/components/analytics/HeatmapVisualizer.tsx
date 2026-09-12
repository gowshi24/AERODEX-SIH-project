'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, TrendingUp, TrendingDown, Info, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface MapCity {
  code: string;
  name: string;
  x: number; // SVG percentage 0-100
  y: number; // SVG percentage 0-100
}

const CITIES: MapCity[] = [
  { code: 'DEL', name: 'Delhi', x: 38, y: 28 },
  { code: 'BOM', name: 'Mumbai', x: 26, y: 58 },
  { code: 'BLR', name: 'Bengaluru', x: 36, y: 76 },
  { code: 'CCU', name: 'Kolkata', x: 74, y: 44 },
  { code: 'HYD', name: 'Hyderabad', x: 44, y: 64 },
  { code: 'MAA', name: 'Chennai', x: 46, y: 78 },
  { code: 'GOI', name: 'Goa', x: 28, y: 68 },
];

export interface MapRoute {
  id: string;
  from: string;
  to: string;
  avgFare: number;
  index: number;
  change: number;
  flightsCount: number;
  airlinesCount: number;
  sourcesCount: number;
  thickness: number; // 2 to 6
  color: string;
}

const ROUTES_DATA: MapRoute[] = [
  { id: 'DEL-BOM', from: 'DEL', to: 'BOM', avgFare: 4850, index: 121.5, change: 2.4, flightsCount: 68, airlinesCount: 5, sourcesCount: 11, thickness: 5, color: '#3b82f6' },
  { id: 'DEL-BLR', from: 'DEL', to: 'BLR', avgFare: 5200, index: 117.8, change: -1.2, flightsCount: 52, airlinesCount: 4, sourcesCount: 10, thickness: 4.5, color: '#10b981' },
  { id: 'BOM-BLR', from: 'BOM', to: 'BLR', avgFare: 3890, index: 115.4, change: 3.1, flightsCount: 44, airlinesCount: 4, sourcesCount: 9, thickness: 4, color: '#f59e0b' },
  { id: 'DEL-CCU', from: 'DEL', to: 'CCU', avgFare: 4950, index: 119.2, change: 0.8, flightsCount: 38, airlinesCount: 3, sourcesCount: 8, thickness: 3.5, color: '#3b82f6' },
  { id: 'BLR-HYD', from: 'BLR', to: 'HYD', avgFare: 2950, index: 112.0, change: -0.5, flightsCount: 32, airlinesCount: 3, sourcesCount: 8, thickness: 3, color: '#10b981' },
  { id: 'MAA-DEL', from: 'MAA', to: 'DEL', avgFare: 5450, index: 123.1, change: 4.2, flightsCount: 30, airlinesCount: 3, sourcesCount: 9, thickness: 3.5, color: '#ef4444' },
  { id: 'DEL-GOI', from: 'DEL', to: 'GOI', avgFare: 5890, index: 126.4, change: 5.6, flightsCount: 24, airlinesCount: 4, sourcesCount: 7, thickness: 2.5, color: '#ef4444' },
];

export const HeatmapVisualizer: React.FC = () => {
  const router = useRouter();
  const [selectedRoute, setSelectedRoute] = useState<MapRoute | null>(null);

  const getCity = (code: string) => CITIES.find((c) => c.code === code)!;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Plane className="w-4 h-4 transform -rotate-45" />
            <span>Interactive India Airfare Route Network</span>
          </div>
          <h2 className="text-2xl font-black text-white">Route Volume & Intensity Heatmap</h2>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Stable / Moderate</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>High Inflation</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Price Drop</span>
          </span>
        </div>
      </div>

      {/* SVG INDIA MAP CANVAS */}
      <div className="relative w-full h-[450px] sm:h-[550px] my-4">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* STYLIZED INDIA MAP BOUNDARY OUTLINE */}
          <path
            d="M 35 12 L 48 10 L 54 18 L 50 26 L 65 30 L 78 35 L 85 45 L 75 52 L 58 60 L 52 75 L 44 88 L 38 90 L 32 80 L 24 68 L 22 55 L 28 42 L 32 30 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="0.8"
            className="opacity-70"
          />

          {/* ROUTE CONNECTING LINES */}
          {ROUTES_DATA.map((route) => {
            const cityA = getCity(route.from);
            const cityB = getCity(route.to);
            return (
              <g key={route.id} className="cursor-pointer group" onClick={() => setSelectedRoute(route)}>
                <line
                  x1={cityA.x}
                  y1={cityA.y}
                  x2={cityB.x}
                  y2={cityB.y}
                  stroke={route.color}
                  strokeWidth={route.thickness * 0.4}
                  strokeLinecap="round"
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <line
                  x1={cityA.x}
                  y1={cityA.y}
                  x2={cityB.x}
                  y2={cityB.y}
                  stroke={route.color}
                  strokeWidth={route.thickness * 0.8}
                  strokeDasharray="2 2"
                  className="animate-pulse opacity-40"
                />
              </g>
            );
          })}

          {/* CITY NODES */}
          {CITIES.map((city) => (
            <g key={city.code} transform={`translate(${city.x}, ${city.y})`}>
              <circle r="2.5" fill="#06b6d4" className="animate-ping opacity-75" />
              <circle r="2" fill="#0284c7" stroke="#ffffff" strokeWidth="0.5" />
              <text
                x="3"
                y="1.2"
                fill="#f8fafc"
                fontSize="3"
                fontWeight="bold"
                className="select-none pointer-events-none drop-shadow-md"
              >
                {city.code}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="text-center text-xs text-slate-400 font-medium">
        Click any route line on the map to inspect live route index, flights observed, and source metrics.
      </div>

      {/* ROUTE DETAIL MODAL */}
      <Modal
        isOpen={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
        title={selectedRoute ? `Route Analytics: ${selectedRoute.from} → ${selectedRoute.to}` : ''}
      >
        {selectedRoute && (
          <div className="space-y-4 text-slate-800">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Average Fare</span>
                <div className="text-xl font-black text-blue-700">
                  ₹{selectedRoute.avgFare.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Route Index</span>
                <div className="text-xl font-black text-slate-900">{selectedRoute.index}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">30D Price Change</span>
                <div
                  className={`text-sm font-extrabold flex items-center ${
                    selectedRoute.change > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {selectedRoute.change > 0 ? '+' : ''}
                  {selectedRoute.change}%
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Daily Observed</span>
                <div className="text-sm font-extrabold text-slate-900">
                  {selectedRoute.flightsCount} flights ({selectedRoute.sourcesCount} sources)
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedRoute(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const r = selectedRoute;
                  setSelectedRoute(null);
                  router.push(`/search?from=${r.from}&to=${r.to}`);
                }}
              >
                Search Flights on Route <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
