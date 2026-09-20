from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FareSchema(BaseModel):
    id: str
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
    base_fare: float
    taxes: float
    fees: float
    total_fare: float
    currency: str = "INR"
    advance_purchase_days: int = 0
    availability_status: str = "AVAILABLE"
    collected_at: Optional[str] = None

    class Config:
        from_attributes = True

class ExplorerFareSchema(BaseModel):
    id: str
    collectedAt: str
    source: str
    airline: str
    flightNumber: str
    origin: str
    destination: str
    travelDate: str
    advanceWindow: int
    fareClass: str
    baseFare: float
    taxes: float
    fees: float
    totalFare: float
    status: str
