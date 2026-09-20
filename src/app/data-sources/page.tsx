'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, ShieldCheck, Activity, Radio } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { getDataSources } from '../../lib/api';
import { DataSource } from '../../types';

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataSources()
      .then((res) => {
        if (res && res.length > 0) {
          setSources(res);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const airlines = sources.filter((s) => s.type === 'AIRLINE');
  const otas = sources.filter((s) => s.type === 'OTA');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Configurable Multi-Portal Scraper Catalog</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Data Source Registry</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            100% genuine live-monitored airline direct portals and Online Travel Aggregators (OTAs) supplying continuous airfare quote streams.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>RFC 9309 Ethical Robot Guard Compliant</span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-bold text-slate-600">Loading live data source registry...</p>
        </div>
      ) : (
        <>
          {/* AIRLINE DIRECT SOURCES */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <span>Airline Direct Portals</span>
              <Badge variant="blue" size="sm">
                {airlines.length} Registered
              </Badge>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {airlines.map((src) => (
                <div
                  key={src.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-slate-900">{src.name}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      LIVE FEED
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 font-medium">
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-bold text-slate-800 text-right">{src.collectionMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Ingest:</span>
                      <span className="font-bold text-slate-800">{src.lastCollection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quotes Logged:</span>
                      <span className="font-black text-blue-700">{src.recordsCollected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Quality:</span>
                      <span className="font-extrabold text-emerald-600">{src.dataQuality}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scope:</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otas.map((src) => (
                <div
                  key={src.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-slate-900">{src.name}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                      LIVE FEED
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 font-medium">
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-bold text-slate-800 text-right">{src.collectionMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Ingest:</span>
                      <span className="font-bold text-slate-800">{src.lastCollection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quotes Logged:</span>
                      <span className="font-black text-cyan-700">{src.recordsCollected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Quality:</span>
                      <span className="font-extrabold text-emerald-600">{src.dataQuality}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scope:</span>
                      <span className="font-bold text-slate-800">{src.coverage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
