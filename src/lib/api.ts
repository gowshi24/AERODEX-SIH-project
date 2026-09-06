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

export interface SearchFlightParams {
  fromCode?: string;
  toCode?: string;
  departureDate?: string;
  returnDate?: string;
  travellers?: number;
  cabinClass?: string;
}

export async function searchFlights(params?: SearchFlightParams): Promise<Flight[]> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 300));
  if (!params || (!params.fromCode && !params.toCode)) {
    return MOCK_FLIGHTS;
  }
  return MOCK_FLIGHTS.filter((f) => {
    const matchFrom = !params.fromCode || f.departureCode.toUpperCase() === params.fromCode.toUpperCase();
    const matchTo = !params.toCode || f.arrivalCode.toUpperCase() === params.toCode.toUpperCase();
    return matchFrom && matchTo;
  });
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
  await new Promise((res) => setTimeout(res, 150));
  return DATA_SOURCES;
}

export async function getDataQuality(): Promise<DataQuality> {
  await new Promise((res) => setTimeout(res, 150));
  return DATA_QUALITY_METRICS;
}

export async function getDataExplorerFares(query?: string): Promise<ExplorerFareRecord[]> {
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
