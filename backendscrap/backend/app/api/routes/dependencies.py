from typing import Generator
from backend.app.core.database import get_db

def get_db_session() -> Generator:
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()
