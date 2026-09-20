"""
live_fetcher.py - FastAPI router wrapping the MoSPI Airfare Price Index
and Realtime Playwright Scraping Engine from backendscrap.
"""

from fastapi import APIRouter, Query, Body, Request, Response
from typing import Dict, Any, Optional, List
import json
import os
import sys

# Ensure backend directory and live_fetcher are in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(CURRENT_DIR)))
FETCHER_DIR = os.path.join(BACKEND_DIR, "backend", "airfare_index", "live_fetcher")
for p in (FETCHER_DIR, BACKEND_DIR):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.airfare_index.live_fetcher.server import (
        auto_manager,
        index_engine,
        scraper,
        db,
        ai_engine,
        forecast_engine,
        live_calamity_tracker,
        robot_guard,
        proxy_manager,
        compute_integrity_score,
        list_shock_scenarios,
        replay_shock,
        AIRPORT_NAMES,
        DATA_SOURCES_CATALOG
    )
except ImportError:
    from airfare_index.live_fetcher.server import (
        auto_manager,
        index_engine,
        scraper,
        db,
        ai_engine,
        forecast_engine,
        live_calamity_tracker,
        robot_guard,
        proxy_manager,
        compute_integrity_score,
        list_shock_scenarios,
        replay_shock,
        AIRPORT_NAMES,
        DATA_SOURCES_CATALOG
    )

router = APIRouter(tags=["Live Telemetry & Index Engine"])

@router.get("/api/v1/live/pulse")
def get_live_pulse() -> Dict[str, Any]:
    """Returns real-time National Airfare Price Index pulse, 12s live updates, CPI impact, and collusion watchlist."""
    return auto_manager.get_live_pulse()

@router.get("/api/v1/live/toggle")
def toggle_auto_scraper() -> Dict[str, Any]:
    """Pause or resume the background 12s scraping loop."""
    auto_manager.is_running = not auto_manager.is_running
    return {"is_running": auto_manager.is_running}

@router.get("/api/v1/airports")
def get_airports() -> List[Dict[str, str]]:
    """List of all monitored IATA domestic airports."""
    return [{"code": code, "name": name} for code, name in AIRPORT_NAMES.items()]

@router.get("/api/v1/index/national")
def get_national_index() -> Dict[str, Any]:
    """Computes Laspeyres & Paasche National Airfare Price Index & CPI contribution."""
    return index_engine.compute_national_index([])

@router.get("/api/v1/macro/timeline")
def get_macro_timeline() -> List[Dict[str, Any]]:
    """Official MoSPI 07.3.3 vs IOCL ATF Fuel vs Market quotes timeline."""
    return index_engine.get_macro_comparison_timeline()

@router.get("/api/v1/macro/daily")
def get_macro_daily(date: Optional[str] = None, route: str = "all", resolution: str = "ticks") -> Dict[str, Any]:
    """Daily intraday tick waveform."""
    return db.get_daily_macro_data(date_str=date, route=route, resolution=resolution)

@router.get("/api/v1/routes/weights")
def get_routes_weights(limit: int = 25) -> List[Dict[str, Any]]:
    """Top DGCA route passenger volume weights from official baseline."""
    return index_engine.get_top_routes_weights(limit=limit)

@router.get("/api/v1/carriers")
def get_carriers() -> Dict[str, Any]:
    """DGCA official airline market shares."""
    return index_engine.carrier_shares

@router.get("/api/v1/heatmap/sectors")
def get_heatmap_sectors() -> Dict[str, Any]:
    """Sector-by-sector inflation heatmap matrix across advance purchase windows."""
    return index_engine.get_sector_heatmap_matrix(live_fares=auto_manager.latest_fares)

@router.get("/api/v1/heatmap/states")
def get_heatmap_states() -> List[Dict[str, Any]]:
    """State-wise airfare inflation nowcast."""
    return index_engine.get_state_nowcast_heatmap(live_fares=auto_manager.latest_fares)

@router.get("/api/v1/db/stats")
def get_db_stats() -> Dict[str, Any]:
    """Microdata SQLite warehouse status and quote counts."""
    return db.get_stats()

@router.get("/api/v1/db/quotes")
def get_db_quotes(origin: Optional[str] = None, destination: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    """Recent quotes from the SQLite microdata warehouse."""
    return db.get_recent_quotes(origin=origin, dest=destination, limit=limit)

@router.get("/api/v1/compliance/sources")
def get_compliance_sources() -> List[Dict[str, Any]]:
    """Status of 11 monitored portals with RFC 9309 robots.txt compliance."""
    return DATA_SOURCES_CATALOG

@router.get("/api/v1/compliance/robots")
def get_compliance_robots() -> Dict[str, Any]:
    """Audit log of robots.txt checks and rate limits."""
    if robot_guard:
        return {"audit_log": robot_guard.audit_log[-50:], "user_agent": robot_guard.user_agent}
    return {"status": "NOT_CONFIGURED"}

@router.get("/api/v1/compliance/anti_bot")
def get_compliance_anti_bot() -> Dict[str, Any]:
    """Anti-bot proxy rotation and challenge telemetry."""
    if proxy_manager:
        return proxy_manager.get_telemetry()
    return {"status": "DISABLED"}

@router.get("/api/v1/integrity/audit")
def get_integrity_audit() -> Dict[str, Any]:
    """Tukey IQR outlier detection, fare reconciliation, and composite score."""
    sample_quotes = db.get_recent_quotes(limit=100)
    return compute_integrity_score(sample_quotes)

@router.get("/api/v1/forecast/calendar")
def get_forecast_calendar(origin: str = "DEL", destination: str = "BOM") -> Dict[str, Any]:
    """30-day forward price nowcasting calendar using pre-trained Random Forest model."""
    route_key = f"{origin.upper()}-{destination.upper()}"
    return forecast_engine.get_monthly_forecast_calendar(route_key)

@router.get("/api/v1/forecast/live_calamities")
def get_live_calamities() -> List[Dict[str, Any]]:
    """Active UN GDACS and severe weather calamity events."""
    return live_calamity_tracker.get_active_calamities()

@router.post("/api/v1/forecast/simulate")
def simulate_fare(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """Simulate future fare based on user parameters."""
    return forecast_engine.simulate(payload)

@router.get("/api/v1/shock/scenarios")
def get_shock_scenarios() -> List[Dict[str, Any]]:
    """Historical aviation shock simulation studio scenarios."""
    return list_shock_scenarios()

@router.post("/api/v1/shock/replay")
def replay_shock_event(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """Replay historical supply shock."""
    scenario_id = payload.get("scenario_id")
    return replay_shock(scenario_id)

@router.get("/api/v1/ai/summary")
def get_ai_summary() -> Dict[str, Any]:
    """Autonomous AI situation room policy briefing."""
    return ai_engine.get_latest_summary()

@router.get("/api/v1/search")
@router.post("/api/v1/search")
def search_flights_live(
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    date: Optional[str] = None,
    payload: Optional[Dict[str, Any]] = Body(None)
) -> Dict[str, Any]:
    """
    Search flights with live Playwright extraction and fallback to SQLite microdata warehouse.
    """
    # Merge query params or JSON body
    org = origin or (payload.get("origin") if payload else None) or "DEL"
    dst = destination or (payload.get("destination") if payload else None) or "BOM"
    dt = date or (payload.get("date") if payload else None) or "2026-09-20"

    auto_manager.pause_briefly(25)
    return scraper.search_live(org, dst, dt, force_live=False)
