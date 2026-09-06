from typing import List, Dict, Any
import datetime
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.models.fare_observation import FareObservation

class DemoSourceAdapter(SourceAdapter):

    def get_source_name(self) -> str:
        return "Demo Generator"

    def get_source_type(self) -> str:
        return "SYNTHETIC"

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        now = datetime.datetime.now().isoformat()
        return [
            FareObservation(
                id=f"demo-{origin}-{destination}-6E2041",
                source="Demo Generator",
                source_type="SYNTHETIC",
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
                collected_at=now
            ),
            FareObservation(
                id=f"demo-{origin}-{destination}-AI803",
                source="Demo Generator",
                source_type="SYNTHETIC",
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
                fees=250.0,
                total_fare=5800.0,
                currency="INR",
                advance_purchase_days=14,
                availability_status="AVAILABLE",
                collected_at=now
            )
        ]

    def health_check(self) -> Dict[str, Any]:
        return {
            "name": self.get_source_name(),
            "type": self.get_source_type(),
            "enabled": True,
            "status": "HEALTHY",
            "collection_method": "SYNTHETIC_GENERATOR"
        }
