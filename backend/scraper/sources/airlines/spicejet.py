from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class SpiceJetSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "SpiceJet Direct"

    def get_source_type(self) -> str:
        return "AIRLINE"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        return f"https://www.spicejet.com/select-flight?origin={origin}&destination={destination}&date={travel_date}"

    def get_result_selectors(self) -> List[str]:
        return [
            ".spicejet-flight-card",
            "div[data-testid*='flight-card']"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-sg-{origin}-{destination}-SG8169",
                source="SpiceJet Direct",
                source_type="AIRLINE",
                airline="SpiceJet",
                flight_number="SG-8169",
                origin=origin,
                destination=destination,
                departure_datetime=f"{travel_date}T18:10:00",
                arrival_datetime=f"{travel_date}T20:25:00",
                travel_date=travel_date,
                fare_class="Saver",
                base_fare=3850.0,
                taxes=580.0,
                fees=220.0,
                total_fare=4650.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


