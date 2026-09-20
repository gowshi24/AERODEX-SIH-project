from typing import List, Dict, Any

ANOMALIES_DATA = [
    {
        "id": "anom-01",
        "route": "DEL-BOM",
        "from": "DEL",
        "to": "BOM",
        "airline": "IndiGo",
        "flightNumber": "6E-2041",
        "source": "IndiGo Direct",
        "currentPrice": 9800,
        "previousPrice": 4870,
        "observedFare": 9800,
        "expectedFare": 5100,
        "percentageChange": 101.2,
        "severity": "High",
        "detectedDate": "2026-09-06",
        "reason": "Sudden surge (+101%) detected during peak weekend window.",
        "type": "SURGE"
    },
    {
        "id": "anom-02",
        "route": "BLR-DEL",
        "from": "BLR",
        "to": "DEL",
        "airline": "Air India",
        "flightNumber": "AI-803",
        "source": "Air India Direct",
        "currentPrice": 3200,
        "previousPrice": 6100,
        "observedFare": 3200,
        "expectedFare": 5900,
        "percentageChange": -47.5,
        "severity": "Medium",
        "detectedDate": "2026-09-05",
        "reason": "Unusual price drop (-47.5%) cross-checked with flash sale release.",
        "type": "DROP"
    }
]

class AnomalyService:
    @staticmethod
    def get_anomalies() -> List[Dict[str, Any]]:
        return ANOMALIES_DATA
