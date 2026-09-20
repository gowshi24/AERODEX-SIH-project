import datetime

def parse_iso_datetime(dt_str: str) -> datetime.datetime:
    try:
        return datetime.datetime.fromisoformat(dt_str)
    except (ValueError, TypeError):
        return datetime.datetime.now()

def calculate_advance_purchase(travel_date_str: str, booking_date_str: str = None) -> int:
    try:
        travel_dt = datetime.date.fromisoformat(travel_date_str)
        if booking_date_str:
            booking_dt = datetime.date.fromisoformat(booking_date_str[:10])
        else:
            booking_dt = datetime.date.today()
        days = (travel_dt - booking_dt).days
        return max(0, days)
    except (ValueError, TypeError):
        return 0
