import React from 'react';
import { AlertCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { AirfareAnomaly } from '../../types';
import { Badge } from '../ui/Badge';

interface AnomalyCardProps {
  anomaly: AirfareAnomaly;
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({ anomaly }) => {
  const severityVariant = {
    High: 'danger',
    Medium: 'warning',
    Low: 'info',
  } as const;

  const isSpike = anomaly.percentageChange > 0;

  return (
    <div className="aerodex-card p-5 bg-white border border-slate-200 rounded-2xl space-y-4 hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {anomaly.severity === 'High' ? (
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          )}
          <span className="font-extrabold text-slate-900 text-base">{anomaly.route}</span>
          <span className="text-xs text-slate-500 font-semibold">({anomaly.airline})</span>
        </div>
        <Badge variant={severityVariant[anomaly.severity]}>{anomaly.severity} Severity</Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Previous</span>
          <div className="text-sm font-bold text-slate-700">₹{anomaly.previousPrice.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Current</span>
          <div className="text-sm font-black text-slate-900">₹{anomaly.currentPrice.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase">Shift</span>
          <div className={`text-sm font-black flex items-center justify-center ${isSpike ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isSpike ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
            {isSpike ? `+${anomaly.percentageChange}%` : `${anomaly.percentageChange}%`}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-medium">
        {anomaly.reason}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center">
          <Clock className="w-3 h-3 mr-1 text-slate-400" />
          Detected: {anomaly.detectedDate}
        </span>
        <span className="font-semibold uppercase text-slate-500">{anomaly.type} Anomaly</span>
      </div>
    </div>
  );
};
