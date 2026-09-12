from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class AirIndiaExpressSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "Air India Express Direct"

    def get_source_type(self) -> str:
        return "AIRLINE"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        return f"https://www.airindiaexpress.com/flight-select?origin={origin}&destination={destination}&date={travel_date}"

    def get_result_selectors(self) -> List[str]:
        return [
            ".express-flight-card",
            "div[class*='flightCard']"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-aix-{origin}-{destination}-IX1421",
                source="Air India Express Direct",
                source_type="AIRLINE",
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
                fees=200.0,
                total_fare=4650.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


