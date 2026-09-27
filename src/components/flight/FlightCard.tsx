'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, TrendingDown, TrendingUp, ExternalLink, ArrowRight } from 'lucide-react';
import { Flight } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getDirectFlightWebsiteUrl, getProviderSearchUrl } from '../../lib/booking';

interface FlightCardProps {
  flight: Flight;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const isDown = flight.priceTrendDirection === 'down';
  const directAirlineUrl = getDirectFlightWebsiteUrl(flight);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all">
      {/* CARD TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        {/* AIRLINE & FLIGHT NO */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-700 text-sm">
            {flight.airlineCode}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-slate-900 text-base">{flight.airline}</span>
              <span className="text-xs font-semibold text-slate-400">({flight.flightNumber})</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {flight.departureCity} ({flight.departureCode}) → {flight.arrivalCity} ({flight.arrivalCode})
            </span>
          </div>
        </div>

        {/* LIVE SCRAPED STATUS & PRICE TREND INDICATOR */}
        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-1">
          {flight.isLive !== false ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Web Scraped</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
              <span>Warehouse Record</span>
            </span>
          )}
          <div
            className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
              isDown
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isDown ? <TrendingDown className="w-3.5 h-3.5 mr-1" /> : <TrendingUp className="w-3.5 h-3.5 mr-1" />}
            <span>
              {isDown ? '↓' : '↑'} {Math.abs(flight.priceTrendPercent)}%
            </span>
          </div>
        </div>
      </div>

      {/* ROUTE TIMES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center py-1">
        <div className="text-left md:text-center">
          <div className="text-2xl font-black text-slate-900">{flight.departureTime}</div>
          <div className="text-xs font-bold text-slate-500">{flight.departureCode}</div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-400">{flight.duration}</span>
          <div className="w-full flex items-center my-1">
            <div className="h-0.5 w-full bg-slate-200 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600"></span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-600">
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
          </span>
        </div>

        <div className="text-right md:text-center">
          <div className="text-2xl font-black text-slate-900">{flight.arrivalTime}</div>
          <div className="text-xs font-bold text-slate-500">{flight.arrivalCode}</div>
        </div>
      </div>

      {/* SOURCE COMPARISON BAR */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 block truncate max-w-sm">
            {flight.sourcePortal ? `Feed: ${flight.sourcePortal}` : 'Direct & OTA Price Comparison'}
          </span>
          <span className="text-[10px] font-semibold text-slate-500">
            Click provider to book directly
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {flight.sources.map((src, idx) => {
            const destUrl = src.bookingUrl || (src.type === 'airline' ? directAirlineUrl : getProviderSearchUrl(flight, src.name));
            return (
              <a
                key={idx}
                href={destUrl || directAirlineUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Auto-search on ${src.name}`}
                className={`p-2 rounded-lg border text-center transition-all hover:scale-[1.02] block cursor-pointer ${
                  src.isCheapest
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-extrabold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="text-[10px] text-slate-500 font-medium truncate flex items-center justify-center gap-1">
                  <span>{src.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                </div>
                <div className="font-black pt-0.5">₹{src.price.toLocaleString('en-IN')}</div>
              </a>
            );
          })}
        </div>
      </div>

      {/* ACTION BUTTONS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Lowest Direct Price</span>
          <div className="text-2xl font-black text-blue-700">
            ₹{flight.basePrice.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/flight/${encodeURIComponent(flight.id)}?from=${flight.departureCode}&to=${flight.arrivalCode}&date=${flight.travelDate}`}
            onClick={() => {
              if (typeof window !== 'undefined') {
                try {
                  sessionStorage.setItem('aerodex_selected_flight', JSON.stringify(flight));
                  sessionStorage.setItem(`aerodex_flight_${flight.id}`, JSON.stringify(flight));
                  sessionStorage.setItem('aerodex_search_from', flight.departureCode);
                  sessionStorage.setItem('aerodex_search_to', flight.arrivalCode);
                  sessionStorage.setItem('aerodex_search_date', flight.travelDate || '');
                } catch (e) {}
              }
            }}
          >
            <Button variant="outline" size="sm" className="font-bold">
              View Details
            </Button>
          </Link>
          <a
            href={directAirlineUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" className="font-bold shadow-xs flex items-center space-x-1.5">
              <span>Auto-Search on {flight.airline}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
