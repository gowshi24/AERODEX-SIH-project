from typing import List, Dict, Any
import numpy as np

def detect_price_anomalies(fare_records: List[Dict[str, Any]], z_threshold: float = 2.5) -> List[Dict[str, Any]]:
    if len(fare_records) < 3:
        return []

    fares = [f.get("total_fare", 0.0) for f in fare_records if f.get("total_fare", 0.0) > 0]
    if not fares:
        return []

    arr = np.array(fares)
    mean = np.mean(arr)
    std = np.std(arr)

    if std == 0:
        return []

    anomalies = []
    for rec in fare_records:
        fare = rec.get("total_fare", 0.0)
        z_score = (fare - mean) / std
        if abs(z_score) >= z_threshold:
            anomalies.append({
                "id": rec.get("id", "anom-01"),
                "flight_number": rec.get("flight_number", "UNKNOWN"),
                "route": f"{rec.get('origin')}-{rec.get('destination')}",
                "airline": rec.get("airline", "UNKNOWN"),
                "source": rec.get("source", "UNKNOWN"),
                "fare": fare,
                "mean_fare": round(float(mean), 2),
                "z_score": round(float(z_score), 2),
                "type": "SURGE" if z_score > 0 else "DROP",
                "severity": "HIGH" if abs(z_score) > 3.0 else "MEDIUM"
            })

    return anomalies
