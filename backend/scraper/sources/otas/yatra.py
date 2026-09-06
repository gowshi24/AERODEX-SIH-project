from typing import List, Dict, Any
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.models.fare_observation import FareObservation

class YatraSourceAdapter(SourceAdapter):

    def get_source_name(self) -> str:
        return "Yatra"

    def get_source_type(self) -> str:
        return "OTA"

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id="obs-yt-01",
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

    def health_check(self) -> Dict[str, Any]:
        return {
            "name": self.get_source_name(),
            "type": self.get_source_type(),
            "enabled": False,
            "status": "DEMO_DATA",
            "collection_method": "PERMITTED_WEB_OR_API"
        }
