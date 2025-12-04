"""
Role-based permission dependencies
"""
from typing import List
from fastapi import Depends, HTTPException, status
from .security import get_current_user, User

# Role constants
CLINICAL_STAFF_ROLES = ["clinical_staff", "doctor", "nurse", "physician"]
ADMIN_ROLES = ["admin", "office_staff", "administrator"]
SYSTEM_ADMIN_ROLES = ["system_admin", "super_admin"]

def normalize_role(role: str) -> str:
    """Normalize role to lowercase for comparison"""
    return role.lower() if role else ""

def is_clinical_staff(user: User) -> bool:
    """Check if user is clinical staff (doctor, nurse, etc.)"""
    role = normalize_role(user.role)
    return any(role == r or role.startswith(r) or r.startswith(role) for r in CLINICAL_STAFF_ROLES)

def is_admin(user: User) -> bool:
    """Check if user is admin/office staff"""
    role = normalize_role(user.role)
    return any(role == r or role.startswith(r) or r.startswith(role) for r in ADMIN_ROLES)

def is_system_admin(user: User) -> bool:
    """Check if user is system admin"""
    role = normalize_role(user.role)
    return any(role == r or role.startswith(r) or r.startswith(role) for r in SYSTEM_ADMIN_ROLES)

def require_roles(allowed_roles: List[str]):
    """
    Dependency factory to require specific roles
    
    Usage:
        @router.get("/endpoint")
        async def endpoint(user: User = Depends(require_roles(["CLINICAL_STAFF", "SYSTEM_ADMIN"]))):
            ...
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = normalize_role(current_user.role)
        
        # System admin has access to everything
        if is_system_admin(current_user):
            return current_user
        
        # Check if user has one of the allowed roles
        has_access = False
        
        if "CLINICAL_STAFF" in allowed_roles and is_clinical_staff(current_user):
            has_access = True
        if "ADMIN" in allowed_roles and is_admin(current_user):
            has_access = True
        if "SYSTEM_ADMIN" in allowed_roles and is_system_admin(current_user):
            has_access = True
        
        if not has_access:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {', '.join(allowed_roles)}"
            )
        
        return current_user
    
    return role_checker

# Convenience dependencies for common role combinations
def require_clinical_staff_or_admin():
    """Require clinical staff or admin (or system admin)"""
    return require_roles(["CLINICAL_STAFF", "ADMIN", "SYSTEM_ADMIN"])

def require_clinical_staff():
    """Require clinical staff (or system admin)"""
    return require_roles(["CLINICAL_STAFF", "SYSTEM_ADMIN"])

def require_admin():
    """Require admin (or system admin)"""
    return require_roles(["ADMIN", "SYSTEM_ADMIN"])

def require_system_admin():
    """Require system admin only"""
    return require_roles(["SYSTEM_ADMIN"])

