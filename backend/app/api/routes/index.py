from fastapi import APIRouter
from typing import List
from backend.app.services.index_service import IndexService
from backend.app.schemas.index import LiveMarketSnapshotSchema, IndexHistorySchema

router = APIRouter(prefix="/index", tags=["Index"])

@router.get("/snapshot", response_model=LiveMarketSnapshotSchema)
def get_live_market_snapshot():
    """
    Get live airfare index market snapshot including current index level, changes, and observation counts.
    """
    return IndexService.get_live_market_snapshot()

@router.get("/history", response_model=List[IndexHistorySchema])
def get_airfare_index_history():
    """
    Get historical airfare index trends compared to baseline (100) and general CPI reference levels.
    """
    return IndexService.get_index_history()
