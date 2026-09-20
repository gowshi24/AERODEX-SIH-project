from fastapi import APIRouter
from backend.app.services.data_quality_service import DataQualityService
from backend.app.schemas.data_quality import DataQualityMetricsSchema

router = APIRouter(prefix="/data-quality", tags=["Data Quality"])

@router.get("", response_model=DataQualityMetricsSchema)
def get_data_quality():
    """
    Get data pipeline quality metrics including completeness, duplicate rate, outlier rate, and validation success rate.
    """
    return DataQualityService.get_data_quality_metrics()
