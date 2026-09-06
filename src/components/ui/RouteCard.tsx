import React from 'react';
import Link from 'next/link';
import { Plane, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from './Badge';

interface RouteCardProps {
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  avgFare: number;
  change: number;
  dailyFlights: number;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  fromCode,
  fromCity,
  toCode,
  toCity,
  avgFare,
  change,
  dailyFlights,
}) => {
  const isPositive = change > 0;

  return (
    <Link
      href={`/results?from=${fromCode}&to=${toCode}`}
      className="block group aerodex-card p-5 hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
            {fromCode}
          </span>
          <Plane className="w-4 h-4 text-blue-500 transform rotate-45 group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
            {toCode}
          </span>
        </div>
        <Badge variant={isPositive ? 'warning' : 'success'}>
          <span className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            )}
            <span>{isPositive ? `+${change}%` : `${change}%`}</span>
          </span>
        </Badge>
      </div>

      <div className="text-xs text-slate-500 mb-3">
        {fromCity} to {toCity}
      </div>

      <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-500">Avg Fare</span>
          <div className="text-xl font-extrabold text-slate-900">₹{avgFare.toLocaleString('en-IN')}</div>
        </div>
        <span className="text-xs font-medium text-blue-600 group-hover:underline">
          {dailyFlights} daily flights →
        </span>
      </div>
    </Link>
  );
};
