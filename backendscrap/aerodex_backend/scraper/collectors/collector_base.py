from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from scraper.models.fare_observation import FareObservation

class SourceAdapter(ABC):
    STATUS_HEALTHY = "HEALTHY"
    STATUS_DEMO_DATA = "DEMO_DATA"
    STATUS_BLOCKED_OR_NOT_PERMITTED = "BLOCKED_OR_NOT_PERMITTED"
    STATUS_NEEDS_SELECTOR_WORK = "NEEDS_SELECTOR_WORK"
    STATUS_FAILED = "FAILED"

    @abstractmethod
    def get_source_name(self) -> str:
        pass

    @abstractmethod
    def get_source_type(self) -> str:
        """AIRLINE, OTA, or SYNTHETIC"""
        pass

    @abstractmethod
    async def search_flights(
        self, origin: str, destination: str, travel_date: str
    ) -> List[FareObservation]:
        pass

    async def collect(
        self, origin: str, destination: str, travel_date: str
    ) -> List[FareObservation]:
        """Alias for search_flights for standardized invocation across interfaces."""
        return await self.search_flights(origin, destination, travel_date)

    @abstractmethod
    def health_check(self) -> Dict[str, Any]:
        pass

