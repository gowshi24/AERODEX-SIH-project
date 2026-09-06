import React from 'react';
import { LucideIcon, Lightbulb } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  tag?: string;
  icon?: LucideIcon;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  tag = 'Analytical Insight',
  icon: Icon = Lightbulb,
}) => {
  return (
    <div className="aerodex-card p-5 bg-gradient-to-br from-blue-50/60 to-white border border-blue-100 rounded-2xl flex items-start space-x-4">
      <div className="p-3 rounded-2xl bg-blue-600 text-white flex-shrink-0 shadow-md shadow-blue-500/20">
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
          {tag}
        </span>
        <h4 className="font-bold text-slate-900 text-base pt-1">{title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
