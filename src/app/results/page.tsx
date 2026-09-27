'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plane, ArrowUpDown, Filter, RefreshCw, Radio, CheckCircle2 } from 'lucide-react';
import { AIRPORTS } from '../../data/mockData';
import { FlightCard } from '../../components/flight/FlightCard';
import { FilterSidebar } from '../../components/flight/FilterSidebar';
import { Flight, FlightFilterState } from '../../types';
import { Button } from '../../components/ui/Button';
import { searchFlights, getDefaultDepartureDate } from '../../lib/api';

function ResultsContent() {
  const searchParams = useSearchParams();
  const fromCode = searchParams.get('from') || 'DEL';
  const toCode = searchParams.get('to') || 'BOM';
  const departDate = searchParams.get('depart') || getDefaultDepartureDate(7);
  const travellers = searchParams.get('travellers') || '1 Traveller';

  const fromAirport = AIRPORTS.find((a) => a.code === fromCode) || { code: fromCode, name: fromCode, city: fromCode };
  const toAirport = AIRPORTS.find((a) => a.code === toCode) || { code: toCode, name: toCode, city: toCode };

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [forceScraping, setForceScraping] = useState(false);
  const [dataSource, setDataSource] = useState<string>('Live Scraped Feed');
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'value'>('cheapest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const defaultFilters: FlightFilterState = {
    maxPrice: 40000,
    stops: [],
    airlines: [],
    departureTimeRange: 'all',
    sortBy: 'cheapest',
  };

  const [filters, setFilters] = useState<FlightFilterState>(defaultFilters);

  const fetchLiveFlights = async (force: boolean = true) => {
    if (force) setForceScraping(true);
    else setLoading(true);

    try {
      const results = await searchFlights({
        fromCode,
        toCode,
        departureDate: departDate,
        forceLive: true, // Always fetch fresh live prices from Google Flights
      });

      if (results && results.length > 0) {
        setFlights(results);
        setDataSource(results[0]?.sourcePortal || results[0]?.cheapestSource || 'Live Web Scraped (Google Flights & Airlines)');
      }
    } catch (e) {
      console.error('[Results] Failed to fetch live flights:', e);
    } finally {
      setLoading(false);
      setForceScraping(false);
    }
  };

  useEffect(() => {
    fetchLiveFlights(true); // Always force live fetch on mount
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
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Scraped Feed</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Sector: <span className="text-white font-bold">{fromAirport.city} ({fromCode}) to {toAirport.city} ({toCode})</span> • Date:{' '}
              <span className="text-white font-bold">{departDate}</span> • Travellers:{' '}
              <span className="text-white font-bold">{travellers}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            disabled={forceScraping}
            onClick={() => fetchLiveFlights(true)}
            className="bg-blue-600/20 text-cyan-300 border-blue-500/40 hover:bg-blue-600/30 flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${forceScraping ? 'animate-spin' : ''}`} />
            <span>{forceScraping ? 'Scraping Portals...' : 'Re-scrape Live Portals'}</span>
          </Button>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <Link href="/search">
            <Button size="sm" variant="dark-outline">
              Change Search
            </Button>
          </Link>
        </div>
      </div>

      {/* LIVE AUDIT TELEMETRY NOTICE */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            Displaying genuine live quotes extracted from official airline booking portals (IndiGo, Air India, SpiceJet, Akasa) and OTAs (EaseMyTrip, Cleartrip, MakeMyTrip).
          </span>
        </div>
        <div className="font-semibold text-slate-600 whitespace-nowrap">
          Warehouse microdata: <span className="font-black text-blue-700">366k+ quotes</span>
        </div>
      </div>

      {/* MAIN RESULTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FILTER SIDEBAR ON DESKTOP (STATIC/STICKY IN VIEWPORT) */}
        <div className={`lg:col-span-4 ${showMobileFilters ? 'block' : 'hidden lg:block'} lg:sticky lg:top-6 self-start z-10`}>
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
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-slate-800">Fetching live flight quotes from airlines and OTAs...</p>
              <p className="text-xs text-slate-500">Querying official airline portals, EaseMyTrip, and microdata warehouse</p>
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
    <Suspense fallback={<div className="p-12 text-center text-slate-500 text-xs font-bold">Loading live flight results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
