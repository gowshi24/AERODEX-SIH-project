import {
  Airport,
  Airline,
  Flight,
  IndexHistoryPoint,
  RouteIndexItem,
  AirfareAnomaly,
  CPIInsightData,
} from '../types';

export const AIRPORTS: Airport[] = [
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
  { code: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata' },
];

export const AIRLINES: Airline[] = [
  { id: '6E', name: 'IndiGo', code: '6E', color: '#1d4ed8' },
  { id: 'AI', name: 'Air India', code: 'AI', color: '#dc2626' },
  { id: 'QP', name: 'Akasa Air', code: 'QP', color: '#ea580c' },
  { id: 'SG', name: 'SpiceJet', code: 'SG', color: '#c2410c' },
];

export interface PopularRouteItem {
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  avgFare: number;
}

export const POPULAR_ROUTES: PopularRouteItem[] = [
  { fromCode: 'DEL', fromCity: 'Delhi', toCode: 'BOM', toCity: 'Mumbai', avgFare: 4980 },
  { fromCode: 'BOM', fromCity: 'Mumbai', toCode: 'DEL', toCity: 'Delhi', avgFare: 5120 },
  { fromCode: 'MAA', fromCity: 'Chennai', toCode: 'DEL', toCity: 'Delhi', avgFare: 5450 },
  { fromCode: 'BLR', fromCity: 'Bengaluru', toCode: 'BOM', toCity: 'Mumbai', avgFare: 3890 },
  { fromCode: 'HYD', fromCity: 'Hyderabad', toCode: 'DEL', toCity: 'Delhi', avgFare: 4620 },
  { fromCode: 'CCU', fromCity: 'Kolkata', toCode: 'DEL', toCity: 'Delhi', avgFare: 4950 },
];

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'fl-6e-2041',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E 2041',
    departureCity: 'New Delhi',
    departureCode: 'DEL',
    departureTime: '07:25',
    arrivalCity: 'Mumbai',
    arrivalCode: 'BOM',
    arrivalTime: '09:40',
    travelDate: '2026-09-20',
    duration: '2h 15m',
    stops: 0,
    basePrice: 4980,
    cheapestSource: 'OTA A (MakeMyTrip)',
    priceTrendPercent: -6.2,
    priceTrendDirection: 'down',
    sources: [
      { name: 'Airline Direct', price: 5100, isCheapest: false, type: 'airline', bookingUrl: 'https://www.goindigo.in/', bookingAvailable: true },
      { name: 'OTA A (MakeMyTrip)', price: 4980, isCheapest: true, type: 'ota', bookingUrl: 'https://www.makemytrip.com/flight/search?itinerary=DEL-BOM-20/09/2026&tripType=O&paxType=A-1_C-0_I-0&cabinClass=E', bookingAvailable: true },
      { name: 'OTA B (Yatra)', price: 5050, isCheapest: false, type: 'ota', bookingUrl: 'https://www.yatra.com/flights', bookingAvailable: true },
      { name: 'OTA C (Cleartrip)', price: 5080, isCheapest: false, type: 'ota', bookingUrl: 'https://www.cleartrip.com/flights/results?from=DEL&to=BOM&depart_date=20/09/2026&adults=1&childs=0&infants=0&class=Economy', bookingAvailable: true },
    ],
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    refundability: 'Partially Refundable',
    priceHistory: [
      { date: '10 Sep', price: 5350 },
      { date: '12 Sep', price: 5200 },
      { date: '15 Sep', price: 5100 },
      { date: '18 Sep', price: 5020 },
      { date: '20 Sep', price: 4980 },
    ],
  },
  {
    id: 'fl-ai-805',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI 805',
    departureCity: 'New Delhi',
    departureCode: 'DEL',
    departureTime: '08:30',
    arrivalCity: 'Mumbai',
    arrivalCode: 'BOM',
    arrivalTime: '10:45',
    travelDate: '2026-09-20',
    duration: '2h 15m',
    stops: 0,
    basePrice: 5250,
    cheapestSource: 'Airline Direct',
    priceTrendPercent: 4.8,
    priceTrendDirection: 'up',
    sources: [
      { name: 'Airline Direct', price: 5250, isCheapest: true, type: 'airline', bookingUrl: 'https://www.airindia.com/in/en/book/flight-search.html', bookingAvailable: true },
      { name: 'OTA A (MakeMyTrip)', price: 5300, isCheapest: false, type: 'ota', bookingUrl: 'https://www.makemytrip.com/flight/search?itinerary=DEL-BOM-20/09/2026&tripType=O&paxType=A-1_C-0_I-0&cabinClass=E', bookingAvailable: true },
      { name: 'OTA B (Yatra)', price: 5390, isCheapest: false, type: 'ota', bookingUrl: 'https://www.yatra.com/flights', bookingAvailable: true },
    ],
    baggage: { cabin: '8 kg', checkIn: '25 kg' },
    refundability: 'Refundable',
    priceHistory: [
      { date: '10 Sep', price: 4950 },
      { date: '12 Sep', price: 5050 },
      { date: '15 Sep', price: 5150 },
      { date: '18 Sep', price: 5200 },
      { date: '20 Sep', price: 5250 },
    ],
  },
  {
    id: 'fl-qp-1102',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNumber: 'QP 1102',
    departureCity: 'New Delhi',
    departureCode: 'DEL',
    departureTime: '11:15',
    arrivalCity: 'Mumbai',
    arrivalCode: 'BOM',
    arrivalTime: '13:30',
    travelDate: '2026-09-20',
    duration: '2h 15m',
    stops: 0,
    basePrice: 4420,
    cheapestSource: 'OTA B (Yatra)',
    priceTrendPercent: -3.5,
    priceTrendDirection: 'down',
    sources: [
      { name: 'Airline Direct', price: 4450, isCheapest: false, type: 'airline', bookingUrl: 'https://www.akasaair.com/', bookingAvailable: true },
      { name: 'OTA A (MakeMyTrip)', price: 4490, isCheapest: false, type: 'ota', bookingUrl: 'https://www.makemytrip.com/flight/search?itinerary=DEL-BOM-20/09/2026&tripType=O&paxType=A-1_C-0_I-0&cabinClass=E', bookingAvailable: true },
      { name: 'OTA B (Yatra)', price: 4420, isCheapest: true, type: 'ota', bookingUrl: 'https://www.yatra.com/flights', bookingAvailable: true },
    ],
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    refundability: 'Non-refundable',
    priceHistory: [
      { date: '10 Sep', price: 4600 },
      { date: '12 Sep', price: 4550 },
      { date: '15 Sep', price: 4480 },
      { date: '18 Sep', price: 4440 },
      { date: '20 Sep', price: 4420 },
    ],
  },
  {
    id: 'fl-sg-8169',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    flightNumber: 'SG 8169',
    departureCity: 'New Delhi',
    departureCode: 'DEL',
    departureTime: '14:45',
    arrivalCity: 'Mumbai',
    arrivalCode: 'BOM',
    arrivalTime: '17:05',
    travelDate: '2026-09-20',
    duration: '2h 20m',
    stops: 0,
    basePrice: 4390,
    cheapestSource: 'OTA C (Cleartrip)',
    priceTrendPercent: 0.0,
    priceTrendDirection: 'stable',
    sources: [
      { name: 'Airline Direct', price: 4420, isCheapest: false, type: 'airline', bookingUrl: 'https://www.spicejet.com/', bookingAvailable: true },
      { name: 'OTA A (MakeMyTrip)', price: 4450, isCheapest: false, type: 'ota', bookingUrl: 'https://www.makemytrip.com/flight/search?itinerary=DEL-BOM-20/09/2026&tripType=O&paxType=A-1_C-0_I-0&cabinClass=E', bookingAvailable: true },
      { name: 'OTA C (Cleartrip)', price: 4390, isCheapest: true, type: 'ota', bookingUrl: 'https://www.cleartrip.com/flights/results?from=DEL&to=BOM&depart_date=20/09/2026&adults=1&childs=0&infants=0&class=Economy', bookingAvailable: true },
    ],
    baggage: { cabin: '7 kg', checkIn: '15 kg' },
    refundability: 'Non-refundable',
    priceHistory: [
      { date: '10 Sep', price: 4390 },
      { date: '12 Sep', price: 4390 },
      { date: '15 Sep', price: 4390 },
      { date: '18 Sep', price: 4390 },
      { date: '20 Sep', price: 4390 },
    ],
  },
];

export const INDEX_SUMMARY = {
  currentIndex: 124.6,
  previousPeriod: 121.8,
  changePercent: 2.3,
  basePeriod: 100.0,
};

export const INDEX_HISTORY: IndexHistoryPoint[] = [
  { date: '2026-01', month: 'Jan 2026', index: 100.0, baseLine: 100, cpiReference: 100.0 },
  { date: '2026-02', month: 'Feb 2026', index: 103.4, baseLine: 100, cpiReference: 101.2 },
  { date: '2026-03', month: 'Mar 2026', index: 106.8, baseLine: 100, cpiReference: 101.8 },
  { date: '2026-04', month: 'Apr 2026', index: 112.5, baseLine: 100, cpiReference: 102.4 },
  { date: '2026-05', month: 'May 2026', index: 117.8, baseLine: 100, cpiReference: 103.1 },
  { date: '2026-06', month: 'Jun 2026', index: 120.1, baseLine: 100, cpiReference: 103.6 },
  { date: '2026-07', month: 'Jul 2026', index: 116.5, baseLine: 100, cpiReference: 104.0 },
  { date: '2026-08', month: 'Aug 2026', index: 121.8, baseLine: 100, cpiReference: 104.5 },
  { date: '2026-09', month: 'Sep 2026', index: 124.6, baseLine: 100, cpiReference: 105.0 },
];

export const ROUTE_INDEX_DATA: RouteIndexItem[] = [
  { route: 'DEL → BOM', from: 'Delhi', to: 'Mumbai', indexValue: 126.8, changePercent: 3.2, avgFare: 4980, trend: 'up' },
  { route: 'DEL → BLR', from: 'Delhi', to: 'Bengaluru', indexValue: 121.4, changePercent: -1.2, avgFare: 5200, trend: 'down' },
  { route: 'BOM → DEL', from: 'Mumbai', to: 'Delhi', indexValue: 125.2, changePercent: 2.1, avgFare: 5120, trend: 'up' },
  { route: 'MAA → DEL', from: 'Chennai', to: 'Delhi', indexValue: 129.5, changePercent: 4.8, avgFare: 5450, trend: 'up' },
  { route: 'HYD → DEL', from: 'Hyderabad', to: 'Delhi', indexValue: 119.8, changePercent: 1.1, avgFare: 4620, trend: 'up' },
];

export const ROUTE_BASKET_CONTRIBUTION = ROUTE_INDEX_DATA;

export const ANOMALIES: AirfareAnomaly[] = [
  {
    id: 'anom-01',
    route: 'DEL → BOM',
    from: 'Delhi',
    to: 'Mumbai',
    airline: 'IndiGo',
    currentPrice: 8200,
    previousPrice: 5100,
    percentageChange: 60.7,
    severity: 'High',
    detectedDate: '2026-09-05 14:30',
    reason: 'Significant fare increase compared with recent historical observations.',
  },
  {
    id: 'anom-02',
    route: 'BLR → BOM',
    from: 'Bengaluru',
    to: 'Mumbai',
    airline: 'Akasa Air',
    currentPrice: 2490,
    previousPrice: 3890,
    percentageChange: -35.9,
    severity: 'High',
    detectedDate: '2026-09-05 11:15',
    reason: 'Unusual fare drop detected on single aggregator source.',
  },
  {
    id: 'anom-03',
    route: 'MAA → DEL',
    from: 'Chennai',
    to: 'Delhi',
    airline: 'Air India',
    currentPrice: 7450,
    previousPrice: 5450,
    percentageChange: 36.7,
    severity: 'Medium',
    detectedDate: '2026-09-04 18:45',
    reason: 'Cross-source price discrepancy exceeding threshold limits.',
  },
  {
    id: 'anom-04',
    route: 'HYD → DEL',
    from: 'Hyderabad',
    to: 'Delhi',
    airline: 'SpiceJet',
    currentPrice: 5900,
    previousPrice: 4620,
    percentageChange: 27.7,
    severity: 'Low',
    detectedDate: '2026-09-04 09:20',
    reason: 'Short-term peak fare surge observed during weekend window.',
  },
];

export const CPI_INSIGHT_DATA: CPIInsightData = {
  airfareChange: 4.8,
  monthlyMovement: 1.9,
  highestIncreaseRoute: 'DEL → BOM (+6.2%)',
  lowestIncreaseRoute: 'BLR → BOM (-1.2%)',
  inflationTrend: [
    { month: 'Apr 2026', airfareInflation: 4.2, generalCPI: 5.1 },
    { month: 'May 2026', airfareInflation: 5.8, generalCPI: 4.9 },
    { month: 'Jun 2026', airfareInflation: 6.4, generalCPI: 5.2 },
    { month: 'Jul 2026', airfareInflation: 3.1, generalCPI: 4.8 },
    { month: 'Aug 2026', airfareInflation: 3.9, generalCPI: 4.6 },
    { month: 'Sep 2026', airfareInflation: 4.8, generalCPI: 4.7 },
  ],
  monthlyMovementData: [
    { month: 'Apr', change: 2.1 },
    { month: 'May', change: 3.4 },
    { month: 'Jun', change: 2.0 },
    { month: 'Jul', change: -3.0 },
    { month: 'Aug', change: 1.4 },
    { month: 'Sep', change: 1.9 },
  ],
  routeComparison: [
    { route: 'DEL → BOM', change: 6.2 },
    { route: 'MAA → DEL', change: 4.8 },
    { route: 'BOM → DEL', change: 3.2 },
    { route: 'HYD → DEL', change: 1.1 },
    { route: 'BLR → BOM', change: -1.2 },
  ],
};

export const LIVE_MARKET_SNAPSHOT = {
  currentAirfareIndex: 124.6,
  dailyChange: 0.4,
  weeklyChange: 1.2,
  monthlyChange: 2.3,
  routesTracked: 126,
  flightsObserved: 18642,
  sourcesMonitored: 11,
  lastUpdatedMinutesAgo: 4,
};

export const AIRFARE_MOVEMENT_DATA = [
  { date: 'Jan 2026', avgFare: 4320, minFare: 3600, maxFare: 6200 },
  { date: 'Feb 2026', avgFare: 4410, minFare: 3700, maxFare: 6400 },
  { date: 'Mar 2026', avgFare: 4580, minFare: 3850, maxFare: 6700 },
  { date: 'Apr 2026', avgFare: 4720, minFare: 3950, maxFare: 7100 },
  { date: 'May 2026', avgFare: 4950, minFare: 4100, maxFare: 7600 },
  { date: 'Jun 2026', avgFare: 5100, minFare: 4250, maxFare: 7900 },
  { date: 'Jul 2026', avgFare: 4880, minFare: 4050, maxFare: 7400 },
  { date: 'Aug 2026', avgFare: 5120, minFare: 4100, maxFare: 7450 },
  { date: 'Sep 2026', avgFare: 4980, minFare: 4290, maxFare: 7500 },
];

export const LEAD_TIME_DATA = [
  { daysBeforeDeparture: 45, label: 'T+45', avgFare: 3850, minFare: 3200, maxFare: 4800, volume: 4500 },
  { daysBeforeDeparture: 30, label: 'T+30', avgFare: 4120, minFare: 3500, maxFare: 5200, volume: 6200 },
  { daysBeforeDeparture: 15, label: 'T+15', avgFare: 4580, minFare: 3900, maxFare: 5900, volume: 8400 },
  { daysBeforeDeparture: 7, label: 'T+7', avgFare: 5240, minFare: 4400, maxFare: 6800, volume: 11200 },
  { daysBeforeDeparture: 1, label: 'T+1', avgFare: 6890, minFare: 5600, maxFare: 9400, volume: 14800 },
];

export const BACKTEST_RESULTS = {
  period: '90 Days Validation Window',
  actualIndex: 124.6,
  estimatedIndex: 124.1,
  difference: 0.5,
  correlation: 0.984,
  mape: 1.42,
  rmse: 1.88,
  historicalPoints: [
    { date: 'Day 1', actual: 110.2, estimated: 109.8 },
    { date: 'Day 30', actual: 113.8, estimated: 113.4 },
    { date: 'Day 60', actual: 121.8, estimated: 121.5 },
    { date: 'Day 90', actual: 124.6, estimated: 124.1 },
  ],
};

export const DATA_SOURCES = [
  { id: 'src-01', name: 'IndiGo Direct', type: 'AIRLINE' as const, collectionMethod: 'Demo Data', status: 'DEMO_DATA' as const, lastCollection: '2026-09-06 02:10', recordsCollected: 4820, dataQuality: 99.6, coverage: 'All Domestic Routes' },
  { id: 'src-02', name: 'Air India Direct', type: 'AIRLINE' as const, collectionMethod: 'Demo Data', status: 'DEMO_DATA' as const, lastCollection: '2026-09-06 02:08', recordsCollected: 3150, dataQuality: 99.2, coverage: 'Full Service Domestic' },
  { id: 'src-03', name: 'Akasa Air Direct', type: 'AIRLINE' as const, collectionMethod: 'Demo Data', status: 'DEMO_DATA' as const, lastCollection: '2026-09-06 02:12', recordsCollected: 2100, dataQuality: 99.1, coverage: 'Metro & Regional' },
  { id: 'src-04', name: 'SpiceJet Direct', type: 'AIRLINE' as const, collectionMethod: 'Demo Data', status: 'DEMO_DATA' as const, lastCollection: '2026-09-06 02:00', recordsCollected: 1850, dataQuality: 98.4, coverage: 'Key Domestic Routes' },
  { id: 'src-05', name: 'MakeMyTrip (OTA A)', type: 'OTA' as const, collectionMethod: 'Demo Data', status: 'DEMO_DATA' as const, lastCollection: '2026-09-06 02:14', recordsCollected: 12400, dataQuality: 99.8, coverage: 'All Airlines & Routes' },
  { id: 'src-06', name: 'Yatra (OTA B)', type: 'OTA' as const, collectionMethod: 'Demo Data', status: 'DEMO_DATA' as const, lastCollection: '2026-09-06 02:04', recordsCollected: 9800, dataQuality: 99.4, coverage: 'All Airlines & Routes' },
  { id: 'src-07', name: 'Cleartrip (OTA C)', type: 'OTA' as const, collectionMethod: 'Demo Data', status: 'DEMO_DATA' as const, lastCollection: '2026-09-06 02:11', recordsCollected: 9200, dataQuality: 99.5, coverage: 'All Airlines & Routes' },
];

export const DATA_QUALITY_METRICS = {
  completeness: 99.4,
  duplicateRate: 0.2,
  missingValuesRate: 0.4,
  outlierRate: 0.8,
  sourceAvailability: 99.8,
  validationSuccess: 99.9,
  history: [
    { date: '2026-09-01', completeness: 99.1, reliability: 99.4 },
    { date: '2026-09-06', completeness: 99.6, reliability: 99.9 },
  ],
};

export const EXPLORER_FARES = [
  { id: 'rec-001', collectedAt: '2026-09-06 02:14:00', source: 'MakeMyTrip', airline: 'IndiGo', flightNumber: '6E 2041', origin: 'DEL', destination: 'BOM', travelDate: '2026-09-20', advanceWindow: 14, fareClass: 'Economy Saver', baseFare: 4110, taxes: 620, fees: 250, totalFare: 4980, status: 'Validated' },
  { id: 'rec-002', collectedAt: '2026-09-06 02:13:00', source: 'Air India Direct', airline: 'Air India', flightNumber: 'AI 805', origin: 'DEL', destination: 'BOM', travelDate: '2026-09-20', advanceWindow: 14, fareClass: 'Economy Flex', baseFare: 4300, taxes: 700, fees: 250, totalFare: 5250, status: 'Validated' },
];
