"""
AERODEX Scraper Package
Exposes core collectors, source adapters, processors, and the RealtimeFlightScraper.
"""

try:
    from backend.airfare_index.live_fetcher.scraper import (
        RealtimeFlightScraper,
        DATA_SOURCES_CATALOG,
        AIRPORT_NAMES
    )
except ImportError:
    try:
        from airfare_index.live_fetcher.scraper import (
            RealtimeFlightScraper,
            DATA_SOURCES_CATALOG,
            AIRPORT_NAMES
        )
    except ImportError:
        pass

