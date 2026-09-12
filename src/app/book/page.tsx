'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Info, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MOCK_FLIGHTS } from '../../data/mockData';
import { getBookingUrl, getProviderSearchUrl } from '../../lib/booking';
import { FlightSource } from '../../types';

interface BookContentProps {
  explicitFlightId?: string;
}

export function BookContent({ explicitFlightId }: BookContentProps) {
  const searchParams = useSearchParams();
  const searchFlightId = searchParams.get('flightId');
  const selectedSourceName = searchParams.get('source');
  const priceParam = searchParams.get('price');

  const targetFlightId = explicitFlightId || searchFlightId;

  // Lookup selected flight by ID
  const flight = targetFlightId
    ? MOCK_FLIGHTS.find((f) => f.id === targetFlightId) || null
    : MOCK_FLIGHTS[0];

  const isInvalidFlightId = Boolean(targetFlightId && !flight);
  const activeFlight = flight || MOCK_FLIGHTS[0];

  const lowestPrice = activeFlight
    ? activeFlight.basePrice
    : priceParam
    ? parseInt(priceParam.replace(/,/g, ''), 10)
    : 4980;

  const depCode = activeFlight.departureCode || 'DEL';
  const arrCode = activeFlight.arrivalCode || 'BOM';
  const dateDDMMYYYY = '20/09/2026';

  // Complete list of booking sources including Cleartrip
  const rawSources: FlightSource[] = activeFlight?.sources || [
    {
      name: 'Airline Direct',
      price: lowestPrice,
      isCheapest: true,
      type: 'airline',
      bookingUrl: 'https://www.goindigo.in/',
      bookingAvailable: true,
    },
    {
      name: 'OTA A (MakeMyTrip)',
      price: lowestPrice + 50,
      isCheapest: false,
      type: 'ota',
      bookingUrl: `https://www.makemytrip.com/flight/search?itinerary=${depCode}-${arrCode}-${dateDDMMYYYY}&tripType=O&paxType=A-1_C-0_I-0&cabinClass=E`,
      bookingAvailable: true,
    },
    {
      name: 'OTA B (Yatra)',
      price: lowestPrice + 70,
      isCheapest: false,
      type: 'ota',
      bookingUrl: 'https://www.yatra.com/flights',
      bookingAvailable: true,
    },
    {
      name: 'OTA C (Cleartrip)',
      price: lowestPrice + 100,
      isCheapest: false,
      type: 'ota',
      bookingUrl: `https://www.cleartrip.com/flights/results?from=${depCode}&to=${arrCode}&depart_date=${dateDDMMYYYY}&adults=1&childs=0&infants=0&class=Economy`,
      bookingAvailable: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* BACK BUTTON */}
      <Link
        href="/results"
        className="inline-flex items-center space-x-2 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Flight Results</span>
      </Link>

      {/* INVALID FLIGHT WARNING BANNER IF APPLICABLE */}
      {isInvalidFlightId && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900 font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-sm">Flight ID Not Found</strong>
            <span>
              The specified flight ID (&quot;{targetFlightId}&quot;) was not found. Showing available options for flight {activeFlight.airline} {activeFlight.flightNumber}.
            </span>
          </div>
        </div>
      )}

      {/* INFORMATIONAL NOTICE */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-blue-900 font-medium">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-sm">Provider Booking Redirect</strong>
          <span>
            Selecting a booking provider will open their official platform in a new browser tab. AERODEX compares airfare across providers and does not process payments directly.
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
            <h1 className="text-xl font-black text-slate-900">
              {activeFlight.airline} {activeFlight.flightNumber}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {`${activeFlight.departureCity} (${activeFlight.departureCode}) → ${activeFlight.arrivalCity} (${activeFlight.arrivalCode}) • ${activeFlight.travelDate || '20 Sep 2026'}`}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Lowest Price</span>
            <div className="text-3xl font-black text-blue-700">₹{lowestPrice.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* CHOOSE WHERE TO CONTINUE */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900">Choose where to continue</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rawSources.map((provider) => {
              const targetUrl =
                getBookingUrl(activeFlight, provider) ||
                getProviderSearchUrl(activeFlight, provider.name);

              const isSelected =
                selectedSourceName &&
                provider.name.toLowerCase().includes(selectedSourceName.toLowerCase());

              return (
                <div
                  key={provider.name}
                  className={`rounded-2xl border p-5 space-y-3 text-center transition-all flex flex-col justify-between ${
                    provider.isCheapest || isSelected
                      ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-100 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="font-extrabold text-slate-900 text-sm">
                      {provider.name}
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      ₹{provider.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {provider.isCheapest && (
                        <Badge variant="emerald" size="sm">
                          Lowest Rate
                        </Badge>
                      )}
                      {isSelected && !provider.isCheapest && (
                        <Badge variant="blue" size="sm">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button
                        variant={provider.isCheapest || isSelected ? 'primary' : 'outline'}
                        size="sm"
                        className="w-full justify-center font-bold text-xs"
                      >
                        <span>{provider.type === 'airline' ? 'Select Flight' : 'Continue to Booking'}</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPLIANCE & SAFETY NOTICE */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-1">
          <div className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1" />
            <span>Official booking and checkout takes place on provider website in a new tab.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-500">Loading booking options...</div>}>
      <BookContent />
    </Suspense>
  );
}
