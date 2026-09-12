from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class IxigoSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "ixigo"

    def get_source_type(self) -> str:
        return "OTA"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        dt_clean = travel_date.replace("-", "")
        return f"https://www.ixigo.com/search/result/flight?from={origin}&to={destination}&date={dt_clean}&adults=1"

    def get_result_selectors(self) -> List[str]:
        return [
            ".c-flight-listing-split-row",
            "div[class*='flightCard']"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-ixi-{origin}-{destination}-SG8169",
                source="ixigo",
                source_type="OTA",
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
                fees=250.0,
                total_fare=4680.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


