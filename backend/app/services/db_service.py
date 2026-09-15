import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

from backend.models.flight import FlightModel
from backend.models.fare import FareModel
try:
    from backend.scraper.models.fare_observation import FareObservation
except ImportError:
    from scraper.models.fare_observation import FareObservation

logger = logging.getLogger("aerodex.db_service")

class DBService:
    @staticmethod
    def save_fare_observations(db: Session, observations: List[FareObservation]) -> bool:
        """
        Store normalized fare observations into Supabase PostgreSQL via SQLAlchemy.
        """
        if not db or not observations:
            return False

        try:
            for obs in observations:
                flight_id = f"fl-{obs.origin.lower()}-{obs.destination.lower()}-{obs.flight_number.lower()}"
                airline_code = obs.flight_number.split("-")[0] if "-" in obs.flight_number else "6E"
                dep_time = obs.departure_datetime.split("T")[1][:5] if "T" in obs.departure_datetime else "08:00"
                arr_time = obs.arrival_datetime.split("T")[1][:5] if "T" in obs.arrival_datetime else "10:15"

                # Check if flight already exists or create
                flight = db.query(FlightModel).filter(FlightModel.id == flight_id).first()
                if not flight:
                    flight = FlightModel(
                        id=flight_id,
                        airline=obs.airline,
                        airline_code=airline_code,
                        flight_number=obs.flight_number,
                        origin=obs.origin.upper(),
                        destination=obs.destination.upper(),
                        departure_time=dep_time,
                        arrival_time=arr_time,
                        duration="2h 15m",
                        stops=0,
                        aircraft="Airbus A320neo",
                        fare_class=obs.fare_class or "Economy Saver",
                    )
                    db.add(flight)

                # Append new FareModel observation timestamped for historical trend analysis
                fare_id = f"fare-{obs.origin.lower()}-{obs.destination.lower()}-{obs.flight_number.lower()}-{int(datetime.now(timezone.utc).timestamp())}"
                fare_record = FareModel(
                    id=fare_id,
                    flight_id=flight_id,
                    source=obs.source,
                    source_type=obs.source_type,
                    base_fare=obs.base_fare,
                    taxes=obs.taxes,
                    fees=obs.fees,
                    total_fare=obs.total_fare,
                    currency=obs.currency,
                    travel_date=obs.travel_date,
                    advance_purchase_days=obs.advance_purchase_days,
                    availability_status=obs.availability_status,
                    is_cheapest=True,
                    collected_at=datetime.now(timezone.utc),
                )
                db.add(fare_record)

            db.commit()
            logger.info(f"[DBService] Persisted {len(observations)} fare observations into Supabase PostgreSQL.")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"[DBService] Exception while saving to Supabase PostgreSQL: {str(e)}")
            return False

    @staticmethod
    def get_cached_observations(
        db: Session,
        origin: str,
        destination: str,
        travel_date: str,
        max_age_minutes: int = 15
    ) -> List[FareModel]:
        """
        Query Supabase PostgreSQL for recent fare observations within max_age_minutes window.
        """
        if not db:
            return []

        try:
            cutoff = datetime.now(timezone.utc) - timedelta(minutes=max_age_minutes)
            fares = (
                db.query(FareModel)
                .join(FlightModel, FareModel.flight_id == FlightModel.id)
                .filter(
                    FlightModel.origin == origin.upper(),
                    FlightModel.destination == destination.upper(),
                    FareModel.travel_date == travel_date,
                    FareModel.collected_at >= cutoff
                )
                .order_by(FareModel.collected_at.desc())
                .all()
            )
            return fares
        except Exception as e:
            logger.error(f"[DBService] Exception querying database cache: {str(e)}")
            return []

    @staticmethod
    def get_historical_fares(
        db: Session,
        origin: Optional[str] = None,
        destination: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Retrieve stored historical fare observations from Supabase PostgreSQL.
        """
        if not db:
            return []

        try:
            query = db.query(FareModel).join(FlightModel, FareModel.flight_id == FlightModel.id)
            if origin:
                query = query.filter(FlightModel.origin == origin.upper())
            if destination:
                query = query.filter(FlightModel.destination == destination.upper())

            results = query.order_by(FareModel.collected_at.desc()).limit(limit).all()
            records = []
            for item in results:
                records.append({
                    "id": item.id,
                    "collectedAt": item.collected_at.isoformat() if item.collected_at else "",
                    "source": item.source,
                    "airline": item.flight.airline if item.flight else "Airline",
                    "flightNumber": item.flight.flight_number if item.flight else "FL-000",
                    "origin": item.flight.origin if item.flight else origin,
                    "destination": item.flight.destination if item.flight else destination,
                    "travelDate": item.travel_date,
                    "advanceWindow": item.advance_purchase_days,
                    "fareClass": item.availability_status,
                    "baseFare": item.base_fare or 0,
                    "taxes": item.taxes or 0,
                    "fees": item.fees or 0,
                    "totalFare": item.total_fare,
                    "status": "Validated"
                })
            return records
        except Exception as e:
            logger.error(f"[DBService] Exception fetching historical fares: {str(e)}")
            return []

db_service = DBService()
