'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Calendar, Users, ArrowRightLeft, Search, BellRing, Sparkles } from 'lucide-react';
import { AIRPORTS } from '../../data/mockData';
import { Button } from '../ui/Button';
import { getDefaultDepartureDate } from '../../lib/api';

interface FlightSearchFormProps {
  initialFrom?: string;
  initialTo?: string;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  initialFrom = 'DEL',
  initialTo = 'BOM',
}) => {
  const router = useRouter();
  const [fromCode, setFromCode] = useState(initialFrom);
  const [toCode, setToCode] = useState(initialTo);
  const [departureDate, setDepartureDate] = useState(() => getDefaultDepartureDate(7));
  const [returnDate, setReturnDate] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/results?from=${fromCode}&to=${toCode}&depart=${departureDate}&cabin=${cabinClass}`);
  };

  const quickRoutes = [
    { from: 'DEL', to: 'BOM', label: 'DEL → BOM' },
    { from: 'DEL', to: 'BLR', label: 'DEL → BLR' },
    { from: 'BOM', to: 'BLR', label: 'BOM → BLR' },
    { from: 'DEL', to: 'CCU', label: 'DEL → CCU' },
    { from: 'BLR', to: 'HYD', label: 'BLR → HYD' },
    { from: 'MAA', to: 'DEL', label: 'MAA → DEL' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
      {/* SEARCH CARD TOP CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2 bg-slate-100/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTripType('oneWay')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'oneWay'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            One Way
          </button>
          <button
            type="button"
            onClick={() => setTripType('roundTrip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'roundTrip'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Round Trip
          </button>
        </div>

        <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <select
              value={travellers}
              onChange={(e) => setTravellers(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value={1}>1 Traveller</option>
              <option value={2}>2 Travellers</option>
              <option value={3}>3 Travellers</option>
              <option value={4}>4+ Travellers</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="bg-transparent font-bold text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="Economy">Economy Saver</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business Class</option>
            </select>
          </div>
        </div>
      </div>

      {/* FORM INPUTS GRID */}
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* FROM CITY */}
          <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-blue-400 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              From Origin
            </label>
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full bg-transparent font-extrabold text-slate-900 text-base focus:outline-none cursor-pointer pt-0.5"
            >
              {AIRPORTS.map((apt) => (
                <option key={apt.code} value={apt.code}>
                  {apt.city} ({apt.code})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-600 block truncate">
              {AIRPORTS.find((a) => a.code === fromCode)?.name}
            </span>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:rotate-180 transition-all"
              title="Swap Airports"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO CITY */}
          <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-blue-400 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              To Destination
            </label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full bg-transparent font-extrabold text-slate-900 text-base focus:outline-none cursor-pointer pt-0.5"
            >
              {AIRPORTS.map((apt) => (
                <option key={apt.code} value={apt.code}>
                  {apt.city} ({apt.code})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-600 block truncate">
              {AIRPORTS.find((a) => a.code === toCode)?.name}
            </span>
          </div>

          {/* DATE PICKERS */}
          <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-blue-400 transition-colors">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Departure Date
            </label>
            <div className="flex items-center space-x-2 pt-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* BUTTONS BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* QUICK ROUTE PILLS */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-600 mr-1 flex items-center">
              <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
              Quick Routes:
            </span>
            {quickRoutes.map((qr) => (
              <button
                key={qr.label}
                type="button"
                onClick={() => {
                  setFromCode(qr.from);
                  setToCode(qr.to);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  fromCode === qr.from && toCode === qr.to
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => router.push(`/trends?route=${fromCode}-${toCode}`)}
              className="w-1/2 sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <BellRing className="w-4 h-4 mr-1.5 text-cyan-600" />
              Track Fare
            </Button>

            <Button type="submit" variant="primary" size="md" className="w-1/2 sm:w-auto shadow-md">
              <Search className="w-4 h-4 mr-2" />
              Search Flights
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
