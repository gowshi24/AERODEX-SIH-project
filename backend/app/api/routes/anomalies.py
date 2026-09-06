from fastapi import APIRouter
from typing import List
from backend.app.services.anomaly_service import AnomalyService
from backend.app.schemas.anomaly import AnomalyResponseSchema

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])

@router.get("", response_model=List[AnomalyResponseSchema])
def get_anomalies():
    """
    Get detected price anomalies, surge warnings, and cross-source price divergence records.
    """
    return AnomalyService.get_anomalies()
