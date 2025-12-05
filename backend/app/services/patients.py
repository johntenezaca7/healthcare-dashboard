"""
Patient service - Business logic for patient operations
"""
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func as sql_func, cast
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.exc import IntegrityError
from typing import Optional, List
from datetime import date, timedelta, datetime
import math

from .. import models, schemas
from ..core.config import settings
from fastapi import HTTPException


def convert_patient_to_schema(patient: models.Patient) -> schemas.Patient:
    """Convert database patient model to Pydantic schema"""
    # Build address
    address = schemas.Address(
        street=patient.address_street,
        city=patient.address_city,
        state=patient.address_state,
        zipCode=patient.address_zip_code,
        country=patient.address_country or "USA"
    )
    
    # Build emergency contact
    emergency_contact = schemas.EmergencyContact(
        name=patient.emergency_contact_name,
        relationship=patient.emergency_contact_relationship,
        phone=patient.emergency_contact_phone,
        email=patient.emergency_contact_email or None
    )
    
    # Build medications
    medications = [
        schemas.Medication(
            id=med.id,
            name=med.name,
            dosage=med.dosage,
            frequency=med.frequency,
            prescribedBy=med.prescribed_by,
            startDate=med.start_date.isoformat() if med.start_date else "",
            endDate=med.end_date.isoformat() if med.end_date else None,
            isActive=med.is_active
        )
        for med in patient.medications if med.is_active
    ]
    
    # Build medical info
    medical_info = schemas.MedicalInfo(
        allergies=patient.allergies or [],
        currentMedications=medications,
        conditions=patient.conditions or [],
        bloodType=patient.blood_type,
        lastVisit=patient.last_visit.isoformat() if patient.last_visit else None,
        status=patient.status or "active"
    )
    
    # Build insurance
    insurance = schemas.InsuranceInfo(
        provider=patient.insurance_provider,
        policyNumber=patient.insurance_policy_number,
        groupNumber=patient.insurance_group_number,
        effectiveDate=patient.insurance_effective_date.isoformat() if patient.insurance_effective_date else "",
        expirationDate=patient.insurance_expiration_date.isoformat() if patient.insurance_expiration_date else None,
        copay=patient.insurance_copay,
        deductible=patient.insurance_deductible
    )
    
    # Build documents
    documents = [
        schemas.Document(
            id=doc.id,
            type=doc.type,
            name=doc.name,
            uploadDate=doc.upload_date.isoformat() if doc.upload_date else "",
            fileSize=doc.file_size,
            mimeType=doc.mime_type,
            url=doc.url
        )
        for doc in patient.documents
    ]
    
    return schemas.Patient(
        id=patient.id,
        firstName=patient.first_name,
        lastName=patient.last_name,
        dateOfBirth=patient.date_of_birth.isoformat() if patient.date_of_birth else "",
        email=patient.email,
        phone=patient.phone,
        address=address,
        emergencyContact=emergency_contact,
        medicalInfo=medical_info,
        insurance=insurance,
        documents=documents,
        createdAt=patient.created_at.isoformat() if patient.created_at else "",
        updatedAt=patient.updated_at.isoformat() if patient.updated_at else ""
    )


def get_paginated_patients(
    db: Session,
    page: int = 1,
    page_size: int = None,
    search: Optional[str] = None,
    status: Optional[str] = None,
    blood_type: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    insurance_provider: Optional[List[str]] = None,
    allergies: Optional[str] = None,
    current_medications: Optional[List[str]] = None,
    conditions: Optional[List[str]] = None,
    last_visit: Optional[str] = None,
    sort_by: str = "createdAt",
    sort_order: str = "desc",
) -> schemas.PaginatedPatients:
    """
    Get paginated patients from database with search, filter, and sort
    
    Args:
        db: Database session
        page: Page number (1-indexed)
        page_size: Number of items per page
        search: Search term (searches name, email, phone)
        status: Filter by status (active, inactive, critical)
        blood_type: Filter by blood type
        city: Filter by city
        state: Filter by state
        insurance_provider: Filter by insurance provider
        sort_by: Field to sort by (firstName, lastName, dateOfBirth, createdAt, status)
        sort_order: Sort direction (asc, desc)
        
    Returns:
        PaginatedPatients schema with patients and pagination metadata
    """
    if page_size is None:
        page_size = settings.DEFAULT_PAGE_SIZE
    
    # Start with base query
    query = db.query(models.Patient)
    
    # Apply search filter
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            or_(
                models.Patient.first_name.ilike(search_term),
                models.Patient.last_name.ilike(search_term),
                models.Patient.email.ilike(search_term),
                models.Patient.phone.ilike(search_term),
                # Search in full name (concatenated)
                (models.Patient.first_name + " " + models.Patient.last_name).ilike(search_term)
            )
        )
    
    # Apply filters
    filters = []
    if status:
        filters.append(models.Patient.status == status)
    if blood_type:
        filters.append(models.Patient.blood_type == blood_type)
    if city:
        filters.append(models.Patient.address_city.ilike(f"%{city}%"))
    if state:
        filters.append(models.Patient.address_state.ilike(f"%{state}%"))
    
    # Filter by insurance provider (can be multiple)
    if insurance_provider:
        if len(insurance_provider) == 1:
            filters.append(models.Patient.insurance_provider.ilike(f"%{insurance_provider[0]}%"))
        else:
            # Multiple insurance providers - use OR condition
            insurance_filters = [
                models.Patient.insurance_provider.ilike(f"%{provider}%")
                for provider in insurance_provider
            ]
            filters.append(or_(*insurance_filters))
    
    # Filter by allergies (JSONB array contains)
    # PostgreSQL: use JSONB containment operator @>
    if allergies:
        # Check if allergy string exists in the JSONB array
        filters.append(
            models.Patient.allergies.op("@>")(cast(f'["{allergies}"]', JSONB))
        )
    
    # Filter by conditions (JSONB array contains - can be multiple)
    if conditions:
        if len(conditions) == 1:
            filters.append(
                models.Patient.conditions.op("@>")(cast(f'["{conditions[0]}"]', JSONB))
            )
        else:
            # Multiple conditions - use OR condition
            condition_filters = [
                models.Patient.conditions.op("@>")(cast(f'["{condition}"]', JSONB))
                for condition in conditions
            ]
            filters.append(or_(*condition_filters))
    
    # Filter by current medications (check active medications - can be multiple)
    # Use distinct to avoid duplicates when joining with medications
    if current_medications:
        if len(current_medications) == 1:
            query = query.join(models.Medication).filter(
                and_(
                    models.Medication.name.ilike(f"%{current_medications[0]}%"),
                    models.Medication.is_active == True
                )
            ).distinct()
        else:
            # Multiple medications - use OR condition
            medication_filters = [
                and_(
                    models.Medication.name.ilike(f"%{med}%"),
                    models.Medication.is_active == True
                )
                for med in current_medications
            ]
            query = query.join(models.Medication).filter(or_(*medication_filters)).distinct()
    
    # Filter by last visit date range
    if last_visit:
        today = date.today()
        if last_visit == 'last_week':
            filters.append(models.Patient.last_visit >= today - timedelta(days=7))
        elif last_visit == 'last_month':
            filters.append(models.Patient.last_visit >= today - timedelta(days=30))
        elif last_visit == 'last_3_months':
            filters.append(models.Patient.last_visit >= today - timedelta(days=90))
        elif last_visit == 'last_6_months':
            filters.append(models.Patient.last_visit >= today - timedelta(days=180))
        elif last_visit == 'last_year':
            filters.append(models.Patient.last_visit >= today - timedelta(days=365))
        elif last_visit == 'over_year':
            filters.append(models.Patient.last_visit < today - timedelta(days=365))
    
    # Apply all filters at once
    if filters:
        query = query.filter(and_(*filters))
    
    if filters:
        query = query.filter(and_(*filters))
    
    # Get total count (before pagination)
    total = query.count()
    
    # Apply sorting
    sort_mapping = {
        "firstName": models.Patient.first_name,
        "lastName": models.Patient.last_name,
        "dateOfBirth": models.Patient.date_of_birth,
        "createdAt": models.Patient.created_at,
        "status": models.Patient.status,
        "insuranceProvider": models.Patient.insurance_provider,
    }
    
    sort_field = sort_mapping.get(sort_by, models.Patient.created_at)
    if sort_order == "desc":
        query = query.order_by(sort_field.desc())
    else:
        query = query.order_by(sort_field.asc())
    
    # Apply pagination
    offset = (page - 1) * page_size
    patients_query = query.offset(offset).limit(page_size).all()
    
    # Convert to simplified list item schemas (only fields needed for table)
    patients = [
        schemas.PatientListItem(
            id=patient.id,
            first_name=patient.first_name,
            last_name=patient.last_name,
            date_of_birth=patient.date_of_birth.isoformat() if patient.date_of_birth else "",
            email=patient.email,
            phone=patient.phone,
            status=patient.status or "active",
            last_visit=patient.last_visit.isoformat() if patient.last_visit else None,
            blood_type=patient.blood_type,
            insurance_provider=patient.insurance_provider,
        )
        for patient in patients_query
    ]
    
    # Calculate total pages
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    
    return schemas.PaginatedPatients(
        items=patients,
        total=total,
        page=page,
        pageSize=page_size,
        totalPages=total_pages
    )


def get_patient_by_id(db: Session, patient_id: str) -> schemas.Patient:
    """Get a single patient by ID"""
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return convert_patient_to_schema(patient)


def update_patient_personal_info(
    db: Session,
    patient_id: str,
    update_data: schemas.PersonalInfoUpdate
) -> schemas.Patient:
    """Update patient personal information (partial update)"""
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Update fields if provided
    update_dict = update_data.model_dump(exclude_unset=True, by_alias=True)
    
    # Conflict detection: Check if patient was modified since last fetch
    if "ifUnmodifiedSince" in update_dict and update_dict["ifUnmodifiedSince"]:
        try:
            client_timestamp = datetime.fromisoformat(update_dict["ifUnmodifiedSince"].replace("Z", "+00:00"))
            # Compare timestamps (accounting for timezone)
            if patient.updated_at and patient.updated_at.replace(tzinfo=None) > client_timestamp.replace(tzinfo=None):
                raise HTTPException(
                    status_code=409,
                    detail="Patient was modified by another user. Please refresh and try again."
                )
        except (ValueError, TypeError):
            # Invalid timestamp format - ignore and proceed (backward compatibility)
            pass
    
    # Check for email conflicts before updating
    if "email" in update_dict:
        new_email = update_dict["email"]
        # Check if email already exists for a different patient
        existing_patient = db.query(models.Patient).filter(
            models.Patient.email == new_email,
            models.Patient.id != patient_id
        ).first()
        
        if existing_patient:
            raise HTTPException(
                status_code=409,
                detail=f"Patient with email '{new_email}' already exists"
            )
    
    if "first_name" in update_dict:
        patient.first_name = update_dict["first_name"]
    if "last_name" in update_dict:
        patient.last_name = update_dict["last_name"]
    if "date_of_birth" in update_dict:
        # Convert string to date
        patient.date_of_birth = datetime.strptime(update_dict["date_of_birth"], "%Y-%m-%d").date()
    if "email" in update_dict:
        patient.email = update_dict["email"]
    if "phone" in update_dict:
        patient.phone = update_dict["phone"]
    if "blood_type" in update_dict:
        patient.blood_type = update_dict["blood_type"]
    
    # Update address if provided
    if "address" in update_dict:
        address = update_dict["address"]
        # Handle both dict (from JSON) and Address object
        if isinstance(address, dict):
            if "street" in address:
                patient.address_street = address["street"]
            if "city" in address:
                patient.address_city = address["city"]
            if "state" in address:
                patient.address_state = address["state"]
            if "zip_code" in address:
                patient.address_zip_code = address["zip_code"]
            if "zipCode" in address:
                patient.address_zip_code = address["zipCode"]
            if "country" in address:
                patient.address_country = address["country"]
        elif hasattr(address, 'street'):
            # Address is a Pydantic model
            patient.address_street = address.street
            patient.address_city = address.city
            patient.address_state = address.state
            patient.address_zip_code = address.zipCode if hasattr(address, 'zipCode') else address.zip_code
            patient.address_country = address.country
    
    # Update updated_at timestamp
    patient.updated_at = datetime.utcnow()
    
    # Commit changes with error handling for race conditions
    try:
        db.commit()
        db.refresh(patient)
    except IntegrityError as e:
        db.rollback()
        # Handle unique constraint violation (race condition scenario)
        if "unique_patient_email" in str(e.orig) or "UNIQUE constraint failed" in str(e.orig):
            if "email" in update_dict:
                raise HTTPException(
                    status_code=409,
                    detail=f"Patient with email '{update_dict['email']}' already exists"
                )
        # Re-raise other integrity errors
        raise HTTPException(
            status_code=400,
            detail="Failed to update patient due to database constraint violation"
        )
    
    return convert_patient_to_schema(patient)


def update_patient_emergency_contact(
    db: Session,
    patient_id: str,
    update_data: schemas.EmergencyContactUpdate
) -> schemas.Patient:
    """Update patient emergency contact information (partial update)"""
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Update fields if provided
    update_dict = update_data.model_dump(exclude_unset=True)
    
    if "name" in update_dict:
        patient.emergency_contact_name = update_dict["name"]
    if "relationship" in update_dict:
        patient.emergency_contact_relationship = update_dict["relationship"]
    if "phone" in update_dict:
        patient.emergency_contact_phone = update_dict["phone"]
    if "email" in update_dict:
        patient.emergency_contact_email = update_dict["email"]
    
    # Update updated_at timestamp
    patient.updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(patient)
    
    return convert_patient_to_schema(patient)


def update_patient_insurance_info(
    db: Session,
    patient_id: str,
    update_data: schemas.InsuranceInfoUpdate
) -> schemas.Patient:
    """Update patient insurance information (partial update)"""
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Update fields if provided
    update_dict = update_data.model_dump(exclude_unset=True, by_alias=True)
    
    if "provider" in update_dict:
        patient.insurance_provider = update_dict["provider"]
    if "policy_number" in update_dict:
        patient.insurance_policy_number = update_dict["policy_number"]
    if "group_number" in update_dict:
        patient.insurance_group_number = update_dict["group_number"]
    if "effective_date" in update_dict:
        # Convert string to date
        patient.insurance_effective_date = datetime.strptime(update_dict["effective_date"], "%Y-%m-%d").date()
    if "expiration_date" in update_dict:
        if update_dict["expiration_date"]:
            patient.insurance_expiration_date = datetime.strptime(update_dict["expiration_date"], "%Y-%m-%d").date()
        else:
            patient.insurance_expiration_date = None
    if "copay" in update_dict:
        patient.insurance_copay = update_dict["copay"]
    if "deductible" in update_dict:
        patient.insurance_deductible = update_dict["deductible"]
    
    # Update updated_at timestamp
    patient.updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(patient)
    
    return convert_patient_to_schema(patient)


def update_patient_medical_info(
    db: Session,
    patient_id: str,
    update_data: schemas.MedicalInfoUpdate
) -> schemas.Patient:
    """Update patient medical information (partial update)"""
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Update fields if provided
    update_dict = update_data.model_dump(exclude_unset=True, by_alias=True)
    
    if "allergies" in update_dict:
        patient.allergies = update_dict["allergies"] if update_dict["allergies"] else []
    if "conditions" in update_dict:
        patient.conditions = update_dict["conditions"] if update_dict["conditions"] else []
    if "last_visit" in update_dict:
        if update_dict["last_visit"]:
            patient.last_visit = datetime.strptime(update_dict["last_visit"], "%Y-%m-%d").date()
        else:
            patient.last_visit = None
    
    # Update updated_at timestamp
    patient.updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(patient)
    
    return convert_patient_to_schema(patient)


def update_patient_medications(
    db: Session,
    patient_id: str,
    update_data: schemas.MedicationsUpdate
) -> schemas.Patient:
    """Update patient medications (replace all medications)"""
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Delete all existing medications for this patient
    db.query(models.Medication).filter(models.Medication.patient_id == patient_id).delete()
    
    # Create new medications
    for med_data in update_data.medications:
        med_dict = med_data.model_dump(exclude_unset=True, by_alias=True)
        
        new_medication = models.Medication(
            patient_id=patient_id,
            name=med_dict["name"],
            dosage=med_dict["dosage"],
            frequency=med_dict["frequency"],
            prescribed_by=med_dict["prescribed_by"],
            start_date=datetime.strptime(med_dict["start_date"], "%Y-%m-%d").date(),
            end_date=datetime.strptime(med_dict["end_date"], "%Y-%m-%d").date() if med_dict.get("end_date") else None,
            is_active=True,  # All medications in the update are active
        )
        db.add(new_medication)
    
    # Update updated_at timestamp
    patient.updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(patient)
    
    return convert_patient_to_schema(patient)



def create_patient(
    db: Session,
    patient_data: schemas.PatientCreate
) -> schemas.Patient:
    """Create a new patient with all related data"""
    
    # Check for existing patient with same email to provide better error message
    existing_patient = db.query(models.Patient).filter(
        models.Patient.email == patient_data.email
    ).first()
    
    if existing_patient:
        raise HTTPException(
            status_code=409,
            detail=f"Patient with email '{patient_data.email}' already exists"
        )
    
    # Convert patient data to dict using by_alias=False to get camelCase field names
    # (by_alias=True would give us snake_case alias names)
    patient_dict = patient_data.model_dump(exclude_unset=True, by_alias=False)
    
    # Parse date of birth
    dob = datetime.strptime(patient_dict["dateOfBirth"], "%Y-%m-%d").date()
    
    try:
        # Create patient record
        new_patient = models.Patient(
            first_name=patient_dict["firstName"],
            last_name=patient_dict["lastName"],
            date_of_birth=dob,
            email=patient_dict["email"],
            phone=patient_dict["phone"],
            blood_type=patient_dict.get("bloodType"),
            # Address
            address_street=patient_dict["address"]["street"],
            address_city=patient_dict["address"]["city"],
            address_state=patient_dict["address"]["state"],
            address_zip_code=patient_dict["address"].get("zipCode", ""),
            address_country=patient_dict["address"].get("country", "USA"),
            # Emergency Contact
            emergency_contact_name=patient_dict["emergencyContact"]["name"],
            emergency_contact_relationship=patient_dict["emergencyContact"]["relationship"],
            emergency_contact_phone=patient_dict["emergencyContact"]["phone"],
            emergency_contact_email=patient_dict["emergencyContact"].get("email"),
            # Medical Info
            allergies=patient_dict.get("allergies", []),
            conditions=patient_dict.get("conditions", []),
            last_visit=datetime.strptime(patient_dict["lastVisit"], "%Y-%m-%d").date() if patient_dict.get("lastVisit") and patient_dict["lastVisit"] else None,
            status=patient_dict.get("status", "active"),
            # Insurance Info
            insurance_provider=patient_dict["insurance"]["provider"],
            insurance_policy_number=patient_dict["insurance"].get("policyNumber", ""),
            insurance_group_number=patient_dict["insurance"].get("groupNumber"),
            insurance_effective_date=datetime.strptime(patient_dict["insurance"].get("effectiveDate", ""), "%Y-%m-%d").date(),
            insurance_expiration_date=datetime.strptime(patient_dict["insurance"]["expirationDate"], "%Y-%m-%d").date() if patient_dict["insurance"].get("expirationDate") else None,
            insurance_copay=patient_dict["insurance"]["copay"],
            insurance_deductible=patient_dict["insurance"]["deductible"],
        )
        
        db.add(new_patient)
        db.flush()  # Get patient ID
        
        # Add medications if provided
        if patient_dict.get("medications"):
            for med_data in patient_dict["medications"]:
                medication = models.Medication(
                    patient_id=new_patient.id,
                    name=med_data["name"],
                    dosage=med_data["dosage"],
                    frequency=med_data["frequency"],
                    prescribed_by=med_data.get("prescribedBy", ""),
                    start_date=datetime.strptime(med_data.get("startDate", ""), "%Y-%m-%d").date(),
                    end_date=datetime.strptime(med_data["endDate"], "%Y-%m-%d").date() if med_data.get("endDate") else None,
                    is_active=True,
                )
                db.add(medication)
        
        # Commit all changes
        db.commit()
        db.refresh(new_patient)
        
        return convert_patient_to_schema(new_patient)
    
    except IntegrityError as e:
        db.rollback()
        # Handle unique constraint violation (race condition scenario)
        if "unique_patient_email" in str(e.orig) or "UNIQUE constraint failed" in str(e.orig):
            raise HTTPException(
                status_code=409,
                detail=f"Patient with email '{patient_data.email}' already exists"
            )
        # Re-raise other integrity errors
        raise HTTPException(
            status_code=400,
            detail="Failed to create patient due to database constraint violation"
        )
