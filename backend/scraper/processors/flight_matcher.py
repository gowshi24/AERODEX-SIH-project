from typing import List, Dict
try:
    from backend.scraper.models.fare_observation import FareObservation
except ImportError:
    from scraper.models.fare_observation import FareObservation

class FlightMatcher:

    @staticmethod
    def get_flight_key(obs: FareObservation) -> str:
        """Generates matching key for identical underlying flights across direct and OTA sources."""
        airline_clean = obs.airline.replace(" ", "").upper()
        flight_num_clean = obs.flight_number.replace(" ", "").replace("-", "").upper()
        return f"{airline_clean}_{flight_num_clean}_{obs.origin}_{obs.destination}_{obs.travel_date}_{obs.departure_datetime}"

    @staticmethod
    def generate_flight_key(obs: FareObservation) -> str:
        return FlightMatcher.get_flight_key(obs)

    @staticmethod
    def group_by_flight(observations: List[FareObservation]) -> Dict[str, List[FareObservation]]:
        grouped: Dict[str, List[FareObservation]] = {}
        for obs in observations:
            key = FlightMatcher.get_flight_key(obs)
            if key not in grouped:
                grouped[key] = []
            grouped[key].append(obs)
        return grouped

