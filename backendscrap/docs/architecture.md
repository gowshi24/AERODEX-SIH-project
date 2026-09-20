# AERODEX System Architecture

AERODEX is structured into modular layers for clear separation of concerns:

```
[ Airline Portals / OTAs ]
           │
           ▼
[ Scheduled Collection / Web Parsing ]
           │
           ▼
[ Data Cleaning & Normalization ]
           │
           ▼
[ Database (PostgreSQL / Supabase) ]
           │
           ▼
[ Analytics & Index Computation Engine ]
           │
           ▼
[ FastAPI Backend REST API ]
           │
           ▼
[ Next.js 16 Production Frontend Dashboard ]
```

## Frontend Subfolder Architecture (`/frontend`)
- `src/app/` : Next.js App Router Pages (`search`, `trends`, `airfare-index`, `lead-time`, `heatmap`, `anomalies`, `cpi-insights`, `backtesting`, `data-sources`, `data-quality`, `data-explorer`, `book`, `about`)
- `src/components/` : Reusable UI, layout, search, flight, and analytics components.
- `src/lib/api.ts` : API Service Layer interface ready for backend swap.
- `src/types/index.ts` : Domain TypeScript definitions.
- `src/data/mockData.ts` : Realistic Indian aviation datasets.
