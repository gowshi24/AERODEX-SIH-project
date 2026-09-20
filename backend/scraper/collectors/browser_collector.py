import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("aerodex.browser_collector")

import logging
import os
import asyncio
from typing import Dict, Any, Optional, List

logger = logging.getLogger("aerodex.browser_collector")

try:
    from backend.airfare_index.live_fetcher.robot_guard import robot_guard
except ImportError:
    try:
        from airfare_index.live_fetcher.robot_guard import robot_guard
    except ImportError:
        robot_guard = None

try:
    from backend.airfare_index.live_fetcher.proxy_rotator import (
        proxy_manager,
        apply_playwright_stealth,
        simulate_human_interaction
    )
except ImportError:
    try:
        from airfare_index.live_fetcher.proxy_rotator import (
            proxy_manager,
            apply_playwright_stealth,
            simulate_human_interaction
        )
    except ImportError:
        proxy_manager = None
        apply_playwright_stealth = None
        simulate_human_interaction = None

class PlaywrightCollector:
    """
    Reusable Playwright browser collector layer.
    Manages Playwright browser lifecycle, page navigation, stealth evasions,
    explicit waits, fallback locators, and failure artifact capture.
    Respects robots.txt and source policies via RobotGuard.
    """

    def __init__(self, headless: bool = True, timeout_ms: int = 15000):
        self.headless = headless
        self.timeout_ms = timeout_ms
        self.playwright = None
        self.browser = None

    async def start(self):
        """Starts Playwright engine and Chromium instance."""
        if not self.browser:
            from playwright.async_api import async_playwright
            import glob
            self.playwright = await async_playwright().start()
            try:
                self.browser = await self.playwright.chromium.launch(
                    headless=self.headless,
                    args=["--no-sandbox", "--disable-setuid-sandbox"]
                )
            except Exception as launch_err:
                candidates = glob.glob(os.path.expandvars(r"%LOCALAPPDATA%\ms-playwright\chromium-*\chrome-win64\chrome.exe")) + \
                             glob.glob(os.path.expandvars(r"%LOCALAPPDATA%\ms-playwright\chromium-*\chrome-win\chrome.exe"))
                if candidates and os.path.exists(candidates[0]):
                    self.browser = await self.playwright.chromium.launch(
                        headless=self.headless,
                        executable_path=candidates[0],
                        args=["--no-sandbox", "--disable-setuid-sandbox"]
                    )
                else:
                    raise launch_err
            logger.info("Playwright Chromium browser launched successfully.")

    async def close(self):
        """Closes browser instance and stops Playwright engine safely."""
        try:
            if self.browser:
                await self.browser.close()
                self.browser = None
            if self.playwright:
                await self.playwright.stop()
                self.playwright = None
            logger.info("Playwright browser closed cleanly.")
        except Exception as e:
            logger.warning(f"Error during Playwright close: {str(e)}")

    async def create_page(self, user_agent: Optional[str] = None):
        """Creates a browser context and new page with stealth and custom user agent."""
        if not self.browser:
            await self.start()
        
        ua = user_agent
        if not ua and proxy_manager:
            ua = proxy_manager.get_random_headers().get("User-Agent")
        if not ua:
            ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


        context = await self.browser.new_context(
            user_agent=ua,
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        page.set_default_timeout(self.timeout_ms)

        # Apply stealth scripts to disguise automated headless execution
        if apply_playwright_stealth:
            try:
                await apply_playwright_stealth(page)
            except Exception as stealth_err:
                logger.warning(f"Stealth application notice: {stealth_err}")

        return context, page


    async def navigate_and_extract(
        self,
        url: str,
        result_selectors: Optional[List[str]] = None,
        timeout_ms: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Navigates to public URL with RobotGuard verification, checks status,
        waits for any of the given result selectors, and returns rendered HTML.
        """
        # 1. Ethical RobotGuard Check
        if robot_guard:
            allowed, reason = robot_guard.can_fetch(url)
            if not allowed:
                logger.warning(f"[ROBOT GUARD] Headless traversal disallowed for {url}: {reason}")
                return {
                    "status": "BLOCKED_OR_NOT_PERMITTED",
                    "url": url,
                    "message": f"Disallowed by robots.txt: {reason}"
                }

        timeout = timeout_ms or self.timeout_ms
        context = None
        page = None
        try:
            context, page = await self.create_page()
            response = await page.goto(url, timeout=timeout, wait_until="domcontentloaded")


            if response and response.status in [403, 429]:
                logger.warning(f"Public access restricted for {url} (HTTP {response.status}).")
                return {
                    "status": "BLOCKED_OR_NOT_PERMITTED",
                    "url": url,
                    "http_status": response.status,
                    "message": f"Public automated access returned HTTP {response.status}."
                }

            # Check if anti-bot/challenge keywords present in visible content
            content = await page.content()
            content_lower = content.lower()
            if any(term in content_lower for term in ["captcha", "challenge-running", "enable javascript", "cf-browser-verification", "ray id"]):
                logger.warning(f"Public page challenge detected for {url}.")
                return {
                    "status": "BLOCKED_OR_NOT_PERMITTED",
                    "url": url,
                    "message": "Automated access blocked by security verification page."
                }

            # If result selectors provided, wait for any to appear
            if result_selectors:
                found_selector = None
                for sel in result_selectors:
                    try:
                        await page.wait_for_selector(sel, timeout=timeout // len(result_selectors))
                        found_selector = sel
                        break
                    except Exception:
                        continue
                
                if not found_selector:
                    logger.info(f"No result selectors appeared on {url} within timeout.")

            rendered_html = await page.content()
            return {
                "status": "SUCCESS",
                "url": url,
                "html": rendered_html,
                "page": page,
                "context": context
            }

        except Exception as e:
            logger.error(f"Playwright navigation failed for {url}: {str(e)}")
            return {
                "status": "BLOCKED_OR_NOT_PERMITTED" if "Timeout" in str(type(e)) else "FAILED",
                "url": url,
                "message": f"Browser navigation exception: {str(e)}"
            }
        finally:
            # Note: caller is responsible for closing page/context if returned, or we close here if error
            if page and ("status" in locals() and locals()["status"] != "SUCCESS"):
                await page.close()
                if context:
                    await context.close()

    async def fetch_page_content(self, url: str, timeout_ms: int = 15000) -> Dict[str, Any]:
        """Backward compatible convenience wrapper."""
        res = await self.navigate_and_extract(url, timeout_ms=timeout_ms)
        if "page" in res and res["page"]:
            await res["page"].close()
        if "context" in res and res["context"]:
            await res["context"].close()
        res.pop("page", None)
        res.pop("context", None)
        return res

BrowserCollector = PlaywrightCollector

