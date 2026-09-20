from typing import Dict

CONVERSION_RATES_TO_INR: Dict[str, float] = {
    "INR": 1.0,
    "USD": 83.5,
    "EUR": 90.2,
    "GBP": 105.8,
    "AED": 22.7,
    "SGD": 62.1,
}

def convert_to_inr(amount: float, currency: str) -> float:
    rate = CONVERSION_RATES_TO_INR.get(currency.upper(), 1.0)
    return round(amount * rate, 2)
