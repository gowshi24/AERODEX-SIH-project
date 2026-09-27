'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Search, Sparkles, MapPin, Calendar, Users, ArrowLeftRight } from 'lucide-react';
import { AIRPORTS, POPULAR_ROUTES } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getDefaultDepartureDate } from '../../lib/api';

export default function SearchPage() {
  const router = useRouter();
  const [fromCode, setFromCode] = useState('DEL');
  const [toCode, setToCode] = useState('BOM');
  const [departureDate, setDepartureDate] = useState(() => getDefaultDepartureDate(7));
  const [returnDate, setReturnDate] = useState(() => getDefaultDepartureDate(10));
  const [travellers, setTravellers] = useState('1 Traveller');
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('roundTrip');

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/results?from=${fromCode}&to=${toCode}&depart=${departureDate}&return=${returnDate}&travellers=${encodeURIComponent(
        travellers
      )}&tripType=${tripType}`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="blue" size="md">
          Search Fares Across India
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Flight Search & Fare Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Compare real-time airfares across Indian airlines and Online Travel Aggregators (OTAs).
        </p>
      </div>

      {/* SEARCH FORM CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        {/* TRIP TYPE SELECTION */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setTripType('roundTrip')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'roundTrip'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setTripType('oneWay')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tripType === 'oneWay'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            One Way
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* FROM */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-blue-400 transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                From Origin
              </label>
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="w-full bg-transparent font-black text-slate-900 text-base focus:outline-none cursor-pointer pt-1"
              >
                {AIRPORTS.map((apt) => (
                  <option key={apt.code} value={apt.code}>
                    {apt.city} ({apt.code})
                  </option>
                ))}
              </select>
            </div>

            {/* SWAP BUTTON */}
            <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all"
                title="Swap Airports"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* TO */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-blue-400 transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                To Destination
              </label>
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="w-full bg-transparent font-black text-slate-900 text-base focus:outline-none cursor-pointer pt-1"
              >
                {AIRPORTS.map((apt) => (
                  <option key={apt.code} value={apt.code}>
                    {apt.city} ({apt.code})
                  </option>
                ))}
              </select>
            </div>

            {/* TRAVELLERS */}
            <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-blue-400 transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Travellers
              </label>
              <select
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
                className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer pt-1"
              >
                <option value="1 Traveller">1 Traveller</option>
                <option value="2 Travellers">2 Travellers</option>
                <option value="3 Travellers">3 Travellers</option>
                <option value="4+ Travellers">4+ Travellers</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DEPARTURE */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-blue-400 transition-colors">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
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

            {/* RETURN */}
            <div className={`bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-blue-400 transition-colors ${tripType === 'oneWay' ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Return Date
              </label>
              <div className="flex items-center space-x-2 pt-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <input
                  type="date"
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  value={returnDate}
                  disabled={tripType === 'oneWay'}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto shadow-md font-bold px-8">
              <Search className="w-4 h-4 mr-2" />
              Search Flights
            </Button>
          </div>
        </form>
      </div>

      {/* POPULAR SEARCHES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Popular Searches in India</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_ROUTES.map((route) => (
            <button
              key={`${route.fromCode}-${route.toCode}`}
              onClick={() => {
                setFromCode(route.fromCode);
                setToCode(route.toCode);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                fromCode === route.fromCode && toCode === route.toCode
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {route.fromCode} → {route.toCode} ({route.fromCity} - {route.toCity})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
