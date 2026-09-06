'use client';

import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { FlightFilterState } from '../../types';
import { Button } from '../ui/Button';

interface FilterBarProps {
  filters: FlightFilterState;
  onFilterChange: (filters: FlightFilterState) => void;
  resultCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, resultCount }) => {
  const handleStopsToggle = (stop: string) => {
    const exists = filters.stops.includes(stop);
    const updated = exists ? filters.stops.filter((s) => s !== stop) : [...filters.stops, stop];
    onFilterChange({ ...filters, stops: updated });
  };

  const handleAirlineToggle = (code: string) => {
    const exists = filters.airlines.includes(code);
    const updated = exists ? filters.airlines.filter((a) => a !== code) : [...filters.airlines, code];
    onFilterChange({ ...filters, airlines: updated });
  };

  const handleReset = () => {
    onFilterChange({
      maxPrice: 10000,
      stops: [],
      airlines: [],
      departureTimeRange: 'all',
      sortBy: 'cheapest',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-xs">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-extrabold text-slate-900">Advanced Filters</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-[11px] font-bold text-slate-600 hover:text-blue-600 flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* SORT BY CONTROL */}
      <div className="space-y-2">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
          Sort Results By
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'cheapest', label: 'Lowest Price' },
            { id: 'fastest', label: 'Shortest Duration' },
            { id: 'earliest', label: 'Earliest Departure' },
            { id: 'value', label: 'Best Value' },
          ].map((sortOption) => (
            <button
              key={sortOption.id}
              onClick={() => onFilterChange({ ...filters, sortBy: sortOption.id as any })}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                filters.sortBy === sortOption.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {sortOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
        {/* PRICE SLIDER */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-extrabold text-slate-700">Maximum Price</span>
            <span className="font-extrabold text-blue-700">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="3000"
            max="12000"
            step="250"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        {/* STOPS FILTER */}
        <div className="space-y-2">
          <span className="block text-xs font-extrabold text-slate-700">Stops</span>
          <div className="flex items-center space-x-2">
            {[
              { id: '0', label: 'Non-stop' },
              { id: '1', label: '1 Stop' },
              { id: '2+', label: '2+ Stops' },
            ].map((stop) => (
              <button
                key={stop.id}
                onClick={() => handleStopsToggle(stop.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  filters.stops.includes(stop.id)
                    ? 'bg-blue-50 text-blue-700 border-blue-400 font-extrabold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {stop.label}
              </button>
            ))}
          </div>
        </div>

        {/* AIRLINES FILTER */}
        <div className="space-y-2">
          <span className="block text-xs font-extrabold text-slate-700">Airlines</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { code: '6E', name: 'IndiGo' },
              { code: 'AI', name: 'Air India' },
              { code: 'QP', name: 'Akasa Air' },
              { code: 'SG', name: 'SpiceJet' },
              { code: 'IX', name: 'Air India Express' },
            ].map((airline) => (
              <button
                key={airline.code}
                onClick={() => handleAirlineToggle(airline.code)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                  filters.airlines.includes(airline.code)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {airline.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
