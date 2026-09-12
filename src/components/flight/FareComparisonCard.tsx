import React from 'react';
import Link from 'next/link';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { FlightSource } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface FareComparisonCardProps {
  sources: FlightSource[];
  flightId: string;
}

export const FareComparisonCard: React.FC<FareComparisonCardProps> = ({ sources, flightId }) => {
  return (
    <div className="aerodex-card p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Multi-Source Fare Breakdown</h3>
          <p className="text-xs text-slate-500">Real-time fare scraped across Airline portals and OTAs</p>
        </div>
        <Badge variant="primary">{sources.length} Sources Scraped</Badge>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <div
            key={source.name}
            className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
              source.isCheapest
                ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/30'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {source.isCheapest && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-sm">{source.name}</span>
                  {source.isCheapest && <Badge variant="success">Best Price</Badge>}
                </div>
                <span className="text-xs text-slate-500 capitalize">{source.type} Booking</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-lg font-extrabold text-slate-900">
                  ₹{source.price.toLocaleString('en-IN')}
                </span>
                {source.isCheapest && (
                  <div className="text-[11px] text-emerald-700 font-semibold">Lowest Fare</div>
                )}
              </div>
              <Link href={`/book?flightId=${flightId}&source=${encodeURIComponent(source.name)}`}>
                <Button size="sm" variant={source.isCheapest ? 'primary' : 'outline'}>
                  <span>Select</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
