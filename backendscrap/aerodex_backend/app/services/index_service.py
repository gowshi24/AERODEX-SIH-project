from typing import List, Dict, Any

class IndexService:
    @staticmethod
    def get_live_market_snapshot() -> Dict[str, Any]:
        return {
            "currentIndex": 118.4,
            "previousIndex": 117.2,
            "dailyChangePercent": 1.02,
            "monthlyChangePercent": 3.45,
            "yearlyChangePercent": 8.12,
            "totalObservations": 124580,
            "activeRoutesCount": 42,
            "lastUpdated": "2026-09-06T14:40:00"
        }

    @staticmethod
    def get_index_history() -> List[Dict[str, Any]]:
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
        history = []
        base_val = 110.0
        for i, m in enumerate(months):
            val = round(base_val + (i * 0.95), 1)
            history.append({
                "date": f"2026-0{i+1}-01" if i < 9 else f"2026-{i+1}-01",
                "month": m,
                "index": val,
                "baseLine": 100.0,
                "cpiReference": round(105.0 + (i * 0.4), 1)
            })
        return history

    @staticmethod
    def get_route_basket_contribution() -> List[Dict[str, Any]]:
        return [
            {
                "route": "DEL-BOM",
                "from": "DEL",
                "to": "BOM",
                "fromCity": "New Delhi",
                "toCity": "Mumbai",
                "weight": 18.5,
                "contribution": 21.9,
                "indexValue": 122.4,
                "changePercent": 4.1,
                "avgFare": 5420,
                "trend": "up"
            },
            {
                "route": "BLR-DEL",
                "from": "BLR",
                "to": "DEL",
                "fromCity": "Bengaluru",
                "toCity": "New Delhi",
                "weight": 14.2,
                "contribution": 16.8,
                "indexValue": 118.2,
                "changePercent": 2.3,
                "avgFare": 5890,
                "trend": "up"
            },
            {
                "route": "BOM-BLR",
                "from": "BOM",
                "to": "BLR",
                "fromCity": "Mumbai",
                "toCity": "Bengaluru",
                "weight": 12.0,
                "contribution": 13.1,
                "indexValue": 109.1,
                "changePercent": -1.4,
                "avgFare": 3950,
                "trend": "down"
            }
        ]
