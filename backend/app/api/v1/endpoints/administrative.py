"""
Administrative endpoints - For admin/office staff
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ....core.database import get_db
from ....core.security import User
from ....core.permissions import require_admin

router = APIRouter()


@router.get("/demographics/{patient_id}")
async def get_patient_demographics(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin()),
):
    """
    Get patient demographics
    
    Access: Admin + System Admin only
    """
    # TODO: Implement demographics retrieval
    return {
        "patient_id": patient_id,
        "demographics": {},
        "message": "Demographics endpoint - requires admin access"
    }


@router.put("/demographics/{patient_id}")
async def update_patient_demographics(
    patient_id: str,
    demographics: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin()),
):
    """
    Update patient demographics
    
    Access: Admin + System Admin only
    """
    # TODO: Implement demographics update
    return {
        "patient_id": patient_id,
        "demographics": demographics,
        "updated_by": current_user.email,
        "message": "Demographics updated"
    }


@router.get("/insurance/{patient_id}")
async def get_insurance_info(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin()),
):
    """
    Get patient insurance information
    
    Access: Admin + System Admin only
    """
    # TODO: Implement insurance retrieval
    return {
        "patient_id": patient_id,
        "insurance": {},
        "message": "Insurance endpoint - requires admin access"
    }


@router.put("/insurance/{patient_id}")
async def update_insurance_info(
    patient_id: str,
    insurance: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin()),
):
    """
    Update patient insurance information
    
    Access: Admin + System Admin only
    """
    # TODO: Implement insurance update
    return {
        "patient_id": patient_id,
        "insurance": insurance,
        "updated_by": current_user.email,
        "message": "Insurance information updated"
    }


@router.get("/schedules")
async def get_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin()),
):
    """
    Get schedules/appointments
    
    Access: Admin + System Admin only
    """
    # TODO: Implement schedules retrieval
    return {
        "schedules": [],
        "message": "Schedules endpoint - requires admin access"
    }


@router.post("/documents/{patient_id}")
async def upload_administrative_document(
    patient_id: str,
    document: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin()),
):
    """
    Upload administrative document
    
    Access: Admin + System Admin only
    """
    # TODO: Implement document upload
    return {
        "patient_id": patient_id,
        "document": document,
        "uploaded_by": current_user.email,
        "message": "Administrative document uploaded"
    }

