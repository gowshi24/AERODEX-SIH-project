from typing import List, Dict, Any, Optional

MOCK_FLIGHTS_DATA = [
    {
        "id": "fl-indigo-6e2041",
        "airline": "IndiGo",
        "airlineCode": "6E",
        "flightNumber": "6E-2041",
        "departureCity": "New Delhi",
        "departureCode": "DEL",
        "departureTime": "07:25",
        "arrivalCity": "Mumbai",
        "arrivalCode": "BOM",
        "arrivalTime": "09:40",
        "travelDate": "2026-09-20",
        "duration": "2h 15m",
        "stops": 0,
        "aircraft": "Airbus A320neo",
        "fareClass": "Saver",
        "basePrice": 4250,
        "cheapestSource": "EaseMyTrip",
        "priceTrendPercent": -4.2,
        "priceTrendDirection": "down",
        "sources": [
            {
                "id": "src-emt",
                "name": "EaseMyTrip",
                "price": 4870,
                "baseFare": 4250,
                "taxes": 620,
                "fees": 0,
                "isCheapest": True,
                "type": "ota",
                "bookingUrl": "https://easemytrip.com"
            },
            {
                "id": "src-indigo",
                "name": "IndiGo Direct",
                "price": 5100,
                "baseFare": 4250,
                "taxes": 620,
                "fees": 230,
                "isCheapest": False,
                "type": "airline",
                "bookingUrl": "https://goindigo.in"
            },
            {
                "id": "src-mmt",
                "name": "MakeMyTrip",
                "price": 5220,
                "baseFare": 4250,
                "taxes": 620,
                "fees": 350,
                "isCheapest": False,
                "type": "ota",
                "bookingUrl": "https://makemytrip.com"
            }
        ],
        "baggage": {
            "cabin": "7 Kgs",
            "checkIn": "15 Kgs"
        },
        "refundability": "Partially Refundable",
        "priceHistory": [
            {"date": "2026-08-20", "price": 6400},
            {"date": "2026-08-27", "price": 5800},
            {"date": "2026-09-01", "price": 5300},
            {"date": "2026-09-06", "price": 4870}
        ]
    },
    {
        "id": "fl-ai-803",
        "airline": "Air India",
        "airlineCode": "AI",
        "flightNumber": "AI-803",
        "departureCity": "New Delhi",
        "departureCode": "DEL",
        "departureTime": "10:00",
        "arrivalCity": "Mumbai",
        "arrivalCode": "BOM",
        "arrivalTime": "12:15",
        "travelDate": "2026-09-20",
        "duration": "2h 15m",
        "stops": 0,
        "aircraft": "Boeing 787-8",
        "fareClass": "Economy",
        "basePrice": 4800,
        "cheapestSource": "Air India Direct",
        "priceTrendPercent": 2.5,
        "priceTrendDirection": "up",
        "sources": [
            {
                "id": "src-ai",
                "name": "Air India Direct",
                "price": 5800,
                "baseFare": 4800,
                "taxes": 750,
                "fees": 250,
                "isCheapest": True,
                "type": "airline",
                "bookingUrl": "https://airindia.com"
            },
            {
                "id": "src-yatra",
                "name": "Yatra",
                "price": 5850,
                "baseFare": 4800,
                "taxes": 750,
                "fees": 300,
                "isCheapest": False,
                "type": "ota",
                "bookingUrl": "https://yatra.com"
            }
        ],
        "baggage": {
            "cabin": "8 Kgs",
            "checkIn": "20 Kgs"
        },
        "refundability": "Refundable",
        "priceHistory": [
            {"date": "2026-08-20", "price": 5600},
            {"date": "2026-08-27", "price": 5700},
            {"date": "2026-09-01", "price": 5750},
            {"date": "2026-09-06", "price": 5800}
        ]
    }
]

class FlightService:
    @staticmethod
    def search_flights(origin: Optional[str] = None, destination: Optional[str] = None) -> List[Dict[str, Any]]:
        results = MOCK_FLIGHTS_DATA
        if origin:
            results = [f for f in results if f["departureCode"].upper() == origin.upper()]
        if destination:
            results = [f for f in results if f["arrivalCode"].upper() == destination.upper()]
        return results

    @staticmethod
    def get_flight_by_id(flight_id: str) -> Optional[Dict[str, Any]]:
        for flight in MOCK_FLIGHTS_DATA:
            if flight["id"] == flight_id:
                return flight
        return MOCK_FLIGHTS_DATA[0]
