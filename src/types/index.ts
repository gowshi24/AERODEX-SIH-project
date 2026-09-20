export interface Airport {
  code: string;
  name: string;
  city: string;
}

export interface Airline {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface FlightSource {
  id?: string;
  name: string;
  price: number;
  baseFare?: number;
  taxes?: number;
  fees?: number;
  isCheapest: boolean;
  type: 'airline' | 'ota';
  bookingUrl?: string | null;
  bookingAvailable?: boolean;
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departureCity: string;
  departureCode: string;
  departureTime: string;
  arrivalCity: string;
  arrivalCode: string;
  arrivalTime: string;
  travelDate?: string;
  duration: string;
  stops: number; // 0, 1, 2
  aircraft?: string;
  fareClass?: string;
  basePrice: number;
  cheapestSource: string;
  priceTrendPercent: number;
  priceTrendDirection: 'up' | 'down' | 'stable';
  sources: FlightSource[];
  baggage: {
    cabin: string;
    checkIn: string;
  };
  refundability: 'Refundable' | 'Non-refundable' | 'Partially Refundable';
  priceHistory: { date: string; price: number }[];
}

export interface FlightFilterState {
  maxPrice: number;
  stops: string[];
  airlines: string[];
  departureTimeRange: 'all' | 'morning' | 'afternoon' | 'evening' | 'night';
  sortBy: 'cheapest' | 'fastest' | 'value';
}

export interface FlightPriceAttribution {
  airline: string;
  flightNumber: string;
  source: string;
  fare: number;
  benchmarkNote?: string;
}

export interface HistoricalTrendPoint {
  date: string;
  fullDate?: string;
  avgFare: number;
  minFare: number;
  maxFare: number;
  volume?: number;
  minFlight?: FlightPriceAttribution;
  maxFlight?: FlightPriceAttribution;
  avgFlight?: FlightPriceAttribution;
}

export interface WeeklyTrendPoint {
  day: string;
  avgFare: number;
  searchVolume?: number;
}

export interface IndexHistoryPoint {
  date: string;
  month: string;
  index: number;
  baseLine: number;
  cpiReference: number;
}

export interface RouteIndexItem {
  route: string;
  from: string;
  to: string;
  fromCity?: string;
  toCity?: string;
  weight?: number;
  contribution?: number;
  indexValue: number;
  changePercent: number;
  avgFare: number;
  trend: 'up' | 'down';
}

export interface AirfareAnomaly {
  id: string;
  route: string;
  from: string;
  to: string;
  airline: string;
  flightNumber?: string;
  source?: string;
  currentPrice: number;
  previousPrice: number;
  observedFare?: number;
  expectedFare?: number;
  percentageChange: number;
  severity: 'High' | 'Medium' | 'Low';
  detectedDate: string;
  reason: string;
  type?: string;
}

export interface CPIInsightData {
  airfareChange: number;
  monthlyMovement: number;
  highestIncreaseRoute: string;
  lowestIncreaseRoute: string;
  inflationTrend: { month: string; airfareInflation: number; generalCPI: number }[];
  monthlyMovementData: { month: string; change: number }[];
  routeComparison: { route: string; change: number }[];
}

export interface BacktestResult {
  period: string;
  actualIndex: number;
  estimatedIndex: number;
  difference: number;
  correlation: number;
  mape: number;
  rmse: number;
  historicalPoints: { date: string; actual: number; estimated: number }[];
}

export interface PopularRouteItem {
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  avgFare: number;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'AIRLINE' | 'OTA' | 'REFERENCE';
  collectionMethod: string;
  status: 'Connected' | 'Monitoring' | 'Scheduled' | 'Unavailable' | 'ACTIVE_SCRAPE' | 'DEMO_DATA';
  lastCollection: string;
  recordsCollected: number;
  dataQuality: number;
  coverage: string;
}

export interface DataQuality {
  completeness: number;
  duplicateRate: number;
  missingValuesRate: number;
  outlierRate: number;
  sourceAvailability: number;
  validationSuccess: number;
  history: { date: string; completeness: number; reliability: number }[];
}

export interface LeadTimePoint {
  daysBeforeDeparture: number;
  label: string;
  avgFare: number;
  minFare: number;
  maxFare: number;
  volume: number;
}

export interface ExplorerFareRecord {
  id: string;
  collectedAt: string;
  source: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  travelDate: string;
  advanceWindow: number;
  fareClass: string;
  baseFare: number;
  taxes: number;
  fees: number;
  totalFare: number;
  status: string;
}
