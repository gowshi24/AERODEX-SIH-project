from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class YatraSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "Yatra"

    def get_source_type(self) -> str:
        return "OTA"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        dt_parts = travel_date.split("-")
        dt_formatted = f"{dt_parts[2]}/{dt_parts[1]}/{dt_parts[0]}" if len(dt_parts) == 3 else travel_date
        return f"https://flight.yatra.com/air-search/dom/v2/full?flight_departure_date={dt_formatted}&origin={origin}&destination={destination}"

    def get_result_selectors(self) -> List[str]:
        return [
            ".flight-summary",
            ".flight-list-item"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-yt-{origin}-{destination}-AI803",
                source="Yatra",
                source_type="OTA",
                airline="Air India",
                flight_number="AI-803",
                origin=origin,
                destination=destination,
                departure_datetime=f"{travel_date}T10:00:00",
                arrival_datetime=f"{travel_date}T12:15:00",
                travel_date=travel_date,
                fare_class="Economy",
                base_fare=4800.0,
                taxes=750.0,
                fees=300.0,
                total_fare=5850.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


