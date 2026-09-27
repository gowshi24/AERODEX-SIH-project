'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ExternalLink,
  Info,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Plane,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getBookingUrl, getProviderSearchUrl, getDirectFlightWebsiteUrl } from '../../lib/booking';
import { getFlightDetails } from '../../lib/api';
import { Flight, FlightSource } from '../../types';

export interface BookContentProps {
  explicitFlightId?: string;
}

export function BookContent({ explicitFlightId }: BookContentProps) {
  const searchParams = useSearchParams();
  const searchFlightId = searchParams.get('flightId');
  const selectedSourceName = searchParams.get('source');
  const priceParam = searchParams.get('price');

  const targetFlightId = explicitFlightId || searchFlightId;
  const [flight, setFlight] = useState<Flight | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (targetFlightId) {
      getFlightDetails(targetFlightId).then((res) => {
        if (res) setFlight(res);
      });
    } else {
      getFlightDetails('AI-101').then((res) => {
        if (res) setFlight(res);
      });
    }
  }, [targetFlightId]);

  const activeFlight = flight || {
    id: targetFlightId || 'quote-live-01',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-101',
    departureCity: 'New Delhi',
    departureCode: 'DEL',
    departureTime: '08:00',
    arrivalCity: 'Mumbai',
    arrivalCode: 'BOM',
    arrivalTime: '10:15',
    travelDate: '2026-09-20',
    duration: '2h 15m',
    stops: 0,
    basePrice: priceParam ? parseInt(priceParam.replace(/,/g, ''), 10) : 5200,
    cheapestSource: 'Air India Official Portal',
    priceTrendPercent: -2.5,
    priceTrendDirection: 'down' as const,
    sources: [],
    priceHistory: [],
  };

  const lowestPrice = activeFlight
    ? activeFlight.basePrice
    : priceParam
    ? parseInt(priceParam.replace(/,/g, ''), 10)
    : 4980;

  const depCode = activeFlight.departureCode || 'DEL';
  const arrCode = activeFlight.arrivalCode || 'BOM';
  const travelDate = activeFlight.travelDate || '2026-09-20';
  const directAirlineUrl = getDirectFlightWebsiteUrl(activeFlight);

  const copyItinerary = () => {
    const text = `Flight: ${activeFlight.airline} (${activeFlight.flightNumber}) | Sector: ${depCode} -> ${arrCode} | Date: ${travelDate} | Fare: ₹${lowestPrice.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Automated booking sources: Pre-injected search parameters for direct checkout
  const rawSources: FlightSource[] =
    activeFlight?.sources && activeFlight.sources.length > 0
      ? activeFlight.sources
      : [
          {
            name: `${activeFlight.airline} Official`,
            price: lowestPrice,
            isCheapest: true,
            type: 'airline',
            bookingUrl: directAirlineUrl,
            bookingAvailable: true,
          },
          {
            name: 'EaseMyTrip',
            price: lowestPrice,
            isCheapest: true,
            type: 'ota',
            bookingUrl: getProviderSearchUrl(activeFlight, 'EaseMyTrip'),
            bookingAvailable: true,
          },
          {
            name: 'Cleartrip',
            price: lowestPrice,
            isCheapest: true,
            type: 'ota',
            bookingUrl: getProviderSearchUrl(activeFlight, 'Cleartrip'),
            bookingAvailable: true,
          },
          {
            name: 'MakeMyTrip',
            price: lowestPrice,
            isCheapest: true,
            type: 'ota',
            bookingUrl: getProviderSearchUrl(activeFlight, 'MakeMyTrip'),
            bookingAvailable: true,
          },
        ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* BACK BUTTON */}
      <div className="flex items-center justify-between">
        <Link
          href="/results"
          className="inline-flex items-center space-x-2 text-xs font-extrabold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Flight Results</span>
        </Link>

        <button
          onClick={copyItinerary}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-extrabold">Itinerary Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Itinerary Details</span>
            </>
          )}
        </button>
      </div>

      {/* AUTOMATED SEARCH TELEMETRY NOTICE */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-emerald-950 font-medium">
        <Zap className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-sm">Automated Flight Search &amp; Fast-Track Checkout Active</strong>
          <span>
            Provider links below automatically pre-populate your origin (<strong className="font-bold">{depCode}</strong>), destination (<strong className="font-bold">{arrCode}</strong>), and travel date (<strong className="font-bold">{travelDate}</strong>) directly into the booking engine to take you straight into the passenger and payment workflow without retyping.
          </span>
        </div>
      </div>

      {/* SELECTED FLIGHT SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="blue" size="sm">
                Selected Flight
              </Badge>
              <Badge variant="emerald" size="sm">
                Auto-Search Ready
              </Badge>
            </div>
            <h1 className="text-xl font-black text-slate-900">
              {activeFlight.airline} {activeFlight.flightNumber}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {`${activeFlight.departureCity} (${activeFlight.departureCode}) → ${activeFlight.arrivalCity} (${activeFlight.arrivalCode}) • ${activeFlight.travelDate || '20 Sep 2026'}`}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Lowest Direct Price</span>
            <div className="text-3xl font-black text-blue-700">₹{lowestPrice.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* PROMINENT DIRECT AIRLINE AUTO-SEARCH CTA BANNER */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg border border-blue-600">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center justify-center sm:justify-start gap-1">
              <Plane className="w-3.5 h-3.5 transform -rotate-45" />
              <span>Official Airline Direct Portal (Pre-filled Search)</span>
            </span>
            <h3 className="text-lg font-black text-white">
              Auto-Search &amp; Book on {activeFlight.airline}
            </h3>
            <p className="text-xs text-blue-200 max-w-md">
              Loads the official {activeFlight.airline} booking engine with your route (<strong className="text-white font-bold">{depCode} → {arrCode}</strong>) and departure date (<strong className="text-white font-bold">{travelDate}</strong>) pre-filled for direct carrier check-in and checkout.
            </p>
          </div>
          <a
            href={directAirlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <Button
              variant="white"
              size="md"
              className="bg-white hover:bg-blue-50 text-blue-950 font-black shadow-lg flex items-center space-x-2 border border-blue-100 hover:border-blue-200 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span className="text-blue-950 font-black">Auto-Search on {activeFlight.airline}</span>
              <ExternalLink className="w-4 h-4 text-blue-950 flex-shrink-0" />
            </Button>
          </a>
        </div>

        {/* CHOOSE WHERE TO CONTINUE (AUTO-SEARCH READY) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">Compare Fast-Track Booking Providers</h2>
            <span className="text-[11px] font-semibold text-slate-500">All links auto-execute search</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rawSources.map((provider) => {
              const targetUrl =
                getBookingUrl(activeFlight, provider) ||
                (provider.type === 'airline' ? directAirlineUrl : getProviderSearchUrl(activeFlight, provider.name));

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
                          Lowest Fare
                        </Badge>
                      )}
                      <Badge variant="blue" size="sm">
                        ⚡ Auto-Search
                      </Badge>
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
                        <span>
                          {provider.type === 'airline'
                            ? `Auto-Search on ${activeFlight.airline}`
                            : `Search & Pay on ${provider.name}`}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATUTORY REGULATORY & PAYMENT EXPLANATION */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>How Automated Booking &amp; Payment Progression Operates</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            In accordance with <strong>Directorate General of Civil Aviation (DGCA)</strong> and airline security mandates, every passenger must enter their government-approved identity details (Full Name, Contact, DOB/Gov ID) and confirm baggage before the payment gateway generates the final payment token. AERODEX automatically pre-fills your route, date, and flight parameters into the booking engine so you land on the flight result and proceed straight into passenger input and payment checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
