from typing import List, Dict, Any
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.models.fare_observation import FareObservation

class IndiGoSourceAdapter(SourceAdapter):

    def get_source_name(self) -> str:
        return "IndiGo Direct"

    def get_source_type(self) -> str:
        return "AIRLINE"

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        # Unconfigured source adapter returning permitted demo data
        return [
            FareObservation(
                id="obs-indigo-01",
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

    def health_check(self) -> Dict[str, Any]:
        return {
            "name": self.get_source_name(),
            "type": self.get_source_type(),
            "enabled": False,
            "status": "DEMO_DATA",
            "collection_method": "PERMITTED_WEB_OR_API"
        }
