from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.services.db_service import db_service

EXPLORER_FARES_DATA = [
    {
        "id": "exp-01",
        "collectedAt": "2026-09-13T10:14:00",
        "source": "SerpApi / Google Flights",
        "airline": "IndiGo",
        "flightNumber": "6E-2041",
        "origin": "DEL",
        "destination": "BOM",
        "travelDate": "2026-09-20",
        "advanceWindow": 14,
        "fareClass": "Economy Saver",
        "baseFare": 4250.0,
        "taxes": 620.0,
        "fees": 0.0,
        "totalFare": 4870.0,
        "status": "VALIDATED"
    },
    {
        "id": "exp-02",
        "collectedAt": "2026-09-13T10:14:00",
        "source": "SerpApi / Google Flights",
        "airline": "Air India",
        "flightNumber": "AI-803",
        "origin": "DEL",
        "destination": "BOM",
        "travelDate": "2026-09-20",
        "advanceWindow": 14,
        "fareClass": "Economy Flex",
        "baseFare": 4800.0,
        "taxes": 750.0,
        "fees": 250.0,
        "totalFare": 5800.0,
        "status": "VALIDATED"
    }
]

class FareService:
    @staticmethod
    def get_explorer_fares(query: Optional[str] = None, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        if db:
            db_records = db_service.get_historical_fares(db, limit=100)
            if db_records:
                if not query:
                    return db_records
                q = query.lower()
                return [
                    f for f in db_records
                    if q in str(f.get("airline", "")).lower()
                    or q in str(f.get("source", "")).lower()
                    or q in str(f.get("flightNumber", "")).lower()
                    or q in str(f.get("origin", "")).lower()
                    or q in str(f.get("destination", "")).lower()
                ]

        if not query:
            return EXPLORER_FARES_DATA
        q = query.lower()
        return [
            f for f in EXPLORER_FARES_DATA
            if q in f["airline"].lower() or q in f["source"].lower() or q in f["flightNumber"].lower() or q in f["origin"].lower() or q in f["destination"].lower()
        ]
