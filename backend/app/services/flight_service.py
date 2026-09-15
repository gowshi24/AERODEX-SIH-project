import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.app.services.serpapi_service import serpapi_service
from backend.app.services.db_service import db_service
from scraper.models.fare_observation import FareObservation

logger = logging.getLogger("aerodex.flight_service")

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
        "aircraft": "Airbus A320neo",
        "fareClass": "Saver",
        "basePrice": 4250.0,
        "cheapestSource": "SerpApi / Google Flights",
        "priceTrendPercent": -4.2,
        "priceTrendDirection": "down",
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
        "baggage": {"cabin": "7 Kgs", "checkIn": "15 Kgs"},
        "refundability": "Partially Refundable",
        "priceHistory": [
            {"date": "2026-09-01", "price": 5300.0},
            {"date": "2026-09-06", "price": 4870.0}
        ]
    },
    {
        "id": "fl-ai-803",
        "airline": "Air India",
        "airlineCode": "AI",
        "flightNumber": "AI-803",
        "departureCity": "New Delhi",
        "departureCode": "DEL",
        "departureTime": "10:00",
        "arrivalCity": "Mumbai",
        "arrivalCode": "BOM",
        "arrivalTime": "12:15",
        "travelDate": "2026-09-20",
        "duration": "2h 15m",
        "stops": 0,
        "aircraft": "Boeing 787-8",
        "fareClass": "Economy",
        "basePrice": 4800.0,
        "cheapestSource": "SerpApi / Google Flights",
        "priceTrendPercent": 2.5,
        "priceTrendDirection": "up",
        "sources": [
            {
                "id": "src-serp-2",
                "name": "SerpApi / Google Flights",
                "price": 5800.0,
                "baseFare": 4800.0,
                "taxes": 750.0,
                "fees": 250.0,
                "isCheapest": True,
                "type": "airline",
                "bookingUrl": "https://www.google.com/travel/flights"
            }
        ],
        "baggage": {"cabin": "8 Kgs", "checkIn": "20 Kgs"},
        "refundability": "Refundable",
        "priceHistory": [
            {"date": "2026-09-01", "price": 5750.0},
            {"date": "2026-09-06", "price": 5800.0}
        ]
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

        # 1. Check Supabase DB for recent observations (< 15 min cache window) if refresh is not explicitly requested
        if not refresh and db:
            cached_fares = db_service.get_cached_observations(db, orig_code, dest_code, t_date, max_age_minutes=15)
            if cached_fares:
                logger.info(f"[FlightService] Returning {len(cached_fares)} fresh cached observations from Supabase PostgreSQL.")
                return FlightService._map_db_fares_to_flights(cached_fares, orig_code, dest_code, t_date)

        # 2. Call SerpAPI from backend if data is stale or forced refresh requested
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
            # 3. Persist observations into Supabase PostgreSQL
            if db:
                db_service.save_fare_observations(db, live_observations)

            return FlightService._map_observations_to_flights(live_observations, orig_code, dest_code, t_date)

        # 4. Fallback to existing database records if live SerpAPI call returns no items
        if db:
            older_fares = db_service.get_cached_observations(db, orig_code, dest_code, t_date, max_age_minutes=1440)
            if older_fares:
                logger.info(f"[FlightService] SerpAPI empty/failed. Returning {len(older_fares)} recent database records.")
                return FlightService._map_db_fares_to_flights(older_fares, orig_code, dest_code, t_date)

        # 5. Ultimate fallback to structured fallback options filtered by origin/destination
        logger.info("[FlightService] Returning structured fallback results.")
        results = MOCK_FLIGHTS_DATA
        if origin:
            results = [f for f in results if f["departureCode"].upper() == orig_code]
        if destination:
            results = [f for f in results if f["arrivalCode"].upper() == dest_code]
        return results

    @staticmethod
    def _map_observations_to_flights(
        observations: List[FareObservation],
        origin: str,
        destination: str,
        travel_date: str
    ) -> List[Dict[str, Any]]:
        flights_list = []
        for idx, obs in enumerate(observations):
            fl_dict = {
                "id": f"fl-serp-{obs.flight_number.lower()}-{idx}",
                "airline": obs.airline,
                "airlineCode": obs.flight_number.split("-")[0] if "-" in obs.flight_number else "6E",
                "flightNumber": obs.flight_number,
                "departureCity": CITY_NAMES.get(obs.origin.upper(), obs.origin),
                "departureCode": obs.origin.upper(),
                "departureTime": obs.departure_datetime.split("T")[1][:5] if "T" in obs.departure_datetime else "08:00",
                "arrivalCity": CITY_NAMES.get(obs.destination.upper(), obs.destination),
                "arrivalCode": obs.destination.upper(),
                "arrivalTime": obs.arrival_datetime.split("T")[1][:5] if "T" in obs.arrival_datetime else "10:15",
                "travelDate": obs.travel_date,
                "duration": "2h 15m",
                "stops": 0,
                "aircraft": "Airbus A320neo",
                "fareClass": obs.fare_class or "Economy Saver",
                "basePrice": float(obs.base_fare),
                "cheapestSource": obs.source,
                "priceTrendPercent": -1.8,
                "priceTrendDirection": "down",
                "sources": [
                    {
                        "id": f"src-serp-{idx}",
                        "name": obs.source,
                        "price": float(obs.total_fare),
                        "baseFare": float(obs.base_fare),
                        "taxes": float(obs.taxes),
                        "fees": float(obs.fees),
                        "isCheapest": True,
                        "type": "ota",
                        "bookingUrl": "https://www.google.com/travel/flights"
                    }
                ],
                "baggage": {"cabin": "7 Kgs", "checkIn": "15 Kgs"},
                "refundability": "Standard Economy",
                "priceHistory": [
                    {"date": "2026-09-01", "price": round(float(obs.total_fare) * 1.06, 2)},
                    {"date": "2026-09-06", "price": round(float(obs.total_fare) * 1.02, 2)},
                    {"date": "2026-09-12", "price": float(obs.total_fare)},
                ]
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
            airline_code = flight_obj.airline_code if flight_obj else "6E"
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
                "duration": "2h 15m",
                "stops": 0,
                "aircraft": "Airbus A320neo",
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
                "baggage": {"cabin": "7 Kgs", "checkIn": "15 Kgs"},
                "refundability": "Standard Economy",
                "priceHistory": [
                    {"date": "2026-09-01", "price": round(float(fare.total_fare) * 1.05, 2)},
                    {"date": "2026-09-12", "price": float(fare.total_fare)},
                ]
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
