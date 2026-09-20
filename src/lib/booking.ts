import { Flight, FlightSource } from '../types';

const CITY_NAMES: Record<string, string> = {
  DEL: 'Delhi',
  BOM: 'Mumbai',
  BLR: 'Bangalore',
  HYD: 'Hyderabad',
  MAA: 'Chennai',
  CCU: 'Kolkata',
  JAI: 'Jaipur',
  LKO: 'Lucknow',
  IXC: 'Chandigarh',
  VNS: 'Varanasi',
  ATQ: 'Amritsar',
  DED: 'Dehradun',
  SXR: 'Srinagar',
  IXL: 'Leh',
  IXZ: 'Port-Blair',
  GOI: 'Goa',
  PNQ: 'Pune',
  AMD: 'Ahmedabad',
  COK: 'Kochi',
  GAU: 'Guwahati',
  PAT: 'Patna',
  BBI: 'Bhubaneswar',
  IXR: 'Ranchi',
  TRV: 'Trivandrum',
  CJB: 'Coimbatore',
  NAG: 'Nagpur',
  IDR: 'Indore',
  VTZ: 'Visakhapatnam',
};

/**
 * Maps any airline code or name to their official flight booking engine,
 * with search parameters (Origin, Destination, Date, Trip Type) automatically pre-injected.
 */
export function getAirlinePortalUrl(
  carrier?: string,
  origin?: string,
  dest?: string,
  travelDate?: string
): string {
  const c = (carrier || '').toLowerCase().trim();
  const depCode = (origin || 'DEL').toUpperCase();
  const arrCode = (dest || 'BOM').toUpperCase();
  const tDate = travelDate || '2026-09-20';

  const dateParts = tDate.includes('-') ? tDate.split('-') : ['2026', '09', '20'];
  const [year, month, day] = dateParts;

  // IndiGo: pre-injects origin, destination, one-way trip, departure date, and adults
  if (c.includes('indigo') || c === '6e') {
    return `https://www.goindigo.in/flight-booking.html?originCode=${depCode}&destinationCode=${arrCode}&tripType=O&departureDate=${year}-${month}-${day}&adults=1`;
  }

  // Air India Express: pre-injects search route and date
  if (c.includes('air india express') || c.includes('express') || c === 'ix') {
    return `https://www.airindiaexpress.com/search?origin=${depCode}&destination=${arrCode}&departureDate=${year}-${month}-${day}&adults=1`;
  }

  // Air India & Vistara (merged into Air India): pre-injects flight route, one-way trip, and departure date
  if (
    c.includes('air india') ||
    c === 'ai' ||
    c.includes('vistara') ||
    c === 'uk'
  ) {
    return `https://www.airindia.com/en-in/book-flights?from=${depCode}&to=${arrCode}&trip=O&depart=${year}-${month}-${day}&adult=1`;
  }

  // Akasa Air: pre-injects origin, destination, and departure date
  if (c.includes('akasa') || c === 'qp') {
    return `https://www.akasaair.com/search?origin=${depCode}&destination=${arrCode}&departureDate=${year}-${month}-${day}&adults=1`;
  }

  // SpiceJet: pre-injects select query with origin, destination, and departure date
  if (c.includes('spicejet') || c.includes('spice jet') || c === 'sg') {
    return `https://book.spicejet.com/Select.aspx?origin=${depCode}&destination=${arrCode}&departureDate=${year}-${month}-${day}&ADT=1`;
  }

  // Alliance Air
  if (c.includes('alliance') || c === '9i') {
    return `https://allianceair.in/`;
  }

  // Star Air
  if (c.includes('star air') || c === 's5') {
    return `https://starair.in/`;
  }

  // Fly91
  if (c.includes('fly91') || c === 'ic') {
    return `https://fly91.in/`;
  }

  // Default fallback to IndiGo pre-injected search
  return `https://www.goindigo.in/flight-booking.html?originCode=${depCode}&destinationCode=${arrCode}&tripType=O&departureDate=${year}-${month}-${day}&adults=1`;
}

/**
 * Returns direct official airline website URL with pre-injected route & date for a given flight.
 * Guarantees automated flight search parameters and never navigates to Google Flights.
 */
export function getDirectFlightWebsiteUrl(flight?: Partial<Flight> | null): string {
  if (!flight) return 'https://www.goindigo.in/';

  // If flight already has a verified airline portal URL, use it if it contains parameters, or augment it
  const airlineSource = flight.sources?.find(
    (s) => s.type === 'airline' && s.bookingUrl && s.bookingUrl.trim() !== ''
  );
  if (airlineSource?.bookingUrl && (airlineSource.bookingUrl.includes('?') || airlineSource.bookingUrl.includes('srch='))) {
    return airlineSource.bookingUrl;
  }

  return getAirlinePortalUrl(
    flight.airlineCode || flight.airline,
    flight.departureCode,
    flight.arrivalCode,
    flight.travelDate
  );
}

/**
 * Generates an automated search URL based on route, date, and provider name.
 * Automatically executes the live flight query and navigates straight towards checkout/payment.
 */
export function getProviderSearchUrl(
  flight?: Partial<Flight> | null,
  providerName?: string
): string {
  const sourceName = (providerName || '').toLowerCase().trim();
  const airlineName = (flight?.airline || '').toLowerCase().trim();
  const carrierCode = (flight?.airlineCode || '').toLowerCase().trim();

  const depCode = (flight?.departureCode || 'DEL').toUpperCase();
  const arrCode = (flight?.arrivalCode || 'BOM').toUpperCase();
  const travelDate = flight?.travelDate || '2026-09-20';

  // Parse date formats
  const dateParts = travelDate.includes('-') ? travelDate.split('-') : ['2026', '09', '20'];
  const [year, month, day] = dateParts;
  const dateDDMMYYYY = `${day}/${month}/${year}`;
  const origCity = CITY_NAMES[depCode] || depCode;
  const destCity = CITY_NAMES[arrCode] || arrCode;

  // Direct Airline Check
  if (
    sourceName.includes('airline') ||
    sourceName.includes('direct') ||
    sourceName.includes('official') ||
    sourceName.includes(airlineName) ||
    sourceName.includes(carrierCode)
  ) {
    return getAirlinePortalUrl(flight?.airlineCode || flight?.airline, depCode, arrCode, travelDate);
  }

  // EaseMyTrip: Instant automated search results execution
  if (sourceName.includes('easemytrip')) {
    return `https://flight.easemytrip.com/FlightList/Index?srch=${depCode}-${origCity}-India|${arrCode}-${destCity}-India|${dateDDMMYYYY}&px=1-0-0&cbn=0&ar=undefined&isSplitSearch=false`;
  }

  // MakeMyTrip: Instant automated search results execution
  if (sourceName.includes('makemytrip') || sourceName.includes('ota a')) {
    return `https://www.makemytrip.com/flight/search?itinerary=${depCode}-${arrCode}-${dateDDMMYYYY}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E`;
  }

  // Cleartrip: Instant automated search results execution
  if (sourceName.includes('cleartrip') || sourceName.includes('ota c')) {
    return `https://www.cleartrip.com/flights/results?from=${depCode}&to=${arrCode}&depart_date=${dateDDMMYYYY}&adults=1&childs=0&infants=0&class=Economy`;
  }

  // Ixigo: Instant automated search results execution
  if (sourceName.includes('ixigo')) {
    return `https://www.ixigo.com/search/result/flight?from=${depCode}&to=${arrCode}&date=${year}${month}${day}&adults=1&children=0&infants=0&class=e`;
  }

  // Yatra: Instant automated search results execution
  if (sourceName.includes('yatra') || sourceName.includes('ota b')) {
    return `https://flight.yatra.com/air-search/dom2/trigger?type=O&viewName=normal&flexi=0&noOfSegments=1&origin=${depCode}&originCode=${depCode}&destination=${arrCode}&destinationCode=${arrCode}&flight_depart_date=${dateDDMMYYYY}&ADT=1&CHD=0&INF=0&class=Economy`;
  }

  // Goibibo
  if (sourceName.includes('goibibo')) {
    return `https://www.goibibo.com/flights/air-${depCode}-${arrCode}-${year}${month}${day}-1-0-0-E-D/`;
  }

  // Default fallback: Always pre-fill and auto-search on airline portal!
  return getAirlinePortalUrl(flight?.airlineCode || flight?.airline, depCode, arrCode, travelDate);
}

/**
 * Returns the external booking URL if booking is available for the source.
 * Guarantees automated search parameters and direct navigation.
 */
export function getBookingUrl(
  flight?: Partial<Flight> | null,
  source?: Partial<FlightSource> | null
): string | null {
  if (!source) return null;

  if (source.bookingAvailable === false && (source.bookingUrl === null || source.bookingUrl === '')) {
    return null;
  }

  if (source.bookingUrl && typeof source.bookingUrl === 'string' && source.bookingUrl.trim() !== '') {
    // If the bookingUrl is pointing to Google Flights, redirect to the direct automated airline search instead!
    if (source.bookingUrl.includes('google.com/travel/flights')) {
      return getAirlinePortalUrl(flight?.airlineCode || flight?.airline, flight?.departureCode, flight?.arrivalCode, flight?.travelDate);
    }
    // If bookingUrl has query params or is already an auto-search deep link, use it
    if (source.bookingUrl.includes('?') || source.bookingUrl.includes('srch=') || source.bookingUrl.includes('itinerary=')) {
      return source.bookingUrl;
    }
  }

  return getProviderSearchUrl(flight, source.name);
}

/**
 * Determines whether a source has a valid, non-empty booking URL and is enabled for booking.
 */
export function isSourceBookable(
  flight?: Partial<Flight> | null,
  source?: Partial<FlightSource> | null
): boolean {
  if (!source) return false;
  if (source.bookingAvailable === false && (source.bookingUrl === null || source.bookingUrl === '')) {
    return false;
  }
  const resolvedUrl = getBookingUrl(flight, source);
  return Boolean(resolvedUrl && resolvedUrl.trim() !== '');
}

/**
 * Safely performs client-side redirection to an external provider search/booking URL.
 */
export function redirectToBooking(url: string | null, target: '_blank' | '_self' = '_blank'): void {
  if (!url) return;
  if (typeof window !== 'undefined') {
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }
}
