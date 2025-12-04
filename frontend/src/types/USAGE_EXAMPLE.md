# Using Auto-Generated Types - Example

## After Running `pnpm generate:types`

Once you've generated types, you can use them like this:

### Basic Usage

```typescript
import type { components } from '@/types/api';

// Extract schema types
type Patient = components['schemas']['Patient'];
type PaginatedPatients = components['schemas']['PaginatedPatients'];
type Address = components['schemas']['Address'];
type Medication = components['schemas']['Medication'];

// Use in your code
const patient: Patient = await fetchPatient();
```

### API Response Types

```typescript
import type { paths } from '@/types/api';

// Get response type for /patients endpoint
type PatientsResponse =
  paths['/patients']['get']['responses']['200']['content']['application/json'];
// This is PaginatedPatients

// Get request parameters
type PatientsParams = paths['/patients']['get']['parameters']['query'];
// { page?: number, page_size?: number }
```

### Full Example

```typescript
import type { components, paths } from '@/types/api';

type Patient = components['schemas']['Patient'];
type PaginatedPatients = components['schemas']['PaginatedPatients'];

// Type-safe API function
export async function fetchPatients(
  params: paths['/patients']['get']['parameters']['query']
): Promise<PaginatedPatients> {
  const response = await fetch(`/patients?page=${params.page}`);
  const data: PaginatedPatients = await response.json();
  return data;
}
```

## Benefits

- ✅ **Always matches backend** - Types generated from actual API
- ✅ **Catches breaking changes** - TypeScript errors if API changes
- ✅ **IntelliSense** - Full autocomplete for API responses
- ✅ **Type safety** - Compile-time checks

## Regenerating Types

Whenever backend schemas change:

```bash
# 1. Make sure backend is running
cd backend && uvicorn app.main:app --reload

# 2. Regenerate types
cd frontend && pnpm generate:types

# 3. TypeScript will show errors for breaking changes
```
