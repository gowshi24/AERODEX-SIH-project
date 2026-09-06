from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class FareModel(Base):
    __tablename__ = "fares"

    id = Column(String, primary_key=True, index=True)
    flight_id = Column(String, ForeignKey("flights.id"), nullable=False)
    source = Column(String, nullable=False, index=True)
    source_type = Column(String, nullable=False)
    base_fare = Column(Float, nullable=False)
    taxes = Column(Float, nullable=False)
    fees = Column(Float, nullable=False)
    total_fare = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    travel_date = Column(String, nullable=False)
    advance_purchase_days = Column(Integer, default=0)
    availability_status = Column(String, default="AVAILABLE")
    is_cheapest = Column(Boolean, default=False)
    collected_at = Column(DateTime, default=datetime.utcnow)

    flight = relationship("FlightModel", back_populates="fares")
