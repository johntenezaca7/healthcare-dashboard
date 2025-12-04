"""
Patient endpoints
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
import logging

from .... import schemas
from ....core.database import get_db
from ....core.security import get_current_user, User
from ....core.permissions import require_clinical_staff_or_admin
from ....services.patients import (
    get_paginated_patients,
    get_patient_by_id,
    create_patient,
    update_patient_personal_info,
    update_patient_emergency_contact,
    update_patient_insurance_info,
    update_patient_medical_info,
    update_patient_medications,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=schemas.Patient, response_model_by_alias=True, status_code=201)
async def create_patient_endpoint(
    patient_data: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
):
    """
    Create a new patient with all information
    
    Access:
    - Clinical Staff: Can create patients
    - Admin: Can create patients
    - System Admin: Full access
    """
    return create_patient(db=db, patient_data=patient_data)


@router.get("", response_model=schemas.PaginatedPatients, response_model_by_alias=True)
async def get_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
    # Pagination
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    # Search
    search: Optional[str] = Query(None, description="Search across name, email, phone"),
    # Filters
    status: Optional[str] = Query(None, description="Filter by status: active, inactive, critical"),
    blood_type: Optional[str] = Query(None, description="Filter by blood type: A+, A-, B+, B-, AB+, AB-, O+, O-"),
    city: Optional[str] = Query(None, description="Filter by city"),
    state: Optional[str] = Query(None, description="Filter by state"),
    insurance_provider: Optional[List[str]] = Query(None, description="Filter by insurance provider (can specify multiple)"),
    allergies: Optional[str] = Query(None, description="Filter by allergy"),
    current_medications: Optional[List[str]] = Query(None, description="Filter by current medication name (can specify multiple)"),
    conditions: Optional[List[str]] = Query(None, description="Filter by condition (can specify multiple)"),
    last_visit: Optional[str] = Query(None, description="Filter by last visit: last_week, last_month, last_3_months, last_6_months, last_year, over_year"),
    # Sorting
    sort_by: Optional[str] = Query(
        "createdAt",
        description="Sort by field: firstName, lastName, dateOfBirth, createdAt, status, insuranceProvider"
    ),
    sort_order: Optional[str] = Query("desc", regex="^(asc|desc)$", description="Sort order: asc or desc"),
):
    """
    Get paginated patients with search, filter, and sort capabilities
    
    - **search**: Search across patient name, email, and phone
    - **status**: Filter by patient status (active, inactive, critical)
    - **blood_type**: Filter by blood type
    - **city/state**: Filter by location
    - **insurance_provider**: Filter by insurance provider
    - **sort_by**: Field to sort by (default: createdAt)
    - **sort_order**: Sort direction - asc or desc (default: desc)
    """
    # Debug logging
    logger.info(f"[DEBUG] Page: {page}, page_size: {page_size}, search: {search}, status: {status}, sort_by: {sort_by}")
    
    # Get paginated patients using service
    result = get_paginated_patients(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        blood_type=blood_type,
        city=city,
        state=state,
        insurance_provider=insurance_provider,
        allergies=allergies,
        current_medications=current_medications,
        conditions=conditions,
        last_visit=last_visit,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    
    logger.info(f"[DEBUG] Total patients: {result.total}, Retrieved: {len(result.items)}, Total pages: {result.totalPages}")
    
    return result


@router.get("/{patient_id}", response_model=schemas.Patient, response_model_by_alias=True)
async def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
):
    """
    Get a single patient by ID with full details
    
    Access:
    - Clinical Staff: Full access to all patient data
    - Admin: Limited access (demographics, insurance, no deep clinical details)
    - System Admin: Full access
    """
    from ....core.permissions import is_admin
    
    # Admin users get limited patient data (no deep clinical details)
    # This would be handled in the service layer if needed
    # For now, all authenticated users can view full patient details
    # TODO: Implement limited view for admin users
    return get_patient_by_id(db=db, patient_id=patient_id)


@router.patch("/{patient_id}/personal-info", response_model=schemas.Patient, response_model_by_alias=True)
async def update_patient_personal_info_endpoint(
    patient_id: str,
    update_data: schemas.PersonalInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
):
    """
    Update patient personal information (partial update)
    
    Access:
    - Clinical Staff: Can update personal info
    - Admin: Can update personal info (demographics)
    - System Admin: Full access
    """
    return update_patient_personal_info(db=db, patient_id=patient_id, update_data=update_data)


@router.patch("/{patient_id}/emergency-contact", response_model=schemas.Patient, response_model_by_alias=True)
async def update_patient_emergency_contact_endpoint(
    patient_id: str,
    update_data: schemas.EmergencyContactUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
):
    """
    Update patient emergency contact information (partial update)
    
    Access:
    - Clinical Staff: Can update emergency contact
    - Admin: Can update emergency contact
    - System Admin: Full access
    """
    return update_patient_emergency_contact(db=db, patient_id=patient_id, update_data=update_data)


@router.patch("/{patient_id}/insurance", response_model=schemas.Patient, response_model_by_alias=True)
async def update_patient_insurance_endpoint(
    patient_id: str,
    update_data: schemas.InsuranceInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
):
    """
    Update patient insurance information (partial update)
    
    Access:
    - Clinical Staff: Can update insurance info
    - Admin: Can update insurance info
    - System Admin: Full access
    """
    return update_patient_insurance_info(db=db, patient_id=patient_id, update_data=update_data)


@router.patch("/{patient_id}/medical-info", response_model=schemas.Patient, response_model_by_alias=True)
async def update_patient_medical_info_endpoint(
    patient_id: str,
    update_data: schemas.MedicalInfoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
):
    """
    Update patient medical information (partial update)
    
    Access:
    - Clinical Staff: Can update medical info
    - Admin: Can update medical info
    - System Admin: Full access
    """
    return update_patient_medical_info(db=db, patient_id=patient_id, update_data=update_data)


@router.patch("/{patient_id}/medications", response_model=schemas.Patient, response_model_by_alias=True)
async def update_patient_medications_endpoint(
    patient_id: str,
    update_data: schemas.MedicationsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_clinical_staff_or_admin()),
):
    """
    Update patient medications (replace all medications)
    
    Access:
    - Clinical Staff: Can update medications
    - Admin: Can update medications
    - System Admin: Full access
    """
    return update_patient_medications(db=db, patient_id=patient_id, update_data=update_data)

