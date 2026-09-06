from backend.scraper.processors.normalizer import DataNormalizer
from backend.scraper.models.fare_observation import FareObservation

def test_normalize_observation_usd_conversion():
    obs = FareObservation(
        id="obs-usd-01",
        source="Global OTA",
        source_type="OTA",
        airline="IndiGo",
        flight_number="6E 2041",
        origin="del",
        destination="bom",
        departure_datetime="2026-09-20T07:25:00",
        arrival_datetime="2026-09-20T09:40:00",
        travel_date="2026-09-20",
        base_fare=50.0,
        taxes=10.0,
        fees=0.0,
        total_fare=60.0,
        currency="USD"
    )
    normalized = DataNormalizer.normalize_observation(obs)
    assert normalized.currency == "INR"
    assert normalized.origin == "DEL"
    assert normalized.destination == "BOM"
    assert normalized.flight_number == "6E-2041"
    assert normalized.total_fare > 4000.0  # Converted from 60 USD
