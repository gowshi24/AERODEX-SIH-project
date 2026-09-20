import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AERODEX Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./aerodex.db")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
