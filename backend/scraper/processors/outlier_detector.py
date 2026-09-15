import numpy as np
from typing import List, Tuple
try:
    from backend.scraper.models.fare_observation import FareObservation
except ImportError:
    from scraper.models.fare_observation import FareObservation

class OutlierDetector:

    @staticmethod
    def detect_outliers_zscore(observations: List[FareObservation], threshold: float = 3.0) -> List[Tuple[FareObservation, str]]:
        if not observations:
            return []
        
        fares = [obs.total_fare for obs in observations]
        if len(fares) < 3:
            return [(obs, "NORMAL") for obs in observations]
            
        mean = np.mean(fares)
        std = np.std(fares)

        results = []
        for obs in observations:
            if std == 0:
                results.append((obs, "NORMAL"))
                continue
            z_score = abs((obs.total_fare - mean) / std)
            if z_score > threshold:
                status = "OUTLIER"
            elif z_score > 2.0:
                status = "SUSPICIOUS"
            else:
                status = "NORMAL"
            results.append((obs, status))
            
        return results

