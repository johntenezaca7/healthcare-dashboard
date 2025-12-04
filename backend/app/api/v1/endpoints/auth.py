"""
Authentication endpoints
"""
from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends

from ....core.security import (
    authenticate_user,
    create_access_token,
    get_current_user,
    LoginRequest,
    Token,
    User,
)
from ....core.config import settings

router = APIRouter()


@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Authenticate user and return JWT token"""
    user = authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information"""
    return current_user

