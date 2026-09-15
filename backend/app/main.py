from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import datetime

from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api.routes import (
    flights_router,
    fares_router,
    routes_router,
    index_router,
    anomalies_router,
    cpi_router,
    backtesting_router,
    data_sources_router,
    data_quality_router,
)

# Initialize Database tables if missing
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade REST API backend service for Indian airfare price monitoring, CPI index calculation, and price analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "Track. Compare. Understand Airfare.",
        "status": "OPERATIONAL",
        "timestamp": datetime.datetime.now().isoformat(),
        "docs": "/docs"
    }

# Health Check Endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "HEALTHY",
        "database": "CONNECTED",
        "analytics_engine": "ACTIVE",
        "scheduler": "RUNNING",
        "timestamp": datetime.datetime.now().isoformat()
    }

# Include API Routers with prefix `/api`
app.include_router(flights_router, prefix=settings.API_V1_STR)
app.include_router(fares_router, prefix=settings.API_V1_STR)
app.include_router(routes_router, prefix=settings.API_V1_STR)
app.include_router(index_router, prefix=settings.API_V1_STR)
app.include_router(anomalies_router, prefix=settings.API_V1_STR)
app.include_router(cpi_router, prefix=settings.API_V1_STR)
app.include_router(backtesting_router, prefix=settings.API_V1_STR)
app.include_router(data_sources_router, prefix=settings.API_V1_STR)
app.include_router(data_quality_router, prefix=settings.API_V1_STR)
