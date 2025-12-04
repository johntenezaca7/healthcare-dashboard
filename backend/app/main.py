"""
Main FastAPI application
"""
import logging
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core.database import engine, SessionLocal
from . import models
from .api.v1.api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API router
# Using root prefix for backward compatibility with frontend
app.include_router(api_router, prefix="")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Healthcare Dashboard API"}


@app.on_event("startup")
async def startup_event():
    """Log database status on startup"""
    db = SessionLocal()
    try:
        patient_count = db.query(models.Patient).count()
        logger.info(f"Database contains {patient_count} patients.")
        if patient_count == 0:
            logger.info("Database is empty. To generate patients, run: docker-compose run --rm backend python -m app.generate_data")
    finally:
        db.close()
