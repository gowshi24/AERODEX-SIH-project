from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class AkasaAirSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "Akasa Air Direct"

    def get_source_type(self) -> str:
        return "AIRLINE"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        return f"https://www.akasaair.com/fly/select-flight?origin={origin}&dest={destination}&date={travel_date}"

    def get_result_selectors(self) -> List[str]:
        return [
            ".akasa-flight-card",
            "div[class*='flightItem']"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-qp-{origin}-{destination}-QP1102",
                source="Akasa Air Direct",
                source_type="AIRLINE",
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
                fees=200.0,
                total_fare=4900.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


