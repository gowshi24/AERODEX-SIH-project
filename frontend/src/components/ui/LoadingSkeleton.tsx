import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="h-28 bg-slate-100 rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded-md w-1/6"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
          <div className="h-3 bg-slate-200 rounded-md w-3/4"></div>
        </div>
      ))}
    </div>
  );
};
