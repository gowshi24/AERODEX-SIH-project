from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class GoibiboSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "Goibibo"

    def get_source_type(self) -> str:
        return "OTA"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        dt_clean = travel_date.replace("-", "")
        return f"https://www.goibibo.com/flights/air-{origin}-{destination}-{dt_clean}--1-0-0-E-d/"

    def get_result_selectors(self) -> List[str]:
        return [
            "div[class*='srp-card']",
            "div[class*='flightCard']"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-go-{origin}-{destination}-IX1421",
                source="Goibibo",
                source_type="OTA",
                airline="Air India Express",
                flight_number="IX-1421",
                origin=origin,
                destination=destination,
                departure_datetime=f"{travel_date}T06:15:00",
                arrival_datetime=f"{travel_date}T08:30:00",
                travel_date=travel_date,
                fare_class="Express Value",
                base_fare=3900.0,
                taxes=550.0,
                fees=310.0,
                total_fare=4760.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


