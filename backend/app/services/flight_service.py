import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.app.services.serpapi_service import serpapi_service
from backend.app.services.db_service import db_service
try:
    from backend.scraper.models.fare_observation import FareObservation
except ImportError:
    from scraper.models.fare_observation import FareObservation

logger = logging.getLogger("aerodex.flight_service")

# In-memory short-lived cache for database-less SerpAPI execution: key = (origin, destination, date)
IN_MEMORY_CACHE: Dict[Tuple[str, str, str], Dict[str, Any]] = {}

AIRLINE_IATA_MAP = {
    "INDIGO": "6E",
    "AIR INDIA": "AI",
    "VISTARA": "UK",
    "AKASA AIR": "QP",
    "SPICEJET": "SG",
    "AIR INDIA EXPRESS": "IX",
    "AIX CONNECT": "IX",
    "ALLIANCE AIR": "9I",
    "FLY91": "IC",
    "STAR AIR": "S5",
    "GO FIRST": "G8",
}

CITY_NAMES = {
    "DEL": "New Delhi",
    "BOM": "Mumbai",
    "BLR": "Bengaluru",
    "MAA": "Chennai",
    "CCU": "Kolkata",
    "HYD": "Hyderabad",
    "AMD": "Ahmedabad",
    "PNQ": "Pune",
    "GOI": "Goa",
    "COK": "Kochi",
}

def get_airline_code(airline: str, flight_number: str) -> str:
    clean_airline = (airline or "").strip().upper()
    if clean_airline in AIRLINE_IATA_MAP:
        return AIRLINE_IATA_MAP[clean_airline]
    for key, code in AIRLINE_IATA_MAP.items():
        if key in clean_airline:
            return code
    if flight_number and "-" in flight_number:
        prefix = flight_number.split("-")[0].strip().upper()
        if 2 <= len(prefix) <= 3:
            return prefix
    if flight_number and len(flight_number) >= 2 and flight_number[:2].isalnum():
        return flight_number[:2].upper()
    return "FL"

def format_duration(duration_minutes: Optional[int]) -> str:
    if not duration_minutes or duration_minutes <= 0:
        return "Direct"
    hours = duration_minutes // 60
    mins = duration_minutes % 60
    if hours > 0 and mins > 0:
        return f"{hours}h {mins}m"
    elif hours > 0:
        return f"{hours}h"
    else:
        return f"{mins}m"

MOCK_FLIGHTS_DATA = [
    {
        "id": "fl-indigo-6e2041",
        "airline": "IndiGo",
        "airlineCode": "6E",
        "flightNumber": "6E-2041",
        "departureCity": "New Delhi",
        "departureCode": "DEL",
        "departureTime": "07:25",
        "arrivalCity": "Mumbai",
        "arrivalCode": "BOM",
        "arrivalTime": "09:40",
        "travelDate": "2026-09-20",
        "duration": "2h 15m",
        "stops": 0,
        "aircraft": None,
        "fareClass": "Saver",
        "basePrice": 4250.0,
        "cheapestSource": "SerpApi / Google Flights",
        "priceTrendPercent": 0.0,
        "priceTrendDirection": "stable",
        "sources": [
            {
                "id": "src-serp-1",
                "name": "SerpApi / Google Flights",
                "price": 4870.0,
                "baseFare": 4250.0,
                "taxes": 620.0,
                "fees": 0.0,
                "isCheapest": True,
                "type": "ota",
                "bookingUrl": "https://www.google.com/travel/flights"
            }
        ],
        "baggage": {"cabin": "Not specified", "checkIn": "Not specified"},
        "refundability": "Not specified",
        "priceHistory": []
    }
]

class FlightService:
    @staticmethod
    async def search_flights_async(
        origin: Optional[str] = None,
        destination: Optional[str] = None,
        travel_date: Optional[str] = "2026-09-20",
        return_date: Optional[str] = None,
        passengers: int = 1,
        cabin_class: Optional[str] = "economy",
        refresh: bool = False,
        db: Optional[Session] = None
    ) -> List[Dict[str, Any]]:
        orig_code = (origin or "DEL").upper()
        dest_code = (destination or "BOM").upper()
        t_date = travel_date or "2026-09-20"
        cache_key = (orig_code, dest_code, t_date)
        now = datetime.now(timezone.utc)

        # 1. In-Memory Cache Lookup (15 min TTL) if refresh=False
        if not refresh and cache_key in IN_MEMORY_CACHE:
            entry = IN_MEMORY_CACHE[cache_key]
            if (now - entry["timestamp"]).total_seconds() < 900:
                logger.info(f"[FlightService] Returning {len(entry['flights'])} in-memory cached results for {orig_code}-{dest_code}")
                return entry["flights"]

        # 2. Check DB Cache if DB session available
        if not refresh and db:
            try:
                cached_fares = db_service.get_cached_observations(db, orig_code, dest_code, t_date, max_age_minutes=15)
                if cached_fares:
                    mapped = FlightService._map_db_fares_to_flights(cached_fares, orig_code, dest_code, t_date)
                    IN_MEMORY_CACHE[cache_key] = {"timestamp": now, "flights": mapped}
                    logger.info(f"[FlightService] Returning {len(mapped)} DB cached observations for {orig_code}-{dest_code}")
                    return mapped
            except Exception as e:
                logger.warning(f"[FlightService] DB cache lookup failed: {e}")

        # 3. Call SerpAPI live service
        logger.info(f"[FlightService] Fetching live airfare data from SerpAPI for route {orig_code}-{dest_code} on {t_date}")
        live_observations = await serpapi_service.fetch_flights(
            origin=orig_code,
            destination=dest_code,
            travel_date=t_date,
            return_date=return_date,
            passengers=passengers,
            cabin_class=cabin_class
        )

        if live_observations:
            mapped = FlightService._map_observations_to_flights(live_observations, orig_code, dest_code, t_date)
            IN_MEMORY_CACHE[cache_key] = {"timestamp": now, "flights": mapped}

            if db:
                try:
                    db_service.save_fare_observations(db, live_observations)
                except Exception as e:
                    logger.warning(f"[FlightService] DB save observations failed: {e}")

            return mapped

        # 4. Fallback to existing in-memory cache if live search returned empty
        if cache_key in IN_MEMORY_CACHE:
            logger.info(f"[FlightService] Live fetch empty. Returning cached results for {cache_key}")
            return IN_MEMORY_CACHE[cache_key]["flights"]

        logger.warning(f"[FlightService] SerpAPI returned no flight results for route {orig_code}-{dest_code}.")
        return []

    @staticmethod
    def _map_observations_to_flights(
        observations: List[FareObservation],
        origin: str,
        destination: str,
        travel_date: str
    ) -> List[Dict[str, Any]]:
        flights_list = []
        for idx, obs in enumerate(observations):
            airline_code = get_airline_code(obs.airline, obs.flight_number)
            duration_str = format_duration(obs.duration_minutes)
            dep_time = obs.departure_datetime.split("T")[1][:5] if "T" in obs.departure_datetime else "08:00"
            arr_time = obs.arrival_datetime.split("T")[1][:5] if "T" in obs.arrival_datetime else "10:15"

            fl_dict = {
                "id": f"fl-serp-{obs.flight_number.lower()}-{idx}",
                "airline": obs.airline,
                "airlineCode": airline_code,
                "flightNumber": obs.flight_number,
                "departureCity": CITY_NAMES.get(obs.origin.upper(), obs.origin),
                "departureCode": obs.origin.upper(),
                "departureTime": dep_time,
                "arrivalCity": CITY_NAMES.get(obs.destination.upper(), obs.destination),
                "arrivalCode": obs.destination.upper(),
                "arrivalTime": arr_time,
                "travelDate": obs.travel_date,
                "duration": duration_str,
                "stops": obs.stops if obs.stops is not None else 0,
                "aircraft": obs.aircraft or None,
                "fareClass": obs.fare_class or "Economy",
                "basePrice": float(obs.base_fare) if obs.base_fare else float(obs.total_fare),
                "cheapestSource": obs.source,
                "priceTrendPercent": 0.0,
                "priceTrendDirection": "stable",
                "sources": [
                    {
                        "id": f"src-serp-{idx}",
                        "name": obs.source,
                        "price": float(obs.total_fare),
                        "baseFare": float(obs.base_fare) if obs.base_fare else float(obs.total_fare),
                        "taxes": float(obs.taxes) if obs.taxes else 0.0,
                        "fees": float(obs.fees) if obs.fees else 0.0,
                        "isCheapest": True,
                        "type": "ota",
                        "bookingUrl": "https://www.google.com/travel/flights"
                    }
                ],
                "baggage": {
                    "cabin": obs.baggage or "Not specified",
                    "checkIn": "Not specified"
                },
                "refundability": obs.refundable or "Not specified",
                "priceHistory": []
            }
            flights_list.append(fl_dict)
        return flights_list

    @staticmethod
    def _map_db_fares_to_flights(
        fares: List[Any],
        origin: str,
        destination: str,
        travel_date: str
    ) -> List[Dict[str, Any]]:
        flights_list = []
        for idx, fare in enumerate(fares):
            flight_obj = fare.flight
            airline = flight_obj.airline if flight_obj else "Airline"
            flight_num = flight_obj.flight_number if flight_obj else f"FL-{100 + idx}"
            airline_code = flight_obj.airline_code if flight_obj else get_airline_code(airline, flight_num)
            dep_time = flight_obj.departure_time if flight_obj else "08:00"
            arr_time = flight_obj.arrival_time if flight_obj else "10:15"

            fl_dict = {
                "id": f"fl-db-{fare.id}",
                "airline": airline,
                "airlineCode": airline_code,
                "flightNumber": flight_num,
                "departureCity": CITY_NAMES.get(origin.upper(), origin),
                "departureCode": origin.upper(),
                "departureTime": dep_time,
                "arrivalCity": CITY_NAMES.get(destination.upper(), destination),
                "arrivalCode": destination.upper(),
                "arrivalTime": arr_time,
                "travelDate": fare.travel_date,
                "duration": "Direct",
                "stops": 0,
                "aircraft": None,
                "fareClass": fare.availability_status or "Economy",
                "basePrice": float(fare.base_fare or fare.total_fare * 0.85),
                "cheapestSource": fare.source,
                "priceTrendPercent": 0.0,
                "priceTrendDirection": "stable",
                "sources": [
                    {
                        "id": f"src-db-{idx}",
                        "name": fare.source,
                        "price": float(fare.total_fare),
                        "baseFare": float(fare.base_fare or fare.total_fare * 0.85),
                        "taxes": float(fare.taxes or fare.total_fare * 0.15),
                        "fees": float(fare.fees or 0),
                        "isCheapest": True,
                        "type": fare.source_type or "ota",
                        "bookingUrl": "https://www.google.com/travel/flights"
                    }
                ],
                "baggage": {"cabin": "Not specified", "checkIn": "Not specified"},
                "refundability": "Not specified",
                "priceHistory": []
            }
            flights_list.append(fl_dict)
        return flights_list

    @staticmethod
    def search_flights(origin: Optional[str] = None, destination: Optional[str] = None) -> List[Dict[str, Any]]:
        results = MOCK_FLIGHTS_DATA
        if origin:
            results = [f for f in results if f["departureCode"].upper() == origin.upper()]
        if destination:
            results = [f for f in results if f["arrivalCode"].upper() == destination.upper()]
        return results

    @staticmethod
    def get_flight_by_id(flight_id: str) -> Optional[Dict[str, Any]]:
        for flight in MOCK_FLIGHTS_DATA:
            if flight["id"] == flight_id:
                return flight
        return MOCK_FLIGHTS_DATA[0]
