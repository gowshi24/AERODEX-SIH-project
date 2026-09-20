from typing import List, Dict, Any
import numpy as np
import pandas as pd

class AirfareIndexCalculator:
    BASE_INDEX_VAL = 100.0
    BASE_YEAR = 2024

    def calculate_basket_index(self, fares: List[float], base_fares: List[float] = None) -> Dict[str, Any]:
        if not fares:
            return {
                "current_index": self.BASE_INDEX_VAL,
                "change_pct": 0.0,
                "sample_size": 0,
            }
        df_fares = pd.Series(fares)
        avg_current = float(df_fares.mean())
        if base_fares:
            avg_base = float(pd.Series(base_fares).mean())
        else:
            avg_base = 4500.0  # Reference baseline average fare in INR

        current_index = round((avg_current / avg_base) * 100.0, 2)
        change_pct = round(((avg_current - avg_base) / avg_base) * 100.0, 2)

        return {
            "current_index": current_index,
            "avg_fare": round(avg_current, 2),
            "change_pct": change_pct,
            "sample_size": len(fares),
            "base_year": self.BASE_YEAR
        }

    def generate_index_series(self, days: int = 30) -> List[Dict[str, Any]]:
        dates = pd.date_range(end=pd.Timestamp.today(), periods=days, freq="D")
        np.random.seed(42)
        base = 118.5
        noise = np.random.normal(0, 1.2, days).cumsum()
        series = []
        for i, dt in enumerate(dates):
            val = round(base + noise[i], 2)
            series.append({
                "date": dt.strftime("%Y-%m-%d"),
                "value": val,
                "change_pct": round(noise[i] - (noise[i-1] if i > 0 else 0), 2)
            })
        return series

index_calculator = AirfareIndexCalculator()
