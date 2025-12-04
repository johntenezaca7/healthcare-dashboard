"""
Application configuration
"""
import os
from typing import List

class Settings:
    """Application settings"""
    
    # API Settings
    API_TITLE: str = "Healthcare Dashboard API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "API for Healthcare Dashboard"
    
    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://web:5173",  # Docker service name
    ]
    
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Settings
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "healthcare.db")
    
    # Pagination Settings
    DEFAULT_PAGE_SIZE: int = 25
    MAX_PAGE_SIZE: int = 100

settings = Settings()

