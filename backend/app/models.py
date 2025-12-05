from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Text, Boolean, DateTime, JSON, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid
from enum import Enum

from .core.database import Base

class BloodType(str, Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"

class PatientStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    CRITICAL = "critical"

class DocumentType(str, Enum):
    MEDICAL_RECORD = "medical_record"
    INSURANCE_CARD = "insurance_card"
    PHOTO_ID = "photo_id"
    TEST_RESULT = "test_result"
    OTHER = "other"

class Patient(Base):
    __tablename__ = "patients"
    __table_args__ = (
        UniqueConstraint('email', name='unique_patient_email'),
    )
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=False)
    
    # Address as JSON (or could be separate table)
    address_street = Column(String, nullable=False)
    address_city = Column(String, nullable=False)
    address_state = Column(String, nullable=False)
    address_zip_code = Column(String, nullable=False)
    address_country = Column(String, default="USA")
    
    # Emergency Contact as JSON
    emergency_contact_name = Column(String, nullable=False)
    emergency_contact_relationship = Column(String, nullable=False)
    emergency_contact_phone = Column(String, nullable=False)
    emergency_contact_email = Column(String)
    
    # Medical Info as JSON
    allergies = Column(JSON, default=list)  # List of strings
    conditions = Column(JSON, default=list)  # List of strings
    blood_type = Column(String)
    last_visit = Column(Date)
    status = Column(String, default="active")
    
    # Insurance Info
    insurance_provider = Column(String, nullable=False)
    insurance_policy_number = Column(String, nullable=False)
    insurance_group_number = Column(String)
    insurance_effective_date = Column(Date, nullable=False)
    insurance_expiration_date = Column(Date)
    insurance_copay = Column(Float, nullable=False)
    insurance_deductible = Column(Float, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="patient", cascade="all, delete-orphan")

class Medication(Base):
    __tablename__ = "medications"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    
    name = Column(String, nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    prescribed_by = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    is_active = Column(Boolean, default=True)
    
    patient = relationship("Patient", back_populates="medications")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False)
    
    type = Column(String, nullable=False)  # medical_record, insurance_card, etc.
    name = Column(String, nullable=False)
    upload_date = Column(Date, nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    mime_type = Column(String, nullable=False)
    url = Column(String, nullable=False)
    
    patient = relationship("Patient", back_populates="documents")
