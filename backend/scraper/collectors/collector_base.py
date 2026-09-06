from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from backend.scraper.models.fare_observation import FareObservation

class SourceAdapter(ABC):

    @abstractmethod
    def get_source_name(self) -> str:
        pass

    @abstractmethod
    def get_source_type(self) -> str:
        """AIRLINE or OTA"""
        pass

    @abstractmethod
    async def search_flights(
        self, origin: str, destination: str, travel_date: str
    ) -> List[FareObservation]:
        pass

    @abstractmethod
    def health_check(self) -> Dict[str, Any]:
        pass
