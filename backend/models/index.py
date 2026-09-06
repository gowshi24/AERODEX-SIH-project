from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
from backend.app.core.database import Base

class IndexModel(Base):
    __tablename__ = "airfare_index"

    id = Column(String, primary_key=True)
    date = Column(String, nullable=False, index=True)
    period_type = Column(String, default="Monthly") # Daily, Weekly, Monthly
    index_value = Column(Float, nullable=False)
    baseline_value = Column(Float, default=100.0)
    cpi_reference = Column(Float, default=100.0)
    created_at = Column(DateTime, default=datetime.utcnow)
