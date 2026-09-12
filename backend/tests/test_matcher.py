from scraper.processors.flight_matcher import FlightMatcher
from scraper.models.fare_observation import FareObservation

def test_generate_flight_key():
    obs1 = FareObservation(
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
    obs2 = FareObservation(
        id="obs-02",
        source="MakeMyTrip",
        source_type="OTA",
        airline="IndiGo",
        flight_number="6E 2041",
        origin="DEL",
        destination="BOM",
        departure_datetime="2026-09-20T07:25:00",
        arrival_datetime="2026-09-20T09:40:00",
        travel_date="2026-09-20",
        base_fare=4250.0,
        taxes=620.0,
        fees=350.0,
        total_fare=5220.0
    )
    key1 = FlightMatcher.generate_flight_key(obs1)
    key2 = FlightMatcher.generate_flight_key(obs2)
    assert key1 == key2

