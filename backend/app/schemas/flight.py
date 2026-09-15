from pydantic import BaseModel
from typing import List, Optional

class FlightSourceSchema(BaseModel):
    name: str
    price: float
    baseFare: Optional[float] = None
    taxes: Optional[float] = None
    fees: Optional[float] = None
    isCheapest: bool
    type: str
    bookingUrl: Optional[str] = "#"

class BaggageSchema(BaseModel):
    cabin: str = "Not specified"
    checkIn: str = "Not specified"

class PriceHistoryPointSchema(BaseModel):
    date: str
    price: float

class FlightSchema(BaseModel):
    id: str
    airline: str
    airlineCode: str
    flightNumber: str
    departureCity: str
    departureCode: str
    departureTime: str
    arrivalCity: str
    arrivalCode: str
    arrivalTime: str
    travelDate: Optional[str] = "2026-09-20"
    duration: str
    stops: int = 0
    aircraft: Optional[str] = None
    fareClass: Optional[str] = "Economy"
    basePrice: float
    cheapestSource: str
    priceTrendPercent: float = 0.0
    priceTrendDirection: str = "stable"
    sources: List[FlightSourceSchema] = []
    baggage: BaggageSchema = BaggageSchema()
    refundability: str = "Not specified"
    priceHistory: List[PriceHistoryPointSchema] = []

    class Config:
        from_attributes = True
