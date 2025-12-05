from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from datetime import date, datetime

# Address Schema
class Address(BaseModel):
    street: str
    city: str
    state: str
    zipCode: str = Field(alias="zip_code")
    country: str = "USA"
    
    class Config:
        from_attributes = True
        populate_by_name = True

# Emergency Contact Schema
class EmergencyContact(BaseModel):
    name: str
    relationship: str
    phone: str
    email: Optional[str] = None
    
    class Config:
        from_attributes = True

# Medication Schema
class Medication(BaseModel):
    id: str
    name: str
    dosage: str
    frequency: str
    prescribedBy: str = Field(alias="prescribed_by")
    startDate: str = Field(alias="start_date")
    endDate: Optional[str] = Field(None, alias="end_date")
    isActive: bool = Field(alias="is_active")
    
    class Config:
        from_attributes = True
        populate_by_name = True

# Insurance Info Schema
class InsuranceInfo(BaseModel):
    provider: str
    policyNumber: str = Field(alias="policy_number")
    groupNumber: Optional[str] = Field(None, alias="group_number")
    effectiveDate: str = Field(alias="effective_date")
    expirationDate: Optional[str] = Field(None, alias="expiration_date")
    copay: float
    deductible: float
    
    class Config:
        from_attributes = True
        populate_by_name = True

# Document Schema
class Document(BaseModel):
    id: str
    type: Literal["medical_record", "insurance_card", "photo_id", "test_result", "other"]
    name: str
    uploadDate: str = Field(alias="upload_date")
    fileSize: int = Field(alias="file_size")
    mimeType: str = Field(alias="mime_type")
    url: str
    
    class Config:
        from_attributes = True
        populate_by_name = True

# Medical Info Schema
class MedicalInfo(BaseModel):
    allergies: List[str] = []
    currentMedications: List[Medication] = []
    conditions: List[str] = []
    bloodType: Optional[Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]] = None
    lastVisit: Optional[str] = Field(None, alias="last_visit")
    status: Literal["active", "inactive", "critical"] = "active"
    
    class Config:
        from_attributes = True
        populate_by_name = True

# Patient Schema
class Patient(BaseModel):
    id: str
    firstName: str = Field(alias="first_name")
    lastName: str = Field(alias="last_name")
    dateOfBirth: str = Field(alias="date_of_birth")
    email: str
    phone: str
    address: Address
    emergencyContact: EmergencyContact = Field(alias="emergency_contact")
    medicalInfo: MedicalInfo = Field(alias="medical_info")
    insurance: InsuranceInfo
    documents: List[Document] = []
    createdAt: str = Field(alias="created_at")
    updatedAt: str = Field(alias="updated_at")
    
    class Config:
        from_attributes = True
        populate_by_name = True

# Update schemas for partial updates
class PersonalInfoUpdate(BaseModel):
    firstName: Optional[str] = Field(None, alias="first_name")
    lastName: Optional[str] = Field(None, alias="last_name")
    dateOfBirth: Optional[str] = Field(None, alias="date_of_birth")
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    bloodType: Optional[Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]] = Field(None, alias="blood_type")
    address: Optional[Address] = None
    # Optional: timestamp for optimistic locking (conflict detection)
    ifUnmodifiedSince: Optional[str] = Field(None, description="ISO timestamp - update only if patient hasn't been modified since this time")
    
    class Config:
        populate_by_name = True

class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = None
    relationship: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    
    class Config:
        populate_by_name = True

class InsuranceInfoUpdate(BaseModel):
    provider: Optional[str] = None
    policyNumber: Optional[str] = Field(None, alias="policy_number")
    groupNumber: Optional[str] = Field(None, alias="group_number")
    effectiveDate: Optional[str] = Field(None, alias="effective_date")
    expirationDate: Optional[str] = Field(None, alias="expiration_date")
    copay: Optional[float] = None
    deductible: Optional[float] = None
    
    class Config:
        populate_by_name = True

class MedicalInfoUpdate(BaseModel):
    allergies: Optional[List[str]] = None
    conditions: Optional[List[str]] = None
    lastVisit: Optional[str] = Field(None, alias="last_visit")
    
    class Config:
        populate_by_name = True

class MedicationUpdate(BaseModel):
    id: Optional[str] = None  # If None, create new medication
    name: str
    dosage: str
    frequency: str
    prescribedBy: str = Field(alias="prescribed_by")
    startDate: str = Field(alias="start_date")
    endDate: Optional[str] = Field(None, alias="end_date")
    
    class Config:
        populate_by_name = True

class MedicationsUpdate(BaseModel):
    medications: List[MedicationUpdate]
    
    class Config:
        populate_by_name = True

# Patient Create Schema (for creating new patients)
class PatientCreate(BaseModel):
    # Personal Information
    firstName: str = Field(alias="first_name")
    lastName: str = Field(alias="last_name")
    dateOfBirth: str = Field(alias="date_of_birth")
    email: EmailStr
    phone: str
    bloodType: Optional[Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]] = Field(None, alias="blood_type")
    address: Address
    
    # Emergency Contact
    emergencyContact: EmergencyContact
    
    # Insurance Information
    insurance: InsuranceInfo
    
    # Medical Information
    allergies: Optional[List[str]] = []
    conditions: Optional[List[str]] = []
    lastVisit: Optional[str] = Field(None, alias="last_visit")
    status: Literal["active", "inactive", "critical"] = "active"
    
    # Medications (optional)
    medications: Optional[List[MedicationUpdate]] = []
    
    class Config:
        populate_by_name = True

# Patient List Item Schema (simplified for list view)
class PatientListItem(BaseModel):
    id: str
    firstName: str = Field(alias="first_name")
    lastName: str = Field(alias="last_name")
    dateOfBirth: str = Field(alias="date_of_birth")
    email: str
    phone: str
    status: Literal["active", "inactive", "critical"] = "active"
    lastVisit: Optional[str] = Field(None, alias="last_visit")
    bloodType: Optional[Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]] = Field(None, alias="blood_type")
    insuranceProvider: str = Field(alias="insurance_provider")
    
    class Config:
        from_attributes = True
        populate_by_name = True

# Pagination Schema
class PaginatedPatients(BaseModel):
    items: List[PatientListItem]
    total: int
    page: int
    pageSize: int = Field(alias="page_size")
    totalPages: int = Field(alias="total_pages")
    
    class Config:
        populate_by_name = True
