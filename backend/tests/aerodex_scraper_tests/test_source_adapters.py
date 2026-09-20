import pytest
from scraper.source_registry import source_registry

@pytest.mark.asyncio
async def test_all_adapters_contract():
    adapters = source_registry._adapters
    assert len(adapters) >= 12

    for key, adapter in adapters.items():
        name = adapter.get_source_name()
        stype = adapter.get_source_type()
        health = adapter.health_check()
        
        assert isinstance(name, str) and len(name) > 0
        assert stype in ["AIRLINE", "OTA", "META_OTA", "SYNTHETIC"]
        assert health["name"] == name
        assert "status" in health

@pytest.mark.asyncio
async def test_source_registry_collect_all():
    observations = await source_registry.collect_all("DEL", "BOM", "2026-09-20")
    assert len(observations) > 0
    assert len(source_registry.last_collection_logs) == len(source_registry._adapters)
    
    for log in source_registry.last_collection_logs:
        assert "source" in log
        assert "status" in log
        assert "timestamp" in log
        assert "route" in log
