from typing import List, Dict, Any, Optional
try:
    from backend.scraper.models.fare_observation import FareObservation
except ImportError:
    from scraper.models.fare_observation import FareObservation
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
        if obs.total_fare is None or obs.total_fare <= 0:
            logger.warning(f"Discarding invalid non-positive total fare: {obs.total_fare}")
            return None

        if obs.base_fare is not None and obs.base_fare < 0:
            logger.warning(f"Discarding observation with negative base fare: {obs.base_fare}")
            return None
        
        if obs.origin and obs.destination and obs.origin.upper() == obs.destination.upper():
            logger.warning(f"Discarding circular route: {obs.origin} -> {obs.destination}")
            return None

        obs.airline = obs.airline.strip() if obs.airline else ""
        obs.flight_number = obs.flight_number.strip().upper() if obs.flight_number else ""
        obs.origin = obs.origin.strip().upper() if obs.origin else ""
        obs.destination = obs.destination.strip().upper() if obs.destination else ""
        return obs


