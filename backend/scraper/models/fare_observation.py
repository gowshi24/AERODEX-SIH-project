from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class FareObservation(BaseModel):
    id: Optional[str] = None
    source: str
    source_type: str
    airline: str
    flight_number: str
    origin: str
    destination: str
    departure_datetime: str
    arrival_datetime: str
    travel_date: str
    fare_class: Optional[str] = "Economy"
    base_fare: Optional[float] = None
    taxes: Optional[float] = None
    fees: Optional[float] = None
    total_fare: float
    currency: str = "INR"
    advance_purchase_days: int = 0
    availability_status: str = "AVAILABLE"
    collected_at: str = Field(default_factory=utc_now_iso)

    
    # Optional metadata
    baggage: Optional[str] = "7 kg cabin, 15 kg check-in"
    refundable: Optional[str] = "Partially Refundable"
    cabin_class: Optional[str] = "Economy"
    aircraft: Optional[str] = "Airbus A320"
    stops: Optional[int] = 0
    duration_minutes: Optional[int] = 135
    source_url: Optional[str] = None
    raw_reference: Optional[str] = None
