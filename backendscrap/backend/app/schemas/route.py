from pydantic import BaseModel
from typing import Optional

class RouteSchema(BaseModel):
    id: str
    origin: str
    destination: str
    weight: float = 0.1
    active: bool = True

class PopularRouteSchema(BaseModel):
    fromCode: str
    fromCity: str
    toCode: str
    toCity: str
    avgFare: float

class RouteBasketSchema(BaseModel):
    route: str
    from_city: str = ""
    to_city: str = ""
    fromCity: Optional[str] = None
    toCity: Optional[str] = None
    weight: Optional[float] = None
    contribution: Optional[float] = None
    indexValue: float
    changePercent: float
    avgFare: float
    trend: str = "up"
