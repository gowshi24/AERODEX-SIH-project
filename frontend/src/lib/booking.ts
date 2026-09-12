import { Flight, FlightSource } from '../types';

/**
 * Generates a provider-specific search URL based on route, date, and provider name.
 */
export function getProviderSearchUrl(
  flight?: Partial<Flight> | null,
  providerName?: string
): string {
  const sourceName = (providerName || '').toLowerCase();
  const airlineName = (flight?.airline || '').toLowerCase();

  const depCode = (flight?.departureCode || 'DEL').toUpperCase();
  const arrCode = (flight?.arrivalCode || 'BOM').toUpperCase();
  const travelDate = flight?.travelDate || '2026-09-20';

  // Parse YYYY-MM-DD
  const dateParts = travelDate.includes('-') ? travelDate.split('-') : ['2026', '09', '20'];
  const [year, month, day] = dateParts;
  const dateDDMMYYYY = `${day}/${month}/${year}`;
  const dateDDMMYYYY_dash = `${day}-${month}-${year}`;

  // MakeMyTrip
  if (sourceName.includes('makemytrip') || sourceName.includes('ota a')) {
    return `https://www.makemytrip.com/flight/search?itinerary=${depCode}-${arrCode}-${dateDDMMYYYY}&tripType=O&paxType=A-1_C-0_I-0&cabinClass=E`;
  }

  // Yatra
  if (sourceName.includes('yatra') || sourceName.includes('ota b')) {
    return `https://www.yatra.com/flights`;
  }

  // Cleartrip
  if (sourceName.includes('cleartrip') || sourceName.includes('ota c')) {
    return `https://www.cleartrip.com/flights/results?from=${depCode}&to=${arrCode}&depart_date=${dateDDMMYYYY}&adults=1&childs=0&infants=0&class=Economy`;
  }

  // EaseMyTrip
  if (sourceName.includes('easemytrip')) {
    return `https://www.easemytrip.com/flight-search/${depCode}-${arrCode}-${dateDDMMYYYY_dash}.html`;
  }

  // ixigo
  if (sourceName.includes('ixigo')) {
    return `https://www.ixigo.com/search/result/flight?from=${depCode}&to=${arrCode}&date=${year}${month}${day}&adults=1&children=0&infants=0&class=e`;
  }

  // Goibibo
  if (sourceName.includes('goibibo')) {
    return `https://www.goibibo.com/flights/air-${depCode}-${arrCode}-${year}${month}${day}-1-0-0-e-d/`;
  }

  // Airlines Direct
  if (sourceName.includes('indigo') || airlineName.includes('indigo')) {
    return 'https://www.goindigo.in/';
  }

  if (sourceName.includes('air india') || airlineName.includes('air india')) {
    return 'https://www.airindia.com/';
  }

  if (sourceName.includes('akasa') || airlineName.includes('akasa')) {
    return 'https://www.akasaair.com/';
  }

  if (sourceName.includes('spicejet') || airlineName.includes('spicejet')) {
    return 'https://www.spicejet.com/';
  }

  // Generic Airline Direct fallback
  if (sourceName.includes('airline direct')) {
    if (airlineName.includes('indigo')) return 'https://www.goindigo.in/';
    if (airlineName.includes('air india')) return 'https://www.airindia.com/';
    if (airlineName.includes('akasa')) return 'https://www.akasaair.com/';
    if (airlineName.includes('spicejet')) return 'https://www.spicejet.com/';
  }

  // Default fallback
  return 'https://www.yatra.com/flights';
}

/**
 * Returns the external booking URL if booking is available for the source.
 */
export function getBookingUrl(
  flight?: Partial<Flight> | null,
  source?: Partial<FlightSource> | null
): string | null {
  if (!source) return null;

  // If booking is explicitly marked as unavailable with false/null, return null
  if (source.bookingAvailable === false && (source.bookingUrl === null || source.bookingUrl === '')) {
    return null;
  }

  // If an explicit non-empty bookingUrl is provided, return it
  if (source.bookingUrl && typeof source.bookingUrl === 'string' && source.bookingUrl.trim() !== '') {
    return source.bookingUrl;
  }

  // Generate provider search URL using route/date params
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
