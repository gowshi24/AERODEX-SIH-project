from typing import List, Dict, Any
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.models.fare_observation import FareObservation

class GoibiboSourceAdapter(SourceAdapter):

    def get_source_name(self) -> str:
        return "Goibibo"

    def get_source_type(self) -> str:
        return "OTA"

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        return [
            FareObservation(
                id="obs-go-01",
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

    def health_check(self) -> Dict[str, Any]:
        return {
            "name": self.get_source_name(),
            "type": self.get_source_type(),
            "enabled": False,
            "status": "DEMO_DATA",
            "collection_method": "PERMITTED_WEB_OR_API"
        }
