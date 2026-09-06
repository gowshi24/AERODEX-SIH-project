from typing import List, Dict, Any
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.models.fare_observation import FareObservation

class SpiceJetSourceAdapter(SourceAdapter):

    def get_source_name(self) -> str:
        return "SpiceJet Direct"

    def get_source_type(self) -> str:
        return "AIRLINE"

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id="obs-sg-01",
                source="SpiceJet Direct",
                source_type="AIRLINE",
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
                fees=220.0,
                total_fare=4650.0,
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
