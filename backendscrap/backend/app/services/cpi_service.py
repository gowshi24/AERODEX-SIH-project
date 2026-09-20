from typing import Dict, Any

class CPIService:
    @staticmethod
    def get_cpi_insights() -> Dict[str, Any]:
        return {
            "airfareChange": 3.45,
            "monthlyMovement": 1.12,
            "highestIncreaseRoute": "DEL-BOM (+6.8%)",
            "lowestIncreaseRoute": "BOM-BLR (-1.4%)",
            "inflationTrend": [
                {"month": "May", "airfareInflation": 2.1, "generalCPI": 4.8},
                {"month": "Jun", "airfareInflation": 2.8, "generalCPI": 4.9},
                {"month": "Jul", "airfareInflation": 3.2, "generalCPI": 4.7},
                {"month": "Aug", "airfareInflation": 3.45, "generalCPI": 4.6}
            ],
            "monthlyMovementData": [
                {"month": "May", "change": 0.8},
                {"month": "Jun", "change": 1.2},
                {"month": "Jul", "change": 0.9},
                {"month": "Aug", "change": 1.12}
            ],
            "routeComparison": [
                {"route": "DEL-BOM", "change": 6.8},
                {"route": "BLR-DEL", "change": 4.2},
                {"route": "MAA-DEL", "change": 2.1},
                {"route": "BOM-BLR", "change": -1.4}
            ]
        }

    @staticmethod
    def get_backtest_results() -> Dict[str, Any]:
        return {
            "period": "Trailing 12 Months (2025-2026)",
            "actualIndex": 118.4,
            "estimatedIndex": 117.8,
            "difference": 0.6,
            "correlation": 0.942,
            "mape": 1.42,
            "rmse": 1.85,
            "historicalPoints": [
                {"date": "2026-01", "actual": 110.2, "estimated": 109.8},
                {"date": "2026-03", "actual": 112.5, "estimated": 112.1},
                {"date": "2026-06", "actual": 115.8, "estimated": 115.3},
                {"date": "2026-09", "actual": 118.4, "estimated": 117.8}
            ]
        }
