from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.flight_service import FlightService
from backend.app.schemas.flight import FlightSchema

router = APIRouter(prefix="/flights", tags=["Flights"])

@router.get("/search", response_model=List[FlightSchema])
async def search_flights(
    origin: Optional[str] = Query(None, description="Origin IATA airport code (e.g. DEL, MAA)"),
    destination: Optional[str] = Query(None, description="Destination IATA airport code (e.g. BOM, DEL)"),
    travel_date: Optional[str] = Query(None, description="Outbound travel date YYYY-MM-DD"),
    return_date: Optional[str] = Query(None, description="Return travel date YYYY-MM-DD if roundtrip"),
    fromCode: Optional[str] = Query(None, description="Alias for origin"),
    toCode: Optional[str] = Query(None, description="Alias for destination"),
    travelDate: Optional[str] = Query(None, description="Alias for travel_date"),
    returnDate: Optional[str] = Query(None, description="Alias for return_date"),
    passengers: int = Query(1, ge=1, le=9, description="Number of passengers"),
    cabin_class: Optional[str] = Query("economy", description="Cabin class (economy, business, etc.)"),
    cabinClass: Optional[str] = Query(None, description="Alias for cabin_class"),
    refresh: bool = Query(False, description="Force SerpAPI live fetch even if cache exists"),
    db: Session = Depends(get_db),
):
    """
    Search flight options with real-time SerpAPI data, Supabase PostgreSQL persistence, and smart caching.
    """
    final_origin = origin or fromCode or "DEL"
    final_dest = destination or toCode or "BOM"
    final_date = travel_date or travelDate or "2026-09-20"
    final_return = return_date or returnDate
    final_cabin = cabin_class or cabinClass or "economy"

    return await FlightService.search_flights_async(
        origin=final_origin,
        destination=final_dest,
        travel_date=final_date,
        return_date=final_return,
        passengers=passengers,
        cabin_class=final_cabin,
        refresh=refresh,
        db=db
    )

@router.get("/{flight_id}", response_model=FlightSchema)
def get_flight_details(flight_id: str):
    """
    Get detailed information and price history breakdown for a specific flight.
    """
    flight = FlightService.get_flight_by_id(flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight
