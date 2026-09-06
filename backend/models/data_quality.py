from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
from backend.app.core.database import Base

class DataQualityModel(Base):
    __tablename__ = "data_quality_logs"

    id = Column(String, primary_key=True)
    date = Column(String, nullable=False, index=True)
    completeness = Column(Float, default=99.4)
    duplicate_rate = Column(Float, default=0.2)
    missing_values_rate = Column(Float, default=0.4)
    outlier_rate = Column(Float, default=0.8)
    source_availability = Column(Float, default=99.8)
    validation_success = Column(Float, default=99.9)
    created_at = Column(DateTime, default=datetime.utcnow)
