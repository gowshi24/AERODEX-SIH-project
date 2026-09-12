import React from 'react';
import { ExternalLink, ShieldCheck, Tag, Search } from 'lucide-react';
import { FlightSource, Flight } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getBookingUrl, getProviderSearchUrl } from '../../lib/booking';

interface BookingSourceCardProps {
  source: FlightSource;
  flight?: Flight;
  airlineName?: string;
}

export const BookingSourceCard: React.FC<BookingSourceCardProps> = ({
  source,
  flight,
  airlineName = 'Airline',
}) => {
  const targetUrl = getBookingUrl(flight, source);
  const fallbackUrl = getProviderSearchUrl(flight, source.name);

  return (
    <div
      className={`aerodex-card p-6 bg-white border rounded-2xl flex flex-col justify-between transition-all ${
        source.isCheapest
          ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-md'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-lg">{source.name}</span>
              {source.isCheapest && <Badge variant="success">Best Price</Badge>}
            </div>
            <span className="text-xs text-slate-500 font-medium capitalize">
              {source.type === 'airline' ? `${airlineName} Direct Booking` : 'OTA Partner'}
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">
              ₹{source.price.toLocaleString('en-IN')}
            </span>
            <div className="text-[11px] text-slate-500 font-medium">Final fare incl. taxes</div>
          </div>
        </div>

        <ul className="space-y-2 mb-6 text-xs text-slate-600">
          <li className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verified Price Intelligence by AERODEX</span>
          </li>
          <li className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-blue-500" />
            <span>Direct external provider redirection</span>
          </li>
        </ul>
      </div>

      {targetUrl ? (
        <a href={targetUrl} target="_blank" rel="noopener noreferrer">
          <Button variant={source.isCheapest ? 'primary' : 'outline'} className="w-full">
            <span>Continue to {source.name}</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      ) : (
        <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full border-slate-300">
            <span>Search on {source.name}</span>
            <Search className="w-4 h-4 ml-2" />
          </Button>
        </a>
      )}
    </div>
  );
};
