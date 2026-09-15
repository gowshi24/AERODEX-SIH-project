from fastapi import APIRouter, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.fare_service import FareService
from backend.app.schemas.fare import ExplorerFareSchema

router = APIRouter(prefix="/fares", tags=["Fares"])

@router.get("/explorer", response_model=List[ExplorerFareSchema])
def get_data_explorer_fares(
    q: Optional[str] = Query(None, description="Filter query by airline, source, flight or city"),
    db: Session = Depends(get_db),
):
    """
    Retrieve raw validated fare observations for data exploration and auditing.
    """
    return FareService.get_explorer_fares(query=q, db=db)

@router.get("/history", response_model=List[ExplorerFareSchema])
def get_historical_fares(
    origin: Optional[str] = Query(None, description="Filter by origin IATA code"),
    destination: Optional[str] = Query(None, description="Filter by destination IATA code"),
    db: Session = Depends(get_db),
):
    """
    Retrieve historical fare observations stored in Supabase PostgreSQL.
    """
    return FareService.get_explorer_fares(query=origin or destination, db=db)
