from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class FareModel(Base):
    __tablename__ = "fares"

    id = Column(String, primary_key=True, index=True)
    flight_id = Column(String, ForeignKey("flights.id"), nullable=False)
    source = Column(String, nullable=False, index=True)
    source_type = Column(String, nullable=False)
    base_fare = Column(Float, nullable=True)
    taxes = Column(Float, nullable=True)
    fees = Column(Float, nullable=True)
    total_fare = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    travel_date = Column(String, nullable=False)
    advance_purchase_days = Column(Integer, default=0)
    availability_status = Column(String, default="AVAILABLE")
    is_cheapest = Column(Boolean, default=False)
    collected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    flight = relationship("FlightModel", back_populates="fares")

    @classmethod
    def from_observation(cls, obs, flight_id: str):
        return cls(
            id=obs.id or f"fare-{obs.source}-{flight_id}-{datetime.now(timezone.utc).timestamp()}",
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
        )

