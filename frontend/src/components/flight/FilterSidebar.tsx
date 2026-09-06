'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FlightFilterState } from '../../types';

interface FilterSidebarProps {
  filters: FlightFilterState;
  onChange: (filters: FlightFilterState) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange, onReset }) => {
  const handleStopsToggle = (stop: string) => {
    const exists = filters.stops.includes(stop);
    const updated = exists ? filters.stops.filter((s) => s !== stop) : [...filters.stops, stop];
    onChange({ ...filters, stops: updated });
  };

  const handleAirlineToggle = (airlineName: string) => {
    const exists = filters.airlines.includes(airlineName);
    const updated = exists ? filters.airlines.filter((a) => a !== airlineName) : [...filters.airlines, airlineName];
    onChange({ ...filters, airlines: updated });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2 text-slate-900 font-black text-base">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* PRICE RANGE SLIDER */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-extrabold text-slate-700">Max Price</span>
          <span className="font-black text-blue-700">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="3500"
          max="10000"
          step="250"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* STOPS FILTER */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <span className="block text-xs font-extrabold text-slate-700">Stops</span>
        <div className="flex flex-col space-y-2">
          {[
            { id: '0', label: 'Non-stop' },
            { id: '1', label: '1 Stop' },
            { id: '2+', label: '2+ Stops' },
          ].map((stop) => (
            <label
              key={stop.id}
              className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={filters.stops.includes(stop.id)}
                onChange={() => handleStopsToggle(stop.id)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{stop.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* AIRLINE FILTER */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <span className="block text-xs font-extrabold text-slate-700">Airlines</span>
        <div className="flex flex-col space-y-2">
          {['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet'].map((airline) => (
            <label
              key={airline}
              className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleAirlineToggle(airline)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>{airline}</span>
            </label>
          ))}
        </div>
      </div>

      {/* DEPARTURE TIME RANGE */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <span className="block text-xs font-extrabold text-slate-700">Departure Time</span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'all', label: 'All Times' },
            { id: 'morning', label: 'Morning (6-12)' },
            { id: 'afternoon', label: 'Afternoon (12-18)' },
            { id: 'evening', label: 'Evening (18-24)' },
          ].map((time) => (
            <button
              key={time.id}
              onClick={() => onChange({ ...filters, departureTimeRange: time.id as any })}
              className={`p-2 rounded-xl text-[11px] font-bold border transition-colors ${
                filters.departureTimeRange === time.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
