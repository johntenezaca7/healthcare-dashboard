/**
 * Query Key Factory for Patient Queries
 * 
 * Best Practices:
 * 1. Hierarchical structure: ['patients'] -> ['patients', 'list'] -> ['patients', 'list', params]
 * 2. Enables granular invalidation:
 *    - Invalidate all: queryClient.invalidateQueries({ queryKey: patientKeys.all })
 *    - Invalidate all lists: queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
 *    - Invalidate specific: queryClient.invalidateQueries({ queryKey: patientKeys.detail(id) })
 * 3. Type-safe and consistent across the app
 * 4. Co-located with queries for better maintainability
 */
import type { FetchPatientsParams } from './types';

export const patientKeys = {
  // Base key for all patient queries
  all: ['patients'] as const,
  
  // All list queries
  lists: () => [...patientKeys.all, 'list'] as const,
  
  // Specific list query with filters/params
  list: (params?: FetchPatientsParams) => [...patientKeys.lists(), params] as const,
  
  // All detail queries
  details: () => [...patientKeys.all, 'detail'] as const,
  
  // Specific detail query by ID
  detail: (id: string) => [...patientKeys.details(), id] as const,
} as const;
