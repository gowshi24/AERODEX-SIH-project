from typing import List, Dict, Any

class DataQualityService:
    @staticmethod
    def get_data_sources() -> List[Dict[str, Any]]:
        return [
            {
                "id": "ds-00",
                "name": "SerpApi / Google Flights",
                "type": "REALTIME_META_OTA",
                "collectionMethod": "SERPAPI_REALTIME_HTTP",
                "status": "Connected",
                "lastCollection": "2026-09-13T10:14:00",
                "recordsCollected": 68400,
                "dataQuality": 99.8,
                "coverage": "Real-time Live Google Flights Market"
            },
            {
                "id": "ds-01",
                "name": "IndiGo Direct",
                "type": "AIRLINE",
                "collectionMethod": "PERMITTED_WEB_OR_API",
                "status": "Connected",
                "lastCollection": "2026-09-06T14:30:00",
                "recordsCollected": 45200,
                "dataQuality": 99.4,
                "coverage": "Domestic All Routes"
            },
            {
                "id": "ds-02",
                "name": "Air India Direct",
                "type": "AIRLINE",
                "collectionMethod": "PERMITTED_WEB_OR_API",
                "status": "Connected",
                "lastCollection": "2026-09-06T14:25:00",
                "recordsCollected": 38100,
                "dataQuality": 98.8,
                "coverage": "Domestic & International"
            },
            {
                "id": "ds-03",
                "name": "MakeMyTrip",
                "type": "OTA",
                "collectionMethod": "PERMITTED_WEB_OR_API",
                "status": "Monitoring",
                "lastCollection": "2026-09-06T14:20:00",
                "recordsCollected": 52800,
                "dataQuality": 97.9,
                "coverage": "OTA Aggregated"
            },
            {
                "id": "ds-04",
                "name": "EaseMyTrip",
                "type": "OTA",
                "collectionMethod": "PERMITTED_WEB_OR_API",
                "status": "Connected",
                "lastCollection": "2026-09-06T14:15:00",
                "recordsCollected": 41500,
                "dataQuality": 99.1,
                "coverage": "OTA Direct Fares"
            }
        ]

    @staticmethod
    def get_data_quality_metrics() -> Dict[str, Any]:
        return {
            "completeness": 99.2,
            "duplicateRate": 0.4,
            "missingValuesRate": 0.3,
            "outlierRate": 1.1,
            "sourceAvailability": 99.8,
            "validationSuccess": 99.5,
            "history": [
                {"date": "2026-09-01", "completeness": 99.0, "reliability": 98.9},
                {"date": "2026-09-03", "completeness": 99.1, "reliability": 99.0},
                {"date": "2026-09-06", "completeness": 99.2, "reliability": 99.3}
            ]
        }
