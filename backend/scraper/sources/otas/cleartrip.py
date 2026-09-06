from typing import List, Dict, Any
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.models.fare_observation import FareObservation

class CleartripSourceAdapter(SourceAdapter):

    def get_source_name(self) -> str:
        return "Cleartrip"

    def get_source_type(self) -> str:
        return "OTA"

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id="obs-ct-01",
                source="Cleartrip",
                source_type="OTA",
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
                fees=290.0,
                total_fare=4990.0,
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
