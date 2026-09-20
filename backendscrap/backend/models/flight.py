from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class FlightModel(Base):
    __tablename__ = "flights"

    id = Column(String, primary_key=True, index=True)
    airline = Column(String, nullable=False)
    airline_code = Column(String, nullable=False)
    flight_number = Column(String, nullable=False, index=True)
    origin = Column(String, nullable=False, index=True)
    destination = Column(String, nullable=False, index=True)
    departure_time = Column(String, nullable=False)
    arrival_time = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    stops = Column(Integer, default=0)
    aircraft = Column(String, nullable=True)
    fare_class = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    fares = relationship("FareModel", back_populates="flight")
