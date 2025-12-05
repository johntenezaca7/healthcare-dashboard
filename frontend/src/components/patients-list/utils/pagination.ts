import type { PaginatedPatients } from '@/types';

export function calculateTotalPages(
  data: PaginatedPatients | undefined,
  total: number,
  pageSize: number
): number {
  if (!data) return 0;

  const apiData = data as PaginatedPatients & { total_pages?: number };
  return (
    apiData?.totalPages ?? apiData?.total_pages ?? (total > 0 ? Math.ceil(total / pageSize) : 0)
  );
}
