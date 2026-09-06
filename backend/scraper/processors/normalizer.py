import re
from backend.scraper.models.fare_observation import FareObservation
from backend.scraper.utils.currency import convert_to_inr

class FareNormalizer:

    @staticmethod
    def parse_currency(amount_str: str) -> float:
        """Standardizes '₹4,250', 'INR 4250', '4,250 INR' -> 4250.0"""
        cleaned = re.sub(r"[^\d.]", "", str(amount_str))
        try:
            return float(cleaned)
        except ValueError:
            return 0.0

    @staticmethod
    def normalize_airline_name(raw_name: str) -> str:
        name = raw_name.lower().strip()
        if "indigo" in name:
            return "IndiGo"
        if "air india express" in name:
            return "Air India Express"
        if "air india" in name:
            return "Air India"
        if "akasa" in name:
            return "Akasa Air"
        if "spicejet" in name:
            return "SpiceJet"
        return raw_name.title()

    @staticmethod
    def normalize(obs: FareObservation) -> FareObservation:
        obs.airline = FareNormalizer.normalize_airline_name(obs.airline)
        if obs.currency != "INR":
            obs.total_fare = convert_to_inr(obs.total_fare, obs.currency)
            obs.currency = "INR"
        obs.origin = obs.origin.upper()
        obs.destination = obs.destination.upper()
        if " " in obs.flight_number:
            obs.flight_number = obs.flight_number.replace(" ", "-")
        obs.base_fare = round(obs.base_fare, 2)
        obs.taxes = round(obs.taxes, 2)
        obs.fees = round(obs.fees, 2)
        obs.total_fare = round(obs.total_fare, 2)
        return obs

    @staticmethod
    def normalize_observation(obs: FareObservation) -> FareObservation:
        return FareNormalizer.normalize(obs)

DataNormalizer = FareNormalizer
