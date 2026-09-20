'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Plane,
  ArrowLeft,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { getFlightDetails } from '../../../lib/api';
import { getDirectFlightWebsiteUrl } from '../../../lib/booking';
import { Flight } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';

export default function FlightDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resolvedParams.id) {
      getFlightDetails(resolvedParams.id)
        .then((f) => {
          if (f) setFlight(f);
        })
        .finally(() => setLoading(false));
    }
  }, [resolvedParams.id]);

  if (!flight) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  const cheapestSource = flight.sources.find((s) => s.isCheapest) || flight.sources[0];
  const directAirlineUrl = getDirectFlightWebsiteUrl(flight);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* BACK NAVIGATION */}
      <Link
        href="/results"
        className="inline-flex items-center space-x-2 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Flight Results</span>
      </Link>

      {/* FLIGHT HEADER SUMMARY */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-md">
              {flight.airlineCode}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">{flight.airline}</h1>
                <Badge variant="cyan" size="sm">
                  {flight.flightNumber}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {flight.departureCity} ({flight.departureCode}) → {flight.arrivalCity} ({flight.arrivalCode})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Lowest Fare
              </span>
              <div className="text-3xl font-black text-cyan-400">
                ₹{flight.basePrice.toLocaleString('en-IN')}
              </div>
            </div>
            <a
              href={directAirlineUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="md">
                Book on {flight.airline} <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </a>
          </div>
        </div>

        {/* ROUTE TIMES BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center py-2">
          <div>
            <div className="text-2xl font-black text-white">{flight.departureTime}</div>
            <div className="text-xs font-bold text-slate-300">
              {flight.departureCity} ({flight.departureCode})
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">{flight.duration}</div>
            <div className="w-32 mx-auto my-2 h-0.5 bg-slate-700 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400"></span>
            </div>
            <div className="text-[10px] font-bold text-emerald-400">
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{flight.arrivalTime}</div>
            <div className="text-xs font-bold text-slate-300">
              {flight.arrivalCity} ({flight.arrivalCode})
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FARE COMPARISON TABLE CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Fare Comparison
          </h3>

          <div className="space-y-3">
            {flight.sources.map((src, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  src.isCheapest
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <div className="font-extrabold">{src.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{src.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm">₹{src.price.toLocaleString('en-IN')}</div>
                  {src.isCheapest && (
                    <Badge variant="emerald" size="sm">
                      Cheapest
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FARE INFORMATION */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <h4 className="font-extrabold text-slate-900 text-xs">Fare Information</h4>
            <div>
              <strong>Cabin Baggage:</strong> {flight.baggage.cabin}
            </div>
            <div>
              <strong>Check-in Baggage:</strong> {flight.baggage.checkIn}
            </div>
            <div>
              <strong>Refundability:</strong> {flight.refundability}
            </div>
            <div>
              <strong>Conditions:</strong> Standard fare terms apply.
            </div>
          </div>
        </div>

        {/* PRICE HISTORY PREVIEW & BOOKING SOURCE CARDS */}
        <div className="lg:col-span-2 space-y-8">
          {/* PRICE HISTORY CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Price History Preview
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Observed price changes over previous dates.
                </p>
              </div>
              <Badge variant="blue" size="sm">
                Fare Trend
              </Badge>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flight.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Fare']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BOOK NOW SOURCE CARDS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Book Now — Choose Provider
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {flight.sources.map((src, idx) => {
                const targetUrl = src.bookingUrl || directAirlineUrl;
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-center space-y-3"
                  >
                    <div className="font-extrabold text-slate-900 text-sm">{src.name}</div>
                    <div className="text-lg font-black text-blue-700">₹{src.price.toLocaleString('en-IN')}</div>
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button variant={src.isCheapest ? 'primary' : 'outline'} size="sm" className="w-full text-xs">
                        {src.type === 'airline' ? `Book on ${flight.airline}` : `Continue on ${src.name}`}
                      </Button>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
