import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "CLINICO 360"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-Powered Clinical Intelligence & Medication Safety Platform"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "clinico360-clinical-intelligence-safety-key-2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    # Database (Defaults to SQLite for instant local zero-dependency run, supports PostgreSQL/pgvector)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./clinico360.db")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # AI Providers (Optional external keys, graceful deterministic fallback)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Safety Disclaimer
    DISCLAIMER: str = (
        "CLINICO 360 is an educational clinical intelligence and medication safety platform. "
        "It does not provide autonomous medical diagnosis, prescribing, or treatment decisions. "
        "All patient management remains strictly under qualified medical supervision."
    )

    class Config:
        case_sensitive = True

settings = Settings()
