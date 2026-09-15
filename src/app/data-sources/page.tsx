'use client';

import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { getDataSources } from '../../lib/api';
import { DataSource } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { LiveStatusBadge } from '../../components/ui/LiveStatusBadge';

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getDataSources().then((data) => {
      setSources(data);
      setLoading(false);
    });
  }, []);

  const realtimeMeta = sources.filter((s) => s.type === ('META_OTA' as any) || s.name.includes('SerpApi'));
  const airlines = sources.filter((s) => s.type === 'AIRLINE');
  const otas = sources.filter((s) => s.type === 'OTA' && !s.name.includes('SerpApi'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Configurable Source Registry</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Data Source Registry</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Monitored airline direct portals, SerpAPI Google Flights real-time engine, and Online Travel Aggregators (OTAs).
          </p>
        </div>
        <LiveStatusBadge isLoading={loading} sourceName="SerpAPI Google Flights Engine" />
      </div>

      {/* REALTIME SOURCES */}
      {realtimeMeta.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <span>Real-Time Meta-Search Engine</span>
            <Badge variant="emerald" size="sm">
              Live Connected
            </Badge>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realtimeMeta.map((src) => (
              <div
                key={src.id}
                className="bg-emerald-50/40 border-2 border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">{src.name}</span>
                  <Badge variant="emerald" size="sm">
                    {src.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between">
                    <span>Collection Method:</span>
                    <span className="font-bold text-emerald-800">{src.collectionMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Collection:</span>
                    <span className="font-bold text-slate-800">{src.lastCollection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Records Monitored:</span>
                    <span className="font-bold text-slate-800">{src.recordsCollected.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Quality:</span>
                    <span className="font-extrabold text-emerald-600">{src.dataQuality}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coverage Scope:</span>
                    <span className="font-bold text-slate-800">{src.coverage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AIRLINE DIRECT SOURCES */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <span>Airline Direct Portals</span>
          <Badge variant="blue" size="sm">
            {airlines.length} Registered
          </Badge>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {airlines.map((src) => (
            <div
              key={src.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900">{src.name}</span>
                <Badge variant="cyan" size="sm">
                  {src.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Collection Method:</span>
                  <span className="font-bold text-slate-800">{src.collectionMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Collection:</span>
                  <span className="font-bold text-slate-800">{src.lastCollection}</span>
                </div>
                <div className="flex justify-between">
                  <span>Records Monitored:</span>
                  <span className="font-bold text-slate-800">{src.recordsCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Quality:</span>
                  <span className="font-extrabold text-emerald-600">{src.dataQuality}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage Scope:</span>
                  <span className="font-bold text-slate-800">{src.coverage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OTA SOURCES */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <span>Online Travel Aggregators (OTAs)</span>
          <Badge variant="cyan" size="sm">
            {otas.length} Registered
          </Badge>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otas.map((src) => (
            <div
              key={src.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900">{src.name}</span>
                <Badge variant="cyan" size="sm">
                  {src.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Collection Method:</span>
                  <span className="font-bold text-slate-800">{src.collectionMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Collection:</span>
                  <span className="font-bold text-slate-800">{src.lastCollection}</span>
                </div>
                <div className="flex justify-between">
                  <span>Records Monitored:</span>
                  <span className="font-bold text-slate-800">{src.recordsCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Quality:</span>
                  <span className="font-extrabold text-emerald-600">{src.dataQuality}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage Scope:</span>
                  <span className="font-bold text-slate-800">{src.coverage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
