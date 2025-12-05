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
    # Default origins for local development
    _default_cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://web:5173",  # Docker service name
    ]
    
    # Parse CORS_ORIGINS from environment variable (comma-separated)
    # If set, it will replace the default origins
    _env_cors_origins: str = os.getenv("CORS_ORIGINS", "")
    
    if _env_cors_origins:
        # Parse comma-separated origins from environment variable
        CORS_ORIGINS: List[str] = [
            origin.strip() for origin in _env_cors_origins.split(",") if origin.strip()
        ]
    else:
        # Use default origins
        CORS_ORIGINS: List[str] = _default_cors_origins
    
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # Pagination Settings
    DEFAULT_PAGE_SIZE: int = 25
    MAX_PAGE_SIZE: int = 100

settings = Settings()

