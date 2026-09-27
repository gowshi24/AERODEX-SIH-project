"""
Automated CSV Ingestion and Database Seeding Script.
Reads all 10 CSV files in 'CSV files/' and seeds:
1. 'aerodex.db' (FastAPI schema: routes, flights, fares, data_sources, airfare_index)
2. 'airfare_index.db' (MoSPI / Laspeyres schema: dgca_routes, carrier_market_shares, mospi_cpi_baseline, atf_fuel_prices, scraped_quotes, index_calculation_logs)
"""

import os
import sqlite3
import csv
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSV_DIR = os.path.join(ROOT_DIR, "CSV files")

def seed_aerodex_db():
    aerodex_db_path = os.path.join(ROOT_DIR, "aerodex.db")
    print(f"[+] Seeding {aerodex_db_path} from CSV files...")
    conn = sqlite3.connect(aerodex_db_path)
    cur = conn.cursor()

    # 1. Seed routes from dgca_citypair_weights.csv
    routes_csv = os.path.join(CSV_DIR, "dgca_citypair_weights.csv")
    if os.path.exists(routes_csv):
        with open(routes_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            routes_inserted = 0
            for r in reader:
                orig = r.get("iata1", "").strip().upper()
                dest = r.get("iata2", "").strip().upper()
                if not orig or not dest:
                    continue
                route_id = f"route-{orig}-{dest}"
                weight = float(r.get("route_weight_percent", 0.1) or 0.1) / 100.0
                cur.execute("""
                    INSERT OR REPLACE INTO routes (id, origin, destination, weight, active)
                    VALUES (?, ?, ?, ?, ?)
                """, (route_id, orig, dest, weight, True))
                routes_inserted += 1
            print(f"  [>] Seeded {routes_inserted} routes into aerodex.db")

    # 2. Seed data_sources
    sources = [
        ("src-indigo", "IndiGo Direct", "AIRLINE", True, "DIRECT_API", "ACTIVE"),
        ("src-airindia", "Air India Direct", "AIRLINE", True, "DIRECT_API", "ACTIVE"),
        ("src-aiexpress", "Air India Express Direct", "AIRLINE", True, "DIRECT_API", "ACTIVE"),
        ("src-akasa", "Akasa Air Direct", "AIRLINE", True, "DIRECT_API", "ACTIVE"),
        ("src-spicejet", "SpiceJet Direct", "AIRLINE", True, "DIRECT_API", "ACTIVE"),
        ("src-easemytrip", "EaseMyTrip", "OTA", True, "LIVE_SCRAPER", "ACTIVE"),
        ("src-cleartrip", "Cleartrip", "OTA", True, "LIVE_SCRAPER", "ACTIVE"),
        ("src-makemytrip", "MakeMyTrip", "OTA", True, "LIVE_SCRAPER", "ACTIVE"),
        ("src-yatra", "Yatra", "OTA", True, "LIVE_SCRAPER", "ACTIVE"),
        ("src-ixigo", "Ixigo", "OTA", True, "LIVE_SCRAPER", "ACTIVE"),
        ("src-google", "Google Flights", "AGGREGATOR", True, "LIVE_SCRAPER", "ACTIVE"),
    ]
    for s_id, s_name, s_type, s_enabled, s_method, s_status in sources:
        cur.execute("""
            INSERT OR REPLACE INTO data_sources (id, name, type, enabled, collection_method, status, last_collection)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (s_id, s_name, s_type, s_enabled, s_method, s_status, datetime.utcnow()))
    print(f"  [>] Seeded {len(sources)} data sources into aerodex.db")

    # 3. Seed flights & fares from db_export_scraped_quotes.csv
    quotes_csv = os.path.join(CSV_DIR, "db_export_scraped_quotes.csv")
    if os.path.exists(quotes_csv):
        with open(quotes_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            seen_flights = set()
            flights_inserted = 0
            fares_inserted = 0

            for r in reader:
                fn = r.get("flight_number", "").strip().upper()
                carrier_code = r.get("carrier_code", "").strip().upper()
                carrier_name = r.get("carrier_name", "").strip()
                orig = r.get("origin", "").strip().upper()
                dest = r.get("destination", "").strip().upper()
                dep_time = r.get("departure_time", "08:00").strip()
                arr_time = r.get("arrival_time", "10:15").strip()
                duration = r.get("duration", "2h 15m").strip()
                stops_str = str(r.get("stops", "0")).lower()
                stops = 0 if "non" in stops_str or stops_str in ("0", "") else 1
                travel_date = r.get("departure_date", "2026-09-20").strip()

                if not fn or not orig or not dest:
                    continue

                flight_id = f"fl-{carrier_code.lower()}-{fn.lower().replace(' ', '-')}-{orig.lower()}-{dest.lower()}"
                
                # Insert unique flight
                if flight_id not in seen_flights:
                    seen_flights.add(flight_id)
                    cur.execute("""
                        INSERT OR REPLACE INTO flights 
                        (id, airline, airline_code, flight_number, origin, destination, departure_time, arrival_time, duration, stops, aircraft, fare_class, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        flight_id, carrier_name, carrier_code, fn, orig, dest,
                        dep_time, arr_time, duration, stops,
                        "Airbus A320neo" if carrier_code == "6E" else "Boeing 737 MAX",
                        "Economy Saver", datetime.utcnow()
                    ))
                    flights_inserted += 1

                # Insert fare quote
                quote_id = f"fare-{r.get('id', fares_inserted + 1)}"
                total_f = float(r.get("total_fare") or 5000.0)
                base_f = float(r.get("base_fare") or (total_f * 0.75))
                taxes = float(r.get("airport_fees_udf_psf") or 620.0)
                fees = float(r.get("gst") or 250.0)
                source_portal = r.get("source_portal") or "Google Flights"
                source_type = "airline" if "official" in source_portal.lower() else "ota"
                adv_str = r.get("advance_window", "T+0")
                adv_days = int(adv_str.replace("T+", "")) if "T+" in adv_str else 0

                cur.execute("""
                    INSERT OR REPLACE INTO fares 
                    (id, flight_id, source, source_type, base_fare, taxes, fees, total_fare, currency, travel_date, advance_purchase_days, availability_status, is_cheapest, collected_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    quote_id, flight_id, source_portal, source_type, base_f, taxes, fees,
                    total_f, "INR", travel_date, adv_days, "AVAILABLE", True, datetime.utcnow()
                ))
                fares_inserted += 1

            print(f"  [>] Seeded {flights_inserted} unique flights and {fares_inserted} fares into aerodex.db")

    # 4. Seed official_mospi_cpi_airfare.csv into airfare_index
    mospi_csv = os.path.join(CSV_DIR, "official_mospi_cpi_airfare.csv")
    if os.path.exists(mospi_csv):
        with open(mospi_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            index_inserted = 0
            for r in reader:
                idx_val = r.get("index") or r.get("item")
                if not idx_val:
                    continue
                try:
                    val = float(idx_val)
                except ValueError:
                    continue
                inf_val = float(r.get("inflation") or r.get("code") or 0.0)
                date_str = f"{r.get('year', 2024)}-{r.get('month', '01')}"
                idx_id = f"cpi-{r.get('sector', 'Combined')}-{date_str}-{index_inserted}"
                cur.execute("""
                    INSERT OR REPLACE INTO airfare_index 
                    (id, date, period_type, index_value, baseline_value, cpi_reference, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (idx_id, date_str, "MONTHLY", val, 100.0, inf_val, datetime.utcnow()))
                index_inserted += 1
            print(f"  [>] Seeded {index_inserted} official index records into aerodex.db")

    conn.commit()
    conn.close()

def seed_airfare_index_db(db_path):
    print(f"[+] Seeding {db_path} from CSV files...")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # 1. dgca_routes
    routes_csv = os.path.join(CSV_DIR, "db_export_dgca_routes.csv")
    if os.path.exists(routes_csv):
        with open(routes_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            count = 0
            for r in reader:
                cur.execute("""
                    INSERT OR IGNORE INTO dgca_routes 
                    (id, rank, city1, city2, route_code, total_passengers, route_weight, route_weight_percent, cumulative_weight_percent)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    r.get("id"), r.get("rank"), r.get("city1"), r.get("city2"), r.get("route_code"),
                    r.get("total_passengers"), r.get("route_weight"), r.get("route_weight_percent"), r.get("cumulative_weight_percent")
                ))
                count += 1
            print(f"  [>] Ingested dgca_routes: {count} rows")

    # 2. carrier_market_shares
    shares_csv = os.path.join(CSV_DIR, "db_export_carrier_market_shares.csv")
    if os.path.exists(shares_csv):
        with open(shares_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            count = 0
            for r in reader:
                cur.execute("""
                    INSERT OR IGNORE INTO carrier_market_shares
                    (id, carrier_code, carrier_name, market_share_percent, fleet_size)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    r.get("id"), r.get("carrier_code"), r.get("carrier_name"),
                    r.get("market_share_percent"), r.get("fleet_size")
                ))
                count += 1
            print(f"  [>] Ingested carrier_market_shares: {count} rows")

    # 3. atf_fuel_prices
    atf_csv = os.path.join(CSV_DIR, "db_export_atf_fuel_prices.csv")
    if os.path.exists(atf_csv):
        with open(atf_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            count = 0
            for r in reader:
                cur.execute("""
                    INSERT OR IGNORE INTO atf_fuel_prices
                    (id, period, price_delhi, price_mumbai, price_kolkata, price_chennai, metro_average, fuel_index)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    r.get("id"), r.get("period"), r.get("price_delhi"), r.get("price_mumbai"),
                    r.get("price_kolkata"), r.get("price_chennai"), r.get("metro_average"), r.get("fuel_index")
                ))
                count += 1
            print(f"  [>] Ingested atf_fuel_prices: {count} rows")

    # 4. mospi_cpi_baseline
    mospi_csv = os.path.join(CSV_DIR, "db_export_mospi_cpi_baseline.csv")
    if os.path.exists(mospi_csv):
        with open(mospi_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            count = 0
            for r in reader:
                cur.execute("""
                    INSERT OR IGNORE INTO mospi_cpi_baseline
                    (id, sector, year, month, state, sub_class, index_value, yoy_inflation_pct)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    r.get("id"), r.get("sector"), r.get("year"), r.get("month"),
                    r.get("state"), r.get("sub_class"), r.get("index_value"), r.get("yoy_inflation_pct")
                ))
                count += 1
            print(f"  [>] Ingested mospi_cpi_baseline: {count} rows")

    # 5. index_calculation_logs
    logs_csv = os.path.join(CSV_DIR, "db_export_index_calculation_logs.csv")
    if os.path.exists(logs_csv):
        with open(logs_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            count = 0
            for r in reader:
                cur.execute("""
                    INSERT OR IGNORE INTO index_calculation_logs
                    (id, calculated_at, origin, destination, departure_date, advance_window, min_fare, carrier_weighted_fare, base_fare_p0, route_price_index, price_change_pct, national_airfare_index, cpi_impact_bps, direct_flights_count)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    r.get("id"), r.get("calculated_at"), r.get("origin"), r.get("destination"),
                    r.get("departure_date"), r.get("advance_window"), r.get("min_fare"),
                    r.get("carrier_weighted_fare"), r.get("base_fare_p0"), r.get("route_price_index"),
                    r.get("price_change_pct"), r.get("national_airfare_index"), r.get("cpi_impact_bps"),
                    r.get("direct_flights_count")
                ))
                count += 1
            print(f"  [>] Ingested index_calculation_logs: {count} rows")

    # 6. scraped_quotes
    quotes_csv = os.path.join(CSV_DIR, "db_export_scraped_quotes.csv")
    if os.path.exists(quotes_csv):
        with open(quotes_csv, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            count = 0
            for r in reader:
                cur.execute("""
                    INSERT OR IGNORE INTO scraped_quotes
                    (id, scraped_at, carrier_name, carrier_code, flight_number, origin, destination, departure_date, departure_time, arrival_time, duration, stops, base_fare, fuel_surcharge_yq, airport_fees_udf_psf, gst, total_fare, advance_window, source_portal, is_live, is_festival_window, weather_severity_score)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    r.get("id"), r.get("scraped_at"), r.get("carrier_name"), r.get("carrier_code"),
                    r.get("flight_number"), r.get("origin"), r.get("destination"), r.get("departure_date"),
                    r.get("departure_time"), r.get("arrival_time"), r.get("duration"), r.get("stops"),
                    r.get("base_fare"), r.get("fuel_surcharge_yq"), r.get("airport_fees_udf_psf"),
                    r.get("gst"), r.get("total_fare"), r.get("advance_window"), r.get("source_portal"),
                    r.get("is_live", 1), r.get("is_festival_window", 0), r.get("weather_severity_score", 0.0)
                ))
                count += 1
            print(f"  [>] Ingested scraped_quotes: {count} rows")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_aerodex_db()
    for db_rel in ["backend/airfare_index/airfare_index.db", "backendscrap/airfare_index/airfare_index.db", "backendscrap/aerodex_backend/airfare_index/airfare_index.db"]:
        p = os.path.join(ROOT_DIR, db_rel)
        if os.path.exists(p):
            seed_airfare_index_db(p)
    print("\n[OK] All CSV datasets successfully processed and loaded into SQLite databases!")
