from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "AERODEX Backend"
    VERSION: str = "1.0.0"

    API_PREFIX: str = "/api"
    API_V1_STR: str = "/api"

    # Supabase PostgreSQL connection
    DATABASE_URL: str

    # SerpApi Google Flights Real-time API Key
    SERPAPI_KEY: Optional[str] = None
    SERPAPI_API_KEY: Optional[str] = None

    @property
    def serpapi_key(self) -> Optional[str]:
        return self.SERPAPI_KEY or self.SERPAPI_API_KEY

    LOG_LEVEL: str = "INFO"

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=(str(ENV_FILE), ".env"),
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()