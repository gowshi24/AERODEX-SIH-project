import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  updatedAgo?: string;
  icon?: React.ReactNode;
  sparkline?: number[];
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  updatedAgo,
  icon,
  sparkline,
  subtitle,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-3">
        <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
        {change !== undefined && (
          <div
            className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-rose-50 text-rose-700'
                : isNegative
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : isNegative ? (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            ) : (
              <Minus className="w-3 h-3 mr-0.5" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {change}%
            </span>
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-600 font-medium">{subtitle}</p>}

      {updatedAgo && (
        <div className="text-[10px] text-slate-600 font-semibold pt-1 border-t border-slate-100 flex items-center justify-between">
          <span>Updated {updatedAgo}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </div>
      )}
    </div>
  );
};
