"""
Security and authentication dependencies
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from .config import settings

security = HTTPBearer()

# Hardcoded users for demo purposes
USERS_DB = {
    "admin@example.com": {
        "email": "admin@example.com",
        "password": "admin123",  # In production, use hashed passwords
        "role": "admin",
        "name": "Admin User"
    },
    "doctor@example.com": {
        "email": "doctor@example.com",
        "password": "doctor123",
        "role": "doctor",
        "name": "Dr. Smith"
    },
    "nurse@example.com": {
        "email": "nurse@example.com",
        "password": "nurse123",
        "role": "nurse",
        "name": "Nurse Johnson"
    },
    "system_admin@example.com": {
        "email": "system_admin@example.com",
        "password": "admin123",
        "role": "system_admin",
        "name": "System Administrator"
    },
    "clinical_staff@example.com": {
        "email": "clinical_staff@example.com",
        "password": "clinical123",
        "role": "clinical_staff",
        "name": "Clinical Staff Member"
    }
}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    email: str
    role: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return TokenData(email=email)
    except JWTError:
        return None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """Get current authenticated user from token"""
    token = credentials.credentials
    token_data = verify_token(token)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = USERS_DB.get(token_data.email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return User(email=user["email"], role=user["role"], name=user["name"])

def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    user = USERS_DB.get(email)
    if not user:
        return None
    if user["password"] != password:
        return None
    return User(email=user["email"], role=user["role"], name=user["name"])

