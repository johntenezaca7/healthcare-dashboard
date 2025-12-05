import { memo } from 'react';

import { Pagination } from '@/components/ui';

import { PaginationDetails } from './PaginationDetails';

interface PatientTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PatientTablePagination = memo(
  ({ page, pageSize, total, totalPages, onPageChange }: PatientTablePaginationProps) => {
    if (total === 0) {
      return null;
    }

    return (
      <div className="mt-8 space-y-4">
        <PaginationDetails
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          itemLabel="patients"
        />
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
        )}
      </div>
    );
  }
);

PatientTablePagination.displayName = 'PatientTablePagination';

export { PatientTablePagination };
