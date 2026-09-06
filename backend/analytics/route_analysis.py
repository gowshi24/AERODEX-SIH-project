from typing import List, Dict, Any
import numpy as np

def analyze_route_fares(route_code: str, fare_records: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not fare_records:
        return {
            "route": route_code,
            "min_fare": 0.0,
            "max_fare": 0.0,
            "avg_fare": 0.0,
            "median_fare": 0.0,
            "std_dev": 0.0,
            "observations_count": 0
        }
    prices = [f.get("total_fare", 0.0) for f in fare_records if f.get("total_fare", 0.0) > 0]
    if not prices:
        return {"route": route_code, "observations_count": 0}

    arr = np.array(prices)
    return {
        "route": route_code,
        "min_fare": round(float(np.min(arr)), 2),
        "max_fare": round(float(np.max(arr)), 2),
        "avg_fare": round(float(np.mean(arr)), 2),
        "median_fare": round(float(np.median(arr)), 2),
        "std_dev": round(float(np.std(arr)), 2),
        "observations_count": len(prices)
    }
