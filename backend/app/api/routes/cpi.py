from fastapi import APIRouter
from backend.app.services.cpi_service import CPIService
from backend.app.schemas.cpi import CPIInsightSchema

router = APIRouter(prefix="/cpi", tags=["CPI Analytics"])

@router.get("/insights", response_model=CPIInsightSchema)
def get_cpi_insights():
    """
    Get CPI correlation insights, transport inflation trends, and regional route comparisons.
    """
    return CPIService.get_cpi_insights()
