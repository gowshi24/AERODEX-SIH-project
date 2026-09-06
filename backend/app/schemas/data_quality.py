from pydantic import BaseModel
from typing import List, Optional

class DataSourceSchema(BaseModel):
    id: str
    name: str
    type: str # AIRLINE or OTA
    enabled: bool = False
    collection_method: str = "PERMITTED_WEB_OR_API"
    status: str = "DEMO_DATA"
    last_collection: str
    records_collected: int
    data_quality: float
    coverage: str

class DataQualityHistoryPoint(BaseModel):
    date: str
    completeness: float
    reliability: float

class DataQualityMetricsSchema(BaseModel):
    completeness: float = 99.4
    duplicateRate: float = 0.2
    missingValuesRate: float = 0.4
    outlierRate: float = 0.8
    sourceAvailability: float = 99.8
    validationSuccess: float = 99.9
    history: List[DataQualityHistoryPoint]
