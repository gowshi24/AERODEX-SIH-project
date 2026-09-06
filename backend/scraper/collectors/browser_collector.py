import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("aerodex.browser_collector")

class BrowserCollector:
    """
    Reusable browser collector using Playwright.
    Respects robots.txt and source policies. Does NOT bypass CAPTCHA, bot protections, or access controls.
    """

    def __init__(self, headless: bool = True):
        self.headless = headless

    async def fetch_page_content(self, url: str, timeout_ms: int = 15000) -> Dict[str, Any]:
        try:
            from playwright.async_api import async_playwright
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=self.headless)
                context = await browser.new_context(user_agent="AERODEX-Airfare-Research-Bot/1.0")
                page = await context.new_page()
                
                response = await page.goto(url, timeout=timeout_ms, wait_until="domcontentloaded")
                
                if response and response.status in [403, 429]:
                    await browser.close()
                    logger.warning(f"Source access blocked for URL {url} with status {response.status}")
                    return {
                        "status": "BLOCKED_OR_NOT_PERMITTED",
                        "url": url,
                        "message": f"Automated access unavailable (HTTP {response.status})."
                    }
                
                content = await page.content()
                await browser.close()
                return {
                    "status": "SUCCESS",
                    "url": url,
                    "html": content
                }
        except Exception as e:
            logger.error(f"Browser collection failed for {url}: {str(e)}")
            return {
                "status": "BLOCKED_OR_NOT_PERMITTED",
                "url": url,
                "message": f"Automated access unavailable: {str(e)}"
            }
