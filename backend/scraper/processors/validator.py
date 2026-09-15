from typing import Tuple, List
try:
    from backend.scraper.models.fare_observation import FareObservation
except ImportError:
    from scraper.models.fare_observation import FareObservation

VALID_IATA_CODES = {"DEL", "BOM", "BLR", "MAA", "HYD", "CCU", "GOI", "AMD", "PNQ", "COK", "TRV", "JAI", "IXC", "VTZ", "NAG", "ATQ", "BHO", "IDR", "GAU", "PAT", "IXB", "SXR", "IXR", "RPR"}

class FareValidator:

    @staticmethod
    def validate(obs: FareObservation) -> Tuple[str, List[str]]:
        reasons = []
        status = "VALID"

        if obs.origin not in VALID_IATA_CODES or obs.destination not in VALID_IATA_CODES:
            reasons.append(f"Unrecognized IATA code: {obs.origin}-{obs.destination}")
            status = "WARNING"

        if obs.base_fare is not None and obs.taxes is not None and obs.fees is not None:
            sum_fare = obs.base_fare + obs.taxes + obs.fees
            if abs(sum_fare - obs.total_fare) > 1.0:
                reasons.append(f"Inconsistent fare sum: base({obs.base_fare})+taxes({obs.taxes})+fees({obs.fees}) != total({obs.total_fare})")
                status = "WARNING"


        if obs.total_fare < 1000 or obs.total_fare > 50000:
            reasons.append(f"Out of bounds domestic fare: ₹{obs.total_fare}")
            status = "WARNING"

        return status, reasons

