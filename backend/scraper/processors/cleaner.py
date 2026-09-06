from typing import List, Dict, Any, Optional
from backend.scraper.models.fare_observation import FareObservation
import logging

logger = logging.getLogger("aerodex.cleaner")

class FareCleaner:

    @staticmethod
    def clean_observations(observations: List[FareObservation]) -> List[FareObservation]:
        cleaned = []
        for obs in observations:
            res = FareCleaner.clean_fare_observation(obs)
            if res:
                cleaned.append(res)
        return cleaned

    @staticmethod
    def clean_fare_observation(obs: FareObservation) -> Optional[FareObservation]:
        if obs.base_fare <= 0 or obs.total_fare <= 0:
            logger.warning(f"Discarding invalid non-positive fare: {obs.total_fare}")
            return None
        
        if obs.origin.upper() == obs.destination.upper():
            logger.warning(f"Discarding circular route: {obs.origin} -> {obs.destination}")
            return None

        obs.airline = obs.airline.strip()
        obs.flight_number = obs.flight_number.strip().upper()
        obs.origin = obs.origin.strip().upper()
        obs.destination = obs.destination.strip().upper()
        return obs
