import httpx
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("aerodex.api_collector")

try:
    from backend.airfare_index.live_fetcher.robot_guard import robot_guard
except ImportError:
    try:
        from airfare_index.live_fetcher.robot_guard import robot_guard
    except ImportError:
        robot_guard = None

try:
    from backend.airfare_index.live_fetcher.proxy_rotator import proxy_manager
except ImportError:
    try:
        from airfare_index.live_fetcher.proxy_rotator import proxy_manager
    except ImportError:
        proxy_manager = None

class APICollector:
    """
    Reusable HTTPx client for authorized API sources.
    Respects robots.txt policies via RobotGuard and uses modern User-Agent rotation.
    """

    def __init__(self, timeout_sec: float = 10.0):
        self.timeout = timeout_sec

    async def get(self, url: str, headers: Optional[Dict[str, str]] = None, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        # 1. Check RFC 9309 robots.txt compliance
        if robot_guard:
            allowed, reason = robot_guard.can_fetch(url)
            if not allowed:
                logger.warning(f"[ROBOT GUARD] Ethical abort for {url}: {reason}")
                return {
                    "status": "BLOCKED_OR_NOT_PERMITTED",
                    "code": 403,
                    "message": f"Disallowed by robots.txt: {reason}"
                }

        # 2. Add realistic browser headers if none provided
        req_headers = dict(headers) if headers else {}
        if "User-Agent" not in req_headers and "user-agent" not in req_headers:
            if proxy_manager:
                req_headers.update(proxy_manager.get_browser_headers())
            else:
                req_headers["User-Agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(url, headers=req_headers, params=params)
                if res.status_code == 200:
                    return {"status": "SUCCESS", "data": res.json()}
                return {
                    "status": "API_ERROR",
                    "code": res.status_code,
                    "message": f"API returned status {res.status_code}"
                }
        except Exception as e:
            logger.error(f"API HTTP GET request failed for {url}: {str(e)}")
            return {"status": "FAILED", "message": str(e)}

