from typing import List, Dict, Any
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.models.fare_observation import FareObservation

class EaseMyTripSourceAdapter(SourceAdapter):

    def get_source_name(self) -> str:
        return "EaseMyTrip"

    def get_source_type(self) -> str:
        return "OTA"

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id="obs-emt-01",
                source="EaseMyTrip",
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
                fees=0.0,  # EMT zero convenience fee USP
                total_fare=4870.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
            )
        ]

    def health_check(self) -> Dict[str, Any]:
        return {
            "name": self.get_source_name(),
            "type": self.get_source_type(),
            "enabled": False,
            "status": "DEMO_DATA",
            "collection_method": "PERMITTED_WEB_OR_API"
        }
