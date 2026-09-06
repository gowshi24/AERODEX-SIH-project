import httpx
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("aerodex.api_collector")

class APICollector:
    """
    Reusable HTTPx client for authorized API sources.
    """

    def __init__(self, timeout_sec: float = 10.0):
        self.timeout = timeout_sec

    async def get(self, url: str, headers: Optional[Dict[str, str]] = None, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(url, headers=headers, params=params)
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
