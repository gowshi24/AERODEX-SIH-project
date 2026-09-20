from sqlalchemy import Column, String, Boolean, DateTime
from datetime import datetime
from backend.app.core.database import Base

class SourceModel(Base):
    __tablename__ = "data_sources"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    type = Column(String, nullable=False) # AIRLINE or OTA
    enabled = Column(Boolean, default=False)
    collection_method = Column(String, default="PERMITTED_WEB_OR_API")
    status = Column(String, default="DEMO_DATA") # DEMO_DATA or NOT_CONFIGURED
    last_collection = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)
