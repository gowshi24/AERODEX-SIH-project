'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Info, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

function BookContent() {
  const searchParams = useSearchParams();
  const flightId = searchParams.get('flightId') || 'fl-6e-2041';
  const price = searchParams.get('price') || '4,980';
  const sourceName = searchParams.get('source') || 'OTA A (MakeMyTrip)';

  const [redirecting, setRedirecting] = useState<string | null>(null);
  const [completedSource, setCompletedSource] = useState<string | null>(null);

  const handleMockRedirect = (name: string) => {
    setRedirecting(name);
    setTimeout(() => {
      setRedirecting(null);
      setCompletedSource(name);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* BACK BUTTON */}
      <Link
        href="/results"
        className="inline-flex items-center space-x-2 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Flight Results</span>
      </Link>

      {/* PROTOTYPE NOTICE */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-blue-900 font-medium">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-sm">AERODEX Prototype Handoff Page</strong>
          <span>
            AERODEX is a price intelligence dashboard and does not process payments or collect personal information. Select a booking provider below to simulate handoff.
          </span>
        </div>
      </div>

      {/* SELECTED FLIGHT SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <Badge variant="blue" size="sm" className="mb-1">
              Selected Flight
            </Badge>
            <h1 className="text-xl font-black text-slate-900">IndiGo 6E 2041</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              New Delhi (DEL) → Mumbai (BOM) • 20 Sep 2026
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Lowest Price</span>
            <div className="text-3xl font-black text-blue-700">₹{price}</div>
          </div>
        </div>

        {/* CHOOSE WHERE TO CONTINUE */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900">Choose where to continue</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Airline Direct', price: 5100, isCheapest: false },
              { name: 'OTA A (MakeMyTrip)', price: Number(price.replace(/,/g, '')), isCheapest: true },
              { name: 'OTA B (Yatra)', price: 5050, isCheapest: false },
            ].map((provider) => (
              <div
                key={provider.name}
                className={`rounded-2xl border p-5 space-y-3 text-center transition-all ${
                  provider.isCheapest
                    ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-100'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="font-extrabold text-slate-900 text-sm">{provider.name}</div>
                <div className="text-xl font-black text-slate-900">
                  ₹{provider.price.toLocaleString('en-IN')}
                </div>
                {provider.isCheapest && (
                  <Badge variant="emerald" size="sm">
                    Lowest Rate
                  </Badge>
                )}

                <Button
                  variant={provider.isCheapest ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full justify-center font-bold text-xs"
                  onClick={() => handleMockRedirect(provider.name)}
                  disabled={redirecting === provider.name}
                >
                  {redirecting === provider.name ? (
                    <span>Redirecting...</span>
                  ) : (
                    <span>
                      Continue to Booking <ExternalLink className="w-3 h-3 ml-1" />
                    </span>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {completedSource && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-extrabold text-emerald-900">
              Mock Redirect Triggered ({completedSource})
            </h3>
            <p className="text-xs text-emerald-700">
              In production, you would now land on {completedSource}&apos;s checkout page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-500">Loading...</div>}>
      <BookContent />
    </Suspense>
  );
}
