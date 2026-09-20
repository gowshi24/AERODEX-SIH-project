from fastapi import APIRouter, Query
from typing import List, Optional
from backend.app.services.fare_service import FareService
from backend.app.schemas.fare import ExplorerFareSchema

router = APIRouter(prefix="/fares", tags=["Fares"])

@router.get("/explorer", response_model=List[ExplorerFareSchema])
def get_data_explorer_fares(
    q: Optional[str] = Query(None, description="Filter query by airline, source, flight or city")
):
    """
    Retrieve raw validated fare observations for data exploration and auditing.
    """
    return FareService.get_explorer_fares(query=q)
