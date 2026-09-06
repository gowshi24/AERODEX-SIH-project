from typing import Dict, List, Any
from backend.scraper.collectors.collector_base import SourceAdapter
from backend.scraper.sources import (
    IndiGoSourceAdapter,
    AirIndiaSourceAdapter,
    AirIndiaExpressSourceAdapter,
    AkasaAirSourceAdapter,
    SpiceJetSourceAdapter,
    MakeMyTripSourceAdapter,
    YatraSourceAdapter,
    EaseMyTripSourceAdapter,
    CleartripSourceAdapter,
    IxigoSourceAdapter,
    GoibiboSourceAdapter,
    DemoSourceAdapter,
)
from backend.scraper.models.fare_observation import FareObservation

class SourceRegistry:

    def __init__(self):
        self._adapters: Dict[str, SourceAdapter] = {
            "indigo": IndiGoSourceAdapter(),
            "air_india": AirIndiaSourceAdapter(),
            "air_india_express": AirIndiaExpressSourceAdapter(),
            "akasa": AkasaAirSourceAdapter(),
            "spicejet": SpiceJetSourceAdapter(),
            "makemytrip": MakeMyTripSourceAdapter(),
            "yatra": YatraSourceAdapter(),
            "easemytrip": EaseMyTripSourceAdapter(),
            "cleartrip": CleartripSourceAdapter(),
            "ixigo": IxigoSourceAdapter(),
            "goibibo": GoibiboSourceAdapter(),
            "demo": DemoSourceAdapter(),
        }

    def get_adapter(self, key: str) -> SourceAdapter:
        return self._adapters.get(key)

    def list_adapters(self) -> List[Dict[str, Any]]:
        return [adapter.health_check() for adapter in self._adapters.values()]

    async def collect_all(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        all_observations: List[FareObservation] = []
        for adapter in self._adapters.values():
            try:
                obs_list = await adapter.search_flights(origin, destination, travel_date)
                all_observations.extend(obs_list)
            except Exception as e:
                # Log adapter failure without breaking remaining adapters
                pass
        return all_observations

source_registry = SourceRegistry()
