from pydantic import BaseModel
from typing import List, Optional

class IndexSummarySchema(BaseModel):
    currentIndex: float = 124.6
    previousPeriod: float = 121.8
    changePercent: float = 2.3
    basePeriod: float = 100.0

class LiveMarketSnapshotSchema(BaseModel):
    currentIndex: float
    previousIndex: float
    dailyChangePercent: float
    monthlyChangePercent: float
    yearlyChangePercent: float
    totalObservations: int
    activeRoutesCount: int
    lastUpdated: str

class IndexHistorySchema(BaseModel):
    date: str
    month: str
    index: float
    baseLine: float = 100.0
    cpiReference: float = 100.0

IndexHistoryPointSchema = IndexHistorySchema

class RouteIndexItemSchema(BaseModel):
    route: str
    from_city: str
    to_city: str
    indexValue: float
    changePercent: float
    avgFare: float
    trend: str = "up"
