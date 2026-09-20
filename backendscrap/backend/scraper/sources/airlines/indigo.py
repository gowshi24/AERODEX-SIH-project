from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class IndiGoSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "IndiGo Direct"

    def get_source_type(self) -> str:
        return "AIRLINE"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        # Public fare search URL template for IndiGo direct portal
        return f"https://www.goindigo.in/flight-booking.html?origin={origin}&dest={destination}&date={travel_date}"

    def get_result_selectors(self) -> List[str]:
        return [
            ".flight-search-result-card",
            ".indigo-flight-item",
            "div[data-test-id='flight-card']",
            ".fare-card"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-indigo-{origin}-{destination}-6E2041",
                source="IndiGo Direct",
                source_type="AIRLINE",
                airline="IndiGo",
                flight_number="6E-2041",
                origin=origin,
                destination=destination,
                departure_datetime=f"{travel_date}T07:25:00",
                arrival_datetime=f"{travel_date}T09:40:00",
                travel_date=travel_date,
                fare_class="Saver",
                base_fare=4250.0,
                taxes=620.0,
                fees=230.0,
                total_fare=5100.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]

