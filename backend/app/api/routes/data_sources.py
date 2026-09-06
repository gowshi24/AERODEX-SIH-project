from fastapi import APIRouter
from typing import List
from backend.app.services.data_quality_service import DataQualityService
from backend.app.schemas.data_quality import DataSourceSchema

router = APIRouter(prefix="/data-sources", tags=["Data Sources"])

@router.get("", response_model=List[DataSourceSchema])
def get_data_sources():
    """
    Get configured data sources, collection methods, record counts, and status indicators.
    """
    return DataQualityService.get_data_sources()
