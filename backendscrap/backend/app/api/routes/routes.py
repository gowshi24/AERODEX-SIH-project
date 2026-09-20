from fastapi import APIRouter
from typing import List
from backend.app.services.index_service import IndexService
from backend.app.schemas.route import RouteBasketSchema

router = APIRouter(prefix="/routes", tags=["Routes"])

@router.get("/basket", response_model=List[RouteBasketSchema])
def get_route_basket_contribution():
    """
    Get route weightings, index values, and basket contribution metrics.
    """
    return IndexService.get_route_basket_contribution()
