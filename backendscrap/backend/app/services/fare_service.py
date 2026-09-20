from typing import List, Dict, Any, Optional

EXPLORER_FARES_DATA = [
    {
        "id": "exp-01",
        "collectedAt": "2026-09-06T14:30:00",
        "source": "IndiGo Direct",
        "airline": "IndiGo",
        "flightNumber": "6E-2041",
        "origin": "DEL",
        "destination": "BOM",
        "travelDate": "2026-09-20",
        "advanceWindow": 14,
        "fareClass": "Saver",
        "baseFare": 4250.0,
        "taxes": 620.0,
        "fees": 230.0,
        "totalFare": 5100.0,
        "status": "VALIDATED"
    },
    {
        "id": "exp-02",
        "collectedAt": "2026-09-06T14:30:00",
        "source": "EaseMyTrip",
        "airline": "IndiGo",
        "flightNumber": "6E-2041",
        "origin": "DEL",
        "destination": "BOM",
        "travelDate": "2026-09-20",
        "advanceWindow": 14,
        "fareClass": "Saver",
        "baseFare": 4250.0,
        "taxes": 620.0,
        "fees": 0.0,
        "totalFare": 4870.0,
        "status": "VALIDATED"
    },
    {
        "id": "exp-03",
        "collectedAt": "2026-09-06T14:30:00",
        "source": "Air India Direct",
        "airline": "Air India",
        "flightNumber": "AI-803",
        "origin": "DEL",
        "destination": "BOM",
        "travelDate": "2026-09-20",
        "advanceWindow": 14,
        "fareClass": "Economy",
        "baseFare": 4800.0,
        "taxes": 750.0,
        "fees": 250.0,
        "totalFare": 5800.0,
        "status": "VALIDATED"
    }
]

class FareService:
    @staticmethod
    def get_explorer_fares(query: Optional[str] = None) -> List[Dict[str, Any]]:
        if not query:
            return EXPLORER_FARES_DATA
        q = query.lower()
        return [
            f for f in EXPLORER_FARES_DATA
            if q in f["airline"].lower() or q in f["source"].lower() or q in f["flightNumber"].lower() or q in f["origin"].lower() or q in f["destination"].lower()
        ]
