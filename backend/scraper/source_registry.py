from typing import Dict, List, Any
from scraper.collectors.collector_base import SourceAdapter
from scraper.sources import (
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
from scraper.models.fare_observation import FareObservation

import logging
from datetime import datetime, timezone

logger = logging.getLogger("aerodex.source_registry")

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
        self.last_collection_logs: List[Dict[str, Any]] = []

    def get_adapter(self, key: str) -> SourceAdapter:
        return self._adapters.get(key)

    def list_adapters(self) -> List[Dict[str, Any]]:
        return [adapter.health_check() for adapter in self._adapters.values()]

    async def collect_all(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        all_observations: List[FareObservation] = []
        self.last_collection_logs.clear()

        for key, adapter in self._adapters.items():
            start_time = datetime.now(timezone.utc).isoformat()
            try:
                obs_list = await adapter.search_flights(origin, destination, travel_date)
                all_observations.extend(obs_list)
                log_entry = {
                    "source": adapter.get_source_name(),
                    "status": getattr(adapter, "last_status", "SUCCESS"),
                    "timestamp": start_time,
                    "route": f"{origin}-{destination}",
                    "travel_date": travel_date,
                    "count": len(obs_list),
                    "error_type": None,
                    "error_message": getattr(adapter, "last_error_message", None)
                }
                self.last_collection_logs.append(log_entry)
                logger.info(f"Source [{adapter.get_source_name()}] collected {len(obs_list)} observations.")
            except Exception as e:
                log_entry = {
                    "source": adapter.get_source_name(),
                    "status": "FAILED",
                    "timestamp": start_time,
                    "route": f"{origin}-{destination}",
                    "travel_date": travel_date,
                    "count": 0,
                    "error_type": type(e).__name__,
                    "error_message": str(e)
                }
                self.last_collection_logs.append(log_entry)
                logger.error(
                    f"Adapter failure isolated for source [{adapter.get_source_name()}]: "
                    f"type={type(e).__name__}, error={str(e)}"
                )

        return all_observations

source_registry = SourceRegistry()


