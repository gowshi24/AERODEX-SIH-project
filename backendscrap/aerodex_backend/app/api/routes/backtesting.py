from fastapi import APIRouter
from backend.app.services.cpi_service import CPIService
from backend.app.schemas.backtest import BacktestResultSchema

router = APIRouter(prefix="/backtesting", tags=["Backtesting"])

@router.get("", response_model=BacktestResultSchema)
def get_backtest_results():
    """
    Get backtest evaluation results (MAPE, RMSE, Pearson Correlation) for CPI augmentation models.
    """
    return CPIService.get_backtest_results()
