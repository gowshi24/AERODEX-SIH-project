from backend.scraper.processors.cleaner import FareCleaner
from backend.scraper.models.fare_observation import FareObservation

def test_clean_fare_observation_valid():
    obs = FareObservation(
        id="obs-01",
        source="IndiGo Direct",
        source_type="AIRLINE",
        airline="IndiGo",
        flight_number="6E-2041",
        origin="DEL",
        destination="BOM",
        departure_datetime="2026-09-20T07:25:00",
        arrival_datetime="2026-09-20T09:40:00",
        travel_date="2026-09-20",
        base_fare=4250.0,
        taxes=620.0,
        fees=230.0,
        total_fare=5100.0
    )
    cleaned = FareCleaner.clean_fare_observation(obs)
    assert cleaned is not None
    assert cleaned.total_fare == 5100.0

def test_clean_fare_observation_negative_fare():
    obs = FareObservation(
        id="obs-02",
        source="IndiGo Direct",
        source_type="AIRLINE",
        airline="IndiGo",
        flight_number="6E-2041",
        origin="DEL",
        destination="BOM",
        departure_datetime="2026-09-20T07:25:00",
        arrival_datetime="2026-09-20T09:40:00",
        travel_date="2026-09-20",
        base_fare=-100.0,
        taxes=620.0,
        fees=230.0,
        total_fare=-500.0
    )
    cleaned = FareCleaner.clean_fare_observation(obs)
    assert cleaned is None
