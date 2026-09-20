from pydantic import BaseModel
from typing import List

class BacktestPoint(BaseModel):
    date: str
    actual: float
    estimated: float

class BacktestResultSchema(BaseModel):
    period: str = "90 Days Validation Window"
    actualIndex: float = 124.6
    estimatedIndex: float = 124.1
    difference: float = 0.5
    correlation: float = 0.984
    mape: float = 1.42
    rmse: float = 1.88
    historicalPoints: List[BacktestPoint]
