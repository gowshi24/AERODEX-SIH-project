'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Database, Filter, ArrowUpDown } from 'lucide-react';
import { getDataExplorerFares } from '../../lib/api';
import { ExplorerFareRecord } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function DataExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState<ExplorerFareRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDataExplorerFares(searchQuery).then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, [searchQuery]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Collected At',
      'Source',
      'Airline',
      'Flight Number',
      'Origin',
      'Destination',
      'Travel Date',
      'Base Fare',
      'Taxes',
      'Fees',
      'Total Fare',
      'Status',
    ];
    const rows = records.map((r) => [
      r.id,
      r.collectedAt,
      r.source,
      r.airline,
      r.flightNumber,
      r.origin,
      r.destination,
      r.travelDate,
      r.baseFare,
      r.taxes,
      r.fees,
      r.totalFare,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AERODEX_Fare_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Raw Data Repository</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Data Explorer</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">
            Query, filter, and export individual airfare observation records.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV Data
        </Button>
      </div>

      {/* SEARCH CONTROL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by airline, source, flight number, origin or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* SEARCHABLE TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3">Collected At</th>
                <th className="p-3">Source</th>
                <th className="p-3">Airline</th>
                <th className="p-3">Flight #</th>
                <th className="p-3">Route</th>
                <th className="p-3">Travel Date</th>
                <th className="p-3">Base Fare</th>
                <th className="p-3">Taxes</th>
                <th className="p-3">Fees</th>
                <th className="p-3 text-right">Total Fare</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-600 font-mono text-[11px]">{rec.collectedAt}</td>
                  <td className="p-3 font-bold text-slate-900">{rec.source}</td>
                  <td className="p-3 text-slate-700">{rec.airline}</td>
                  <td className="p-3 font-mono font-bold text-blue-700">{rec.flightNumber}</td>
                  <td className="p-3 font-bold text-slate-900">
                    {rec.origin} → {rec.destination}
                  </td>
                  <td className="p-3 text-slate-600">{rec.travelDate}</td>
                  <td className="p-3 text-slate-700">₹{rec.baseFare}</td>
                  <td className="p-3 text-slate-700">₹{rec.taxes}</td>
                  <td className="p-3 text-slate-700">₹{rec.fees}</td>
                  <td className="p-3 text-right font-black text-slate-900 text-sm">
                    ₹{rec.totalFare.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="emerald" size="sm">
                      {rec.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
