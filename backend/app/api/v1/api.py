"""
API v1 router - Aggregates all v1 endpoints
"""
from fastapi import APIRouter

from .endpoints import auth, patients, health, clinical, administrative, system

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(clinical.router, prefix="/clinical", tags=["clinical"])
api_router.include_router(administrative.router, prefix="/administrative", tags=["administrative"])
api_router.include_router(system.router, prefix="/system", tags=["system"])

