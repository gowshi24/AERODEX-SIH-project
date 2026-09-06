import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  iconBg?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon: Icon,
  iconBg = 'bg-blue-50 text-blue-600',
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="aerodex-card p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{value}</div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || change !== undefined) && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
          {change !== undefined && (
            <Badge variant={isNegative ? 'success' : isPositive ? 'danger' : 'neutral'}>
              <span className="flex items-center">
                {isNegative ? (
                  <TrendingDown className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingUp className="w-3 h-3 mr-1" />
                )}
                {change > 0 ? `+${change}%` : `${change}%`}
              </span>
            </Badge>
          )}
          {changeLabel && <span className="text-slate-500 font-medium">{changeLabel}</span>}
          {subtitle && !changeLabel && <span className="text-slate-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
