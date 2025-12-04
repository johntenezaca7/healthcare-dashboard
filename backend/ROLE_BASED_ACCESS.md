# Role-Based Access Control (RBAC) Implementation

## Overview

This document describes the role-based access control system implemented in the Healthcare Dashboard API.

## Roles

The system supports three main role categories:

1. **Clinical Staff** (`clinical_staff`, `doctor`, `nurse`, `physician`)
   - Can access clinical workflows
   - Can view/edit clinical notes, vitals, medications
   - Can manage diagnoses & conditions
   - Cannot change billing/insurance configs
   - Cannot manage system users

2. **Admin / Office Staff** (`admin`, `office_staff`, `administrator`)
   - Handles operational and non-clinical parts
   - Can manage patient demographics
   - Can manage insurance info
   - Can handle scheduling
   - Can upload administrative docs
   - Cannot edit medical info
   - Cannot view sensitive clinical notes
   - Cannot manage medications

3. **System Administrator** (`system_admin`, `super_admin`)
   - Full access to all data
   - Can manage users and roles
   - Can manage billing + system settings
   - Can view audit logs
   - Has access to everything (but preferably not edit clinical notes unless needed)

## Implementation

### Permission System

The permission system is implemented in `app/core/permissions.py`:

- `require_roles(allowed_roles)` - Factory function to create role-based dependencies
- `require_clinical_staff()` - Requires clinical staff or system admin
- `require_admin()` - Requires admin or system admin
- `require_system_admin()` - Requires system admin only
- `require_clinical_staff_or_admin()` - Requires clinical staff, admin, or system admin

### Usage in Endpoints

```python
from ....core.permissions import require_clinical_staff

@router.get("/endpoint")
async def my_endpoint(
    current_user: User = Depends(require_clinical_staff()),
):
    # Only clinical staff and system admin can access this
    ...
```

### Protected Endpoints

#### Patient Endpoints (`/patients`)
- **GET `/patients`** - `require_clinical_staff_or_admin()` - All authenticated users can view patient list
- **GET `/patients/{patient_id}`** - `require_clinical_staff_or_admin()` - All authenticated users can view patient details
  - Note: Admin users should get limited view (no deep clinical details) - TODO: Implement

#### Clinical Endpoints (`/clinical`)
- All endpoints require `require_clinical_staff()`:
  - `GET /clinical/notes/{patient_id}` - Get clinical notes
  - `POST /clinical/notes/{patient_id}` - Create clinical note
  - `GET /clinical/vitals/{patient_id}` - Get vitals
  - `POST /clinical/vitals/{patient_id}` - Update vitals
  - `GET /clinical/medications/{patient_id}` - Get medications
  - `POST /clinical/medications/{patient_id}` - Manage medications

#### Administrative Endpoints (`/administrative`)
- All endpoints require `require_admin()`:
  - `GET /administrative/demographics/{patient_id}` - Get demographics
  - `PUT /administrative/demographics/{patient_id}` - Update demographics
  - `GET /administrative/insurance/{patient_id}` - Get insurance info
  - `PUT /administrative/insurance/{patient_id}` - Update insurance info
  - `GET /administrative/schedules` - Get schedules
  - `POST /administrative/documents/{patient_id}` - Upload admin document

#### System Endpoints (`/system`)
- All endpoints require `require_system_admin()`:
  - `GET /system/users` - List users
  - `POST /system/users` - Create user
  - `PUT /system/users/{user_id}` - Update user
  - `DELETE /system/users/{user_id}` - Delete user
  - `GET /system/billing/settings` - Get billing settings
  - `PUT /system/billing/settings` - Update billing settings
  - `GET /system/system/settings` - Get system settings
  - `PUT /system/system/settings` - Update system settings
  - `GET /system/audit-logs` - Get audit logs

## Demo Users

The following demo users are available:

- `admin@example.com` / `admin123` - Admin role
- `doctor@example.com` / `doctor123` - Doctor role (Clinical Staff)
- `nurse@example.com` / `nurse123` - Nurse role (Clinical Staff)
- `system_admin@example.com` / `admin123` - System Admin role
- `clinical_staff@example.com` / `clinical123` - Clinical Staff role

## Testing

To test role-based access:

1. Login with different user roles
2. Try accessing protected endpoints
3. Verify that:
   - Clinical staff can access `/clinical/*` endpoints
   - Admin can access `/administrative/*` endpoints
   - System admin can access all endpoints
   - Unauthorized access returns 403 Forbidden

## Error Responses

When a user tries to access an endpoint without proper permissions:

```json
{
  "detail": "Insufficient permissions. Required roles: CLINICAL_STAFF, SYSTEM_ADMIN"
}
```

Status code: `403 Forbidden`

## Future Enhancements

- [ ] Implement limited patient view for admin users (no deep clinical details)
- [ ] Add field-level permissions (e.g., admin can view but not edit certain fields)
- [ ] Implement audit logging for all role-based actions
- [ ] Add role hierarchy (system admin > admin > clinical staff)
- [ ] Support for custom roles and permissions

