# AeroDex Complete System (Excluding Frontend) — `backendscrap`

This directory contains the complete backend, scraping infrastructure, econometric engines, machine learning models, database warehouses, documentation, presentations, and deployment specifications extracted from the AeroDex project (SIH 2026 Problem Statement: SIH26056). All frontend presentation layers (Next.js/React UI, HTML/CSS dashboard, icons, and web bundles) have been excluded.

---

## 📁 Repository & Directory Layout

```
backendscrap/
├── app.py                          # Cloud PaaS WSGI/ASGI entrypoint (Render/Railway/Fly.io)
├── main.py                         # Root entrypoint to boot FastAPI REST server
├── run_backend.bat                 # 1-Click Windows launcher
├── requirements.txt                # Root Python dependencies
├── Procfile                        # Container process declaration
├── railway.json                    # Railway deployment manifest
├── render.yaml                     # Render blueprint specification
├── runtime.txt                     # Target Python runtime version (3.12+)
│
├── aerodex.db                      # SQLite relational database (AeroDex schema)
├── AGENTS.md / CLAUDE.md           # Developer & agent architectural documentation
├── DEMO_SCRIPT.md                  # 5-minute hackathon jury presentation script
├── METHODOLOGY.md                  # Complete mathematical & econometric methodology
├── AeroDex_Mathematical_Formulation_Manual.pdf # Formal formulation documentation
├── AeroDex_Technology_Stack_Specification.pdf # Complete system architecture specification
├── AeroDex_SIH2026_Submission.pptx # Official SIH 2026 idea pitch deck
├── SIH2026-IDEA-Presentation-Format (3).pptx # SIH official slide deck
│
├── scraper/                        # 🌐 Modular Multi-Source Scraping Subsystem (31 files)
│   ├── collectors/                 # Engine collectors for data extraction
│   │   ├── api_collector.py        # Async HTTPx collector for authorized API endpoints
│   │   ├── browser_collector.py    # Playwright browser manager with stealth & lifecycle
│   │   └── collector_base.py       # Abstract SourceAdapter base classes
│   │
│   ├── sources/                    # Carrier & OTA source adapters (12 adapters)
│   │   ├── base_playwright_adapter.py # Shared Playwright extraction pipeline
│   │   ├── demo_source.py          # Calibrated offline fallback fixture adapter
│   │   ├── source_registry.py      # Central registry mapping sources (IndiGo, EMT, etc.)
│   │   ├── airlines/               # Direct Carrier adapters (IndiGo, Air India, Akasa, SpiceJet, AI Express)
│   │   └── otas/                   # OTA adapters (EaseMyTrip, MakeMyTrip, Cleartrip, Ixigo, Goibibo, Yatra)
│   │
│   ├── processors/                 # Ingestion & cleaning pipeline
│   │   ├── cleaner.py              # FareCleaner: schema validation & invalid fare removal
│   │   ├── deduplicator.py         # FareDeduplicator: deduplicates identical flight observations
│   │   ├── flight_matcher.py       # Cross-platform flight number & itinerary reconciliation
│   │   ├── normalizer.py           # FareNormalizer: timestamp & currency standardisation
│   │   ├── outlier_detector.py     # Tukey 1.5x IQR statistical outlier filtering
│   │   └── validator.py            # Microdata mathematical reconciliation validator
│   │
│   ├── models/fare_observation.py  # Canonical FareObservation Pydantic schema
│   ├── scheduler/jobs.py           # Async cron task scheduling for multi-source scraping
│   └── utils/                      # Currency and date parsing utilities
│
├── airfare_index/                  # 📊 Econometric Data, Benchmark Baselines & Live Fetcher
│   ├── airfare_index.db            # SQLite relational microdata warehouse with audit trails
│   ├── airfare_predictor.joblib    # Pre-trained 9-feature Random Forest regression model
│   ├── index_engine.py             # Laspeyres & Paasche price index validation engine
│   ├── atf_fuel_prices.csv/.json         # Historical IOCL Aviation Turbine Fuel (ATF) benchmarks
│   ├── carrier_market_shares.csv/.json   # Official DGCA carrier market volume shares
│   ├── dgca_citypair_weights.csv/.json   # Official DGCA route weights (786 city pairs)
│   ├── official_mospi_cpi_airfare.csv/.json # MoSPI CPI sub-class 07.3.3 historical baseline
│   │
│   └── live_fetcher/               # Real-time multi-source scraping & REST API
│       ├── server.py               # REST API server & router (/api/v1/search, /pulse, /export)
│       ├── scraper.py              # Multi-source concurrent Playwright flight scraper
│       ├── worker_scraper.py       # Decoupled background ingestion worker
│       ├── database.py             # SQLite WAL-mode microdata persistence & logger
│       ├── index_engine.py         # Live Laspeyres & Paasche index calculation engine
│       ├── forecasting_engine.py   # Machine Learning Nowcasting engine & METAR telemetry
│       ├── integrity_engine.py     # Real-time fare reconciliation & Tukey IQR outlier trimmer
│       ├── live_calamity_tracker.py# UN GDACS & weather calamity shock monitor
│       ├── shock_replay.py         # Historical aviation crisis replay simulation studio
│       ├── ai_engine.py            # Gemini 3.6 Flash Situation Room & policy briefings
│       ├── proxy_rotator.py        # Rotating proxy manager with anti-bot stealth mechanisms
│       └── robot_guard.py          # Ethical robots.txt rate-limiter & compliance checker
│
├── aerodex_backend/                # ⚡ Full FastAPI Service & Analytics Layer (117 files)
│   ├── app/
│   │   ├── api/routes/             # 10 REST API route modules (flights, fares, index, anomalies, etc.)
│   │   ├── core/                   # Config, database engine, logging
│   │   ├── schemas/                # Comprehensive Pydantic request/response schemas
│   │   └── services/               # Core business logic services
│   ├── analytics/                  # Airfare index calculation, anomaly detection, backtesting
│   ├── models/                     # SQLAlchemy ORM models (Flight, Fare, Index, Route, Source, etc.)
│   ├── tests/                      # Pytest unit & integration tests
│   └── schema.sql                  # PostgreSQL DDL table schemas
│
├── docs/                           # 📚 Architecture & Design Specifications
│   ├── api_contract.md             # REST API endpoint contracts
│   ├── architecture.md             # High-level architecture specification
│   ├── design_system.md            # System tokens & data flow design
│   ├── DEMO_SCRIPT.md              # Demonstration narrative
│   └── METHODOLOGY.md              # Mathematical index methodology
│
├── scratch/                        # 🛠️ Scratchpad, Tooling & Diagnostic Harnesses
│   ├── generate_tech_stack_pdf.py  # Automated PDF documentation generator
│   └── aerodex_tools/              # Scraper diagnostic & test harnesses
│
├── tests/                          # 🧪 Test Suites (All passing)
│   ├── test_api.py                 # REST API endpoints & telemetry integration tests
│   ├── test_forecasting.py         # ML nowcasting & METAR weather feature tests
│   ├── test_index_engine.py        # Laspeyres mathematical aggregation tests
│   ├── test_scraper.py             # Live fetcher scraper & robots.txt guard tests
│   └── aerodex_scraper_tests/      # Test suite for modular scraper subsystem (11 tests)
│
└── .github/workflows/
    └── scheduled_scraper.yml       # Automated GitHub Actions background scraper workflow
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pip install -r requirements.txt
playwright install chromium
```

### 2. Run the REST API Server
```bash
python main.py
```
Server runs on `http://localhost:8000`.

### 3. Run the Scraper Verification Tests
```bash
python -m pytest tests/aerodex_scraper_tests -q
```

### 4. Run the Core Econometric Tests
```bash
python -m unittest tests/test_index_engine.py tests/test_forecasting.py tests/test_scraper.py
```
