from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
from backend.app.core.database import Base

class AnomalyModel(Base):
    __tablename__ = "anomalies"

    id = Column(String, primary_key=True)
    route = Column(String, nullable=False, index=True)
    airline = Column(String, nullable=False)
    current_price = Column(Float, nullable=False)
    previous_price = Column(Float, nullable=False)
    percentage_change = Column(Float, nullable=False)
    severity = Column(String, nullable=False) # High, Medium, Low
    detected_date = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
