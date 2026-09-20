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
    cabin: str = "7 kg"
    checkIn: str = "15 kg"

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
    aircraft: Optional[str] = "Airbus A320"
    fareClass: Optional[str] = "Economy Saver"
    basePrice: float
    cheapestSource: str
    priceTrendPercent: float = 0.0
    priceTrendDirection: str = "stable"
    sources: List[FlightSourceSchema] = []
    baggage: BaggageSchema = BaggageSchema()
    refundability: str = "Partially Refundable"
    priceHistory: List[PriceHistoryPointSchema] = []

    class Config:
        from_attributes = True
