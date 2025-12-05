/**
 * Query Key Factory for Auth Queries
 * 
 * Best Practices:
 * 1. Hierarchical structure: ['auth'] -> ['auth', 'currentUser']
 * 2. Enables granular invalidation:
 *    - Invalidate all: queryClient.invalidateQueries({ queryKey: authKeys.all })
 *    - Invalidate current user: queryClient.invalidateQueries({ queryKey: authKeys.currentUser })
 * 3. Type-safe and consistent across the app
 * 4. Co-located with queries for better maintainability
 */
export const authKeys = {
  // Base key for all auth queries
  all: ['auth'] as const,
  
  // Current user query
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
} as const;

