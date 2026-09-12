import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Pharma Customer Complaint QMS"
    API_V1_STR: str = "/api"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    FALLBACK_GROQ_MODEL: str = "gemma2-9b-it"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./complaints.db")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
