"""
Script to generate 1500 sample patients for testing
Run with Docker: docker compose run --rm api python -m app.generate_data
Or: docker run --rm -v $(pwd)/healthcare.db:/app/healthcare.db <image> python -m app.generate_data
"""
import random
from datetime import date, timedelta
from faker import Faker
from sqlalchemy.orm import Session
import uuid

from .core.database import SessionLocal, engine, Base
from . import models

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

fake = Faker()

# Blood types
BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

# Patient statuses
STATUSES = ["active", "active", "active", "active", "inactive", "critical"]  # Weighted

# Common allergies
ALLERGIES_POOL = [
    "Peanuts", "Shellfish", "Dairy", "Eggs", "Soy", "Wheat", "Tree Nuts",
    "Fish", "Penicillin", "Latex", "Pollen", "Dust Mites", "Mold", "Pet Dander"
]

# Common conditions
CONDITIONS_POOL = [
    "Hypertension", "Type 2 Diabetes", "Asthma", "Arthritis", "High Cholesterol",
    "Anxiety", "Depression", "Migraine", "GERD", "Osteoporosis", "Sleep Apnea",
    "COPD", "Heart Disease", "Kidney Disease", "Liver Disease", "Thyroid Disorder"
]

# Common medications
MEDICATIONS_POOL = [
    ("Lisinopril", "10mg", "Once daily"),
    ("Metformin", "500mg", "Twice daily"),
    ("Atorvastatin", "20mg", "Once daily"),
    ("Amlodipine", "5mg", "Once daily"),
    ("Omeprazole", "20mg", "Once daily"),
    ("Metoprolol", "25mg", "Twice daily"),
    ("Losartan", "50mg", "Once daily"),
    ("Albuterol", "90mcg", "As needed"),
    ("Levothyroxine", "75mcg", "Once daily"),
    ("Gabapentin", "300mg", "Three times daily"),
    ("Sertraline", "50mg", "Once daily"),
    ("Ibuprofen", "200mg", "As needed"),
    ("Acetaminophen", "500mg", "As needed"),
]

# Insurance providers
INSURANCE_PROVIDERS = [
    "Blue Cross Blue Shield",
    "Aetna",
    "UnitedHealthcare",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
    "Medicaid",
    "Medicare"
]

# Relationship types
RELATIONSHIP_TYPES = [
    "Spouse", "Parent", "Child", "Sibling", "Friend", "Partner", "Other"
]

# Document types
DOCUMENT_TYPES = [
    "medical_record",
    "insurance_card",
    "photo_id",
    "test_result",
    "other"
]

# MIME types
MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword"
]


def generate_patient(db: Session, patient_number: int):
    """Generate a single patient with related data"""
    # Basic info
    first_name = fake.first_name()
    last_name = fake.last_name()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=90)
    email = f"{first_name.lower()}.{last_name.lower()}{patient_number}@example.com"
    phone = fake.phone_number()[:15]  # Limit length
    
    # Address
    street = fake.street_address()
    city = fake.city()
    state = fake.state_abbr()
    zip_code = fake.zipcode()
    
    # Emergency contact
    emergency_name = fake.name()
    emergency_relationship = random.choice(RELATIONSHIP_TYPES)
    emergency_phone = fake.phone_number()[:15]
    emergency_email = fake.email() if random.random() > 0.3 else None
    
    # Medical info
    num_allergies = random.randint(0, 3)
    allergies = random.sample(ALLERGIES_POOL, num_allergies) if num_allergies > 0 else []
    
    num_conditions = random.randint(0, 3)
    conditions = random.sample(CONDITIONS_POOL, num_conditions) if num_conditions > 0 else []
    
    blood_type = random.choice(BLOOD_TYPES) if random.random() > 0.1 else None  # 10% chance of unknown
    
    # Last visit within last 2 years
    days_ago = random.randint(0, 730)
    last_visit = date.today() - timedelta(days=days_ago) if random.random() > 0.05 else None  # 5% never visited
    
    status = random.choice(STATUSES)
    
    # Insurance
    insurance_provider = random.choice(INSURANCE_PROVIDERS)
    insurance_policy = f"{insurance_provider[:3].upper()}{random.randint(100000000, 999999999)}"
    insurance_group = f"GRP{random.randint(100, 999)}" if random.random() > 0.2 else None
    
    # Insurance dates (active for most)
    insurance_start = date(2024, 1, 1) if random.random() > 0.1 else fake.date_between(start_date='-2y', end_date='today')
    insurance_end = date(2024, 12, 31) if random.random() > 0.1 else fake.date_between(start_date='today', end_date='+1y')
    
    insurance_copay = random.choice([10.0, 15.0, 20.0, 25.0, 30.0, 50.0])
    insurance_deductible = random.choice([500.0, 1000.0, 1500.0, 2000.0, 2500.0, 5000.0])
    
    # Create patient
    patient = models.Patient(
        id=str(uuid.uuid4()),
        first_name=first_name,
        last_name=last_name,
        date_of_birth=dob,
        email=email,
        phone=phone,
        address_street=street,
        address_city=city,
        address_state=state,
        address_zip_code=zip_code,
        address_country="USA",
        emergency_contact_name=emergency_name,
        emergency_contact_relationship=emergency_relationship,
        emergency_contact_phone=emergency_phone,
        emergency_contact_email=emergency_email,
        allergies=allergies,
        conditions=conditions,
        blood_type=blood_type,
        last_visit=last_visit,
        status=status,
        insurance_provider=insurance_provider,
        insurance_policy_number=insurance_policy,
        insurance_group_number=insurance_group,
        insurance_effective_date=insurance_start,
        insurance_expiration_date=insurance_end,
        insurance_copay=insurance_copay,
        insurance_deductible=insurance_deductible
    )
    
    db.add(patient)
    db.flush()  # Get patient ID
    
    # Add medications (0-3 per patient)
    num_medications = random.randint(0, 3)
    if num_medications > 0:
        selected_medications = random.sample(MEDICATIONS_POOL, min(num_medications, len(MEDICATIONS_POOL)))
        for med_name, dosage, frequency in selected_medications:
            start_date = fake.date_between(start_date='-1y', end_date='today')
            end_date = None if random.random() > 0.3 else fake.date_between(start_date='today', end_date='+1y')
            is_active = end_date is None or end_date > date.today()
            
            medication = models.Medication(
                id=str(uuid.uuid4()),
                patient_id=patient.id,
                name=med_name,
                dosage=dosage,
                frequency=frequency,
                prescribed_by=f"Dr. {fake.last_name()}",
                start_date=start_date,
                end_date=end_date,
                is_active=is_active
            )
            db.add(medication)
    
    # Add documents (0-5 per patient)
    num_documents = random.randint(0, 5)
    for _ in range(num_documents):
        doc_type = random.choice(DOCUMENT_TYPES)
        doc_name = f"{doc_type.replace('_', ' ').title()} - {fake.word().capitalize()}"
        upload_date = fake.date_between(start_date='-2y', end_date='today')
        file_size = random.randint(50000, 5000000)  # 50KB to 5MB
        mime_type = random.choice(MIME_TYPES)
        url = f"/documents/{patient.id}/{fake.uuid4()}.{mime_type.split('/')[-1]}"
        
        document = models.Document(
            id=str(uuid.uuid4()),
            patient_id=patient.id,
            type=doc_type,
            name=doc_name,
            upload_date=upload_date,
            file_size=file_size,
            mime_type=mime_type,
            url=url
        )
        db.add(document)
    
    return patient


def generate_patients(count: int = 1500):
    """Generate specified number of patients"""
    db = SessionLocal()
    try:
        print(f"Generating {count} patients...")
        
        # Check if patients already exist
        existing_count = db.query(models.Patient).count()
        if existing_count > 0:
            print(f"⚠️  Database already contains {existing_count} patients.")
            print("Adding more patients...")
        
        # Generate in batches for better performance
        batch_size = 100
        for i in range(0, count, batch_size):
            batch_count = min(batch_size, count - i)
            print(f"Generating patients {i+1} to {i+batch_count}...")
            
            for j in range(batch_count):
                generate_patient(db, i + j + 1)
            
            # Commit batch
            db.commit()
            print(f"✓ Committed batch {i//batch_size + 1}")
        
        final_count = db.query(models.Patient).count()
        print(f"\n✅ Successfully generated {final_count} total patients!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error generating patients: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 1500
    generate_patients(count)

