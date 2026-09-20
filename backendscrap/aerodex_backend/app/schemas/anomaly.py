from pydantic import BaseModel
from typing import Optional

class AnomalySchema(BaseModel):
    id: str
    route: str
    from_city: str
    to_city: str
    airline: str
    currentPrice: float
    previousPrice: float
    percentageChange: float
    severity: str
    detectedDate: str
    reason: str

class AnomalyResponseSchema(BaseModel):
    id: str
    route: str
    airline: str
    flightNumber: Optional[str] = None
    source: Optional[str] = None
    currentPrice: float
    previousPrice: float
    observedFare: Optional[float] = None
    expectedFare: Optional[float] = None
    percentageChange: float
    severity: str
    detectedDate: str
    reason: str
    type: Optional[str] = "SURGE"
