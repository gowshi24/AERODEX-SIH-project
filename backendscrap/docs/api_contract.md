# AERODEX API Contract Specification

This document details the REST API specification for integrating Next.js frontend with FastAPI / Supabase backend.

## 1. Flight Search

`GET /api/flights/search`

Query Parameters:
- `from` (string): 3-letter IATA origin code (e.g. `DEL`)
- `to` (string): 3-letter IATA destination code (e.g. `BOM`)
- `date` (string): ISO date (`YYYY-MM-DD`)
- `cabin` (string): `Economy` | `Premium Economy` | `Business`

Response 200 OK:
```json
{
  "results": [
    {
      "id": "fl-101",
      "airline": "IndiGo",
      "airlineCode": "6E",
      "flightNumber": "6E-2041",
      "departureCode": "DEL",
      "arrivalCode": "BOM",
      "departureTime": "06:00",
      "arrivalTime": "08:15",
      "duration": "2h 15m",
      "stops": 0,
      "basePrice": 4790,
      "cheapestSource": "MakeMyTrip",
      "sources": [
        { "name": "IndiGo Direct", "price": 4820, "isCheapest": false, "type": "airline" },
        { "name": "MakeMyTrip", "price": 4790, "isCheapest": true, "type": "ota" }
      ]
    }
  ]
}
```

## 2. Airfare Price Index

`GET /api/index/current`

Response 200 OK:
```json
{
  "currentAirfareIndex": 118.42,
  "dailyChange": 0.4,
  "weeklyChange": 1.2,
  "monthlyChange": 2.8,
  "routesTracked": 126,
  "flightsObserved": 18642,
  "sourcesMonitored": 11
}
```
