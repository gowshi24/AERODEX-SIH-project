from sqlalchemy import Column, String, Float, Boolean
from backend.app.core.database import Base

class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True)
    origin = Column(String, nullable=False, index=True)
    destination = Column(String, nullable=False, index=True)
    weight = Column(Float, default=0.1)
    active = Column(Boolean, default=True)
