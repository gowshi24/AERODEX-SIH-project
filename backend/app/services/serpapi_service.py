import logging
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from backend.app.core.config import settings
from scraper.models.fare_observation import FareObservation
from scraper.processors.cleaner import FareCleaner
from scraper.processors.validator import FareValidator
from scraper.processors.normalizer import FareNormalizer

logger = logging.getLogger("aerodex.serpapi_service")

class SerpAPIService:
    """
    Dedicated backend service for fetching and normalizing real-time airfare data from SerpAPI Google Flights engine.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.serpapi_key

    async def fetch_flights(
        self,
        origin: str,
        destination: str,
        travel_date: str,
        return_date: Optional[str] = None,
        passengers: int = 1,
        cabin_class: Optional[str] = "economy"
    ) -> List[FareObservation]:
        """
        Fetch live flight fares from SerpAPI backend and normalize into FareObservation objects.
        """
        if not self.api_key:
            logger.error("[SerpAPI] SERPAPI_KEY environment variable is not configured.")
            return []

        url = "https://serpapi.com/search.json"
        # 1 = Round trip, 2 = One way
        flight_type = "1" if return_date else "2"

        params: Dict[str, Any] = {
            "engine": "google_flights",
            "departure_id": origin.upper(),
            "arrival_id": destination.upper(),
            "outbound_date": travel_date,
            "type": flight_type,
            "currency": "INR",
            "api_key": self.api_key
        }

        if return_date:
            params["return_date"] = return_date

        if cabin_class:
            class_map = {"economy": 1, "premium_economy": 2, "business": 3, "first": 4}
            params["travel_class"] = class_map.get(cabin_class.lower(), 1)

        try:
            # Mask API key in debug logs for security
            log_params = {k: ("***" if k == "api_key" else v) for k, v in params.items()}
            logger.info(f"[SerpAPI] Requesting live flights for route {origin}-{destination} on {travel_date} with params {log_params}")

            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.get(url, params=params)
                if res.status_code != 200:
                    logger.error(f"[SerpAPI] HTTP {res.status_code} error from SerpAPI")
                    return []

                data = res.json()
                if "error" in data:
                    logger.error(f"[SerpAPI] API returned error message: {data['error']}")
                    return []

                flight_items = data.get("best_flights", []) + data.get("other_flights", [])
                observations: List[FareObservation] = []

                for idx, item in enumerate(flight_items):
                    obs = self._parse_flight_item(item, origin, destination, travel_date, idx)
                    if obs:
                        normalized = FareNormalizer.normalize(obs)
                        cleaned = FareCleaner.clean_fare_observation(normalized)
                        if cleaned:
                            v_status, _ = FareValidator.validate(cleaned)
                            observations.append(cleaned)

                logger.info(f"[SerpAPI] Successfully parsed {len(observations)} real-time fare observations.")
                return observations

        except httpx.TimeoutException:
            logger.error("[SerpAPI] Network timeout while requesting SerpAPI.")
            return []
        except Exception as e:
            logger.error(f"[SerpAPI] Exception during API request: {str(e)}")
            return []

    def _parse_flight_item(
        self,
        item: Dict[str, Any],
        origin: str,
        destination: str,
        travel_date: str,
        idx: int
    ) -> Optional[FareObservation]:
        try:
            flights = item.get("flights", [])
            if not flights:
                return None
            first_leg = flights[0]

            airline = first_leg.get("airline", "Generic Airline")
            flight_num_raw = first_leg.get("flight_number", f"SA-{100 + idx}")
            flight_number = flight_num_raw.replace(" ", "-")

            dep_time_str = first_leg.get("departure_airport", {}).get("time")
            arr_time_str = first_leg.get("arrival_airport", {}).get("time")

            dep_datetime = dep_time_str.replace(" ", "T") if dep_time_str else f"{travel_date}T08:00:00"
            arr_datetime = arr_time_str.replace(" ", "T") if arr_time_str else f"{travel_date}T10:15:00"

            price = float(item.get("price", 4500))
            base_fare = round(price * 0.85, 2)
            taxes = round(price * 0.15, 2)

            fare_class = first_leg.get("travel_class", "Economy")

            return FareObservation(
                id=f"obs-serpapi-{origin.lower()}-{destination.lower()}-{flight_number.lower()}-{idx}",
                source="SerpApi / Google Flights",
                source_type="META_OTA",
                airline=airline,
                flight_number=flight_number,
                origin=origin.upper(),
                destination=destination.upper(),
                departure_datetime=dep_datetime,
                arrival_datetime=arr_datetime,
                travel_date=travel_date,
                fare_class=fare_class,
                base_fare=base_fare,
                taxes=taxes,
                fees=0.0,
                total_fare=price,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        except Exception as e:
            logger.warning(f"[SerpAPI] Error parsing flight item: {str(e)}")
            return None

serpapi_service = SerpAPIService()
