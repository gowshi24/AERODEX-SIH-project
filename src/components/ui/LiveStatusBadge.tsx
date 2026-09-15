import React from 'react';
import { RefreshCw, Database, Radio, AlertCircle } from 'lucide-react';

export interface LiveStatusBadgeProps {
  isLoading?: boolean;
  isLive?: boolean;
  isCached?: boolean;
  isError?: boolean;
  lastUpdated?: string;
  sourceName?: string;
  onRefresh?: () => void;
  className?: string;
}

export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({
  isLoading = false,
  isLive = true,
  isCached = false,
  isError = false,
  lastUpdated,
  sourceName = 'SerpAPI / Google Flights',
  onRefresh,
  className = '',
}) => {
  const currentTime = lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold ${className}`}>
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
        <span>Loading latest airfare data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        <span>Unable to fetch latest data. Showing recent database data.</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="ml-1 text-amber-700 hover:text-amber-900 underline flex items-center gap-1 text-[11px]"
            title="Retry fetching data"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isCached) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold ${className}`}>
        <Database className="w-3.5 h-3.5 text-slate-600" />
        <span>Data source: Supabase DB (Cached)</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-600">Updated: {currentTime}</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="ml-1 p-0.5 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="Refresh with live SerpAPI search"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Radio className="w-3.5 h-3.5 text-emerald-600" />
      <span>LIVE DATA ({sourceName})</span>
      <span className="text-emerald-300">•</span>
      <span className="text-emerald-700">Updated: {currentTime}</span>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-1 p-0.5 hover:bg-emerald-100 rounded text-emerald-700 transition-colors"
          title="Refresh live data"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
