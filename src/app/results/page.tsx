'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plane, ArrowUpDown, Filter } from 'lucide-react';
import { AIRPORTS } from '../../data/mockData';
import { searchFlights } from '../../lib/api';
import { Flight, FlightFilterState } from '../../types';
import { FlightCard } from '../../components/flight/FlightCard';
import { FilterSidebar } from '../../components/flight/FilterSidebar';
import { Button } from '../../components/ui/Button';
import { LiveStatusBadge } from '../../components/ui/LiveStatusBadge';

function ResultsContent() {
  const searchParams = useSearchParams();
  const fromCode = searchParams.get('from') || 'DEL';
  const toCode = searchParams.get('to') || 'BOM';
  const departDate = searchParams.get('depart') || '2026-09-20';
  const travellers = searchParams.get('travellers') || '1 Traveller';

  const fromAirport = AIRPORTS.find((a) => a.code === fromCode) || AIRPORTS[0];
  const toAirport = AIRPORTS.find((a) => a.code === toCode) || AIRPORTS[1];

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'value'>('cheapest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const defaultFilters: FlightFilterState = {
    maxPrice: 20000,
    stops: [],
    airlines: [],
    departureTimeRange: 'all',
    sortBy: 'cheapest',
  };

  const [filters, setFilters] = useState<FlightFilterState>(defaultFilters);

  const fetchFlightData = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setIsError(false);
    try {
      const results = await searchFlights({
        fromCode,
        toCode,
        departureDate: departDate,
      });
      setFlights(results);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsCached(!forceRefresh && results.some((f) => f.id.includes('db')));
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlightData(false);
  }, [fromCode, toCode, departDate]);

  const filteredFlights = useMemo(() => {
    return flights
      .filter((flight) => {
        if (flight.basePrice > filters.maxPrice) return false;
        if (filters.stops.length > 0) {
          const stopStr = flight.stops === 0 ? '0' : flight.stops === 1 ? '1' : '2+';
          if (!filters.stops.includes(stopStr)) return false;
        }
        if (filters.airlines.length > 0) {
          if (!filters.airlines.includes(flight.airline)) return false;
        }
        if (filters.departureTimeRange !== 'all') {
          const hour = parseInt(flight.departureTime.split(':')[0], 10);
          if (filters.departureTimeRange === 'morning' && (hour < 6 || hour >= 12)) return false;
          if (filters.departureTimeRange === 'afternoon' && (hour < 12 || hour >= 18)) return false;
          if (filters.departureTimeRange === 'evening' && (hour < 18 || hour > 23)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cheapest') return a.basePrice - b.basePrice;
        if (sortBy === 'fastest') return a.duration.localeCompare(b.duration);
        if (sortBy === 'value') return b.priceTrendPercent - a.priceTrendPercent;
        return 0;
      });
  }, [flights, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* TOP ROUTE & SEARCH SUMMARY BAR */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-bold text-white">
            <Plane className="w-6 h-6 transform -rotate-12 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black tracking-tight">
                {fromCode} → {toCode}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/30 text-cyan-300 font-bold border border-blue-400/30">
                {fromAirport.city} to {toAirport.city}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Date: <span className="text-white font-bold">{departDate}</span> • Travellers:{' '}
              <span className="text-white font-bold">{travellers}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <LiveStatusBadge
            isLoading={loading}
            isLive={!isCached && !isError}
            isCached={isCached}
            isError={isError}
            lastUpdated={lastUpdated}
            sourceName="SerpAPI / Google Flights"
            onRefresh={() => fetchFlightData(true)}
          />
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <Link href="/search">
              <Button size="sm" variant="outline" className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-800">
                Change Search
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN RESULTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FILTER SIDEBAR ON DESKTOP */}
        <div className={`lg:col-span-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
        </div>

        {/* FLIGHT RESULTS LIST */}
        <div className="lg:col-span-8 space-y-6">
          {/* SORTING HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Showing <span className="text-slate-900 font-black">{filteredFlights.length}</span> Flights Found
            </span>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                Sort By:
              </span>
              {[
                { label: 'Cheapest', value: 'cheapest' },
                { label: 'Fastest', value: 'fastest' },
                { label: 'Best Value', value: 'value' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    sortBy === opt.value
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* RESULTS CARDS LIST */}
          {loading ? (
            <div className="bg-white p-12 text-center border border-slate-200 rounded-3xl space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Loading latest airfare data from SerpAPI...</p>
            </div>
          ) : filteredFlights.length > 0 ? (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center border border-slate-200 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">No Flights Match Your Selected Filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your max price range slider or clearing stop / airline filter checkboxes.
              </p>
              <Button size="sm" variant="outline" onClick={() => setFilters(defaultFilters)}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-xs font-bold">Loading flight results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
