from typing import List
try:
    from backend.scraper.models.fare_observation import FareObservation
except ImportError:
    from scraper.models.fare_observation import FareObservation

class FareDeduplicator:

    @staticmethod
    def deduplicate_exact(observations: List[FareObservation]) -> List[FareObservation]:
        """Removes identical observations from the exact same source with identical parameters."""
        seen = set()
        unique = []
        for obs in observations:
            key = (
                obs.airline.strip().upper(),
                obs.flight_number.strip().upper(),
                obs.origin.strip().upper(),
                obs.destination.strip().upper(),
                obs.travel_date,
                obs.departure_datetime,
                obs.source.strip().lower(),
                obs.total_fare,
            )
            if key not in seen:
                seen.add(key)
                unique.append(obs)
        return unique

    @staticmethod
    def deduplicate_cross_source(observations: List[FareObservation]) -> List[FareObservation]:
        """Group identical flight offers across platforms, retaining the lowest total fare per unique flight."""
        cheapest_map = {}
        for obs in observations:
            flight_key = (
                obs.airline.strip().upper(),
                obs.flight_number.strip().upper(),
                obs.origin.strip().upper(),
                obs.destination.strip().upper(),
                obs.travel_date,
                obs.departure_datetime,
            )
            if flight_key not in cheapest_map or obs.total_fare < cheapest_map[flight_key].total_fare:
                cheapest_map[flight_key] = obs
        return list(cheapest_map.values())

    @staticmethod
    def deduplicate(observations: List[FareObservation]) -> List[FareObservation]:
        return FareDeduplicator.deduplicate_exact(observations)

Deduplicator = FareDeduplicator


