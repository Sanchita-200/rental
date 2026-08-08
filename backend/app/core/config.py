from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "RentFlow"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "rentflow-hackathon-super-secret-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    DATABASE_URL: str = "postgresql://postgres:KritiSreyash%40123@db.lhzjfkvxgfyengxcwhsl.supabase.co:5432/postgres"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]
    
    # AI & Cloudinary Credentials (Optional / Fallback Ready)
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
