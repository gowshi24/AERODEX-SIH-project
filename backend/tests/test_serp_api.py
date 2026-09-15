import pytest
from scraper.sources.serp_api import SerpApiSourceAdapter

@pytest.mark.asyncio
async def test_serp_api_adapter_contract():
    adapter = SerpApiSourceAdapter()
    assert adapter.get_source_name() == "SerpApi / Google Flights"
    assert adapter.get_source_type() == "META_OTA"
    health = adapter.health_check()
    assert health["name"] == "SerpApi / Google Flights"
    assert health["type"] == "META_OTA"
    assert "status" in health

@pytest.mark.asyncio
async def test_serp_api_live_search():
    adapter = SerpApiSourceAdapter()
    observations = await adapter.search_flights("DEL", "BOM", "2026-09-20")
    assert len(observations) > 0
    obs = observations[0]
    assert obs.origin == "DEL"
    assert obs.destination == "BOM"
    assert obs.total_fare > 0
    assert obs.source == "SerpApi / Google Flights"
