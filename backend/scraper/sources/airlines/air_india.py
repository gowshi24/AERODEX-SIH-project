from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class AirIndiaSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "Air India Direct"

    def get_source_type(self) -> str:
        return "AIRLINE"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        return f"https://www.airindia.com/in/en/book/flight-select.html?origin={origin}&destination={destination}&date={travel_date}"

    def get_result_selectors(self) -> List[str]:
        return [
            ".flight-card",
            ".air-india-bound-card",
            "div[class*='flightResultCard']"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-ai-{origin}-{destination}-AI803",
                source="Air India Direct",
                source_type="AIRLINE",
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
                fees=250.0,
                total_fare=5800.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


