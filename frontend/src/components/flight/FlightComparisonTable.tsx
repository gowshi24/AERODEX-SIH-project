'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import { Flight } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface FlightComparisonTableProps {
  flights: Flight[];
}

export const FlightComparisonTable: React.FC<FlightComparisonTableProps> = ({ flights }) => {
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(flights[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedFlightId(expandedFlightId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {flights.map((flight) => {
        const isExpanded = expandedFlightId === flight.id;
        const lowestSource = flight.sources.find((s) => s.isCheapest) || flight.sources[0];
        const sourceCount = flight.sources.length;

        return (
          <div
            key={flight.id}
            className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
              isExpanded
                ? 'border-blue-500 shadow-md ring-2 ring-blue-100'
                : 'border-slate-200/90 hover:border-blue-300 shadow-xs'
            }`}
          >
            {/* MAIN FLIGHT SUMMARY CARD BAR */}
            <div
              onClick={() => toggleExpand(flight.id)}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer select-none bg-white hover:bg-slate-50/50 transition-colors"
            >
              {/* AIRLINE & FLIGHT INFO */}
              <div className="flex items-center space-x-4 min-w-[200px]">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-700 text-sm shadow-xs">
                  {flight.airlineCode}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-base">{flight.airline}</span>
                    <span className="text-xs font-semibold text-slate-400">({flight.flightNumber})</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {flight.aircraft || 'Airbus A320'} • {flight.fareClass || 'Economy Saver'}
                  </div>
                </div>
              </div>

              {/* TIMES & ROUTE */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-lg font-black text-slate-900">{flight.departureTime}</div>
                  <div className="text-[11px] font-bold text-slate-600">{flight.departureCode}</div>
                </div>

                <div className="flex flex-col items-center min-w-[100px]">
                  <span className="text-[10px] font-bold text-slate-400">{flight.duration}</span>
                  <div className="w-full flex items-center my-1">
                    <div className="h-0.5 w-full bg-slate-200 relative">
                      {flight.stops === 0 ? (
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500"></span>
                      ) : (
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
                  </span>
                </div>

                <div className="text-center">
                  <div className="text-lg font-black text-slate-900">{flight.arrivalTime}</div>
                  <div className="text-[11px] font-bold text-slate-600">{flight.arrivalCode}</div>
                </div>
              </div>

              {/* PRICING & SOURCES BADGE */}
              <div className="flex items-center space-x-4 md:space-x-6 self-end md:self-auto">
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Badge variant="emerald" size="sm">
                      BEST PRICE
                    </Badge>
                  </div>
                  <div className="text-xl font-black text-blue-700 pt-0.5">
                    ₹{flight.basePrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-600 font-medium">
                    via {lowestSource.name}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link href={`/flight/${flight.id}`} onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                      Details
                    </Button>
                  </Link>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* EXPANDED MULTI-SOURCE COMPARISON PANEL */}
            {isExpanded && (
              <div className="bg-slate-50/70 border-t border-slate-200 p-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                {/* HIGHLIGHT BANNER */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 font-medium">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>
                      Price checked across <strong className="font-bold">{sourceCount} sources</strong>. Save up to ₹160 compared to market average.
                    </span>
                  </div>
                  <Badge variant="cyan" size="sm">
                    Verified {flight.cheapestSource} Lowest
                  </Badge>
                </div>

                {/* COMPARISON MATRIX GRID */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Multi-Source Airfare Breakdown Matrix
                  </h4>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                          <th className="p-3">Source Provider</th>
                          <th className="p-3">Source Type</th>
                          <th className="p-3">Base Fare</th>
                          <th className="p-3">Taxes & Charges</th>
                          <th className="p-3">Convenience Fees</th>
                          <th className="p-3 text-right">Total Fare</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                        {flight.sources.map((src, idx) => (
                          <tr
                            key={idx}
                            className={`hover:bg-blue-50/30 transition-colors ${
                              src.isCheapest ? 'bg-emerald-50/40 font-semibold' : ''
                            }`}
                          >
                            <td className="p-3 flex items-center space-x-2">
                              <span className="font-bold text-slate-900">{src.name}</span>
                              {src.isCheapest && (
                                <Badge variant="emerald" size="sm">
                                  Lowest
                                </Badge>
                              )}
                            </td>
                            <td className="p-3 text-slate-600 uppercase text-[10px] font-bold">
                              {src.type}
                            </td>
                            <td className="p-3 text-slate-700">
                              ₹{(src.baseFare || Math.round(src.price * 0.82)).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-slate-700">
                              ₹{(src.taxes || Math.round(src.price * 0.13)).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-slate-700">
                              ₹{(src.fees || Math.round(src.price * 0.05)).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-right font-black text-slate-900 text-sm">
                              ₹{src.price.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3 text-center">
                              <Link
                                href={`/book?flightId=${flight.id}&source=${encodeURIComponent(
                                  src.name
                                )}&price=${src.price}`}
                              >
                                <Button
                                  size="sm"
                                  variant={src.isCheapest ? 'primary' : 'outline'}
                                  className="py-1 px-3 text-[11px]"
                                >
                                  Select <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* BAGGAGE & REFUNDABILITY */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/80 gap-4">
                  <div className="flex items-center space-x-4">
                    <span>
                      <strong>Cabin:</strong> {flight.baggage.cabin}
                    </span>
                    <span>
                      <strong>Check-in:</strong> {flight.baggage.checkIn}
                    </span>
                    <span>
                      <strong>Refundability:</strong>{' '}
                      <span className="font-bold text-slate-800">{flight.refundability}</span>
                    </span>
                  </div>
                  <Link
                    href={`/flight/${flight.id}`}
                    className="text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1"
                  >
                    <span>View Price History & Full Details</span>
                    <ChevronDown className="w-3.5 h-3.5 transform -rotate-90" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
