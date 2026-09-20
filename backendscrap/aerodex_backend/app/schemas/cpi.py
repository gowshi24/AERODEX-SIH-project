from pydantic import BaseModel
from typing import List

class InflationTrendPoint(BaseModel):
    month: str
    airfareInflation: float
    generalCPI: float

class MonthlyMovementPoint(BaseModel):
    month: str
    change: float

class RouteComparisonPoint(BaseModel):
    route: str
    change: float

class CPIInsightSchema(BaseModel):
    airfareChange: float = 4.8
    monthlyMovement: float = 1.9
    highestIncreaseRoute: str = "DEL → BOM (+6.2%)"
    lowestIncreaseRoute: str = "BLR → BOM (-1.2%)"
    inflationTrend: List[InflationTrendPoint]
    monthlyMovementData: List[MonthlyMovementPoint]
    routeComparison: List[RouteComparisonPoint]
