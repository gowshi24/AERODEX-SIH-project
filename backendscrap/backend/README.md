# AERODEX Backend & Data Collection Pipeline

AERODEX is a production-grade Indian airfare price intelligence, monitoring, analytics, and index calculation platform. This backend service collects permitted airfare observations, cleans and normalizes market data, matches identical flights across airline direct portals and Online Travel Aggregators (OTAs), detects price anomalies, calculates the Indian Airfare Price Index, and exposes REST APIs.

---

## 🏛️ System Architecture

```
backend/
├── app/
│   ├── main.py                  # FastAPI application entry point, CORS, Swagger UI & route bindings
│   ├── api/
│   │   └── routes/              # REST API endpoints (flights, fares, index, anomalies, CPI, backtesting, quality)
│   ├── core/                    # Config, database engine (SQLAlchemy), logging setup
│   ├── schemas/                 # Pydantic v2 validation schemas
│   └── services/                # Business logic and database operations
├── scraper/
│   ├── collectors/              # Playwright browser collector & HTTPx API collector base
│   ├── sources/                 # Source adapters (IndiGo, Air India, SpiceJet, MMT, Yatra, EaseMyTrip, etc.)
│   ├── processors/              # Cleaning, Validation, Normalization, Deduplication, Matching & Outliers
│   ├── models/                  # Raw FareObservation model
│   ├── scheduler/               # Periodic collection & index calculation jobs
│   └── source_registry.py       # Central adapter orchestrator
├── models/                      # SQLAlchemy ORM models (Flight, Fare, Route, Source, Index, Anomaly, Quality)
├── analytics/                   # Index calculation, lead-time curve, anomaly detection, CPI backtesting
├── tests/                       # Pytest automated test suite
├── .env.example                 # Environment variables configuration template
├── requirements.txt             # Python dependencies
└── README.md                    # Backend documentation
```

---

## 🛡️ Ethical Scraper Architecture & Data Collection Guidelines

1. **Permitted Access**: Source adapters inherit from `SourceAdapter`. Collection is performed only where permitted or via public endpoints.
2. **Graceful Status Handling**: Adapters requiring authentication, CAPTCHA, or anti-bot clearance register as `NOT_CONFIGURED` or `BLOCKED_OR_NOT_PERMITTED` without bypass attempts.
3. **Synthetic/Demo Fallback**: Unconfigured sources provide standard, realistic `DEMO_DATA` observations for system testing.

---

## 🔄 Data Processing & Analytics Pipeline

```
[ Raw Source Adapter ]
         │
         ▼
  [ FareCleaner ]  ───────► Filters invalid/negative fares & malformed data
         │
         ▼
  [ FareValidator ] ──────► Validates IATA airport codes & total fare breakdown
         │
         ▼
[ DataNormalizer ] ───────► Standardizes currencies (INR), dates & flight numbers
         │
         ▼
 [ Deduplicator ]  ───────► Identifies duplicate readings within same window
         │
         ▼
 [ FlightMatcher ] ───────► Groups identical flight numbers across direct & OTA sources
         │
         ▼
[ OutlierDetector ] ──────► Computes Z-scores & tags price surges/drops
         │
         ▼
 [ Airfare Index ] ───────► Calculates basket averages, index points & CPI correlation
```

---

## 🚀 Getting Started (Windows PowerShell Setup)

### 1. Prerequisites
- **Python 3.11+** installed
- **Git** installed

### 2. Create Virtual Environment & Install Dependencies
Open Windows PowerShell inside the repository root (`e:\AERODEX`):

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Upgrade pip and install requirements
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Default configuration uses local SQLite database (`sqlite:///./aerodex.db`). PostgreSQL or Supabase connection strings can be specified in `.env`.

---

## 🧪 Running Automated Tests

Run the complete test suite using `pytest`:

```powershell
pytest
```

---

## ⚡ Running the FastAPI Backend Server

Start the development server with live reload:

```powershell
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Or run directly via Python:

```powershell
python main.py
```

- **API Base URL**: `http://localhost:8000`
- **Interactive Swagger UI Documentation**: `http://localhost:8000/docs`
- **ReDoc API Documentation**: `http://localhost:8000/redoc`
- **Health Check Endpoint**: `http://localhost:8000/health`

---

## 📡 REST API Endpoint Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Backend status & DB connection health check |
| `GET` | `/api/flights/search` | Search flights across airlines and OTAs |
| `GET` | `/api/flights/{flight_id}` | Detailed flight information & price history |
| `GET` | `/api/fares/explorer` | Auditable raw fare observation explorer |
| `GET` | `/api/routes/basket` | Route weightings and basket contributions |
| `GET` | `/api/index/snapshot` | Live airfare index market snapshot |
| `GET` | `/api/index/history` | Historical index points vs baseline & CPI |
| `GET` | `/api/anomalies` | Detected price surges, drops & mismatches |
| `GET` | `/api/cpi/insights` | CPI correlation & transport inflation trends |
| `GET` | `/api/backtesting` | Backtesting metric evaluation (MAPE, RMSE) |
| `GET` | `/api/data-sources` | Configured source adapters & statuses |
| `GET` | `/api/data-quality` | Data completeness & pipeline reliability metrics |
