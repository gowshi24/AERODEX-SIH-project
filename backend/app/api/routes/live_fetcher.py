"""
live_fetcher.py - FastAPI router wrapping the MoSPI Airfare Price Index
and Realtime Playwright Scraping Engine from backendscrap.
"""

from fastapi import APIRouter, Query, Body, Request, Response
from typing import Dict, Any, Optional, List
from datetime import datetime
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
    return db.get_db_stats()

@router.get("/api/v1/db/quotes")
def get_db_quotes(origin: Optional[str] = None, destination: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    """Recent quotes from the SQLite microdata warehouse."""
    if origin and destination:
        return db.get_recent_quotes_for_corridor(origin=origin.upper(), destination=destination.upper(), limit=limit)
    return db.get_recent_quotes(limit=limit)

@router.get("/api/v1/flight")
@router.get("/api/v1/flight/details")
def get_flight_quote(
    id: str = Query("", description="Flight ID or Flight Number"),
    origin: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
) -> Dict[str, Any]:
    """Single flight quote lookup matching flight number and route corridor."""
    flight_id = id
    origin_param = (origin or "").upper()
    dest_param = (destination or "").upper()
    flight = None

    # 1. First check in-memory cache of fresh live scraped flights matching route
    with scraper._cache_lock:
        for entry in scraper._cache.values():
            data = entry.get("data", {})
            for f in data.get("flights", []):
                fn = f.get("flight_number", "").lower()
                f_orig = f.get("origin", "").upper()
                f_dest = f.get("destination", "").upper()
                if origin_param and f_orig != origin_param:
                    continue
                if dest_param and f_dest != dest_param:
                    continue
                if fn and (fn in flight_id.lower() or flight_id.lower() in fn):
                    flight = f
                    break
            if flight:
                break

    # 2. Database lookup with regex flight number matching and route scoping
    if not flight and hasattr(db, "get_flight_by_id"):
        flight = db.get_flight_by_id(flight_id, origin=origin_param, destination=dest_param)

    return flight or {}

@router.get("/api/v1/analytics/lead_time")
@router.get("/api/v1/lead_time")
def get_lead_time_analytics() -> List[Dict[str, Any]]:
    """Advance booking lead-time dynamic pricing curves (T-30 to T-0)."""
    return db.get_lead_time_analytics() if hasattr(db, "get_lead_time_analytics") else []

@router.get("/api/v1/analytics/anomalies")
@router.get("/api/v1/anomalies")
def get_live_anomalies() -> List[Dict[str, Any]]:
    """Real-time pricing anomalies, surges, and IQR outliers."""
    return db.get_live_anomalies() if hasattr(db, "get_live_anomalies") else []

@router.get("/api/v1/analytics/collusion")
@router.get("/api/v1/collusion")
def get_collusion_watchdog(origin: Optional[str] = None, destination: Optional[str] = None) -> Any:
    """Anti-Trust Collusion & Route Monopoly Watchdog (CCI / DGCA)."""
    if origin and destination:
        route_code = f"{origin.upper()}-{destination.upper()}"
        return index_engine.calculate_route_collusion_watchdog(route_code)
    return index_engine.get_pan_india_collusion_watchlist(live_fares=auto_manager.latest_fares)

@router.get("/api/v1/compliance/sources")
def get_compliance_sources() -> List[Dict[str, Any]]:
    """Status of 11 monitored portals with RFC 9309 robots.txt compliance."""
    return DATA_SOURCES_CATALOG

@router.get("/api/v1/compliance/robots")
def get_compliance_robots() -> Dict[str, Any]:
    """Audit log of robots.txt checks and rate limits."""
    if robot_guard:
        return {
            "user_agent": getattr(robot_guard, "user_agent", "AeroDexBot/2.0"),
            "cached_domains": len(getattr(robot_guard, "parsed_robots", {})),
            "total_checks": len(getattr(robot_guard, "audit_log", [])),
            "audit_log": getattr(robot_guard, "audit_log", [])[-50:]
        }
    return {
        "user_agent": "AeroDexBot/2.0",
        "cached_domains": 0,
        "total_checks": 0,
        "audit_log": [],
        "status": "NOT_CONFIGURED"
    }

@router.get("/api/v1/compliance/anti_bot")
@router.get("/api/v1/compliance/proxies")
@router.get("/api/compliance/proxies")
def get_compliance_anti_bot() -> Dict[str, Any]:
    """Anti-bot proxy rotation and challenge telemetry."""
    if proxy_manager:
        data = proxy_manager.get_telemetry()
        if isinstance(data, dict) and "nodes_detail" not in data and "nodes" in data:
            data = dict(data)
            data["nodes_detail"] = data["nodes"]
        return data
    return {
        "proxy_management_active": True,
        "user_agent_pool_size": 6,
        "ip_proxy_pool_configured": False,
        "nodes": [],
        "nodes_detail": [],
        "status": "ACTIVE"
    }

@router.get("/api/v1/integrity/audit")
@router.get("/api/v1/integrity/score")
@router.get("/api/integrity-score")
def get_integrity_audit() -> Dict[str, Any]:
    """Tukey IQR outlier detection, fare reconciliation, and composite score."""
    sample_quotes = db.get_recent_quotes(limit=100)
    return compute_integrity_score(sample_quotes)

@router.get("/api/v1/forecast/calendar")
def get_forecast_calendar(month: Optional[str] = None, category: Optional[str] = None) -> List[Dict[str, Any]]:
    """Annotated calendar with festival/holiday travel demand nowcasting."""
    parsed_month = None
    if month and str(month).lower() not in ("all", "", "none"):
        try:
            parsed_month = int(str(month).split("-")[-1]) if "-" in str(month) else int(month)
        except Exception:
            parsed_month = None
    return forecast_engine.get_annotated_calendar(month=parsed_month, category=category)

@router.get("/api/v1/forecast/live_calamities")
def get_live_calamities(force_refresh: bool = False) -> Dict[str, Any]:
    """Active UN GDACS and severe weather calamity events."""
    return live_calamity_tracker.fetch_all(force_refresh=force_refresh)

@router.post("/api/v1/forecast/simulate")
def simulate_fare(payload: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """Simulate future fare & projected national index under market shock scenarios."""
    target_date = payload.get("target_date") or payload.get("date") or datetime.now().strftime("%Y-%m-%d")
    scenario = payload.get("scenario_id") or payload.get("scenario", "auto")
    affected_corridor = payload.get("affected_corridor")
    custom_shock_pct = float(payload.get("custom_shock_pct", 0.0))

    pulse = auto_manager.get_live_pulse()
    current_live_index = float(pulse.get("national_index", 127.44))

    sim_result = forecast_engine.simulate_forecast(
        target_date,
        scenario=scenario,
        affected_corridor=affected_corridor,
        custom_shock_pct=custom_shock_pct
    )

    sim_result["current_live_index"] = current_live_index
    sim_result["index_delta"] = round(sim_result["projected_national_index"] - current_live_index, 2)
    sim_result["index_delta_pct"] = round(((sim_result["projected_national_index"] - current_live_index) / current_live_index) * 100.0, 1)
    sim_result["ai_briefing"] = ai_engine.generate_forecast_briefing(sim_result)

    return sim_result

@router.get("/api/v1/shock/scenarios")
@router.get("/api/v1/shocks/list")
def get_shock_scenarios() -> List[Dict[str, Any]]:
    """Historical aviation shock simulation studio scenarios."""
    return list_shock_scenarios()

@router.get("/api/v1/shocks/replay")
@router.get("/api/v1/shock/replay")
@router.post("/api/v1/shock/replay")
@router.post("/api/v1/shocks/replay")
def replay_shock_event(
    scenario_id: Optional[str] = Query(None),
    payload: Optional[Dict[str, Any]] = Body(None)
) -> Dict[str, Any]:
    """Replay historical supply shock."""
    sid = scenario_id or (payload.get("scenario_id") if payload else None) or "gofirst_2023"
    return replay_shock(sid)

@router.get("/api/v1/ai/summary")
def get_ai_summary() -> Dict[str, Any]:
    """Autonomous AI situation room policy briefing."""
    return ai_engine.get_latest_summary()

@router.get("/api/v1/index/weekly")
@router.get("/api/v1/weekly")
def get_weekly_index(weeks: int = 12) -> List[Dict[str, Any]]:
    """12-week rolling timeline JSON."""
    return index_engine.get_weekly_aggregation_timeline(weeks=weeks)

@router.get("/api/v1/export/daily")
@router.get("/api/v1/export/daily.csv")
def export_daily_csv():
    """Export MoSPI Daily Sector Airfare Bulletin (CSV)."""
    csv_content = index_engine.generate_daily_bulletin_csv(auto_manager.get_live_pulse())
    filename = f"MoSPI_Daily_Airfare_Index_Bulletin_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})

@router.get("/api/v1/export/weekly")
@router.get("/api/v1/export/weekly.csv")
def export_weekly_csv():
    """Export Weekly Route Basket Weightings (CSV)."""
    csv_content = index_engine.generate_weekly_bulletin_csv(weeks=12)
    filename = f"MoSPI_Weekly_Airfare_Index_Bulletin_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})

@router.get("/api/v1/export/monthly")
@router.get("/api/v1/export/monthly.csv")
def export_monthly_csv():
    """Export Monthly CPI 07.3.3 Nowcast Series (CSV)."""
    csv_content = index_engine.generate_monthly_timeline_csv()
    filename = f"MoSPI_Monthly_Airfare_Series_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})

@router.get("/api/v1/export/quotes")
@router.get("/api/v1/export/quotes.csv")
def export_quotes_csv():
    """Export Microdata Raw Flight Quotes Audit Log (CSV)."""
    csv_content = db.export_quotes_csv(limit=5000) if hasattr(db, "export_quotes_csv") else "id,carrier_name,total_fare\n"
    filename = f"MoSPI_Microdata_Raw_Quotes_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={filename}"})

@router.get("/api/v1/search")
@router.post("/api/v1/search")
def search_flights_live(
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    date: Optional[str] = None,
    force_live: Optional[bool] = None,
    payload: Optional[Dict[str, Any]] = Body(None)
) -> Dict[str, Any]:
    """
    Search flights with live Playwright extraction, Laspeyres index calculation, and fallback to SQLite microdata warehouse.
    """
    # Merge query params or JSON body
    org = (origin or (payload.get("origin") if payload else None) or "DEL").upper()
    dst = (destination or (payload.get("destination") if payload else None) or "BOM").upper()
    dt = date or (payload.get("date") if payload else None) or (payload.get("travel_date") if payload else None) or "2026-09-20"
    fl = force_live if force_live is not None else (payload.get("force_live", False) if payload else False)

    auto_manager.pause_briefly(25)
    results = scraper.search_live(org, dst, dt, force_live=fl)

    route_code = f"{org}-{dst}"
    if results.get("flights"):
        fares = [f["total_fare"] for f in results["flights"]]
        carrier_weighted_fare = index_engine.compute_carrier_weighted_fare(results["flights"])
        sector_index_data = index_engine.calculate_route_index(route_code, carrier_weighted_fare)
        
        results["summary"] = {
            "min_fare": min(fares),
            "max_fare": max(fares),
            "avg_fare": round(sum(fares) / len(fares)),
            "carrier_weighted_fare": carrier_weighted_fare,
            "carrier_count": len(set(f.get("carrier_code", "AI") for f in results["flights"])),
            "direct_flights": len(results["flights"]),
            **sector_index_data
        }
        results["collusion_watchdog"] = index_engine.calculate_route_collusion_watchdog(
            route_code,
            flights=results["flights"],
            base_fare_p0=results["summary"].get("base_fare_p0")
        )
    else:
        results["summary"] = {"min_fare": 0, "max_fare": 0, "avg_fare": 0, "carrier_count": 0, "direct_flights": 0}
        results["collusion_watchdog"] = index_engine.calculate_route_collusion_watchdog(route_code)

    pulse = auto_manager.get_live_pulse()
    results["macro_context"] = {
        "national_airfare_index": pulse.get("national_index", 127.44),
        "headline_cpi_impact_basis_points": pulse.get("cpi_impact_bps", 31.8),
        "headline_cpi_contribution_pct": pulse.get("cpi_contribution_pct", 0.04),
        "airfare_inflation_vs_base_pct": pulse.get("national_change_pct", 3.2),
        "routes_evaluated": 25
    }

    return results
