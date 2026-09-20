from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from backend.app.services.flight_service import FlightService
from backend.app.schemas.flight import FlightSchema

router = APIRouter(prefix="/flights", tags=["Flights"])

@router.get("/search", response_model=List[FlightSchema])
def search_flights(
    fromCode: Optional[str] = Query(None, description="Origin IATA airport code"),
    toCode: Optional[str] = Query(None, description="Destination IATA airport code"),
):
    """
    Search flight options with aggregated multi-source fares across airlines and OTAs.
    """
    return FlightService.search_flights(origin=fromCode, destination=toCode)

@router.get("/{flight_id}", response_model=FlightSchema)
def get_flight_details(flight_id: str):
    """
    Get detailed information and price history breakdown for a specific flight.
    """
    flight = FlightService.get_flight_by_id(flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight
