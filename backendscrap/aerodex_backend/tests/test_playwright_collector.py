import pytest
from scraper.collectors.browser_collector import PlaywrightCollector

@pytest.mark.asyncio
async def test_playwright_collector_lifecycle():
    collector = PlaywrightCollector(headless=True)
    await collector.start()
    assert collector.browser is not None
    
    context, page = await collector.create_page()
    assert context is not None
    assert page is not None
    
    await page.close()
    await context.close()
    await collector.close()
    assert collector.browser is None

@pytest.mark.asyncio
async def test_playwright_collector_blocked_handling():
    collector = PlaywrightCollector(headless=True, timeout_ms=5000)
    # Test gracefully returning BLOCKED_OR_NOT_PERMITTED on non-existent or blocked URL
    res = await collector.fetch_page_content("https://httpbin.org/status/403", timeout_ms=5000)
    assert res["status"] in ["BLOCKED_OR_NOT_PERMITTED", "FAILED"]
