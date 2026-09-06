'use client';

import React, { useState } from 'react';
import { AirfareAnomaly } from '../../types';
import { Badge } from '../ui/Badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AnomalyTableProps {
  anomalies: AirfareAnomaly[];
}

export const AnomalyTable: React.FC<AnomalyTableProps> = ({ anomalies }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  const filteredAnomalies =
    selectedSeverity === 'All'
      ? anomalies
      : anomalies.filter((a) => a.severity === selectedSeverity);

  return (
    <div className="aerodex-card bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Airfare Anomaly Detection Registry</h3>
          <p className="text-xs text-slate-500">Automated algorithmic detection of non-standard fare shifts</p>
        </div>

        <div className="flex items-center space-x-2">
          {['All', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedSeverity === sev
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">Route</th>
              <th className="py-3.5 px-4">Airline</th>
              <th className="py-3.5 px-4">Current Price</th>
              <th className="py-3.5 px-4">Previous Price</th>
              <th className="py-3.5 px-4">% Change</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAnomalies.map((anom) => {
              const isSpike = anom.percentageChange > 0;
              return (
                <tr key={anom.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{anom.route}</td>
                  <td className="py-3.5 px-4 font-medium">{anom.airline}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    ₹{anom.currentPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    ₹{anom.previousPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center font-extrabold ${
                        isSpike ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isSpike ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                      {isSpike ? `+${anom.percentageChange}%` : `${anom.percentageChange}%`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        anom.severity === 'High'
                          ? 'danger'
                          : anom.severity === 'Medium'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {anom.severity}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{anom.detectedDate}</td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs font-medium truncate" title={anom.reason}>
                    {anom.reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
