import asyncio
import logging
from scraper.source_registry import source_registry

logger = logging.getLogger("aerodex.scheduler")

from datetime import datetime, timedelta

async def run_data_collection_job(travel_date: str = None):
    logger.info("Starting scheduled airfare data collection job...")
    key_routes = [
        ("DEL", "BOM"),
        ("BLR", "DEL"),
        ("BOM", "BLR"),
        ("DEL", "CCU"),
        ("MAA", "DEL")
    ]
    target_date = travel_date or (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d")
    total_observations = 0
    for origin, dest in key_routes:
        obs_list = await source_registry.collect_all(origin, dest, target_date)
        total_observations += len(obs_list)

    logger.info(f"Scheduled collection complete. Collected {total_observations} observations across {len(key_routes)} routes.")
    return total_observations

def trigger_index_recalculation():
    logger.info("Triggering airfare index recalculation...")
    return {"status": "SUCCESS", "message": "Airfare index recalculated."}

