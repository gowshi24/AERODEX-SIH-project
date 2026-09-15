from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings
import logging

logger = logging.getLogger("aerodex.database")

db_url = settings.DATABASE_URL
engine = None
SessionLocal = None

if not db_url or db_url.startswith("sqlite"):
    logger.warning("DATABASE_URL is not configured. Running in database-less / SerpAPI live mode.")
else:
    # Clean/fix password escaping if needed for standard SQLAlchemy PostgreSQL connection
    if "postgres:[Yeshwanth@123]" in db_url:
        db_url = db_url.replace("postgres:[Yeshwanth@123]", "postgres:Yeshwanth%40123")

    try:
        engine = create_engine(db_url, pool_pre_ping=True, pool_size=10, max_overflow=20)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    except Exception as e:
        logger.error(f"Failed to create SQLAlchemy engine for DATABASE_URL: {str(e)}")
        engine = None
        SessionLocal = None

Base = declarative_base()

def get_db():
    if not SessionLocal:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {str(e)}")
        yield None
    finally:
        db.close()
