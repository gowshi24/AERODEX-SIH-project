from typing import List
from backend.scraper.models.fare_observation import FareObservation

class FareDeduplicator:

    @staticmethod
    def deduplicate(observations: List[FareObservation]) -> List[FareObservation]:
        seen = set()
        unique = []
        for obs in observations:
            key = (
                obs.airline,
                obs.flight_number,
                obs.origin,
                obs.destination,
                obs.travel_date,
                obs.departure_datetime,
                obs.source,
                obs.total_fare,
            )
            if key not in seen:
                seen.add(key)
                unique.append(obs)
        return unique

Deduplicator = FareDeduplicator
