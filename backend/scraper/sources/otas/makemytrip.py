from typing import List, Dict, Any, Optional
from scraper.sources.base_playwright_adapter import BasePlaywrightAdapter
from scraper.models.fare_observation import FareObservation

class MakeMyTripSourceAdapter(BasePlaywrightAdapter):

    def get_source_name(self) -> str:
        return "MakeMyTrip"

    def get_source_type(self) -> str:
        return "OTA"

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        dt_parts = travel_date.split("-")
        dt_formatted = f"{dt_parts[2]}/{dt_parts[1]}/{dt_parts[0]}" if len(dt_parts) == 3 else travel_date
        return f"https://www.makemytrip.com/flight/search?itinerary={origin}-{destination}-{dt_formatted}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E"

    def get_result_selectors(self) -> List[str]:
        return [
            ".listingCard",
            "div[id*='flightListing']",
            ".flightCard"
        ]

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id=f"obs-mmt-{origin}-{destination}-6E2041",
                source="MakeMyTrip",
                source_type="OTA",
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
                fees=350.0,
                total_fare=5220.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]


