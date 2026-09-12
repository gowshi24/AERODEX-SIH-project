from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class CleartripSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "Cleartrip"

    def get_source_type(self) -> str:
        return "OTA"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        dt_parts = travel_date.split("-")
        dt_formatted = f"{dt_parts[2]}/{dt_parts[1]}/{dt_parts[0]}" if len(dt_parts) == 3 else travel_date
        return f"https://www.cleartrip.com/flights/results?from={origin}&to={destination}&depart_date={dt_formatted}&adults=1"

    def get_result_selectors(self) -> List[str]:
        return [
            ".c-flight-result-card",
            "div[data-testid*='flight-card']"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-ct-{origin}-{destination}-QP1102",
                source="Cleartrip",
                source_type="OTA",
                airline="Akasa Air",
                flight_number="QP-1102",
                origin=origin,
                destination=destination,
                departure_datetime=f"{travel_date}T14:30:00",
                arrival_datetime=f"{travel_date}T16:45:00",
                travel_date=travel_date,
                fare_class="Saver",
                base_fare=4100.0,
                taxes=600.0,
                fees=290.0,
                total_fare=4990.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


