import pytest
from scraper.processors.deduplicator import FareDeduplicator
from scraper.models.fare_observation import FareObservation

def test_deduplicate_exact_and_cross_source():
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
        source="EaseMyTrip",
        source_type="OTA",
        airline="IndiGo",
        flight_number="6E-2041",
        origin="DEL",
        destination="BOM",
        departure_datetime="2026-09-20T07:25:00",
        arrival_datetime="2026-09-20T09:40:00",
        travel_date="2026-09-20",
        base_fare=4250.0,
        taxes=620.0,
        fees=0.0,
        total_fare=4870.0
    )
    obs3 = FareObservation(
        id="obs-03",
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

    # Exact deduplication preserves obs1 and obs2, removes duplicate obs3
    exact = FareDeduplicator.deduplicate_exact([obs1, obs2, obs3])
    assert len(exact) == 2

    # Cross-source deduplication selects cheapest (obs2 at 4870.0) for the unique flight
    cross = FareDeduplicator.deduplicate_cross_source([obs1, obs2, obs3])
    assert len(cross) == 1
    assert cross[0].source == "EaseMyTrip"
    assert cross[0].total_fare == 4870.0
