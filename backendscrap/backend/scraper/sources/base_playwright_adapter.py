import logging
from typing import List, Dict, Any, Optional
from scraper.collectors.collector_base import SourceAdapter
from scraper.collectors.browser_collector import PlaywrightCollector
from scraper.models.fare_observation import FareObservation
from scraper.processors.cleaner import FareCleaner
from scraper.processors.validator import FareValidator
from scraper.processors.normalizer import FareNormalizer

logger = logging.getLogger("aerodex.base_playwright_adapter")

import os

class BasePlaywrightAdapter(SourceAdapter):
    """
    Base class for Playwright-based airline/OTA adapters.
    Provides standard lifecycle management, navigation, extraction hooks, and failure isolation.
    """

    def __init__(self, headless: bool = True, timeout_ms: int = 15000, enable_live_scraping: Optional[bool] = None):
        self.collector = PlaywrightCollector(headless=headless, timeout_ms=timeout_ms)
        self.last_status = self.STATUS_DEMO_DATA
        self.last_error_message = None
        
        env_flag = os.getenv("ENABLE_LIVE_PLAYWRIGHT_SCRAPING", "false").lower() in ("true", "1", "yes")
        self.enable_live_scraping = env_flag if enable_live_scraping is None else enable_live_scraping

    def get_search_url(self, origin: str, destination: str, travel_date: str) -> str:
        """Override in subclasses to return platform-specific public search URL."""
        return ""

    def get_result_selectors(self) -> List[str]:
        """Override in subclasses to return CSS/XPath selectors expected on rendered flight cards."""
        return []

    async def parse_page_observations(
        self,
        page_html: str,
        origin: str,
        destination: str,
        travel_date: str,
        page_obj: Optional[Any] = None
    ) -> List[FareObservation]:
        """Override in subclasses to extract FareObservations from rendered DOM."""
        return []

    def get_fallback_demo_observations(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        """Subclasses can provide fallback observations when unconfigured or blocked."""
        return []

    async def search_flights(self, origin: str, destination: str, travel_date: str) -> List[FareObservation]:
        search_url = self.get_search_url(origin, destination, travel_date)
        if not search_url or not self.enable_live_scraping:
            # Source unconfigured or live Playwright extraction disabled, return fallback
            self.last_status = self.STATUS_DEMO_DATA
            return self.get_fallback_demo_observations(origin, destination, travel_date)


        logger.info(f"[{self.get_source_name()}] Navigating to public page: {search_url}")
        res = await self.collector.navigate_and_extract(
            url=search_url,
            result_selectors=self.get_result_selectors()
        )

        status = res.get("status")
        if status != "SUCCESS":
            self.last_status = status
            self.last_error_message = res.get("message")
            logger.warning(f"[{self.get_source_name()}] Browser collection status: {status}. Message: {res.get('message')}")
            return self.get_fallback_demo_observations(origin, destination, travel_date)

        html = res.get("html", "")
        page_obj = res.get("page")
        context_obj = res.get("context")

        observations = []
        try:
            raw_obs = await self.parse_page_observations(html, origin, destination, travel_date, page_obj=page_obj)
            if raw_obs:
                for obs in raw_obs:
                    normalized = FareNormalizer.normalize(obs)
                    cleaned = FareCleaner.clean_fare_observation(normalized)
                    if cleaned:
                        v_status, v_reasons = FareValidator.validate(cleaned)
                        observations.append(cleaned)
                self.last_status = self.STATUS_HEALTHY
                self.last_error_message = None
            else:
                self.last_status = self.STATUS_NEEDS_SELECTOR_WORK
                self.last_error_message = "Page loaded successfully but no flight cards matched selectors."
                logger.info(f"[{self.get_source_name()}] No observations parsed from rendered page.")
                observations = self.get_fallback_demo_observations(origin, destination, travel_date)
        except Exception as e:
            self.last_status = self.STATUS_FAILED
            self.last_error_message = str(e)
            logger.error(f"[{self.get_source_name()}] Exception parsing rendered page DOM: {str(e)}")
            observations = self.get_fallback_demo_observations(origin, destination, travel_date)
        finally:
            if page_obj:
                await page_obj.close()
            if context_obj:
                await context_obj.close()

        return observations

    def health_check(self) -> Dict[str, Any]:
        return {
            "name": self.get_source_name(),
            "type": self.get_source_type(),
            "enabled": True,
            "status": self.last_status,
            "collection_method": "PLAYWRIGHT_DOM_EXTRACTION",
            "last_error": self.last_error_message
        }
