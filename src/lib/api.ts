import {
  Flight,
  HistoricalTrendPoint,
  IndexHistoryPoint,
  RouteIndexItem,
  AirfareAnomaly,
  CPIInsightData,
  BacktestResult,
  DataSource,
  DataQuality,
  LeadTimePoint,
  ExplorerFareRecord,
} from '../types';

import {
  MOCK_FLIGHTS,
  LIVE_MARKET_SNAPSHOT,
  AIRFARE_MOVEMENT_DATA,
  LEAD_TIME_DATA,
  INDEX_HISTORY,
  ROUTE_BASKET_CONTRIBUTION,
  ANOMALIES,
  CPI_INSIGHT_DATA,
  BACKTEST_RESULTS,
  DATA_SOURCES,
  DATA_QUALITY_METRICS,
  EXPLORER_FARES,
  POPULAR_ROUTES,
} from '../data/mockData';

/**
 * Service Layer for AERODEX Frontend
 * Provides simulated async API interfaces.
 * Replace with FastAPI backend fetch calls in the future:
 * Next.js -> FastAPI -> PostgreSQL/Supabase
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SearchFlightParams {
  fromCode?: string;
  toCode?: string;
  departureDate?: string;
  returnDate?: string;
  travellers?: number;
  cabinClass?: string;
  refresh?: boolean;
}

export async function searchFlights(params?: SearchFlightParams): Promise<Flight[]> {
  const searchParams = new URLSearchParams();
  if (params?.fromCode) searchParams.append('origin', params.fromCode);
  if (params?.toCode) searchParams.append('destination', params.toCode);
  if (params?.departureDate) searchParams.append('travel_date', params.departureDate);
  if (params?.returnDate) searchParams.append('return_date', params.returnDate);
  if (params?.travellers) searchParams.append('passengers', params.travellers.toString());
  if (params?.cabinClass) searchParams.append('cabin_class', params.cabinClass);
  if (params?.refresh) searchParams.append('refresh', 'true');

  const url = `${API_BASE_URL}/api/flights/search?${searchParams.toString()}`;
  const res = await fetch(url);
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Backend error (${res.status}): ${errorText || res.statusText}`);
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid response payload format from flight search API');
  }

  return data as Flight[];
}

export async function getFlightDetails(id: string): Promise<Flight | null> {
  await new Promise((res) => setTimeout(res, 200));
  const found = MOCK_FLIGHTS.find((f) => f.id === id);
  return found || MOCK_FLIGHTS[0];
}

export async function getLiveMarketSnapshot() {
  await new Promise((res) => setTimeout(res, 150));
  return LIVE_MARKET_SNAPSHOT;
}

export async function getAirfareMovement(period: string = '30D'): Promise<HistoricalTrendPoint[]> {
  await new Promise((res) => setTimeout(res, 200));
  return AIRFARE_MOVEMENT_DATA;
}

export async function getLeadTimeAnalysis(): Promise<LeadTimePoint[]> {
  await new Promise((res) => setTimeout(res, 200));
  return LEAD_TIME_DATA;
}

export async function getAirfareIndexHistory(): Promise<IndexHistoryPoint[]> {
  await new Promise((res) => setTimeout(res, 200));
  return INDEX_HISTORY;
}

export async function getRouteBasketContribution(): Promise<RouteIndexItem[]> {
  await new Promise((res) => setTimeout(res, 150));
  return ROUTE_BASKET_CONTRIBUTION;
}

export async function getAnomalies(): Promise<AirfareAnomaly[]> {
  await new Promise((res) => setTimeout(res, 200));
  return ANOMALIES;
}

export async function getCPIInsights(): Promise<CPIInsightData> {
  await new Promise((res) => setTimeout(res, 200));
  return CPI_INSIGHT_DATA;
}

export async function getBacktestResults(): Promise<BacktestResult> {
  await new Promise((res) => setTimeout(res, 200));
  return BACKTEST_RESULTS;
}

export async function getDataSources(): Promise<DataSource[]> {
  try {
    const url = `${API_BASE_URL}/api/data-sources`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as DataSource[];
      }
    }
  } catch {
    // Fallback to local mock data
  }
  await new Promise((res) => setTimeout(res, 150));
  return DATA_SOURCES;
}

export async function getDataQuality(): Promise<DataQuality> {
  await new Promise((res) => setTimeout(res, 150));
  return DATA_QUALITY_METRICS;
}

export async function getDataExplorerFares(query?: string): Promise<ExplorerFareRecord[]> {
  try {
    const url = `${API_BASE_URL}/api/fares/explorer${query ? `?q=${encodeURIComponent(query)}` : ''}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data as ExplorerFareRecord[];
      }
    }
  } catch {
    // Fallback to local mock data
  }

  await new Promise((res) => setTimeout(res, 200));
  if (!query) return EXPLORER_FARES;
  const q = query.toLowerCase();
  return EXPLORER_FARES.filter(
    (r) =>
      r.airline.toLowerCase().includes(q) ||
      r.source.toLowerCase().includes(q) ||
      r.flightNumber.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)
  );
}

export async function getPopularRoutes() {
  await new Promise((res) => setTimeout(res, 150));
  return POPULAR_ROUTES;
}
