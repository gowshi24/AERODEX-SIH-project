from .flights import router as flights_router
from .fares import router as fares_router
from .routes import router as routes_router
from .index import router as index_router
from .anomalies import router as anomalies_router
from .cpi import router as cpi_router
from .backtesting import router as backtesting_router
from .data_sources import router as data_sources_router
from .data_quality import router as data_quality_router

__all__ = [
    "flights_router",
    "fares_router",
    "routes_router",
    "index_router",
    "anomalies_router",
    "cpi_router",
    "backtesting_router",
    "data_sources_router",
    "data_quality_router",
]
